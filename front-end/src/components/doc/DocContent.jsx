import React, {Component} from 'react';
import styles from './DocContent.less';
import { getDocInfo } from '../../services/fetchData';

class DocContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docContent: {}
    };

    this.docId = this.props.location.query.docid;
    this.flag = this.props.location.query.flag;
  }

  componentDidMount(){
    getDocInfo(this.docId).then(data => {
      console.log(data);
      this.setState({docContent: data.info});
    });
  }

  render() {
    let { docContent } = this.state;

    let content;
    if(this.flag === 'publish'){
      content = docContent.publishContent;
    }else if(this.flag === 'draft'){
      content = docContent.draftContent;
    }

    return (
      <div className={styles.container}>
        <div className="catalog">

        </div>
        <div className="doc">
          <h1>{docContent.title}</h1>
          <div className="content">
            {content}
          </div>
        </div>
      </div>
    );
  }
}

export default DocContent;
