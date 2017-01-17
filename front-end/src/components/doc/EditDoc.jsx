import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import SimpleMDE from 'react-simplemde-v1';
import {Button, Input, message} from 'antd';
import styles from './EditDoc.less';
import {API, saveDoc, getDocInfo} from '../../services/fetchData';

class EditDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docContent: '',
      title: ''
    };

    this.repoId = this.props.location.query.repoid;
    this.docId = this.props.location.query.docid;
    this.flag = this.props.location.query.flag;

  }

  componentDidMount() {
    if (this.flag === 'e') {
      getDocInfo(this.docId).then(data => {
        console.log(data);
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

        <Button type="primary" size="small" className="publish" onClick={this.saveDoc.bind(this, 'publish')}>发布文档</Button>
        <Button type="primary" size="small" className="save" onClick={this.saveDoc.bind(this, 'save')}>保存草稿</Button>

        <div className="editor">
          {simplemde}
        </div>

      </div>
    );
  }

  getTitle(e) {
    this.setState({title: e.target.value});
  }

  saveDoc(flag) {
    let {title, docContent} = this.state;
    let body = {
      repoId: this.repoId,
      creatorId: '7',
      info: {
        title,
        draftContent: docContent
      }
    };

    if (flag === 'publish') {
      body.info.publishContent = docContent;
    }

    if (this.flag === 'c') {
      saveDoc(body).then(data => {
        console.log(data);
        message.success('保存成功');
        browserHistory.push(`${API}/repo?repoid=${this.repoId}`);
      });
    } else if (flag === 'e') {}

  }
}

export default EditDoc;
