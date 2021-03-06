import React, {Component} from 'react';
import { Link, browserHistory } from 'react-router';
import moment from 'moment';

import styles from './DocContent.less';
import '../../lib/github-markdown.css';
import '../../lib/hybrid.css';
import marked from 'marked';

import Bread from '../../common/Bread.jsx';

import { request, API } from '../../services/request';

const currentUserId = sessionStorage.getItem('userId');

class DocContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docContent: {},
      tableContent: [],
      repoName: '',
      currentDoc: ''
    };

    this.docId = this.props.location.query.docId;
    this.repoId = this.props.location.query.repoId;
    this.flag = this.props.location.query.flag;
    this.fromlabel = this.props.location.query.fromlabel || '';

    this.pageView = 0;
    this.todayPageView = 0;
  }

  componentDidMount() {
    Promise.all([this.getDocInfo(this.docId), this.getRepoInfo(), this.getAllDocs()])
      .then(data => {
        const docInfo = data[0];
        const tableContent = data[1].tableOfContents;
        const repoName = data[1].repoName;
        const docs = data[2];

        // 总浏览量
        this.pageView = docInfo.pageView;

        let datePageView = docInfo.datePageView.filter(item => {
          return item.date === moment(new Date()).format('YYYY-MM-DD');
        })

        // 当天的浏览量
        this.todayPageView = datePageView[0] ? datePageView[0].pageView : 0;

        marked.setOptions({
          highlight: function (code) {
            return require('highlight.js').highlightAuto(code).value;
          }
        });

        let info = JSON.parse(JSON.stringify(docInfo.info));
        if (this.flag === 'publish') {
          info.publishContent = marked(docInfo.info.publishContent);
        } else if (this.flag === 'draft') {
          info.draftContent = marked(docInfo.info.draftContent);
        }

        // 为目录数据增加题目(by docId)
        tableContent.forEach(item => {
          docs.forEach(subItem => {
            if(item.docId === subItem._id) {
              item.title = subItem.info.title;
            }
          })
        })

        this.updatePageView(docInfo);

        this.setState({docContent: info, tableContent, repoName, currentDoc: docInfo.info.title});
      }, (err) => {
        console.log(err);
      })
  }

  // 更新浏览量
  updatePageView(docInfo) {
    docInfo.pageView = this.pageView + 1;

    docInfo.datePageView.forEach(item => {
      if(item.date === moment(new Date()).format('YYYY-MM-DD')) {
        item.pageView = this.todayPageView + 1;
      }
    })

    let datePageView = docInfo.datePageView.filter(item => {
      return item.date === moment(new Date()).format('YYYY-MM-DD');
    })

    if(!datePageView[0]) {
      docInfo.datePageView.push({
        date: moment(new Date()).format('YYYY-MM-DD'),
        pageView: this.todayPageView + 1
      })
    }

    request({
      url: `${API}/api/doc/${this.docId}`,
      method: 'put',
      body: docInfo
    }).then(data => {
      console.log(data);
    });
  }

  // 获取仓库目录
  getRepoInfo() {
    return request({
      url: `${API}/api/repo/${this.repoId}`
    })
  }

  // 获取单个文档信息
  getDocInfo(docId) {
    return request({
      url: `${API}/api/doc/${docId}`
    })
  }

  // 获取所有文档
   getAllDocs() {
    return request({
      url: `${API}/api/doc`
    })
  }

  // 切换文档
  changeDoc(docId) {
    browserHistory.push(`/doc/view?repoId=${this.repoId}&docId=${docId}&flag=${this.flag}`);
    this.docId = docId;

    this.getDocInfo(docId)
      .then(docInfo => {
        this.pageView = docInfo.pageView;

        docInfo.datePageView.forEach(item => {
          if(item.date === moment(new Date()).format('YYYY-MM-DD')) {
            item.pageView = this.todayPageView + 1;
          }
        })

        let info = JSON.parse(JSON.stringify(docInfo.info));
        if (this.flag === 'publish') {
          info.publishContent = marked(docInfo.info.publishContent);
        } else if (this.flag === 'draft') {
          info.draftContent = marked(docInfo.info.draftContent);
        }

        this.updatePageView(docInfo);

        this.setState({docContent: info, currentDoc: docInfo.info.title});
    })
  }

  render() {
    let { docContent, tableContent, repoName, currentDoc } = this.state;

    let content;
    if (this.flag === 'publish') {
      content = docContent.publishContent;
    } else if (this.flag === 'draft') {
      content = docContent.draftContent;
    }

    const dataSource = [
      {
        name: "仓库"
      },
      {
        name: repoName,
        path: `/repo?repoId=${this.repoId}&userId=${currentUserId}&fromlabel=${this.fromlabel}`
      }, {
        name: currentDoc
      }
    ]

    return (
      <div className={styles.container}>
        <Bread dataSource={dataSource} />

        <div className="catalog">
          {
            tableContent.map((item, index) => {
              return (
                <p key={index} className={`catalog-title ${item.rank === 2 ? 'rank2Style' : 'rank1Style'} ${item.docId === this.docId ? 'current' : ''}`} onClick={this.changeDoc.bind(this, item.docId)}>{item.title}</p>
              )
            })
          }
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
