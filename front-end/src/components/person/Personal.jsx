import React, {Component} from 'react';
import {Link} from 'react-router';
import {Tabs, Icon} from 'antd';
import styles from './Personal.less';

import { request, API } from '../../services/request';

class Personal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repoList: [],
      teams: [],
      userInfo: '',
      collections: [],
      allRepos: []
    };

    this.userId = this.props.location.query.userId;
  }

  componentDidMount() {
    Promise.all([this.getRepoList(this.userId), this.getTeamInfo(), this.getUserInfo(), this.getRepoList()]).then(data => {
      let teamsArr = getAllMyTeams(data[2]._id, data[1]);

      this.setState({
        repoList: data[0],
        teams: teamsArr,
        userInfo: data[2].info,
        collections: data[2].collectedReposIds,
        allRepos: data[3]
      });
    }, (err) => {
      console.log(err);
    });
  }

  // 获取用户信息
  getUserInfo() {
    return request({
      url: `${API}/api/user/${this.userId}`,
    });
  }

  // 获取仓库列表
  getRepoList(creatorId) {
    let url = `${API}/api/repo?creatorId=${creatorId}`;

    if(!creatorId) {
      url = `${API}/api/repo`;
    }

    return request({
      url
    });
  }

  // 获取团队信息
  getTeamInfo() {
    return request({
      url: `${API}/api/team`,
    });
  }

  renderCollectionList() {
    let collections = getCollectedRepos(this.state.collections, this.state.allRepos);

    return collections.map((item, index) => {
      return (
        <Link to={`/repo?repoId=${item._id}&userId=${this.userId}`} key={item._id}>
          {item.repoName}
        </Link>
      )
    })
  }

  render() {
    let {repoList, teams, userInfo} = this.state;

    return (
      <div className={styles.container}>
        <div className="left-side">
          <div className="personal-info">
            <Link to={`/person/edit?userId=${this.userId}`}>
              <Icon type="edit" className="icon-edit"/>
            </Link>
            <p className="name">
              {userInfo.nickName}
              {
                userInfo.name ? (<span>（{userInfo.name}）</span>) : null
              }
            </p>
            <p>
              {
                userInfo.email ? (<span>邮箱：</span>) : null
              }
              <span>{userInfo.email}</span>
            </p>
            <p>
              {
                userInfo.job ? (<span>职位：</span>) : null
              }
              <span>{userInfo.job}</span>
            </p>
            <p>
              {
                userInfo.department ? (<span>部门：</span>) : null
              }
              <span>{userInfo.department}</span>
            </p>
          </div>
          <div className="personal-team">
            <p className="title">
              团队
            </p>
            <div className="avatars">
              {
                teams.map(item => {
                  return (
                    <Link to={`/team?teamId=${item._id}&userId=${this.userId}`} key={item._id}><img src={item.avatar} alt="" className="team-avatar"/>
                    </Link>
                  );
                })
              }
            </div>
          </div>
        </div>

        <div className="right-side">
          <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
            <Tabs.TabPane tab="仓库列表" key="1">
              <div className="repos">
                {
                  repoList.map(item => {
                    return (
                      <p key={item._id}>
                        <Link to={`/repo?repoId=${item._id}&userId=${this.userId}`} >
                          {item.repoName}
                        </Link>
                      </p>
                    );
                  })
                }
              </div>

            </Tabs.TabPane>
            <Tabs.TabPane tab="收藏列表" key="2">{this.renderCollectionList()}</Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }

  changeTab() {}
}

// 获取个人的所有团队
function getAllMyTeams(userId, teams){
  let teamsArr = [];
  teams.forEach(team => {
    let membersInfo = team.members;
    membersInfo.forEach(item => {
      if(item.userId === userId) {
        teamsArr.push(team);
      }
    })
  });

  return teamsArr;
}

// 获得收藏的仓库信息
function getCollectedRepos(repoIds, repos) {
  let collectionArr = [];
  repoIds.forEach(id => {
    repos.forEach(repo => {
      if(id === repo._id) {
        collectionArr.push(repo);
      }
    })
  })

  return collectionArr;
}

export default Personal;
