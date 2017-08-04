import React, { Component } from 'react';
import ListSelect from '../components/ListSelect';
import * as actions from './../actions/actions';
import merge from 'lodash/merge';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SimpleProductList from '../components/SimpleProductList'

class DataList {
  constructor(data=[]) {
    this._data = data;
  }

  getObjectAt(index) {
    return this._data[index];
  }

  push(data){
    this._data.push(data);
  }

  getSize() {
    return this._data.length;
  }

  removeFrom(index){
    this._data.splice(index, 1);
  }
}

class Outputs extends Component {
  constructor(props) {
    super(props);
    this.checkModel = this.checkModel.bind(this);
  }

  componentWillMount() {
    this.props.actions.getInventoryIO();
  }

  checkModel(item) {
    this.props.actions.showInfoIO(item);
  }

  render() {
    return (
      <div className="cont">
        <div className="float-left outputs-pane">
          <ListSelect
            description="Salidas"
            items={this.props.ioList || []}
            onClickItem={this.checkModel}
          />
        </div>
        <div className="table-products">
          <SimpleProductList data={new DataList(this.props.listProductsIO)} edit={false}/>
        </div>
      </div>
    );
  }
  
}

const mapStateToProps = state => {
  return {
    ioList: state.entitiesReducer.io,
    listProductsIO: state.entitiesReducer.listProductsIO,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(merge({}, actions), dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Outputs);
