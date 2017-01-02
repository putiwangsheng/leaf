import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import styles from './index.less';

class MainLayout extends Component {
  constructor(props) {
      super(props)
  }

  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.head}>
          <h2>青叶</h2>
        </div>

        <div className={styles.main}>
          {this.props.children}
        </div>

        <div className={styles.foot}>
          Built with react, react-router, ant-tool, css-modules, antd...
        </div>
      </div>
    )
  }
}

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainLayout;
