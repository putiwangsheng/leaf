import React, {Component} from 'react';
import {Tabs} from 'antd';

import styles from './TeamInfo.less';

class TeamInfo extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={styles.container}>
        <div className="left-side">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="仓库" key="1">
              <p>
                团队仓库列表
              </p>
            </Tabs.TabPane>

            <Tabs.TabPane tab="成员" key="2">
              <p>
                成员列表
              </p>
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className="right-side">
          <p className="tag-member">
            成员
          </p>
          <div className="members">
            <p>
              llll
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default TeamInfo;
