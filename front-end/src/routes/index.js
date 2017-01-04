import React, { Component, PropTypes } from 'react';
import { Router, Route } from 'react-router';

import MainLayout from '../layouts/MainLayout';

import NotFound from '../common/NotFound';
import EditDoc from '../components/doc/EditDoc';
import Personal from '../components/person/Personal';
import EditContentTable from '../components/repo/EditContentTable'


class Routes extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <Router history={this.props.history}>
        <Route path="/" component={MainLayout}>

          {/* doc: */}
          <Route path="/doc/edit" component={EditDoc} />

          {/* person: */}
          <Route path="/personal" component={Personal} />

          {/* repo: */}
          <Route path="/repo/editContentTable" component={EditContentTable} />

        </Route>
        <Route path="*" component={NotFound}/>
      </Router>
    );
  }
}

Routes.propTypes = {
  history: PropTypes.any,
};

export default Routes;
