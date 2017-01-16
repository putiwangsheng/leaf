import React, {Component} from 'react';
import {Link} from 'react-router';
import {Tabs, Icon} from 'antd';
import styles from './Personal.less';
import { getPersonalRepoList, getTeamInfo, getUserInfo } from '../../services/fetchData';

class Personal extends Component {
  constructor() {
    super();
    this.state = {
      repoList: [],
      teams: [],
      userInfo: {}
    };
  }

  componentDidMount(){
    Promise.all([getPersonalRepoList(), getTeamInfo(), getUserInfo()]).then(data => {
      this.setState({
        repoList: data[0],
        teams: data[1],
        userInfo: data[2][0].info
      });
    });
  }

  render() {
    let { repoList, teams, userInfo } = this.state;

    return (
      <div className={styles.container}>
        <div className="left-side">
          <div className="personal-info">
            <Link to={`/person/edit`}>
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
              <span>职位：</span>
              <span>{userInfo.job}</span>
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
                    <img src={item.avatar} alt="" className="team-avatar"/>
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
                      <p>
                        <Link to={`/repo?repoid=${item._id}`}>
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

  changeTab(){

  }

}

export default Personal;
