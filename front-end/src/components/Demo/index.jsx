import React, { Component } from 'react'
import styles from './index.less';

class Demo extends Component {
  constructor() {
    super()
  }

  render() {

    return (
      <div>
        {JSON.stringify(this.props.location)}
      </div>
    )
  }
}

export default Demo
