import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

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
        title: '编程',
        hoverStyle: styles.lineUp,
      },
      {
        id: 2,
        rank: 1,
        title: 'js 大法好',
        hoverStyle: '',
      },
      {
        id: 3,
        rank: 1,
        title: '英语',
        hoverStyle: styles.lineDown,
      },
      {
        id: 4,
        rank: 1,
        title: '要学好英语',
        hoverStyle: '',
      },
      {
        id: 5,
        rank: 1,
        title: '要学能阅读英语',
        hoverStyle: styles.border
      }
    ];
  }

  isHasChild(index) {
    const { cards } = this.state;

    // 边界条件
    if (index >= cards.length - 1) {
      return false;
    }

    return cards[index].rank === 1 && cards[index + 1].rank === 2;
  }

  getMoveInfo(monitor, component, hoverIndex) {
    const moveInfo = {
      newRank: 1,
      isFirstBlock: false
    };

    // 1. get rectHeight
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const rectHeight = hoverBoundingRect.bottom - hoverBoundingRect.top;

    // 2. get hoverClientHeight
    const clientOffset = monitor.getClientOffset();
    const hoverClientHeight = clientOffset.y - hoverBoundingRect.top;

    // 3. get hoverRectRank and nextRectRank
    const { cards } = this.state;
    const hoverRectRank = cards[hoverIndex] && cards[hoverIndex].rank;
    const nextRectRank = cards[hoverIndex + 1] && cards[hoverIndex + 1].rank;

    // 4. judge newRank:三种情况分别讨论。整个判断逻辑请看 doc.md
    if (hoverClientHeight < rectHeight/4) {
      moveInfo.newRank = hoverRectRank;
      moveInfo.isFirstBlock = true;
    }
    else if (hoverClientHeight > rectHeight/4 && hoverClientHeight < rectHeight * 3/4) {
      moveInfo.newRank = 2;
    }
    else if (hoverClientHeight > rectHeight*3/4) {
      // 不存在下一行的特殊情况。
      if (cards[hoverIndex + 1] === undefined) {
        moveInfo.newRank = 1;
        return moveInfo;
      }

      moveInfo.newRank = hoverRectRank === 1 && nextRectRank === 2 ? 2 : 1;
    }

    return moveInfo;
  }

  // isSameRank 是跟 hover card 来比较
  getHoverInfo(monitor, component, hoverIndex) {
    const moveInfo = this.getMoveInfo(monitor, component, hoverIndex);

    return {
      ...moveInfo,
      isSameRank: moveInfo.newRank === this.state.cards[hoverIndex].rank
    };
  }

  moveCard(dragIndex, dropIndex, newRank, isFirstBlock) {
    const { cards } = this.state;
    const newCards = cards.slice();

    const dragCard = cards[dragIndex];
    const dropCard = cards[dropIndex];

    dragCard.rank = newRank;

    // 1. get moveCards from splice newCards
    let moveCards;
    // 移动 card, 分两种情况，dragCard 没子 card，有子 card
    if (!this.isHasChild(dragIndex)) {
      moveCards = newCards.splice(dragIndex, 1);
    } else {
      // 有子 card 需要把 子 card 全部移动
      let childLen = cards.slice(dragIndex + 1).findIndex(
        item => item.rank === 1
      );
      childLen = childLen === -1 ? cards.length - dragIndex : childLen;

      moveCards = newCards.splice(dragIndex, childLen + 1);
    }

    // 2. get insertIndex
    let insertIndex = newCards.findIndex(item => item.id === dropCard.id);
    if (!isFirstBlock) {
      insertIndex += 1;
    }

    // 3. insert moveCards
    newCards.splice(insertIndex, 0, ...moveCards);

    this.setState({
      cards: newCards
    });
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
        <div className={`rank${item.rank} ${item.hoverStyle}`}>
          <Card
            key={item.id}
            index={i}
            id={item.id}
            text={item.title}
            moveCard={this.moveCard.bind(this)}
            getMoveInfo={this.getMoveInfo.bind(this)}
            getHoverInfo={this.getHoverInfo.bind(this)}
            isHasChild={this.isHasChild.bind(this)} />
        </div>
      );
    });
  }
}


export default EditContentTable;
