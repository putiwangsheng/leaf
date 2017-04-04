import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Link, browserHistory } from 'react-router';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'react/lib/update';

import Card from './Card';

import { request, API } from '../../../services/request';

import styles from './index.less';

/*jshint ignore:start*/
@DragDropContext(HTML5Backend)
/*jshint ignore:end*/
class EditContentTable extends Component {
  constructor() {
    super();

    this.state = {
      cards: []
    };
  }

  componentDidMount() {
    const that = this;
    request({
      url: `${API}/api/repo/${this.props.repoId}`
    }).then(repo => {
      let { tableOfContents } = repo;

      if(tableOfContents.length > 0) {
        const docsIds = tableOfContents.map(item => item.docId);

        const qureyStr = `?_id__in=${docsIds.join(',')}&select=info`;

        return request({
          url: `${API}/api/doc${qureyStr}`
        }).then(docs => {
          return tableOfContents.map(item => {
            let docInfo = docs.filter(doc => item.docId === doc._id)[0];

            return {
              id: item.docId,
              rank: item.rank,
              title: docInfo ? docInfo.info.title : '',
              hoverStyle: undefined
          }})
        }).then(tableOfContents => {
          console.log(tableOfContents);
          that.setState({
            cards: tableOfContents
          })
        })
      }

    });

  }

  changeHoverStyle(style, index) {
    if (this.state.cards[index].hoverStyle === style) {
      return;
    }

    const newCards = this.state.cards.slice();

    newCards.forEach(item => item.hoverStyle = undefined);

    newCards[index].hoverStyle = style;

    this.setState({
      cards: newCards
    })
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
    const hoverBoundingRect = findDOMNode(component).parentElement.getBoundingClientRect();
    const rectHeight = hoverBoundingRect.bottom - hoverBoundingRect.top;

    // 2. get hoverClientHeight
    const clientOffset = monitor.getClientOffset();
    const hoverClientHeight = clientOffset.y - hoverBoundingRect.top;

    // 3. get hoverRectRank and nextRectRank
    const { cards } = this.state;
    const hoverRectRank = cards[hoverIndex] && cards[hoverIndex].rank;
    const nextRectRank = cards[hoverIndex + 1] && cards[hoverIndex + 1].rank;

    // 4. judge newRank:三种情况分别讨论。整个判断逻辑请看 doc.md
    if (hoverClientHeight >= 0 && hoverClientHeight < rectHeight/4) {
      moveInfo.newRank = hoverRectRank;
      moveInfo.isFirstBlock = true;
    }
    else if (hoverClientHeight => rectHeight/4 && hoverClientHeight < rectHeight * 3/4) {
      moveInfo.newRank = 2;
    }
    else if (hoverClientHeight => rectHeight*3/4 && hoverClientHeight <= rectHeight) {
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

    newCards.forEach(item => item.hoverStyle = undefined);

    this.setState({
      cards: newCards
    });

    // put data to server
    const tableOfContents = newCards.map(item => ({
      rank: item.rank,
      docId: item.id
    }))

    request({
      url: `${API}/api/repo/${this.props.repoId}`,
      method: 'put',
      body: {
        tableOfContents
      }
    })
  }

  resetHoverStyle() {
    const newCards = this.state.cards.slice();

    newCards.forEach(item => item.hoverStyle = undefined);

    this.setState({
      cards: newCards
    });
  }

  computeRankOneIndex(cards, rank, index) {
    if(index === 0) {
      return 0;
    }

    if(rank === 1 && index > 0) {
      let cardsSliced = cards.slice(0, index);
      let rankTwoArr = cardsSliced.filter((item) => {
        return item.rank === 2;
      })

      return rankTwoArr.length;
    }
  }

  computeRankTwoIndex(cards, index) {
    if(index < 1) {
      return `${1.1}`;
    }

    let cardsSliced = cards.slice(0, index);
    let rankOneArr = cardsSliced.filter((item) => {
      return item.rank === 1;
    });

    let subOneIndex = rankOneArr.length;
    let arrayIndex;
    cards.forEach((item, index) => {
      if(item.title === rankOneArr[rankOneArr.length - 1].title) {
        arrayIndex = index;
      }
    })

    let rankTwoArr = cardsSliced.slice(arrayIndex, index).filter((item) => {
      return item.rank === 2;
    })

    let subIndex = `${subOneIndex}.${rankTwoArr.length + 1}`;
    return subIndex;
  }

  render() {
    return (
      <div className={styles.container}>
        {
          this.state.cards.length > 0 ? (
            <div className="">
              <p className="notice">
                <span className="star">*</span>拖动可进行目录设置
              </p>

              {this.renderContentList()}
            </div>
          ) : (<p className="notice-mssage">暂无文档，赶快去创建吧~~</p>)
        }

      </div>
    );
  }

  renderContentList() {
    if (!this.state.cards) {
      return;
    }

    return this.state.cards.map((item, i) => {
      let rankOneIndex = i + 1 - this.computeRankOneIndex(this.state.cards, item.rank, i);
      let rankTwoIndex = this.computeRankTwoIndex(this.state.cards, i);

      return (
        <div className={`rank${item.rank}${this.getHoverClass(item)}`} key={i}>
          <Link to={`/doc/view?repoId=${this.props.repoId}&docId=${item.id}&flag=publish`}>
            <Card
              key={item.id}
              index={i}
              id={item.id}
              text={item.title}
              cards={this.state.cards}
              moveCard={this.moveCard.bind(this)}
              getMoveInfo={this.getMoveInfo.bind(this)}
              getHoverInfo={this.getHoverInfo.bind(this)}
              hoverStyles={styles}
              changeHoverStyle={this.changeHoverStyle.bind(this)}
              resetHoverStyle={this.resetHoverStyle.bind(this)}
              isHasChild={this.isHasChild.bind(this)} />

            <div className="index-wrapper">
              <span className="catalog-index">{item.rank === 1 ? `${rankOneIndex}` : `${rankTwoIndex}`}</span>
            </div>
          </Link>
        </div>
      );
    });
  }

  getHoverClass(item) {
    return item.hoverStyle ? ` ${item.hoverStyle}` : '';
  }
}


export default EditContentTable;
