import React, {Component} from 'react';

import {Link} from 'react-router';
import {Button, Tabs, Icon, Popconfirm, message} from 'antd';

import EditContentTable from './EditContentTable';

import styles from './Repo.less';
import {getRepoInfo, getRepoDoc, deleteRepoDoc} from '../../services/fetchData';


class Repo extends Component {
  constructor(props) {
    super(props);
    this.repoId = this.props.location.query.repoid;
    this.state = {
      repoData: {},
      repoDocs: [],
      draftDocs: []
    };
  }

  componentDidMount() {
    Promise.all([
      getRepoInfo(this.repoId),
      getRepoDoc(this.repoId)
    ]).then(data => {
      console.log(data);
      this.setState({repoData: data[0], repoDocs: data[1], draftDocs: data[1]});
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
          <Icon type="smile-o" className="icon-collect"/>

          <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
            <Tabs.TabPane tab="目录" key="1">
              <div className="tab-pane-content">
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
                  {this.getDraftDocList()}
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
        <p key={item._id}>
          {item.info.title}
        </p>
      );
    });
  }

  getDraftDocList() {
    return this.state.draftDocs.map(item => {
      return (
        <Link to={`/doc/view?docid=${item._id}&flag=draft`} key={item._id}>
          <p>
            {item.info.title}

            <Popconfirm title="确定删除该文档吗？" onConfirm={this.confirmDelete.bind(this, item._id)} okText="Yes" cancelText="No">
              <Icon type="close" className="icon-delete-doc"/>
            </Popconfirm>

            <Link to={`/doc/edit`}>
              <Icon type="edit" className="icon-edit-doc"/>
            </Link>
          </p>
        </Link>
      );
    });
  }

  confirmDelete(docId) {
    deleteRepoDoc(docId).then(data => {
      console.log(data);
      message.success('删除成功');
      
      getRepoDoc(this.repoId).then(data => {
        this.setState({draftDocs: data});
      });
    });
  }

  changeTab() {}
}

export default Repo;
