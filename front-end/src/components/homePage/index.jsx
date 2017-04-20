import React, {Component} from 'react';
import { Link, browserHistory } from 'react-router';

import {Card, Col, Row, Modal, Button} from 'antd';
import styles from './index.less';

import {request, API} from '../../services/request';

class Catagory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      labels: []
    }
    console.log(this.props);
  }

  componentDidMount() {
    request({
      url: `${API}/api/label`
    }).then(labelData => {
      // 标签排序
      labelData.sort((a, b) => {
        return a.index - b.index;
      })

      this.setState({
        labels: labelData
      })
    }, (err) => {
      console.log(err);
    })
  }

  goRepos(labelId) {
    browserHistory.push(`/type/repos?labelId=${labelId}`);
  }

  render() {
    let { labels } = this.state;

    return (
      <div className={styles.container}>
        <div className="title">
          <p>探索青叶小世界，发现你的大世界</p>
          <div className="earth"></div>
        </div>

        <Row>
          {
            labels.map((item) => {
              return (
                <Col span="8" key={item._id} onClick={this.goRepos.bind(this, item._id)}>
                  <Card title={item.labelName}>{item.description}</Card>
                </Col>
              )
            })
          }
        </Row>
      </div>
    );
  }
}

export default Catagory;
