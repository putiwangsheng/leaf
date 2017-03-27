import React, {Component} from 'react';
import { Link, browserHistory } from 'react-router';

import {
  Tabs,
  Button,
  Modal,
  Form,
  Select,
  Input,
  Tag,
  message,
  Icon
} from 'antd';

import styles from './TeamInfo.less';

import {request, API} from '../../services/request';

const FormItem = Form.Item;
const Option = Select.Option;

class MemberList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      memberList: [],
      teamInfo: {},
      visible: false,
      isManager: false
    };

    this.teamId = this.props.location.query.teamId;
    this.userId = this.props.location.query.userId;
  }

  componentDidMount() {
    this.fetchTeamData();
  }

  // 获取团队成员信息
  fetchTeamData() {
    request({
      url: `${API}/api/team/${this.teamId}`,
    }).then(teamData => {
      let memberArr = teamData.members;

      let memberArrTemp = [];
      memberArr.forEach(item => {
        let memberInfo = this.getUserInfo(item.userId);
        memberArrTemp.push(memberInfo);
      });

      Promise.all(memberArrTemp).then(data => {
        // 添加权限字段
        data.forEach(item => {
          memberArr.forEach(subItem => {
            if(item._id === subItem.userId) {
              item.authority = subItem.authority;
            }
          })
        })

        // 判断当前用户是否是该团队的管理员
        let currentUserInfo = data.filter(item => {
          return item._id === this.userId;
        })

        let isManager;
        if(currentUserInfo[0].authority === 'Owner' || currentUserInfo[0].authority === 'Manager') {
          isManager = true;
        }
        this.setState({memberList: data, teamInfo: teamData, isManager});
      });
    });
  }

  // 获取用户信息
  getUserInfo(userId) {
    if(!userId){
      userId = '';
    }
    return request({
      url: `${API}/api/user/${userId}`,
    });
  }

  // 显示添加成员弹框
  addMember() {
    this.setState({visible: true});
  }

  // 添加成员
  handleOk() {
    let that = this;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getUserInfo().then(allMembers => {
          allMembers.forEach(item => {
            if (item.info.nickName === values.memberName || item.info.name === values.memberName) {
              let addMemberId = item._id;
              let body = that.state.teamInfo;
              let memberObj = {
                authority: 'Member',
                userId: addMemberId
              }
              body.members.push(memberObj);

              request({
                url: `${API}/api/team/${body._id}`,
                method: 'put',
                body: body
              }).then(data => {
                that.fetchTeamData();

                this.setState({visible: false});
              });
            } else {
              message.warning('无法找到该成员的信息！', 2);
            }
          });
        });

      }
    });
  }

  handleCancel(e) {
    this.props.form.resetFields();
    this.setState({visible: false});
  }

  // 删除成员
  deleteMember(memberId) {
    let memberArr = this.state.teamInfo.members;
    let index;
    memberArr.forEach((item, itemIndex) => {
      if (item.userId === memberId) {
        index = itemIndex;
      }
    });
    memberArr.splice(index, 1);

    request({
      url: `${API}/api/team/${this.state.teamInfo._id}`,
      method: 'put',
      body: this.state.teamInfo
    }).then(data => {
      this.fetchTeamData();
    });
  }

  // 修改成员权限
  modifyAuthority(userId) {
    let memberList = this.state.memberList;

    memberList.forEach(item => {
      if(item._id === userId) {
        item.underModify = true;
      }
    })

    this.setState({memberList});
  }

  // 改变数据库权限数据
  handleBlur(userId) {
    let memberList = this.state.memberList;
    let teamInfo = this.state.teamInfo;

    let userAuthrity = teamInfo.members.filter(item => {
      return item.userId === userId;
    })

    memberList.forEach(item => {
      if(item._id === userId) {
        item.underModify = false;
        item.authority = userAuthrity[0] ? userAuthrity[0].authority : item.authority;
      }
    })

    this.setState({memberList});

    request({
      url: `${API}/api/team/${this.teamId}`,
      method: 'put',
      body: teamInfo
    }).then(data => {
      console.log(data);
    }, (err) => {
      console.log(err);
    })
  }

  // 选择权限，改变权限
  handleAuthorityChange(userId, value) {
    let teamInfo = this.state.teamInfo;
    let { members } = teamInfo;

    members.forEach(item => {
      if(item.userId === userId) {
        item.authority = value;
      }
    })

    this.setState({teamInfo});
  }

  // 渲染成员列表
  renderMemberList(memberList) {
    return (memberList.map((item, index) => {
      return (
        <div key={index} className="member">
          <Link to={`/person?userId=${item._id}`}>
            <img src={item.info.avatar} alt="avatar" className="user-avatar"/>
            <span className="nickName">{item.info.nickName}</span>
          </Link>
          {
            item.underModify ? (
              <Select
                defaultValue={item.authority}
                style={{ width: 84 }}
                onChange={this.handleAuthorityChange.bind(this, item._id)} onBlur={this.handleBlur.bind(this, item._id)}>
                  <Option value="Manager">Manager</Option>
                  <Option value="Member">Member</Option>
              </Select>
            ) : (<span>{item.authority}</span>)
          }

          {
            this.state.isManager && item.authority !== 'Owner' ? (<Icon type="edit" className="icon-edit-doc" onClick={this.modifyAuthority.bind(this, item._id)}/>) : null
          }

          <span className="delete" onClick={this.deleteMember.bind(this, item._id)}>删除</span>
        </div>
      );
    }));
  }

  // 渲染添加成员弹框
  renderModal() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal title="添加成员" visible={this.state.visible} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)} className="add-member">
        <Form horizontal>
          <FormItem label="团队名称">
            {
              getFieldDecorator('name', {
              initialValue: this.state.teamInfo.name,
              rules: [
                {
                  required: true,
                  message: '请输入团队名称'
                }
              ]
            })(<Input placeholder="团队名称"/>)
          }
          </FormItem>

          <FormItem label="团队成员">
            {
              getFieldDecorator('memberName', {
                rules: [
                  {
                    required: true,
                    message: '请输入要添加的成员昵称'
                  }
                ]
              })
              (
              <div className="">
                {this.state.memberList.map((item, index) => {
                  return (
                    <Tag key={index}>{item.info.nickName}</Tag>
                  );
                })}
                <Input placeholder="成员昵称"/>
              </div>
            )
          }
          </FormItem>
        </Form>
      </Modal>
    );
  }

  render() {
    let { memberList } = this.state;

    let addButton = (
      <Button type="primary" className="add-button" onClick={this.addMember.bind(this)}>添加成员</Button>
    );

    return (
      <div className={styles.container}>
        <div className="button-wrapper">
          {addButton}
        </div>

        {this.renderModal()}

        <div className="catalog">
          <p><Link to={`/team?teamId=${this.teamId}&userId=${this.userId}&flag=repos`}>仓库列表</Link></p>
          <p><Link to={`/team/member?teamId=${this.teamId}&userId=${this.userId}&flag=members`}>成员权限</Link></p>
        </div>

        <div className="left-side">
          <div className="member-list">
            {
              this.renderMemberList(memberList)
            }
          </div>
        </div>
      </div>
    );
  }
}

MemberList = Form.create()(MemberList);

export default MemberList;
