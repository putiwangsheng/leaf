import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {Form, Input, Button} from 'antd';
import { API, createTeam } from '../../services/fetchData';
import styles from './EditPersonInfo.less';

const FormItem = Form.Item;

class EditPersonInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { getFieldDecorator  } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div className={styles.container}>
        <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
          <FormItem label="头像" {...formItemLayout}>
            <Input placeholder="头像"/>
          </FormItem>

          <FormItem label="昵称" {...formItemLayout}>
            {
              getFieldDecorator ('nickName', {
                rules: [{ required: true, message: '请输入昵称' }],
              })
              (<Input placeholder="昵称"/>)
            }
          </FormItem>

          <FormItem label="姓名" {...formItemLayout}>
            {
              getFieldDecorator('name')
              (<Input placeholder="姓名"/>)
            }
          </FormItem>

          <FormItem label="邮箱" {...formItemLayout}>
            {
              getFieldDecorator('email', {
                rules: [{ required: true, message: '请输入邮箱' }],
              })
              (<Input placeholder="邮箱"/>)
            }
          </FormItem>

          <FormItem label="职位" {...formItemLayout}>
            {
              getFieldDecorator('job')
              (<Input placeholder="职位"/>)
            }
          </FormItem>

          <FormItem label="所属部门" {...formItemLayout}>
            {
              getFieldDecorator('department')
              (<Input placeholder="所属部门"/>)
            }
          </FormItem>

          <FormItem wrapperCol={{
            span: 14,
            offset: 6
          }}>
            <Button type="primary" htmlType="submit">
              修改
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
        values.membersIds = ['7'];
        createTeam(values).then(data => {
          console.log(data);
          browserHistory.push(`${API}/`);
        });
      }
    });
  }
}

EditPersonInfo = Form.create()(EditPersonInfo);

export default EditPersonInfo;
