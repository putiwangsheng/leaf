import React, {Component} from 'react';
import {Link} from 'react-router';
import {Tabs, Icon} from 'antd';

import styles from './Personal.less';

import Bread from '../../common/Bread.jsx';

import { request, API } from '../../services/request';

const currentUserId = sessionStorage.getItem('userId');

class Personal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repoList: [],
      teams: [],
      userInfo: '',
      collections: [],
      allRepos: [],
      showMessage: 'none'
    };

    this.userId = this.props.location.query.userId;
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    Promise.all([this.getRepoList(this.userId), this.getTeamInfo(), this.getUserInfo(), this.getRepoList()]).then(data => {
      let teamsArr = getAllMyTeams(data[2]._id, data[1]);

      this.setState({
        repoList: data[0] || [],
        teams: teamsArr || [],
        userInfo: data[2].info || {},
        collections: data[2].collectedReposIds || [],
        allRepos: data[3],
        showMessage: teamsArr.length > 0 ? 'none' : 'block'
      });
    }).catch(err => {
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

  // 渲染收藏列表
  renderCollectionList() {
    let collections = getCollectedRepos(this.state.collections, this.state.allRepos);
    if(collections.length) {
      return collections.map((item, index) => {
        return (
          <div className="collections-wrap" key={item._id}>
            <Link to={`/repo?repoId=${item._id}&userId=${this.userId}`}>
              {item.repoName}
            </Link>
          </div>
        )
      })
    } else {
      return ((<p className="notice">暂无收藏</p>))
    }

  }

  render() {
    let {repoList, teams, userInfo, showMessage} = this.state;

    if (this.userId !== this.props.location.query.userId) {
      this.userId = this.props.location.query.userId;
      this.fetchData();
    }

    const dataSource = [
      {
        name: '个人管理'
      }
    ]

    return (
      <div className={styles.container}>
        <Bread dataSource={dataSource} />

        <div className="left-side">
          <div className="personal-info">
            {
              currentUserId === this.userId ? (
                <Link to={`/person/edit?userId=${this.userId}`}>
                  <Icon type="edit" className="icon-edit"/>
                </Link>
              ) : null
            }

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
            {
              teams.length > 0 ? (
                <div className="">
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
              ) : null
            }

            <p className="notice" style={{display: showMessage}}>暂且没有加入任何团队哦</p>
          </div>
        </div>

        <div className="right-side">
          <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
            <Tabs.TabPane tab={currentUserId === this.userId ? '我的仓库' : '他的仓库'} key="1">
              <div className="repos-wrap">
                {
                  repoList.length ? repoList.map(item => {
                    return (
                      <p key={item._id}>
                        <Link to={`/repo?repoId=${item._id}&userId=${this.userId}`} >
                          {item.repoName}
                        </Link>
                      </p>
                    );
                  }) : (<p className="notice">暂且没有创建任何仓库</p>)
                }

              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab={currentUserId === this.userId ? '我的收藏' : '他的收藏'} key="2">
              {this.renderCollectionList()}
            </Tabs.TabPane>
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
