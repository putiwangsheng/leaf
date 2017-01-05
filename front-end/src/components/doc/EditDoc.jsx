import React, {Component} from 'react';
import SimpleMDE from 'react-simplemde-v1';
import {Button, Input, message} from 'antd';
import styles from './EditDoc.less';
import { saveDoc } from '../../services/fetchData';

class EditDoc extends Component {
  constructor() {
    super();
    this.state = {
      docContent: '',
      title: ''
    };
  }

  render() {
    let that = this;
    const option = {};
    const onEvents = {
      'change': function() {
        that.setState({docContent: this.value()});
      }
    };
    return (
      <div className={styles.container}>
        <Input placeholder="请输入标题" style={{width: 300}} className="title" onChange={this.getTitle.bind(this)}/>

        <Button type="primary" size="small" className="publish">发布文档</Button>
        <Button type="primary" size="small" className="save" onClick={this.saveDoc.bind(this)}>保存草稿</Button>

        <div className="editor">
          <SimpleMDE option={option} text='' onEvents={onEvents}/>
        </div>

      </div>
    );
  }

  getTitle(e){
    this.setState({
      title: e.target.value
    });
  }

  saveDoc(){
    let { title, docContent } = this.state;
    let body = {
      repoId: '1',
      creatorId: '1',
      info: {
        title,
        draftContent: docContent
      }
    };
    saveDoc(body).then(data => {
      console.log(data);
      message.success('保存成功');
    });
  }
}

export default EditDoc;
