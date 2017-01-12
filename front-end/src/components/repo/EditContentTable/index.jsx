import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import update from 'react/lib/update';

import Card from './Card';

import styles from './index.less';

@DragDropContext(HTML5Backend)
class EditContentTable extends Component {
  constructor() {
    super();

    // repoIndex is list index
    this.state = {}
    this.state.cards = [
      {
        id: 1,
        rank: 1,
        title: '编程'
      },
      {
        id: 2,
        rank: 2,
        title: 'js 大法好'
      },
      {
        id: 3,
        rank: 1,
        title: '英语'
      },
      {
        id: 4,
        rank: 2,
        title: '要学好英语'
      },
      {
        id: 5,
        rank: 3,
        title: '要学能阅读英语'
      }
    ];
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
  }

  render() {
    return (
      <div className={styles.container}>
        <p className="notice">
          <span className="star">*</span>拖动进行目录设置
        </p>
        {this.renderContentList()}
      </div>
    );
  }

  renderContentList() {
    return this.state.cards.map((item, i) => {
      return (
        <div className={`rank${item.rank}`}>
          <Card
            key={item.id}
            index={i}
            id={item.id}
            text={item.title}
            moveCard={this.moveCard.bind(this)} />
        </div>
      );
    });
  }
}


export default EditContentTable;
