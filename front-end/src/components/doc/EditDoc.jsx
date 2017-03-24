import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import SimpleMDE from 'react-simplemde-v1';

import {Button, Input, message} from 'antd';

import styles from './EditDoc.less';

import { request, API } from '../../services/request';

class EditDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docContent: '',
      title: ''
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
        this.setState({docContent: data.info.draftContent, title: data.info.title});
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

    return (
      <div className={styles.container}>
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

  getTitle(e) {
    this.setState({title: e.target.value});
  }

  handleSaveDoc(flag) {
    let {title, docContent} = this.state;
    let body = {
      repoId: this.repoId,
      creatorId: '58b27acd766cf80822353e7f',
      info: {
        title,
        draftContent: docContent
      }
    };

    if (flag === 'publish') {
      body.info.publishContent = docContent;
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
        browserHistory.push(`${API}/repo?repoId=${this.repoId}&userId=${this.userId}`);
      });

    } else if (this.flag === 'e') {
      console.log(body);
      // 修改文档
      request({
        url: `${API}/api/doc/${this.docId}`,
        method: 'put',
        body: body
      }).then(data => {
        console.log(data);
      });
    }
  }
}

export default EditDoc;
