import merge from 'lodash/merge';

function fetchingReducer(state = { isFetching: false, error: null }, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return merge({}, state, {
        isFetching: true,
        lastEndpoint: action.endpoint
      });
    case 'FETCH_RESPONSE':
      return merge({}, state, {
        isFetching: false,
        lastEndpoint: action.endpoint
      });
    case 'FETCH_FAILURE':
      return merge({}, state, {
        isFetching: false,
        lastEndpoint: action.endpoint,
        error: action.error
      });
    default:
      return state;
  }
}

export default fetchingReducer;


