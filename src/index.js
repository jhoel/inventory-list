import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';
import './index.css';
import './menu.css'
import './outputs.css'
import './popup.css'

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
  <div>
    <Root store={store} history={history}>
    </Root>
  </div>,
  document.getElementById('root')
)
