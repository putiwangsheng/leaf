import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import NotFound from '../common/NotFound';

import MainLayout from '../layouts/MainLayout';

import EditDoc from '../components/doc/EditDoc';
import DocContent from '../components/doc/DocContent';

import Catagory from '../components/homePage/index';

import CreateTeam from '../components/team/CreateTeam';
import TeamInfo from '../components/team/TeamInfo';
import MemberList from '../components/team/MemberList';

import CreateRepo from '../components/repo/CreateRepo';
import Repo from '../components/repo/Repo';

import Personal from '../components/person/Personal';
import EditPersonInfo from '../components/person/EditPersonInfo';

import TypeRepo from '../components/type/TypeRepo';

import PageView from '../components/analyze/PageView';

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
          <Route path="/team/member" component={MemberList} />

          {/* person: */}
          <Route path="/person" component={Personal} />
          <Route path="/person/edit" component={EditPersonInfo} />

          {/* repo: */}
          <Route path="/repo/create" component={CreateRepo} />
          <Route path="/repo" component={Repo} />

          {/* type: */}
          <Route path="/type/repos" component={TypeRepo} />

          {/* view: */}
          <Route path="/analyze/view" component={PageView} />

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
