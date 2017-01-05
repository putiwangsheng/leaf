import React, { Component } from 'react';
// import { DragDropContext } from 'react-dnd';
// import HTML5Backend from 'react-dnd-html5-backend';

import styles from './index.less';

// @DragDropContext(HTML5Backend)
class EditContentTable extends Component {
  constructor() {
    super();

    // repoIndex is list index
    this.mockData = [
      {
        rank: 1,
        title: '编程'
      },
      {
        rank: 2,
        title: 'js 大法好'
      },
      {
        rank: 1,
        title: '英语'
      },
      {
        rank: 2,
        title: '要学好英语'
      },
      {
        rank: 2,
        title: '要学能阅读英语'
      }
    ];
  }

  render() {
    return (
      <div>
        {this.renderContentList()}
      </div>
    );
  }

  renderContentList() {
    return this.mockData.map(item => {
      return (
        <div className={getRankClassName(item.rank)}>
           {item.title}
        </div>
      );
    });
  }
}

function getRankClassName(rank) {
  if (rank === 1) {
    return styles.rank1;
  }
  if (rank === 2) {
    return styles.rank2;
  }
  if (rank === 3) {
    return styles.rank3;
  }
}


export default EditContentTable;
