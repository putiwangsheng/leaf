import React, {Component} from 'react';
import { Link, browserHistory } from 'react-router';

import createG2 from 'g2-react';
import { Stat } from 'g2';

import { Row, Col, Button, DatePicker, Input, Spin, message } from 'antd';
import Bread from '../../common/Bread.jsx';

import styles from './PageView.less';

import {request, API} from '../../services/request';

const Search = Input.Search;

const Line = createG2(chart => {
  chart.legend({
    position: 'top',
    word: {
      fill: '#4c4c4c',
      'font-size': '12',
    }
  });

  let axisStyle = {
    labels: {
      label: {
        fill: '#999999',
        'font-size': '12',
      }
    }
  };

  chart.axis('date', axisStyle);
  chart.axis('viewCount', axisStyle);

  chart.col('date', {
    alias: '日期',
    type: 'time',
    mask: 'yyyy/mm/dd',
  })

  chart.col('viewCount', {
    alias: '浏览量',
  })

  chart.line().position('date*viewCount').color('#94e08a').size(2);
  chart.render();
});

const Pie = createG2(chart => {
  chart.coord('theta', {
    radius: 0.8
  });

  chart.legend('name', {
    position: 'top'
  });

  chart.tooltip({
    title: null,
    map: {
      value: 'value'
    }
  });

  chart.intervalStack()
    .position(Stat.summary.percent('value'))
    .color('name')
    .label('name*..percent', (name, percent) => {
      percent = (percent * 100).toFixed(2) + '%';
      return name + ' ' + percent;
    });

  chart.render();

  // 设置默认选中
  let geom = chart.getGeoms()[0]; // 获取所有的图形
  let items = geom.getData(); // 获取图形对应的数据
  geom.setSelected(items[1]); // 设置选中
});

class PageView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      lineData: [],
      pieData: []
    }

    this.userId = this.props.location.query.userId;
    this.docTitle = '';
  }

  componentDidMount() {
    Promise.all([this.fetchSelfDocs(), this.fetchSelfRepos(), this.fetchLabels()])
      .then(data => {
        let docs = data[0];
        let repos = data[1];
        let labels = data[2];

        // 已经正式发布的文档
        let publishDocs = docs.filter((item) => {
          return !!item.info.publishContent;
        })

        // 默认第一篇文档
        let firstDoc = publishDocs[0] ? publishDocs[0] : {};
        this.docTitle = firstDoc.info.title;
        let dataArr = this.formatLineData(firstDoc);

        // 非团队仓库
        let selfRepos = repos.filter((item) => {
          return !item.isBelongToTeam;
        })

        let pieDataArr = this.processPieData(selfRepos, labels);

        this.setState({
          docs: publishDocs,
          lineData: dataArr,
          pieData: pieDataArr
        });
      })
  }

  // 获取自己发布的文章
  fetchSelfDocs() {
    return request({
      url: `${API}/api/doc?creatorId=${this.userId}`
    })
  }

  // 获取自己的仓库
  fetchSelfRepos() {
    return request({
      url: `${API}/api/repo?creatorId=${this.userId}`
    })
  }

  fetchLabels() {
    return request({
      url: `${API}/api/label`
    })
  }

  // 线图数据格式处理
  formatLineData(data) {
    let dataArr = [];
    data.datePageView.forEach(item => {
      let obj = {
        date: item.date,
        viewCount: item.pageView
      }

      dataArr.push(obj);
    })

    return dataArr;
  }

  // 处理饼图数据
  processPieData(selfRepos, labelsData) {
    let data = [];
    let allDocs = 0;

    selfRepos.forEach(item => {
      allDocs += item.tableOfContents.length;
    })

    labelsData.sort((a, b) => {
      return a.index - b.index;
    })

    labelsData.forEach(labelItem => {
      let count = 0;
      selfRepos.forEach(repoItem => {
        if(repoItem.labels[0] && labelItem._id === repoItem.labels[0].labelId) {
          count += repoItem.tableOfContents.length;
        }
      })

      let obj = {
        name: labelItem.labelName,
        value: (count / allDocs) * 100
      };

      data.push(obj);
    })

    return data;
  }

  handleSearch(value) {
    let { docs } = this.state;

    let searchDoc = docs.filter((item) => {
      return item.info.title === value;
    })

    if(!searchDoc[0]) {
      message.warning('未找到该文章', 2);
      return;
    }

    let dataArr = this.formatLineData(searchDoc[0]);
    this.docTitle = value;

    this.setState({lineData: dataArr});
  }

  render() {
    let { lineData, pieData } = this.state;

    const plotCfg = {
      margin: [90, 0, 100, 0]
    };

    let line;
    if(lineData.length > 0) {
      line = (<Line
        data={lineData}
        width={1000}
        height={300}
        forceFit={true}
      />)
    } else {
      line = (<div className="loading"><Spin /></div>);
    }

    let pie;
    if(pieData.length > 0) {
      pie = (<Pie
        data={pieData}
        width={600}
        height={550}
        plotCfg={plotCfg}
        forceFit={true}
      />)
    } else {
      pie = (<div className="loading"><Spin /></div>);
    }

    return (
      <div className={styles.container}>
        <div className="line-chart">
          <p className="title">文章浏览量趋势</p>
          <p className="doc-title">{this.docTitle}</p>

          <div className="search" style={{float: 'right'}}>
            <Search
              placeholder="搜索文章"
              style={{ width: 200 }}
              onSearch={this.handleSearch.bind(this)}
            />
          </div>
          <div className="linechart-wrapper">
            {line}
          </div>
        </div>

        <div className="pie-chart">
          <p className="title-pie">文档类型占比</p>
          <div className="">
            {pie}
          </div>
        </div>
      </div>
    )
  }
}

export default PageView;
