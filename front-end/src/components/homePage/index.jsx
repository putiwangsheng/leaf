import React, {Component} from 'react';
import {Card, Col, Row} from 'antd';
import styles from './index.less';

class Catagory extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div style={{
        padding: '30px'
      }} className={styles.container}>
        <Row>
          <Col span="8">
            <Card title="Card title">Card content</Card>
          </Col>
          <Col span="8">
            <Card title="Card title">Card content</Card>
          </Col>
          <Col span="8">
            <Card title="Card title">Card content</Card>
          </Col>
          <Col span="8">
            <Card title="Card title">Card content</Card>
          </Col>
          <Col span="8">
            <Card title="Card title">Card content</Card>
          </Col>
          <Col span="8">
            <Card title="Card title">Card content</Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Catagory;
