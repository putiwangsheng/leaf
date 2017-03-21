import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import MainLayout from '../layouts/MainLayout';

import NotFound from '../common/NotFound';
import EditDoc from '../components/doc/EditDoc';
import DocContent from '../components/doc/DocContent';

import Catagory from '../components/homePage/index';

import CreateTeam from '../components/team/CreateTeam';
import TeamInfo from '../components/team/TeamInfo';

import CreateRepo from '../components/repo/CreateRepo';
import Repo from '../components/repo/Repo';

import Personal from '../components/person/Personal';
import EditPersonInfo from '../components/person/EditPersonInfo';


class Routes extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <Router history={this.props.history}>
        <Route path="/" component={MainLayout}>
          <IndexRoute component={Catagory} />

          {/* doc: */}
          <Route path="/doc/edit" component={EditDoc} />
          <Route path="/doc/view" component={DocContent} />

          {/* team: */}
          <Route path="/team/create" component={CreateTeam} />
          <Route path="/team" component={TeamInfo} />

          {/* person: */}
          <Route path="/person" component={Personal} />
          <Route path="/person/edit" component={EditPersonInfo} />

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
