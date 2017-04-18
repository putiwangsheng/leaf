import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import SimpleMDE from 'react-simplemde-v1';
import moment from 'moment';

import {Button, Input, message} from 'antd';
import Bread from '../../common/Bread.jsx';

import styles from './EditDoc.less';

import { request, API } from '../../services/request';

class EditDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docContent: '',
      title: '',
      data: []
    };

    const query = this.props.location.query;
    this.repoId = query.repoId;
    this.userId = query.userId;
    this.docId = query.docId;
    this.flag = query.flag;
  }

  componentDidMount() {
    // 获取文档信息
    if (this.flag === 'e') {
      request({
        url: `${API}/api/doc/${this.docId}`,
      }).then(data => {
        this.setState({docContent: data.info.draftContent, title: data.info.title, data});
      });
    }
  }

  getTitle(e) {
    this.setState({title: e.target.value});
  }

  handleSaveDoc(flag) {
    let { title, docContent, data } = this.state;

    if(!docContent) {
      message.warning("请填写内容！");
      return;
    }

    if(!title) {
      message.warning("请填写标题！");
      return;
    }

    let info = data.info ? data.info : {};

    let body = {
      repoId: this.repoId,
      creatorId: this.userId,
      info: {
        title,
        draftContent: docContent,
        publishContent: info.publishContent || '',
        publishTime: info.publishTime || '',
        saveTime: moment(new Date()).format('YYYY-MM-DD')
      }
    };

    if (flag === 'publish') {
      body.info.publishContent = docContent;
      body.info.publishTime = moment(new Date()).format('YYYY-MM-DD');
    }

    if (this.flag === 'c') {
      // 保存文档
      request({
        url: `${API}/api/doc`,
        method: 'post',
        body: body
      }).then(data => {
        console.log(data);
        message.success('保存成功');
        browserHistory.push(`/repo?repoId=${this.repoId}&userId=${this.userId}`);
      });

    } else if (this.flag === 'e') {
      // 修改文档
      request({
        url: `${API}/api/doc/${this.docId}`,
        method: 'put',
        body: body
      }).then(data => {
        console.log(data);
        message.success('修改成功');
        browserHistory.push(`/repo?repoId=${this.repoId}&userId=${this.userId}`);
      });
    }
  }

  render() {
    let that = this;
    const option = {};

    const onEvents = {
      'change': function() {
        that.setState({docContent: this.value()});
      }
    };

    let simplemde;
    if(this.flag === 'e' && this.state.docContent){
      simplemde = (<SimpleMDE option={option} text={this.state.docContent} onEvents={onEvents} />);
    }

    if(this.flag === 'c'){
      simplemde = (<SimpleMDE option={option} text="" onEvents={onEvents} />);
    }

    const dataSource = [
      {
        name: '仓库'
      }, {
        name: '编辑仓库文档'
      }
    ];

    return (
      <div className={styles.container}>
        <Bread dataSource={dataSource} />

        <Input placeholder="请输入标题" style={{
          width: 300
        }} value={this.state.title} className="title" onChange={this.getTitle.bind(this)}/>

      <Button type="primary" size="small" className="publish" onClick={this.handleSaveDoc.bind(this, 'publish')}>发布文档</Button>
        <Button type="primary" size="small" className="save" onClick={this.handleSaveDoc.bind(this, 'save')}>保存草稿</Button>

        <div className="editor">
          {simplemde}
        </div>

      </div>
    );
  }
}

export default EditDoc;
