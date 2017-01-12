import React, {Component} from 'react';

import {Link} from 'react-router';
import {Button, Tabs} from 'antd';
import EditContentTable from './EditContentTable';

import {getRepoInfo, getRepoDoc} from '../../services/fetchData';

import styles from './index.less';


class Repo extends Component {
  constructor(props) {
    super(props);
    this.repoId = this.props.location.query.repoid;
    this.state = {
      repoData: {},
      repoDocs: []
    };
  }

  componentDidMount() {
    Promise.all([
      getRepoInfo(this.repoId),
      getRepoDoc(this.repoId)
    ]).then(data => {
      console.log(data);
      this.setState({repoData: data[0], repoDocs: data[1]});
    });
  }

  render() {
    let {repoData} = this.state;

    return (
      <div className={styles.repoContainer}>
        <Link to={`/doc/edit?repoid=${this.repoId}`}>
          <Button type="primary" className="create-doc-button">
            新建文档
          </Button>
        </Link>

        <div className="repo-content">
          <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
            <Tabs.TabPane tab="目录" key="1">
              <div className="">
                <p className="repoName">
                  {repoData.repoName}
                </p>
                <p className="repoIntro">
                  {repoData.intro}
                </p>
                <div className="docs">
                  <EditContentTable />
                </div>
              </div>

            </Tabs.TabPane>

            <Tabs.TabPane tab="草稿" key="2">
              <div className="">
                <p className="repoName">
                  {repoData.repoName}
                </p>
                <div className="docs">
                  {this.getRepoDocList()}
                </div>
              </div>

            </Tabs.TabPane>

            <Tabs.TabPane tab="设置" key="3">Content of Tab Pane 3</Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }

  getRepoDocList() {
    return this.state.repoDocs.map(item => {
      return (
        <p>
          {item.info.title}
        </p>
      );
    });
  }

  changeTab() {}
}

export default Repo;
