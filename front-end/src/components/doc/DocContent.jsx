import React, {Component} from 'react';
import styles from './DocContent.less';
import '../../lib/github-markdown.css';
import '../../lib/hybrid.css';
import {getDocInfo} from '../../services/fetchData';
import marked from 'marked';

class DocContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docContent: {}
    };

    this.docId = this.props.location.query.docid;
    this.flag = this.props.location.query.flag;
  }

  componentDidMount() {
    getDocInfo(this.docId).then(data => {
      console.log(data);
      // this.setState({docContent: data.info});
      marked.setOptions({
        highlight: function (code) {
          return require('highlight.js').highlightAuto(code).value;
        }
      });

      if (this.flag === 'publish') {
        data.info.publishContent = marked(data.info.publishContent);
      } else if (this.flag === 'draft') {
        data.info.draftContent = marked(data.info.draftContent);
        console.log(typeof(marked(data.info.draftContent)));
      }
      this.setState({docContent: data.info});
    });
  }

  render() {
    let {docContent} = this.state;

    let content;
    if (this.flag === 'publish') {
      content = docContent.publishContent;
    } else if (this.flag === 'draft') {
      content = docContent.draftContent;
    }

    return (
      <div className={styles.container}>
        <div className="catalog"></div>
        <div className="doc">
          <p className="title">{docContent.title}</p>

          <div className="content markdown-body" dangerouslySetInnerHTML={{__html: content}}>
          </div>
        </div>
      </div>
    );
  }
}

export default DocContent;
