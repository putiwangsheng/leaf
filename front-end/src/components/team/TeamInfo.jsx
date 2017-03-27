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

class TeamInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      memberList: [],
      teamInfo: {}
    };

    this.teamId = this.props.location.query.teamId;
    this.userId = this.props.location.query.userId;
    this.current = this.props.location.query.flag;
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
        this.setState({memberList: data, teamInfo: teamData});
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

  // 创建团队仓库
  addTeamRepo() {
    browserHistory.push(`/repo/create?userId=${this.userId}`);
  }

  render() {
    let { memberList } = this.state;

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
          <p><Link to={`/team?teamId=${this.teamId}&userId=${this.userId}&flag=repos`}>仓库列表</Link></p>
          <p><Link to={`/team/member?teamId=${this.teamId}&userId=${this.userId}&flag=members`}>成员权限</Link></p>
        </div>

        <div className="left-side">
          <p>
            团队仓库列表
          </p>
        </div>

        <div className="right-side">
          <p className="tag-member">
            成员
          </p>

          <div className="members">
            {
              memberList.map((item, index) => {
              return (
                <Link to={`/person?userId=${item._id}`} key={index}>
                  <img src={item.info.avatar} alt="avatar" className="avatars"/>
                </Link>
              );
            })
          }
          </div>
        </div>
      </div>
    );
  }
}

TeamInfo = Form.create()(TeamInfo);

export default TeamInfo;
