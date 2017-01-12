import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

const CARD_TYPE = 'CARD';


const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    monitor.getItem().index = hoverIndex;
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
      <div style={{ opacity }}>
        {text}
      </div>
    ));
  }
}

export default Card;
