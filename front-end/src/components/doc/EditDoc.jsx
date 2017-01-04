import React, {Component} from 'react';
import SimpleMDE from 'react-simplemde-v1';
import {Button} from 'antd';
import styles from './EditDoc.less';

class EditDoc extends Component {
  constructor() {
    super();
    this.state = {
      docContent: ''
    };
  }

  render() {
    let that = this;
    const option = {};
    const onEvents = {
      'change': function() {
        console.log(this.value());
        that.setState({docContent: this.value()});
      }
    };
    return (
      <div className={styles.container}>
        <Button type="primary" size="small" className="publish">发布</Button>
        <Button type="primary" size="small" className="save">保存</Button>

        <div className="editor">
          <SimpleMDE option={option} text='' onReady={this.onReady.bind(this)} onEvents={onEvents}/>
        </div>

      </div>
    );
  }

  onReady(instance) {
    console.log(instance.value());
  }
}

export default EditDoc;
