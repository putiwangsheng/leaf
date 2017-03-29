import React, {Component} from 'react';
import { Link, browserHistory } from 'react-router';

import createG2 from 'g2-react';
import { Stat } from 'g2';

import { Row, Col, Button, DatePicker, Spin, message } from 'antd';
import styles from './PageView.less';

import {request, API} from '../../services/request';

const Line = createG2(chart => {
  chart.legend({
    position: 'top',
    word: {
      fill: '#4c4c4c',
      'font-size': '12',
    }
  });

  let axisStyle = {
    title: null,
    labels: {
      label: {
        fill: '#999999',
        'font-size': '12',
      }
    }
  };
  chart.axis('date', axisStyle);
  chart.axis('number', axisStyle);

  chart.col('date', {
    type: 'time',
    mask: 'yyyy/mm/dd',
  })

  chart.line().position('date*viewCount').color('name', ['#718b97', '#94e08a', '#4e7ccc']).size(2);
  chart.render();
});

class PageView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      width: 1050,
      height: 270,
      plotCfg: {
        margin: [60, 40, 30, 70],
      },
    }

    this.userId = this.props.location.query.userId;
  }

  componentDidMount() {
    this.fetchSelfDocs().then(docs => {
      let publishDocs = docs.filter((item) => {
        return !!item.info.publishContent;
      })

      let dataArr = [];
      publishDocs.forEach(item => {
        let obj = {
          date: item.info.publishTime,
          viewCount: item.pageView,
          name: item.info.title
        }

        dataArr.push(obj);
      })
      console.log(dataArr);

      this.setState({data: dataArr})
    })
  }

  // 获取自己发布的文章
  fetchSelfDocs() {
    return request({
      url: `${API}/api/doc?creatorId=${this.userId}`
    })
  }

  render() {
    let { data, width, height, plotCfg } = this.state;

    let line;
    if(data.length > 0) {
      line = (<Line
        data={data}
        width={width}
        height={height}
        plotCfg={plotCfg}
        forceFit={true}
      />)
    } else {
      line = (<div className="loading"><Spin /></div>);
    }

    return (
      <div className={styles.container}>{line}</div>
    )
  }
}

export default PageView;
