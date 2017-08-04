import React, { Component } from 'react';
import LayoutContainer from './Layout';
import './App.css';

import { Router, Route, Link, IndexRoute, hashHistory, BrowserHistory } from 'react-router'


class App extends Component {
  render() {
    return (
      <div></div>
    );
  }
}

export default App;

const Home = () => <h1>Hello from Home!</h1>
