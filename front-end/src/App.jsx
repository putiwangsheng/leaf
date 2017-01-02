import React, { Component, PropTypes } from 'react';
import Demo from './components/Demo';
import MainLayout from './layouts/MainLayout';

const App = ({ location }) => {
  return (
    <MainLayout>
      <Demo location={location} />
    </MainLayout>
  );
};

App.propTypes = {
};

export default App;
