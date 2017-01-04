import React, {Component, PropTypes} from 'react';
import {Row, Col, Menu, Dropdown, Icon} from 'antd';
import {Link} from 'react-router';
import styles from './MainLayout.less';

class MainLayout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <Link to='/doc/edit'>创建文档</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to='/createteam'>创建团队</Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.container}>
        <div className={styles.head}>
          <h2 className="title">
            <Link to='/'>青 叶</Link>
          </h2>
          <Row className="right">
            <Col span="8">
              <Link to='/'>探索</Link>
            </Col>

            <Col span="8">
              <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" href="#">
                  <Icon type="plus"/>
                </a>
              </Dropdown>
            </Col>

            <Col span="8"><Link to='/person'>我</Link></Col>
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

MainLayout.propTypes = {
  children: PropTypes.element.isRequired
};

export default MainLayout;
