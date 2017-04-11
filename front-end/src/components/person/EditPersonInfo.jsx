import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {Form, Input, Button, Card} from 'antd';

import styles from './EditPersonInfo.less';

import Bread from '../../common/Bread.jsx';

import { request, API } from '../../services/request';

const FormItem = Form.Item;

class EditPersonInfo extends Component {
  constructor(props) {
    super(props);
    this.userId = this.props.location.query.userId;

    this.state = {
      userInfo: {}
    };
  }

  componentDidMount(){
    // 用户信息
    request({
      url: `${API}/api/user/${this.userId}`,
    }).then(data => {
      this.setState({
        userInfo: data.info
      });
    });
  }

  // 修改个人信息
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let body = {
          collectedReposIds:[],
          info: values
        };

        request({
          url: `${API}/api/user/${this.userId}`,
          method: 'put',
          body: body
        }).then(data => {
          console.log(data);
          browserHistory.push(`${API}/person?userId=${this.userId}`);
        });
      }
    });
  }

  render() {
    let { userInfo } = this.state;
    const { getFieldDecorator  } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 7 },
    };

    const dataSource = [
      {
        path: `/person?userId=${this.userId}`,
        name: '个人管理'
      }, {
        name: '编辑信息'
      }
    ]

    return (
      <div className={styles.container}>
        <Bread dataSource={dataSource} />

        <Card style={{
          width: "100%",
          minHeight: "560px"
        }}>
          <div className="form-wrapper">
            <p className="title">
              修改个人信息
            </p>
            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
              <FormItem label="头像地址" {...formItemLayout}>
                  {
                    getFieldDecorator ('avatar', {
                      initialValue: userInfo.avatar,
                      rules: [{ required: false, message: '请输入头像地址' }],
                    })
                    (<Input placeholder="头像"/>)
                  }
              </FormItem>

              <FormItem label="昵称" {...formItemLayout}>
                {
                  getFieldDecorator ('nickName', {
                    initialValue: userInfo.nickName,
                    rules: [{ required: true, message: '请输入昵称' }],
                  })
                  (<Input placeholder="昵称"/>)
                }
              </FormItem>

              <FormItem label="姓名" {...formItemLayout}>
                {
                  getFieldDecorator('name', {
                    initialValue: userInfo.name,
                  })
                  (<Input placeholder="姓名"/>)
                }
              </FormItem>

              <FormItem label="邮箱" {...formItemLayout}>
                {
                  getFieldDecorator('email', {
                    initialValue: userInfo.email,
                    rules: [{ required: true, message: '请输入邮箱' }],
                  })
                  (<Input placeholder="邮箱"/>)
                }
              </FormItem>

              <FormItem label="职位" {...formItemLayout}>
                {
                  getFieldDecorator('job', {
                    initialValue: userInfo.job,
                  })
                  (<Input placeholder="职位"/>)
                }
              </FormItem>

              <FormItem label="所属部门" {...formItemLayout}>
                {
                  getFieldDecorator('department', {
                    initialValue: userInfo.department,
                  })
                  (<Input placeholder="所属部门"/>)
                }
              </FormItem>

              <FormItem wrapperCol={{
                span: 7,
                offset: 3
              }}>
                <Button type="primary" htmlType="submit" className="modify-button">
                  修改
                </Button>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
    );
  }
}

EditPersonInfo = Form.create()(EditPersonInfo);

export default EditPersonInfo;
