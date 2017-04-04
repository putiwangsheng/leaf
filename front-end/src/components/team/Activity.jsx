import React, {Component} from 'react';
import { Link, browserHistory } from 'react-router';

import createG2 from 'g2-react';
import { Stat, Frame } from 'g2';

import { Row, Col, Table, DatePicker, Spin } from 'antd';
import styles from './Activity.less';

import {request, API} from '../../services/request';

const BarChart = createG2(chart => {
  chart.setMode('select'); // 开启框选模式
  chart.select('rangeX'); // 设置 X 轴范围的框选

  chart.col('publishCount', {
    alias: '发布文章数'
  });

  chart.col('name', {
    tickInterval: 5,
    alias: '成员'
  });

  chart.interval().position('name*publishCount').color('#54becc');
  chart.render();

  // 监听双击事件，这里用于复原图表
  chart.on('plotdbclick', function(ev) {
    chart.set('filters', {});
    chart.repaint();
  });
});

class Activity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      chartData: []
    }

    this.teamId = this.props.location.query.teamId;

    this.columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '文档',
        dataIndex: 'docTitle',
        key: 'docTitle',
      },{
        title: '所属仓库',
        dataIndex: 'repoName',
        key: 'repoName',
      }, {
        title: '发布时间',
        dataIndex: 'publishTime',
        key: 'publishTime',
      }
    ]
  }

  componentDidMount() {
    Promise.all([this.fetchTeamInfo(), this.fetchTeamRepos()])
      .then(resData => {
        let teamMembers = resData[0].members;
        let teamRepos = resData[1];

        let getDocFunArr = [];
        teamRepos.forEach((item) => {
          getDocFunArr.push(this.fetchTeamDocs(item._id));
        })

        let getUserFunArr = [];
        teamMembers.forEach(item => {
          getUserFunArr.push(this.fetchMemberInfo(item.userId))
        })

        Promise.all(getDocFunArr).then(teamDocs => {
          // teamDocs 为团队仓库的文档
          let docs = [];
          teamDocs.forEach(item => {
            // 合并所有仓库的文档
            docs = docs.concat(item);
          })

          let data = this.formTableData(docs, teamMembers);

          Promise.all(getUserFunArr).then(users => {
            data = this.addName(data, users);
            let chartData = this.formChartData(data, teamMembers);

            data = data.filter((dataItem) => {
              return !!dataItem.docId;
            })

            data = this.addRepoName(teamRepos, data);

            data.sort((a, b) => {
              return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
            })

            this.setState({
              data,
              chartData
            });
          })

        }, (err) => {
          console.log(err);
        })
      }, (err) => {
        console.log(err);
      })
  }

  // 获取团队信息
  fetchTeamInfo() {
    return request({
      url: `${API}/api/team/${this.teamId}`
    })
  }

  // 获取属于该团队的仓库
  fetchTeamRepos() {
    return request({
      url: `${API}/api/repo?teamId=${this.teamId}`
    })
  }

  // 获取属于团队的文档
  fetchTeamDocs(repoId) {
    return request({
      url: `${API}/api/doc?repoId=${repoId}`
    })
  }

  fetchMemberInfo(userId) {
    return request({
      url: `${API}/api/user/${userId}`
    })
  }

  // 构造表格数据
  formTableData(docs, teamMembers) {
    let data = [];
    docs.forEach(docItem => {
      teamMembers.forEach(item => {
        let obj = {
          creatorId: item.userId,
          repoId: docItem.repoId
        }

        if(item.userId === docItem.creatorId) {
          obj.docId = docItem._id;
          obj.docTitle = docItem.info.title;
          obj.publishTime = docItem.info.publishTime;
        }

        data.push(obj);
      })
    })

    return data;
  }

  addName(data, users) {
    data.forEach(item => {
      users.forEach(userItem => {
        if(item.creatorId === userItem._id) {
          item.name = userItem.info.name || userItem.info.nickName;
        }
      })
    })

    return data;
  }

  addRepoName(teamRepos, data) {
    teamRepos.forEach(item => {
      data.forEach(subItem => {
        if(item._id === subItem.repoId) {
          subItem.repoName = item.repoName;
        }
      })
    })

    return data;
  }

  // 构造图标数据
  formChartData(data, teamMembers) {
    let chartData = [];
    teamMembers.forEach(item => {
      let personData = data.filter((dataItem) => {
        return item.userId === dataItem.creatorId;
      })

      let hasPublishDoc = data.filter((dataItem) => {
        return item.userId === dataItem.creatorId && !!dataItem.docId;
      })

      chartData.push({
        name: personData[0].name,
        publishCount: hasPublishDoc.length === 0 ? 0 : personData.length
      })
    })

    return chartData;
  }

  render() {
    let { data, chartData } = this.state;

    let frame = new Frame(chartData);
    frame = Frame.sort(frame, 'publishCount');

    const plotCfg = {
      margin: [90, 0, 100, 0]
    };

    let bar;
    if(chartData.length > 0) {
      bar = (<BarChart
        data={frame}
        width={400}
        height={350}
        forceFit={true}
      />)
    } else {
      bar = (<div className="loading"><Spin /></div>);
    }

    return (
      <div className={styles.container}>
        <div className="chart">
          {bar}
        </div>

        <div className="table">
          <p>发布历史</p>
          <Table dataSource={data} columns={this.columns} bordered={true} pagination={false}/>
        </div>
      </div>
    )
  }
}

export default Activity;
