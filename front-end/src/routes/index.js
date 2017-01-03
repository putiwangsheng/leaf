import React, { Component, PropTypes } from 'react';
import { Router, Route} from 'react-router';
import MainLayout from '../layouts/MainLayout';
import EditDoc from '../components/EditDoc';
import NotFound from '../components/NotFound';

class Routes extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <Router history={this.props.history}>
        <Route path="/" component={MainLayout}>
          <Route path="/editdoc" component={EditDoc} />
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
