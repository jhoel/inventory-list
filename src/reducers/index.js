import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import entitiesReducer from './entitiesReducer';
import fetchingReducer from './fetchingReducer.js';

const rootReducer = combineReducers({
  routing,
  entitiesReducer,
  fetchingReducer,
});

export default rootReducer;

