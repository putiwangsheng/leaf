import React, {Component, PropTypes} from 'react';
import {Row, Col, Menu, Dropdown, Icon, Modal} from 'antd';
import {Link} from 'react-router';
import styles from './MainLayout.less';
import faceIcon from '../images/face.svg';

import { request, API } from '../services/request';

import leafLogo from '../images/leaf.png';

const APPID = '101388260';
const authorize_api = 'https://graph.qq.com/oauth2.0';
const redirectUri = 'http://changqi.site';

let openId;

class MainLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: undefined,
      userId: undefined
    }
  }

  componentDidMount() {
    let that = this;

    const code = this.props.location.query.code;

    if(document.cookie) {
      let userInfo = decodeURIComponent(getCookie('user'));
      if(userInfo) {
        userInfo = JSON.parse(userInfo);
      }

      openId = decodeURIComponent(getCookie('openId'));

      request({url: `${API}/api/user?openId=${openId}`})
        .then(data => {
          sessionStorage.setItem('userId', data[0]._id);
          this.setState({userInfo, userId: data[0]._id});
        }, (err) => {
          console.log(err);
        });
    }

    if (!code && !document.cookie) {
      this.showModal(that);
    }

    if(code && !document.cookie) {
      this.getUserInfoAndSave(code);
    }
  }

  showModal(that) {
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

  login() {
    location.href = `${authorize_api}/authorize?response_type=code&client_id=${APPID}&redirect_uri=${encodeURIComponent(redirectUri)}&state=test`;
  }

  // 获取登录用户信息
  getUserInfoAndSave(code) {
    let url = `${redirectUri}/api/userInfo?code=${code}`;

    // 种 cookie
    request({url}).then(userInfo => {
      userInfo = userInfo.data ? JSON.parse(userInfo.data) : '';

      if(!userInfo) {
        console.log('获取登录用户信息失败');
        return;
      }

      this.setState({userInfo});

      openId = decodeURIComponent(getCookie('openId'));

      request({url: `${API}/api/user?openId=${openId}`})
        .then(data => {
          // 如果登陆的用户不在用户表，创建新用户
          if(data.length === 0) {
            this.saveUserInfo(userInfo, openId).then(data => {
              console.log(data);
            });
          } else {
            sessionStorage.setItem('userId', data[0]._id);

            this.setState({
              userId: data[0]._id
            })
          }
        });
    })
  }

  // 用户第一次登录存储用户信息
  saveUserInfo(userInfo, openId) {
    let body = {
      info: {
        avatar: userInfo.figureurl_qq_1,
        nickName: userInfo.nickname
      },
      openId
    };

    return request({
      url: `${API}/api/user`,
      method: 'post',
      body: body
    }).then(data => {
      console.log(data);
    });
  }

  render() {
    let { userInfo, userId } = this.state;

    const menu = (
      <Menu>
        <Menu.Item>
          <Link to={`/repo/create?userId=${userId}`}>创建仓库</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={`/team/create?userId=${userId}`}>创建团队</Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className=''>
        <div className={styles.head}>
          <p className="title">
            <img src={leafLogo} alt="" />
            <Link to='/'>青 叶</Link>
          </p>

          <Row className="right" gutter={24}>
            <Col span={4}>
              <Link to='/'>指南</Link>
            </Col>

            <Col span={5}>
              <Link to={`/analyze/view?userId=${userId}`}>数据分析</Link>
            </Col>

            <Col span={3}>
              <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" href="#">
                  <Icon type="plus"/>
                </a>
              </Dropdown>
            </Col>

            <Col span={8} className="user">
              {
                userInfo ? (<Link to={`/person?userId=${userId}`}>
                  <img src={userInfo.figureurl_qq_1} alt="avatar" />
                  <span className="nickname">{userInfo.nickname}</span>
                </Link>) : (<img src={faceIcon} alt="avatar" />)
              }
              </Col>
          </Row>
        </div>

        <div className={styles.main}>
          {this.props.children}
        </div>

        <div className={styles.foot}></div>
      </div>
    );
  }
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

MainLayout.propTypes = {
  children: PropTypes.element.isRequired
};

export default MainLayout;
