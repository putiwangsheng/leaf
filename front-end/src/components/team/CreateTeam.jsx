import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {Form, Input, Checkbox, Button, Card} from 'antd';
import styles from './CreateTeam.less';

import { request, API } from '../../services/request';
import Bread from '../../common/Bread.jsx';

const FormItem = Form.Item;

class CreateTeam extends Component {
  constructor(props) {
    super(props);

    this.userId = this.props.location.query.userId;
  }

  // 创建团队
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let obj = {
          authority: 'Owner',
          userId: this.userId
        }
        values.members = [obj];

        request({
          url: `${API}/api/team`,
          method: 'post',
          body: values
        }).then(data => {
          console.log(data);
          browserHistory.push(`${API}/person?userId=${this.userId}`);
        });
      }
    });
  }

  render() {
    const { getFieldDecorator  } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 7 },
    };

    const dataSource = [
      {
        name: '新建团队'
      }
    ];

    return (
      <div className={styles.container}>
        <Bread dataSource={dataSource} />

        <Card style={{
          width: "100%",
          minHeight: "560px"
        }}>
          <div className="form-wrapper">
            <p className="title">
              创建团队
            </p>
            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
              <FormItem label="头像地址" {...formItemLayout}>
                {
                  getFieldDecorator ('avatar', {
                    rules: [{ required: false, message: '请输入头像地址' }],
                  })
                  (<Input placeholder="头像"/>)
                }

              </FormItem>

              <FormItem label="团队名称" {...formItemLayout}>
                {
                  getFieldDecorator ('name', {
                    rules: [{ required: true, message: '请输入团队名称' }],
                  })
                  (<Input placeholder="团队名称"/>)
                }
              </FormItem>

              <FormItem label="简介" {...formItemLayout}>
                {
                  getFieldDecorator('intro')
                  (<Input type="textarea" placeholder="简介" rows={6}/>)
                }
              </FormItem>

              <FormItem style={{ marginBottom: 8 }} wrapperCol={{
                span: 8,
                offset: 3
              }}>
                {
                  getFieldDecorator ('isPrivate', {
                    initialValue: false,
                    valuePropName: 'checked',
                  })

                  (<Checkbox>是否设为私密</Checkbox>)
                }
              </FormItem>

              <FormItem wrapperCol={{
                span: 3,
                offset: 3
              }}>
                <Button type="primary" htmlType="submit" className="team-button">
                  创 建
                </Button>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
    );
  }
}

CreateTeam = Form.create()(CreateTeam);

export default CreateTeam;
