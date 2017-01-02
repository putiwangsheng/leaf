import React, { Component } from 'react'

class Demo extends Component {
  constructor() {
    super()
  }

  render() {

    return (
      <div>
        {this.props.location}
      </div>
    )
  }
}

export default Demo
