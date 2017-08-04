import { camelizeKeys } from 'humps';
import 'isomorphic-fetch';
import merge from 'lodash/merge';
import api_constants from '../constants/constants'

const API_ROOT = api_constants.API_ROOT;

function callApiFunc(endpoint, method, body) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;
  var headers = {
    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
    'Content-Type': 'application/json; charset=iso-8859-1'
  }

  var payload;
  if (body === null || body === undefined){
    payload = {
      method: method,
      mode: 'cors',
      headers: headers,
    }
  } else{
    payload = {
      method: method,
      mode: 'cors',
      headers: headers,
      body: body
    }
  }

  return fetch(fullUrl, payload
  ).then(response =>
    response.json().then(json => ({ json, response }))
  ).then(({ json, response }) => {
    if (response.status >= 400) {
      json['status'] = response.status;
    }

    json['status'] = response.status;
    const camelizedJson = camelizeKeys(json);
    return camelizedJson;
  });
}

export const CALL_API = Symbol('Call API');

export default store => next => action => {

  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') { // si no es un CALL_API sigue
    return next(action);
  }
  let { endpoint } = callAPI;
  const { method, body, token } = callAPI;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  function actionWith(data) {
    const finalAction = merge({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  next({ type: 'FETCH_REQUEST', endpoint: endpoint });

  return callApiFunc(endpoint, method, body, token).then(
    response => {
      next(actionWith({response, type: "SUCCESS_RESPONSE" }));
      next({ type: 'FETCH_RESPONSE', endpoint: endpoint });
    },
    error => {
      next(actionWith({ type: 'FETCH_FAILURE', endpoint: endpoint, error: error.msg.message || 'Error al llamar al API' }));
    }
  );
}

