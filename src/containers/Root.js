import React from 'react'
import {Provider} from 'react-redux';
import {Router} from 'react-router'
import {Route, IndexRoute} from 'react-router';
import Layout from '../Layout';
import PropTypes from 'prop-types';
import Outputs from './Outputs'
import Empty from './Empty'

const Root = ({store, history}) => (
  <Provider store={store}>
    <Router history={history}>
      <Route component={Empty} path="/">
        <IndexRoute component={Layout}></IndexRoute>
        <Route component={Outputs} path="salidas"/>
      </Route>
    </Router>
  </Provider>
)

Root.propTypes = {
  history: PropTypes.object.isRequired
}

export default Root;
