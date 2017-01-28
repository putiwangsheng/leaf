import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {Form, Input, Checkbox, Button} from 'antd';
import styles from './CreateTeam.less';
import { API, createTeam } from '../../services/fetchData';

const FormItem = Form.Item;

class CreateTeam extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { getFieldDecorator  } = this.props.form;

    return (
      <div className={styles.container}>
        <p className="title">
          创建团队
        </p>
        <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
          <FormItem label="头像">
            <Input placeholder="头像"/>
          </FormItem>

          <FormItem label="团队名称">
            {
              getFieldDecorator ('name', {
                rules: [{ required: true, message: '请输入团队名称' }],
              })
              (<Input placeholder="团队名称"/>)
            }
          </FormItem>

          <FormItem label="简介">
            {
              getFieldDecorator('intro')
              (<Input type="textarea" placeholder="简介" rows={6}/>)
            }
          </FormItem>

          <FormItem style={{ marginBottom: 8 }}>
            {
              getFieldDecorator ('isPrivate', {
                initialValue: false,
                valuePropName: 'checked',
              })

              (<Checkbox>是否设为私密</Checkbox>)
            }
          </FormItem>

          <FormItem wrapperCol={{
            span: 8
          }}>
            <Button type="primary" htmlType="submit">
              创 建
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.avatar = 'https://ooo.0o0.ooo/2017/01/15/587b32a8cd8ba.jpg';
        values.membersIds = ['587c81421407a634241e77cf'];
        createTeam(values).then(data => {
          console.log(data);
          browserHistory.push(`${API}/`);
        });
      }
    });
  }
}

CreateTeam = Form.create()(CreateTeam);

export default CreateTeam;
