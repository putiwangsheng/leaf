import React, {Component} from 'react';
import {Tabs, Button, Modal, Form, Input} from 'antd';
import styles from './TeamInfo.less';
import {getTeamInfo, getUserInfo} from '../../services/fetchData';
const FormItem = Form.Item;

class TeamInfo extends Component {
  constructor(props) {
    super(props);
    this.teamId = this.props.location.query.teamid;

    this.state = {
      members: [],
      visible: false
    };
  }

  componentDidMount() {
    getTeamInfo(this.teamId).then(data => {
      let memberIds = data.membersIds;

      let memberArr = [];
      memberIds.forEach(item => {
        memberArr.push(getUserInfo(item));
      });

      Promise.all(memberArr).then(data => {
        console.log(data);
        this.setState({members: data, isRepo: true});
      });
    });
  }

  render() {
    let {members, isRepo} = this.state;

    let addButton;
    if (!isRepo) {
      addButton = (
        <Button type="primary" className="add-button" onClick={this.addMember.bind(this)}>添加成员</Button>
      );
    }

    return (
      <div className={styles.container}>
        <div className="button-wrapper">
          {addButton}
        </div>
        {this.renderModal()}

        <div className="left-side">
          <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
            <Tabs.TabPane tab="仓库" key="1">
              <p>
                团队仓库列表
              </p>
            </Tabs.TabPane>

            <Tabs.TabPane tab="成员" key="2">
              <div className="member-list">
                {this.renderMemberList(members)}
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className="right-side">
          <p className="tag-member">
            成员
          </p>
          <div className="members">
            {members.map((item, index) => {
              return (
                <div key={index}>
                  <img src={item.info.avatar} alt="avatar" className="avatars"/>
                </div>
              );
            })
}
          </div>
        </div>
      </div>
    );
  }

  // 渲染成员列表
  renderMemberList(members) {
    return (members.map((item, index) => {
      return (
        <div key={index}>
          <img src={item.info.avatar} alt="avatar" className="user-avatar"/>
          <span>{item.info.nickName}</span>
          <span className="role">Owner</span>
          <span className="delete">删除</span>
        </div>
      );
    }));
  }

  renderModal() {
    const { getFieldDecorator  } = this.props.form;

    return (
      <Modal title="添加成员" visible={this.state.visible} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
        <Form horizontal>
          <FormItem label="团队名称">
            {
              getFieldDecorator ('name', {
                rules: [{ required: true, message: '请输入团队名称' }],
              })
              (<Input placeholder="团队名称"/>)
            }
          </FormItem>

          <FormItem label="团队成员">
            {
              getFieldDecorator('member')
              (<Input placeholder="团队成员"/>)
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }

  changeTab(key) {
    if (key === '2') {
      this.setState({isRepo: false});
    } else {
      this.setState({isRepo: true});
    }
  }

  addMember() {
    this.setState({
      visible: true
    });
  }

  handleOk() {
    this.setState({
      visible: false,
    });
  }

  handleCancel(e) {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
}

TeamInfo = Form.create()(TeamInfo);

export default TeamInfo;
