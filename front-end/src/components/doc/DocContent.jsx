import React, {Component} from 'react';
import styles from './DocContent.less';
import '../../lib/github-markdown.css';
import '../../lib/hybrid.css';

import marked from 'marked';

import { request, API } from '../../services/request';

class DocContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docContent: {},
      tableContent: []
    };

    this.docId = this.props.location.query.docId;
    this.repoId = this.props.location.query.repoId;
    this.flag = this.props.location.query.flag;
  }

  componentDidMount() {
    Promise.all([this.getDocInfo(), this.getRepoTableContent()])
      .then(data => {
        console.log(data);

        const docInfo = data[0];
        const tableContent = data[1];

        marked.setOptions({
          highlight: function (code) {
            return require('highlight.js').highlightAuto(code).value;
          }
        });

        if (this.flag === 'publish') {
          docInfo.info.publishContent = marked(docInfo.info.publishContent);
        } else if (this.flag === 'draft') {
          docInfo.info.draftContent = marked(docInfo.info.draftContent);
        }

        this.setState({docContent: docInfo.info, tableContent});
      }, (err) => {
        console.log(err);
      })
  }

  // 获取仓库目录
  getRepoTableContent() {
    return request({
      url: `${API}/api/repo/${this.repoId}`
    })
  }

  // 获取文档信息
  getDocInfo() {
    return request({
      url: `${API}/api/doc/${this.docId}`
    })
  }

  render() {
    let { docContent, tableContent } = this.state;

    let content;
    if (this.flag === 'publish') {
      content = docContent.publishContent;
    } else if (this.flag === 'draft') {
      content = docContent.draftContent;
    }

    return (
      <div className={styles.container}>
        <div className="catalog">

        </div>

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
