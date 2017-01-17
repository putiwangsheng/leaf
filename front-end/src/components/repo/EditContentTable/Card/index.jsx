import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import styles from './index.less';

const CARD_TYPE = 'CARD';


const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  },

  endDrag: function (props, monitor, component) {
    props.resetHoverStyle()

    const result = monitor.getDropResult()
    if (!monitor.didDrop() || !result || result.dropIndex === undefined) {
      return;
    }

    const { dragIndex, dropIndex, newRank, isFirstBlock } = monitor.getDropResult();

    props.moveCard(dragIndex, dropIndex, newRank, isFirstBlock);
  }
};


function getHoverStyle(styleInfo, styles) {
  if (styleInfo.style === 'line') {
    if (styleInfo.isFirstBlock) {
      return styles.lineUp;
    } else {
      return styles.lineDown
    }
  }

  if (styleInfo.style === 'border') {
    return styles.border;
  }
}

const cardTarget = {

  // 需要显示 hover 处 drop 的效果，根据 isSameRank 来
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    const { isHasChild } = props;

    const hoverInfo = props.getHoverInfo(monitor, component, hoverIndex);

    if (isDisableDrop(dragIndex, hoverIndex, props.cards, isHasChild, hoverInfo.isFirstBlock)) {
      props.resetHoverStyle();
      return;
    }

    const styleInfo = {
      isFirstBlock: hoverInfo.isFirstBlock
    };

    // 如果 isSameRank 或 有 dragCard 有子 card，style 应该为 line
    if(hoverInfo.isSameRank || props.isHasChild(dragIndex)) {
      styleInfo.style = 'line';
    } else {
      styleInfo.style = 'border';
    }

    const hoverStyle = getHoverStyle(styleInfo, props.hoverStyles)

    props.changeHoverStyle(hoverStyle, hoverIndex);
  },

  // drop 时 move card， 需要改变 容器的 state，根据 newRank 来
  drop(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const dropIndex = props.index;
    const { isHasChild } = props;

    // 1. get newRank
    let { newRank, isFirstBlock } = props.getMoveInfo(monitor, component, dropIndex);
    if (isHasChild(dragIndex)) {
      newRank = 1;
    }

    if (isDisableDrop(dragIndex, dropIndex, props.cards, isHasChild, isFirstBlock)) {
      return;
    }

    return {
      newRank,
      isFirstBlock,
      dragIndex,
      dropIndex
    };
  }
};


function isDisableDrop(dragIndex, dropIndex, cards, isHasChild, isFirstBlock) {
  if (dragIndex === dropIndex) {
    return true;
  }


  // 当有子 card 的 card 在 drop 时，有一些禁止的边界情况
  if (isHasChild(dragIndex)) {
    // dropCard rank 为 2
    if (cards[dropIndex].rank === 2) {
      return true;
    }

    // dropCard 有子 card，并且 isFirstBlock = false
    if (isHasChild(dropIndex) && isFirstBlock === false) {
      return true;
    }

    // dropCard 就是 dragCard 的子 card
    if (isChild(dropIndex, dragIndex, cards)) {
      return true;
    }
  }

  return false;
}

function isChild(childCardIndex, cardIndex, cards) {
  if (childCardIndex < cardIndex) {
    const childCards = cards.slice(cardIndex + 1, childCardIndex + 1);
    return childCards.every(item => item.rank === 1);
  }
  return false;
}

@DropTarget(CARD_TYPE, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(CARD_TYPE, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Card extends Component {
  constructor() {
    super();
  }

  render() {
    const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
    const drapingSytle = {
      opacity: isDragging ? 0.1 : 1
    }

    return connectDragSource(connectDropTarget(
      <div className={styles.card} style={drapingSytle}>
        {text}
      </div>
    ));
  }
}

export default Card;
