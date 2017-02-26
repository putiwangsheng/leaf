import React, {Component} from 'react';
import {Link} from 'react-router';
import {Tabs, Icon} from 'antd';
import styles from './Personal.less';
import {getRepoList, getTeamInfo, getUserInfo} from '../../services/fetchData';

const userId = '58b27acd766cf80822353e7f';

class Personal extends Component {
  constructor() {
    super();
    this.state = {
      repoList: [],
      teams: [],
      userInfo: {},
      collections: [],
      allRepos: [],
      userId: ''
    };
  }

  componentDidMount() {
    Promise.all([getRepoList(userId), getTeamInfo(), getUserInfo(userId), getRepoList()]).then(data => {
      let teamsArr = getAllMyTeams(data[2]._id, data[1]);

      this.setState({
        repoList: data[0],
        teams: teamsArr,
        userInfo: data[2].info,
        collections: data[2].collectedReposIds,
        allRepos: data[3],
        userId: data[2]._id
      });
    });
  }

  renderCollectionList() {
    let collections = getCollectedRepos(this.state.collections, this.state.allRepos);
    console.log(this.state.collections, this.state.allRepos)
    return collections.map((item, index) => {
      return (
        <Link to={`/repo?repoid=${item._id}`} key={item._id}>
          {item.repoName}
        </Link>
      )
    })
  }

  render() {
    let {repoList, teams, userInfo, userId} = this.state;

    const jobLabel = userInfo.job ? (<span>职位：</span>) : '';
    const depLabel = userInfo.department ? (<span>部门：</span>) : '';

    return (
      <div className={styles.container}>
        <div className="left-side">
          <div className="personal-info">
            <Link to={`/person/edit?userid=${userId}`}>
              <Icon type="edit" className="icon-edit"/>
            </Link>
            <p className="name">
              {userInfo.nickName}（{userInfo.name}）
            </p>
            <p>
              <span>邮箱：</span>
              <span>{userInfo.email}</span>
            </p>
            <p>
              {jobLabel}
              <span>{userInfo.job}</span>
            </p>
            <p>
              {depLabel}
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
                    <Link to={`/team?teamid=${item._id}`} key={item._id}><img src={item.avatar} alt="" className="team-avatar"/>
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
                        <Link to={`/repo?repoid=${item._id}`} >
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
    let membersIds = team.membersIds;
    console.log(membersIds, userId)
    if(membersIds.indexOf(userId) !== -1){
      teamsArr.push(team);
    }
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
