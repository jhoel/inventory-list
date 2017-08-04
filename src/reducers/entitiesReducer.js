import merge from 'lodash/merge';

function entitiesReducer(state = { data: {}, msg: {} }, action) {
  if (action.response) {
    merge(action.response, { msg: {messageActive: true} } );
    if (action.response.unitWorks && state.unitWorks) {
      state.unitWorks = null;
    }
    if (action.response.models && state.models) {
      state.models = null;
    }
    if (action.response.workers && state.workers) {
      state.workers = null;
    }
    if (action.response.update){
      window.location.reload();
    }
    state.message = null;
    //debugger;
    state.products = [];
    state.listProductsIO = [];
    return merge({}, state, action.response);
  }
  else {
    return state
  }
}


export default entitiesReducer;
