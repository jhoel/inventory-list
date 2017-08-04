import { CALL_API } from '../middleware/api';


function fetchProducts() {
  return {
    [CALL_API]: {
      endpoint: '/api/products',
      method: 'GET'
    }
  };
}

export function getProducts() {
  return (dispatch) => {
    return dispatch(fetchProducts());
  };
};

function fetchProductsByContainer(container) {
  return {
    [CALL_API]: {
      endpoint: '/api/productsByContainer',
      method: 'POST',
      body: JSON.stringify({
        container: container,
      })
    }
  };
}

export function getProductsByContainer(container) {
  return (dispatch) => {
    return dispatch(fetchProductsByContainer(container));
  };
};

function postConfirmOutput(data, ioType, date) {
  return {
    [CALL_API]: {
      endpoint: '/api/inventoryIO',
      method: 'POST',
      body: JSON.stringify({
        "data": data,
        ioType: ioType,
        date: date
      })
    }
  }
}

export function confirmOutput(data, date) {
  return (dispatch) => {
    return dispatch(postConfirmOutput(data, "salida", date));
  }
}

function postUpdateProduct(data) {
  return {
    [CALL_API]: {
      endpoint: '/api/updateProduct',
      method: 'POST',
      body: JSON.stringify({
        data: data,
      })
    }
  }
}

export function confirmEditProduct(data) {
  return (dispatch) => {
    return dispatch(postUpdateProduct(data));
  }
}




function fetchInventoryIO() {
  return {
    [CALL_API]: {
      endpoint: '/api/inventoryIO',
      method: 'GET'
    }
  };
}

export function getInventoryIO() {
  return (dispatch) => {
    return dispatch(fetchInventoryIO());
  };
};


function postIOById(id) {
  return {
    [CALL_API]: {
      endpoint: '/api/ioById',
      method: 'POST',
      body: JSON.stringify({
        id: id,
      })
    }
  }
}

export function showInfoIO(id) {
  return (dispatch) => {
    return dispatch(postIOById(id));
  }
}
