import React, { Component, PropTypes } from 'react';
import { Router, Route} from 'react-router';
import MainLayout from '../layouts/MainLayout';
import NotFound from '../components/NotFound';
import EditDoc from '../components/EditDoc';
import Personal from '../components/Personal';

class Routes extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <Router history={this.props.history}>
        <Route path="/" component={MainLayout}>
          <Route path="/editdoc" component={EditDoc} />
          <Route path="/personal" component={Personal} />

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
