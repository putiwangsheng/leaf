import React, { Component, PropTypes } from 'react';
import { Router, Route } from 'react-router';

import MainLayout from '../layouts/MainLayout';

import NotFound from '../common/NotFound';
import EditDoc from '../components/doc/EditDoc';

import CreateTeam from '../components/team/CreateTeam';

import CreateRepo from '../components/repo/CreateRepo';
import Repo from '../components/repo/Repo';


import Personal from '../components/person/Personal';


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

          {/* team: */}
          <Route path="/team/create" component={CreateTeam} />

          {/* person: */}
          <Route path="/person" component={Personal} />

          {/* repo: */}
          <Route path="/repo/create" component={CreateRepo} />
          <Route path="/repo" component={Repo} />

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
