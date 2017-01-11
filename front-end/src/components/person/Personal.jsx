import React, {Component} from 'react';
import {Link} from 'react-router';
import {Tabs} from 'antd';
import styles from './Personal.less';
import { getPersonalRepoList } from '../../services/fetchData';

class Personal extends Component {
  constructor() {
    super();
    this.state = {
      repoList: []
    };
  }

  componentDidMount(){
    getPersonalRepoList().then(data => {
      console.log(data);
      this.setState({
        repoList: data
      });
    });
  }

  render() {
    let { repoList } = this.state;

    return (
      <div className={styles.container}>
        <div className="left-side">
          <div className="personal-info">
            <p className="name">
              测试
            </p>
            <p>
              <span>邮箱：</span>
              <span>2026929156@qq.com</span>
            </p>
            <p>
              <span>职位：</span>
              <span>前端</span>
            </p>
          </div>
          <div className="personal-team">
            <p className="title">
              团队
            </p>
          </div>
        </div>

        <div className="right-side">
          <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
            <Tabs.TabPane tab="仓库列表" key="1">
              <div className="repos">
                {
                  repoList.map(item => {
                    return (
                      <Link to='/repo'>
                        {item.repoName}
                      </Link>
                    );
                  })
                }
              </div>

            </Tabs.TabPane>
            <Tabs.TabPane tab="收藏列表" key="2">Content of Tab Pane 2</Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }

  changeTab(){

  }

}

export default Personal;
