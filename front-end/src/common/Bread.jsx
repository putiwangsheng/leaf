import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Row, Col, Breadcrumb  } from 'antd';

class Bread extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visiable: false
    }
  }

  renderBread(dataSource) {
    return (
      <Breadcrumb>
        {
          dataSource && dataSource.length > 0 ? dataSource.map(item => {
            return (
              <Breadcrumb.Item key={item.name}>
                { !item.path ?
                  (<span>{item.name}</span>) :
                  (<Link to={item.path}>{item.name}</Link>)
                }
                </Breadcrumb.Item>
            )
          }) : null
        }
      </Breadcrumb>
    )
  }

  render() {
    const dataSource = this.props.dataSource || [];

    return (
      <div className="" style={{margin: "20px auto"}}>
        <Row>
          <Col span={24}>{this.renderBread(dataSource)}</Col>
        </Row>
      </div>
    )
  }
}

export default Bread;
