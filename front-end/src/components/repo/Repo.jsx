import React, {Component} from 'react';
import {Link} from 'react-router';
import {Button, Tabs, Icon, Popconfirm, message, Tooltip } from 'antd';

import EditContentTable from './EditContentTable';

import styles from './Repo.less';
import {getRepoInfo, getRepoDoc, deleteRepoDoc, getUserInfo, modifyUserInfo} from '../../services/fetchData';

const userId = '58b27acd766cf80822353e7f';

class Repo extends Component {
  constructor(props) {
    super(props);
    this.repoId = this.props.location.query.repoid;
    this.state = {
      repoData: {},
      draftDocs: [],
      userInfo: {},
      isCollected: false
    };
  }

  componentDidMount() {
    Promise.all([
      getRepoInfo(this.repoId),
      getRepoDoc(this.repoId),
      getUserInfo(userId)
    ]).then(data => {
      let isCollected = this.judgeIsCollected(data[2]);
      this.setState({repoData: data[0], draftDocs: data[1], userInfo: data[2], isCollected});
    });
  }

  render() {
    let {repoData, isCollected} = this.state;

    let iconColorClass = isCollected ? 'collected' : '';

    return (
      <div className={styles.repoContainer}>
        <Link to={`/doc/edit?repoid=${this.repoId}&flag=c`}>
          <Button type="primary" className="create-doc-button">
            新建文档
          </Button>
        </Link>

        <div className="repo-content">
          <div><Icon type="smile-o" className={`icon-collect ${iconColorClass}`} onClick={this.collectRepo.bind(this)}/><p className="word-collect">收藏</p></div>

          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="目录" key="1">
              <div className="tab-pane-content">
                <p className="repoName">
                  {repoData.repoName}
                </p>
                <p className="repoIntro">
                  {repoData.intro}
                </p>
                <div className="docs">
                  <EditContentTable repoId={this.repoId} />
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

  // 草稿列表
  getDraftDocList() {
    return this.state.draftDocs.map(item => {
      return (
        <Link to={`/doc/view?docid=${item._id}&flag=draft`} key={item._id}>
          <p>
            {item.info.title}

            <Popconfirm title="确定删除该文档吗？" onConfirm={this.confirmDelete.bind(this, item._id)} okText="Yes" cancelText="No">
              <Icon type="close" className="icon-delete-doc"/>
            </Popconfirm>

            <Link to={`/doc/edit?repoid=${this.repoId}&docid=${item._id}&flag=e`}>
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

  // 收藏仓库
  collectRepo() {
    let { userInfo, isCollected } = this.state;

    if(isCollected) {
      message.warning('该仓库您已收藏', 1.5);

      return;
    }

    let collectionIds = userInfo.collectedReposIds;
    collectionIds.push(this.repoId);

    modifyUserInfo(userId, userInfo).then(data => {
      console.log(data);
      message.success('收藏成功');
    })
  }

  // 判断该仓库是否被收藏
  judgeIsCollected(userInfo) {
    let collectionIds = userInfo.collectedReposIds;

    if(collectionIds.indexOf(this.repoId) !== -1) {
      return true;
    }
  }
}

export default Repo;
