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
  Card,
  message,
  Icon
} from 'antd';

import styles from './TeamInfo.less';
import Bread from '../../common/Bread.jsx';

import {request, API} from '../../services/request';

const FormItem = Form.Item;
const Option = Select.Option;

class TeamInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      memberList: [],
      teamRepos: []
    };

    this.teamId = this.props.location.query.teamId;
    this.userId = this.props.location.query.userId;
  }

  componentDidMount() {
    Promise.all([this.fetchTeamData(), this.fetchTeamRepos()]).then(data => {
      let teamData = data[0];
      let teamRepos = data[1];
      console.log(data)
      // 团队仓库
      this.setState({teamRepos});

      // 团队成员信息
      let memberArr = teamData.members;

      let memberArrTemp = [];
      memberArr.forEach(item => {
        let memberInfo = this.getUserInfo(item.userId);
        memberArrTemp.push(memberInfo);
      });

      Promise.all(memberArrTemp).then(data => {
        this.setState({memberList: data});
      });
    }, (err) => {
      console.log(err);
    })
  }

  // 获取团队仓库
  fetchTeamRepos() {
    return request({
      url: `${API}/api/repo?teamId=${this.teamId}`,
    })
  }

  // 获取团队成员信息
  fetchTeamData() {
    return request({
      url: `${API}/api/team/${this.teamId}`,
    })
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

  // 创建团队仓库
  addTeamRepo() {
    browserHistory.push(`/repo/create?userId=${this.userId}&teamId=${this.teamId}&belongTeam=true`);
  }

  // 便签颜色对应
  mapColor(labelName) {
    let color;
    if(labelName === '编程开发') {
      color = 'purple';
    }

    if(labelName === 'UI设计') {
      color = 'cyan';
    }

    if(labelName === '产品文档') {
      color = 'blue';
    }

    if(labelName === '工具资源') {
      color = 'green';
    }

    if(labelName === '阅读') {
      color = '#aad8e3';
    }

    if(labelName === '其他') {
      color = '#ebf8f2';
    }

    return color;
  }

  render() {
    let { memberList, teamRepos } = this.state;

    const dataSource = [
      {
        name: '团队'
      }, {
        name: '仓库列表'
      }
    ];

    let addButton;
    addButton = (
      <Button type="primary" onClick={this.addTeamRepo.bind(this)}>创建团队仓库</Button>
    );

    return (
      <div className={styles.container}>
        <Bread dataSource={dataSource} />

        <div className="left-side">
          <div className="button-wrapper">
            {addButton}
          </div>

          <Card title="团队仓库列表" extra={<Link to={`/team/member?teamId=${this.teamId}&userId=${this.userId}`}><Icon type="setting" />成员权限</Link>} className="repo-list">
            {
              teamRepos.length > 0 ? teamRepos.map((item => {
                return (
                  <div key={item._id} className="repo-item">
                    <Link to={`/repo?repoId=${item._id}&userId=${this.userId}`}>
                      {item.repoName}
                    </Link>

                    <div>
                      <Tag color={this.mapColor(item.labels[0].labelName)}>{item.labels[0].labelName}</Tag>
                    </div>
                  </div>
                )
              })) : (<p className="notice">暂无仓库</p>)
            }
          </Card>
        </div>

        <div className="right-side">
          <Card title="成员" className="member-list" extra={<Link to={`/team/activity?teamId=${this.teamId}&userId=${this.userId}`}>活跃度</Link>}>
            {
              memberList.map((item, index) => {
                return (
                  <Link to={`/person?userId=${item._id}`} key={index}>
                    <img src={item.info.avatar} alt="avatar" className="avatars"/>
                  </Link>
                );
              })
            }
          </Card>

        </div>
      </div>
    );
  }
}

TeamInfo = Form.create()(TeamInfo);

export default TeamInfo;
