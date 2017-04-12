import React, {Component} from 'react';
import {Row, Col, Form, Input, Checkbox, Button, Select, Card} from 'antd';
import {browserHistory} from 'react-router';

import styles from './CreateRepo.less';

import Bread from '../../common/Bread.jsx';

import { request, API } from '../../services/request';

const FormItem = Form.Item;
const Option = Select.Option;

class CreateRepo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      labels: []
    }

    this.userId = this.props.location.query.userId;
    this.teamId = this.props.location.query.teamId;
    this.isBelongToTeam = Boolean(this.props.location.query.belongTeam);
  }

  componentDidMount() {
    request({
      url: `${API}/api/label`
    }).then(labelData => {
      // 标签排序
      labelData.sort((a, b) => {
        return a.index - b.index;
      })

      this.setState({
        labels: labelData
      })
    }, (err) => {
      console.log(err);
    })
  }

  // 创建仓库
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.creatorId = this.userId;

        if(this.isBelongToTeam) {
          values.teamId = this.teamId;
          values.isBelongToTeam = true;
        }

        let labels = values.labels;
        let labelArr = [];
        labels.forEach(labelItem => {
          this.state.labels.forEach(item => {
            if(item._id === labelItem) {
              labelArr.push({
                labelId: labelItem,
                labelName: item.labelName
              })
            }
          })
        })

        values.labels = labelArr;

        request({
          url: `${API}/api/repo`,
          method: 'post',
          body: values
        }).then(data => {
          console.log(data);
          if(this.isBelongToTeam) {
            browserHistory.push(`/team?teamId=${this.teamId}&userId=${this.userId}&flag=repos`);
          }
          browserHistory.push(`/`);
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let { labels } = this.state;

    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 7 },
    };

    let dataSource = !this.isBelongToTeam ? [
      {
        name: '新建仓库'
      }
    ]: [
      {
        name: '团队'
      },
      {
        path: `/team?teamId=${this.teamId}&userId=${this.userId}`,
        name: '团队信息'
      },
      {
        name: '新建团队仓库'
      }
    ]

    const children = [];
    labels.forEach(item => {
      children.push(<Option key={item._id}>{item.labelName}</Option>);
    })

    return (
      <div className={styles.container}>
        <Bread dataSource={dataSource} />

        <Card style={{
          width: "100%",
          minHeight: "560px"
        }}>
          <div className="form-wrapper">
            <p className="title">
              新建仓库
            </p>

            <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
              <FormItem label="仓库名称" {...formItemLayout}>
                {
                  getFieldDecorator ('repoName', {
                    rules: [{ required: true, message: '请输入仓库名称' }],
                  })
                  (<Input placeholder="仓库名称"/>)
                }
              </FormItem>

              <FormItem label="标签" {...formItemLayout}>
                {
                  getFieldDecorator ('labels', {
                    rules: [{ required: true, message: '请选择仓库标签' }],
                  })
                  (<Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="选择标签">
                      {children}
                    </Select>)
                }
              </FormItem>

              <FormItem label="简介" {...formItemLayout}>
                {
                  getFieldDecorator('intro')

                  (<Input type="textarea" placeholder="简介" rows={6}/>)
                }
              </FormItem>

              <FormItem style={{ marginBottom: 8 }} wrapperCol={{
                span: 24,
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
                <Row gutter={16} className="repo-button">
                  <Col span={12}>
                    <Button type="primary" htmlType="submit">
                      创 建
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
    );
  }
}

CreateRepo = Form.create()(CreateRepo);

export default CreateRepo;
