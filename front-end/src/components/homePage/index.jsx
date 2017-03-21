import React, {Component} from 'react';
import {Card, Col, Row, Modal, Button} from 'antd';
import styles from './index.less';

import { request } from '../../services/common';
const APPID = '101388260';
const APPKEY = 'ab3ce1001f995d83c3b69248bc295d2b';

const authorize_api = 'https://graph.qq.com/oauth2.0';
const redirectUri = 'http://changqi.site';

class Catagory extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let that = this;

    const code = this.props.location.query.code;

    if (!code && !document.cookie) {
      Modal.info({
        title: '欢迎来到青叶~~',
        content: (
          <div className={styles.modal}>
            <p className="notice">请先使用 qq 扫码登陆哦~~</p>
            <p className="qq" onClick={that.login.bind(that)}></p>
          </div>
        ),
        onOk() {

        }});
    }

    if(code && !document.cookie) {
      let url = `${redirectUri}/api/userInfo?code=${code}`;
      request({url}).then(userInfo => {
        userInfo = JSON.parse(userInfo.data);
        console.log(userInfo);
      })
    }
  }

  login() {
    location.href = `${authorize_api}/authorize?response_type=code&client_id=${APPID}&redirect_uri=${encodeURIComponent(redirectUri)}&state=test`;
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
