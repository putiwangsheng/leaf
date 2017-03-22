import React, {Component} from 'react';
import {Card, Col, Row, Modal, Button} from 'antd';
import styles from './index.less';

class Catagory extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{
        padding: '30px'
      }} className={styles.container}>
        <Row>
          <Col span="8">
            <Card title="编程开发">Card content</Card>
          </Col>
          <Col span="8">
            <Card title="UI设计">Card content</Card>
          </Col>
          <Col span="8">
            <Card title="产品文档">Card content</Card>
          </Col>
          <Col span="8">
            <Card title="阅读">Card content</Card>
          </Col>
          <Col span="8">
            <Card title="工具资源">Card content</Card>
          </Col>
          <Col span="8">
            <Card title="其他">Card content</Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Catagory;
