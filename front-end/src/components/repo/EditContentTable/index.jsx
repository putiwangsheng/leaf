import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


@DragDropContext(HTML5Backend)
class EditContentTable extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}

export default EditContentTable
