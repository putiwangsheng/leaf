import React, {Component} from 'react';
import { Link, browserHistory } from 'react-router';

import {
  Button,
  Card,
  message,
} from 'antd';

import styles from './TypeRepo.less';

import {request, API} from '../../services/request';

class TypeRepo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      repoList: [],
      teamList: [],
      displayNotice: 'none'
    };

    this.labelId = this.props.location.query.labelId;
  }

  componentDidMount() {
    Promise.all([this.fetchTypeRepos()]).then(data => {
      let repos = data[0];
      let repoList = [];

      // 属于当前标签的仓库
      repos.forEach((item) => {
        let labels = item.labels;
        let label = labels.filter(labelItem => {
          return labelItem.labelId === this.labelId;
        })

        if(label.length > 0) {
          if(!item.isPrivate) {
            repoList.push(item);
          }
        }
      })

      let getTeamArr = [];
      // 团队
      repoList.forEach((item) => {
        if(!!item.isBelongToTeam) {
          getTeamArr.push(this.fetchTeamData(item.teamId));
        }
      })

      Promise.all(getTeamArr).then(teamsData => {
        let displayNotice = repoList.length > 0 ? 'none' : 'block';
        this.setState({repoList, teamList: teamsData, displayNotice});
      })
    }, (err) => {
      console.log(err);
    })
  }

  // 获取仓库
  fetchTypeRepos() {
    return request({
      url: `${API}/api/repo`,
    })
  }

  // 获取团队信息
  fetchTeamData(teamId) {
    return request({
      url: `${API}/api/team/${teamId}`,
    })
  }

  render() {
    let { repoList, teamList, displayNotice } = this.state;

    return (
      <div className={styles.container}>

        <div className="left-side">
          <Card title="仓库列表">
            {
              repoList.length > 0 ? (
                <ul>
                  {
                    repoList.map(item => {
                      return (
                        <li key={item._id}><Link to={`/repo?repoId=${item._id}&userId=${item.teamId}`}>{item.repoName}</Link></li>
                      )
                    })
                  }
                </ul>
              ) : null
            }

            <p className="none-notice" style={{display: displayNotice}}>暂时没有该类型的仓库</p>
          </Card>
        </div>

        <div className="right-side">
          <Card title="团队">
            {
              teamList.length > 0 ? (
                <ul>
                  {
                    teamList.map(item => {
                      return (
                        <li key={item._id}>{item.name}</li>
                      )
                    })
                  }
                </ul>
              ) : null
            }

            <p className="none-notice" style={{display: displayNotice}}>暂无团队</p>
          </Card>
        </div>
      </div>
    );
  }
}

export default TypeRepo;
