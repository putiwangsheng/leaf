import React, {Component} from 'react';
import {Row, Col, Form, Input, Checkbox, Button} from 'antd';
import {browserHistory} from 'react-router';

import styles from './CreateRepo.less';

import { request, API } from '../../services/request';

const FormItem = Form.Item;

class CreateRepo extends Component {
  constructor(props) {
    super(props);

    this.userId = this.props.location.query.userId;
  }

  // 创建仓库
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.creatorId = this.userId;

        request({
          url: `${API}/api/repo`,
          method: 'post',
          body: values
        }).then(data => {
          console.log(data);
          browserHistory.push(`${API}/`);
        });
      }
    });
  }

  render() {
    const { getFieldDecorator  } = this.props.form;

    return (
      <div className={styles.container}>
        <p className="title">
          新建仓库
        </p>
        <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
          <FormItem label="仓库名称">
            {
              getFieldDecorator ('repoName', {
                rules: [{ required: true, message: '请输入仓库名称' }],
              })
              (<Input placeholder="仓库名称"/>)
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
            <Row gutter={16} className="repo-button">
              <Col span={12}>
                <Button type="primary" htmlType="submit">
                  创 建
                </Button>
              </Col>
              <Col span={12}>
                <Button type="Default">
                  删 除
                </Button>
              </Col>
          </Row>
          </FormItem>
        </Form>
      </div>
    );
  }
}

CreateRepo = Form.create()(CreateRepo);

export default CreateRepo;
