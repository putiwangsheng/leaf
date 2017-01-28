import React, {Component} from 'react';
import {Link} from 'react-router';
import {Tabs, Icon} from 'antd';
import styles from './Personal.less';
import {getPersonalRepoList, getTeamInfo, getUserInfo} from '../../services/fetchData';

class Personal extends Component {
  constructor() {
    super();
    this.state = {
      repoList: [],
      teams: [],
      userInfo: {},
      userId: ''
    };
  }

  componentDidMount() {
    Promise.all([getPersonalRepoList(), getTeamInfo(), getUserInfo('587c81421407a634241e77cf')]).then(data => {
      let teamsArr = allMyTeams(data[2]._id, data[1]);

      this.setState({
        repoList: data[0],
        teams: teamsArr,
        userInfo: data[2].info,
        userId: data[2]._id
      });
    });
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
            <Tabs.TabPane tab="收藏列表" key="2">Content of Tab Pane 2</Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }

  changeTab() {}

}

// 获取个人的所有团队
function allMyTeams(userId, teams){
  let teamsArr = [];
  teams.forEach(team => {
    let membersIds = team.membersIds;
    if(membersIds.indexOf(userId) !== -1){
      teamsArr.push(team);
    }
  });

  return teamsArr;
}

export default Personal;
