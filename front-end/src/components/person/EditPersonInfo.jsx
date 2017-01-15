import React, {Component} from 'react';
import {Link} from 'react-router';
import {Tabs, Icon} from 'antd';
import styles from './Personal.less';
import { getPersonalRepoList } from '../../services/fetchData';

class EditPersonInfo extends Component {
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
            <Icon type="edit" className="icon-edit"/>
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
                      <p>
                        <Link to={`/repo?repoid=${item._id}`}>
                          {item.repoName}
                        </Link>
                      </p>
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

export default EditPersonInfo;
