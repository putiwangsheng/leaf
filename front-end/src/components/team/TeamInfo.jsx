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

  render() {
    let { memberList, teamRepos } = this.state;

    let addButton;
    addButton = (
      <Button type="primary" className="add-button" onClick={this.addTeamRepo.bind(this)}>创建团队仓库</Button>
    );

    return (
      <div className={styles.container}>
        <div className="button-wrapper">
          {addButton}
        </div>

        <div className="catalog">
          <div className="nav-body">
            <div className="highlight" style={{top: 0}}></div>

            <p className="current"><Link to={`/team?teamId=${this.teamId}&userId=${this.userId}`}>仓库列表</Link></p>
            <p><Link to={`/team/member?teamId=${this.teamId}&userId=${this.userId}`}>成员权限</Link></p>
          </div>
        </div>

        <div className="left-side">
          <Card title="团队仓库列表" className="repo-list">
            {
              teamRepos.length > 0 ? teamRepos.map((item => {
                return (
                  <div key={item._id} className="repo-item">
                    <Link to={`/repo?repoId=${item._id}&userId=${this.userId}`}>
                      {item.repoName}
                    </Link>

                    <div>
                      <Tag color="purple">{item.labels[0].labelName}</Tag>
                    </div>
                  </div>
                )
              })) : null
            }
          </Card>
        </div>

        <div className="right-side">
          <Card title="成员" className="member-list" extra={<a href={`/team/activity?teamId=${this.teamId}`}>活跃度</a>}>
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
