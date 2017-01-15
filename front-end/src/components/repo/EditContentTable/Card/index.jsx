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
    const result = monitor.getDropResult()
    if (!monitor.didDrop() || !result || result.dropIndex === undefined) {
      return;
    }

    const { dragIndex, dropIndex, newRank, isFirstBlock } = monitor.getDropResult();

    props.moveCard(dragIndex, dropIndex, newRank, isFirstBlock);
  }
};

let oldStyleInfo = {
  style: '',
  isFirstBlock: undefined
}

// 当位置和 style 未改变的时候，不用更新 style
function needChangeStyle(oldInfo, newInfo) {
  return oldInfo.style !== newInfo.style || oldInfo.isFirstBlock !== newInfo.isFirstBlock;
}

const cardTarget = {

  // 需要显示 hover 处 drop 的效果，根据 isSameRank 来
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return
    }

    const hoverInfo = props.getHoverInfo(monitor, component, hoverIndex);
    const styleInfo = {
      isFirstBlock: hoverInfo.isFirstBlock
    };

    // 如果 isSameRank 或 有 dragCard 有子 card，style 应该为 line
    if(hoverInfo.isSameRank || props.isHasChild(dragIndex)) {
      styleInfo.style = 'line';
    } else {
      styleInfo.style = 'border';
    }

    // 如果不需要更新样式，则结束
    if (!needChangeStyle(oldStyleInfo, styleInfo)) {
      return;
    }

    // 在需要更新样式的前体下，更新样式
    if (styleInfo.style === 'line') {
      console.log('line');
    } else {
      console.log('border')
    }

    oldStyleInfo = styleInfo;
  },

  // drop 时 move card， 需要改变 容器的 state，根据 newRank 来
  drop(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const dropIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === dropIndex) {
      return;
    }

    // 1. get newRank
    let { newRank, isFirstBlock } = props.getMoveInfo(monitor, component, dropIndex);
    if (props.isHasChild(dragIndex)) {
      newRank = 1;
    }

    return {
      newRank,
      isFirstBlock,
      dragIndex,
      dropIndex
    }
  }
};


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
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(
      <div className={styles.card} style={{ opacity }}>
        {text}
      </div>
    ));
  }
}

export default Card;
