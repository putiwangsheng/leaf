import React, {Component} from 'react';
import {Link} from 'react-router';
import {Button, Tabs} from 'antd';
import styles from './index.less';
import { getRepoInfo } from '../../services/fetchData';

class Repo extends Component {
  constructor() {
    super();
  }

  componentDidMount(){
    getRepoInfo().then(data => {
      console.log(data);
    });
  }

  render() {
    return (
      <div className={styles.repoContainer}>
        <Link to='/doc/edit'><Button type="primary">
          新建文档
        </Button></Link>

      <div className="repo-content">
        <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
          <Tabs.TabPane tab="目录" key="1">
            <div className="">

            </div>

          </Tabs.TabPane>
          <Tabs.TabPane tab="草稿" key="2">Content of Tab Pane 2</Tabs.TabPane>
          <Tabs.TabPane tab="设置" key="3">Content of Tab Pane 3</Tabs.TabPane>
        </Tabs>
      </div>
      </div>
    );
  }

  changeTab(){

  }
}

export default Repo;
