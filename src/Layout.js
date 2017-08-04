import React, { Component } from 'react';
import './App.css';
import {Table, Column, Cell} from 'fixed-data-table';
import * as actions from './actions/actions';
import merge from 'lodash/merge';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SimpleProductList from './components/SimpleProductList';
import SideBar from './components/SideBar';
import moment from 'moment';
import Dimensions from 'react-dimensions';
import Popup from 'react-popup'

var { Button, Modal, Glyphicon } = require('react-bootstrap');


const rows = []

class SortHeaderCell extends React.Component {
  constructor(props) {
    super(props);
    this._onSortChange = this._onSortChange.bind(this);
  }

  render() {
    var {sortDir, children, ...props} = this.props;
    return (
      <Cell {...props}>
        <a onClick={this._onSortChange}>
          {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
        </a>
      </Cell>
    );
  }

  _onSortChange(e) {
    e.preventDefault();
    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ?
        reverseSortDirection(this.props.sortDir) :
        SortTypes.DESC
      );
    }
  }
}

const TextCell = ({rowIndex, data, columnKey, ...props}) => {
  return (
    <Cell {...props}>
      {data.getObjectAt(rowIndex)[columnKey]}
    </Cell>
  )
};

class DataListWrapper {
  constructor(indexMap, data) {
    this._indexMap = indexMap;
    this._data = data;
  }

  getSize() {
    return this._indexMap.length;
  }

  getObjectAt(index) {
    return this._data[ this._indexMap[index]];
  }
}

class InitialDataList {
  getObjectAt(index) {
    return rows[index];
  }

  getSize() {
    return rows.length;
  }
}

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

var SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

class Layout extends Component {
  constructor(props) {
    super(props);

    this._defaultSortIndexes = [];
    this.state = {
      sortedDataList: new InitialDataList(),
      colSortDirs: {},
      showModal: false,
      modifiedProducts: new DataList(),
      discountQty: 0,
      nOutputs: 0,
      showModalEdit: false,
      showModalImage: false,
      currentProduct: null,
      image: null,
    };

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onFilterChangeName = this._onFilterChangeName.bind(this);
    this.printPicture = this.printPicture.bind(this);
    this.printPictureClick = this.printPictureClick.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    this.handleNewQty = this.handleNewQty.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.addModified = this.addModified.bind(this);
    this.clearModified = this.clearModified.bind(this);
    this.confirmedClearModified = this.confirmedClearModified.bind(this);
    this.confirmOutput = this.confirmOutput.bind(this);
    this.editOpen = this.editOpen.bind(this);
    this.editClose = this.editClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.editConfirm = this.editConfirm.bind(this);
    this.openModalImage = this.openModalImage.bind(this);
    this.closeModalImage = this.closeModalImage.bind(this);
    this.getProductsByContainer = this.getProductsByContainer.bind(this);
    this.removeFromModified = this.removeFromModified.bind(this);
  }

  editConfirm() {
    this.props.actions.confirmEditProduct(this.state.currentProduct);
    //window.location.reload();
  }

  handleChange(field, e) {
    let newCurrentProduct = Object.assign({}, this.state.currentProduct);
    newCurrentProduct[field] = e.target.value;
    this.setState({currentProduct: newCurrentProduct});
  }

  close() {
    this.setState({ showModal: false });
  }

  openModalImage() {
    this.setState({ showModalImage: true });
  }

  closeModalImage() {
    this.setState({ showModalImage: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  handleNewQty(e) {
    this.setState({newQty: this.state.currentQty - e.target.value, discountQty: e.target.value});
  }

  componentWillMount() {
    this.props.actions.getProducts();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.products && nextProps.products) {
      let size = nextProps.products.length;
      for (let index = 0; index < size; index++) {
        this._defaultSortIndexes.push(index);
      }
      this.setState({sortedDataList: new DataList(nextProps.products)});
    }
    if (this.props.products && this.props.products.length !== nextProps.products.length) {
      let size = nextProps.products.length;
      this._defaultSortIndexes = [];
      for (let index = 0; index < size; index++) {
        this._defaultSortIndexes.push(index);
      }
      this.setState({sortedDataList: new DataList(nextProps.products)});
    }
  }

  editOpen(rowIndex) {
    this.setState({ showModalEdit: true, currentProduct: this.state.sortedDataList.getObjectAt(rowIndex) });
  }

  editClose() {
    this.setState({ showModalEdit: false });
  }

  _onFilterChangeName(e) {
    if (!e.target.value) {
      this.setState({
        filteredDataList: this.sortedDataList,
      });
    }

    var filterBy = e.target.value.toLowerCase();
    var size = this.props.products.length;
    var filteredIndexes = [];
    for (var index = 0; index < size; index++) {
      var {nombre} = this.props.products[index];
      if (nombre.toLowerCase().indexOf(filterBy) !== -1) {
        filteredIndexes.push(index);
      }
    }
    this.setState({
      sortedDataList: new DataListWrapper(filteredIndexes, this.props.products),
    });
  }

  _onFilterChange(e) {
    if (!e.target.value) {
      this.setState({
        filteredDataList: this.sortedDataList,
      });
    }

    var filterBy = e.target.value.toLowerCase();
    var size = this.props.products.length;
    var filteredIndexes = [];
    for (var index = 0; index < size; index++) {
      var {codigo} = this.props.products[index];
      if (codigo.toLowerCase().indexOf(filterBy) !== -1) {
        filteredIndexes.push(index);
      }
    }
    this.setState({
      sortedDataList: new DataListWrapper(filteredIndexes, this.props.products),
    });
  }

  confirmedClearModified(){
    this.setState({
      discountQty: 0,
      nOutputs: 0,
      modifiedProducts: [],
    });
  }

  clearModified() {
    Popup.create({
      title: 'Vaciar la lista de salidas',
      content: 'Eliminar la lista de productos agregados a salidas.',
      buttons: {
        right: [
          {
            text: 'Vaciar',
            className: 'danger',
            action: function () {
              Popup.alert('Lista de salidas vacia');
              this.props.confirmedClearModified();
              Popup.close();
            }
          }
        ]
      }
    });
  }

  addModified(code, discountQty) {
    if (this.state.discountQty !== 0) {
      this.setState({
        discountQty: 0,
        nOutputs: this.state.nOutputs+1,
      });
      this.state.modifiedProducts.push({'code': this.state.currentCode, discountQty: this.state.discountQty, id: this.state.id});
    }
  }

  removeFromModified(index){
    let newArr = [];
    this.state.modifiedProducts.removeFrom(index);
    newArr = this.state.modifiedProducts._data;
    this.setState({
      modifiedProducts: new DataList(newArr),
      nOutputs : this.state.nOutputs - 1,
    });
  }

  printPicture(image, qty, code, id, rowIndex) {
    if(this.props.containerWidth > 1200) {
      this.setState({
        image: image,
        currentQty: qty,
        currentCode: code,
        id: id,
        newQty: qty,
        discountQty: 0,
        currentProduct: this.state.sortedDataList.getObjectAt(rowIndex),
      });
    }
  }

  printPictureClick(image, qty, code, id) {
    if(this.props.containerWidth <= 1200) {
      this.setState({
        image: image,
        currentQty: qty,
        currentCode: code,
        id: id,
        newQty: qty,
        discountQty: 0,
        showModalImage: true,
      });
    }
  }

  confirmOutput() {
    this.props.actions.confirmOutput(this.state.modifiedProducts._data, moment().subtract(5, 'hours'));
  }

  _onSortChange(columnKey, sortDir) {
    var sortIndexes = this._defaultSortIndexes.slice();
    sortIndexes.sort((indexA, indexB) => {
      var valueA = this.props.products[indexA][columnKey];
      var valueB = this.props.products[indexB][columnKey];
      var sortVal = 0;
      if (valueA > valueB) {
        sortVal = 1;
      }
      if (valueA < valueB) {
        sortVal = -1;
      }
      if (sortVal !== 0 && sortDir === SortTypes.ASC) {
        sortVal = sortVal * -1;
      }
      return sortVal;
    });

    this.setState({
      sortedDataList: new DataListWrapper(sortIndexes, this.props.products),
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  }

  getProductsByContainer(container) {
    this.props.actions.getProductsByContainer(container);
  }


  showSettings (event) {
    event.preventDefault();
  }

  render() {
    var {sortedDataList, colSortDirs} = this.state;

    const widthStyle = {
      width: this.props.containerWidth > 540 ? this.props.containerWidth : 540
    }
    return (
      <div>

        <Popup confirmedClearModified={this.confirmedClearModified} />

        <nav style={widthStyle} className="navbar navbar-toggleable-md navbar-inverse fixed-top bg-inverse">
          <a className="navbar-brand" href="#">Title</a>
        </nav>


        { this.props.containerWidth > 700 ?  <SideBar getProductsByContainer={this.getProductsByContainer} /> : null }
        <div className="float-left">
          <input
            className="form-control search-table float-left"
            onChange={this._onFilterChange}
            placeholder="Buscar por Código"
          />
          <input
            className="form-control search-table"
            onChange={this._onFilterChangeName}
            placeholder="Buscar por Nombre"
          />
          <div className="table-container">
            <Table
              rowHeight={50}
              rowsCount={sortedDataList.getSize()}
              headerHeight={50}
              width={540}
              height={500}
              {...this.props}>
              <Column
                cell={({rowIndex, ...props}) =>
                    <img onMouseOver={() => this.printPicture(sortedDataList.getObjectAt(rowIndex)["codigo"], sortedDataList.getObjectAt(rowIndex)["cantidad"], sortedDataList.getObjectAt(rowIndex)["codigo"], sortedDataList.getObjectAt(rowIndex)["id"], rowIndex)} className="exampleImage" onClick={() => this.printPictureClick(sortedDataList.getObjectAt(rowIndex)["codigo"], sortedDataList.getObjectAt(rowIndex)["cantidad"], sortedDataList.getObjectAt(rowIndex)["codigo"], sortedDataList.getObjectAt(rowIndex)["id"])} src={"./fotos/"+sortedDataList.getObjectAt(rowIndex)["codigo"]+".jpg"} />
                }
                fixed={true}
                width={50}
              />
              <Column
                columnKey="codigo"
                header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={colSortDirs.codigo}>Código</SortHeaderCell>}
                cell={<TextCell data={sortedDataList} />}
                fixed={true}
                width={100}
              />
              <Column
                columnKey="cantidad"
                header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={colSortDirs.CANTIDAD}>Cant.</SortHeaderCell>}
                cell={<TextCell data={sortedDataList} />}
                fixed={true}
                width={60}
              />
              <Column
                columnKey="nombre"
                header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={colSortDirs.NOMBRE}>Nombre</SortHeaderCell>}
                cell={<TextCell data={sortedDataList} />}
                fixed={true}
                width={100}
              />
              <Column
                columnKey="ubicacion"
                header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={colSortDirs.UBICACION}>Ubicación</SortHeaderCell>}
                cell={<TextCell data={sortedDataList} />}
                fixed={true}
                width={100}
              />
              <Column
                columnKey="seccion"
                header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={colSortDirs.SECCION}>Sección</SortHeaderCell>}
                cell={<TextCell data={sortedDataList} />}
                fixed={true}
                width={75}
              />
              <Column
                cell={({rowIndex, ...props}) => <Cell><Button bsSize="small" onClick={ (e) => this.editOpen(rowIndex)}><Glyphicon glyph="pencil" /></Button></Cell>}
                fixed={true}
                width={50}
              />
            </Table>
          </div>
        </div>

        {this.state.currentProduct ?
            <div className="infoSection float-left">
              <div>Cant. Ini.: <span>{this.state.currentProduct.initQty} </span></div><br/>
              <div>Unid. X Caj: <span>{this.state.currentProduct.unitXBox} </span></div><br/>
              <div>RMB: <span>{this.state.currentProduct.rmb} </span></div><br/>
              <div>Precio: <span>{this.state.currentProduct.priceUnit} </span></div><br/>
              <div>Prec. Doc.: <span>{this.state.currentProduct.priceDoc} </span></div><br/>
              <div>Prec. Caj.: <span>{this.state.currentProduct.priceBox} </span></div><br/>
              <div>Contenedor: <span>{this.state.currentProduct.contenedor} </span></div><br/>
            </div>
            :
          null
        }

        {this.props.containerWidth > 1200 ?
            <div className="imageSection">
              <h5>{ this.state.currentProduct ? this.state.currentProduct.codigo : null }</h5>
              { this.state.image ?
                  <img className="img-thumbnail giantImage" src={"./fotos/"+this.state.image+".jpg"} />
                  :
                  <img className="img-thumbnail giantImage" src={"./fotos/question.jpg"} />
              }
              <hr/>
              <div>
                <input value={this.state.discountQty} onChange={this.handleNewQty} type="number"/>
                <span> Quedan: {this.state.newQty}  </span>
                <button onClick={this.addModified} type="button" className="btn boton-descontar">Descontar</button>
              </div>
              <div>
                Productos agregados a <i>Salidas</i>: {this.state.nOutputs}
              </div>
              <Button
                bsStyle="danger"
                bsSize="large"
                onClick={this.clearModified}
              >
                Vaciar
              </Button>
              <Button
                bsStyle="primary"
                bsSize="large"
                onClick={this.open}
                className="float-right"
              >
                Confirmar
              </Button>
            </div>
            :
          null
        }


        <div className='static-modal'>
          <Modal title='Modal title'
            show={this.state.showModalImage}
            onHide={this.closeModalImage}
            enforceFocus={true}
            backdrop={true}
            animation={true}
            onRequestHide={function() {}}>

            <div className='modal-body'>
              <div className="imageSectionModal">
                { this.state.image ?
                    <img className="img-thumbnail giantImage" src={"./fotos/"+this.state.image+".jpg"} />
                    :
                    <img className="img-thumbnail giantImage" src={"./fotos/question.jpg"} />
                }
                <div>
                  <input value={this.state.discountQty} onChange={this.handleNewQty} type="number"/>
                  <span> Quedan: {this.state.newQty}  </span>
                  <button onClick={this.addModified} type="button" className="btn boton-descontar">Descontar</button>
                </div>
                <div>
                  Productos agregados a <i>Salidas</i>: {this.state.nOutputs}
                </div>
                <Button
                  bsStyle="primary"
                  bsSize="large"
                  onClick={this.open}
                >
                  Confirmar
                </Button>
              </div>
            </div>

            <div className='modal-footer'>
              <Button onClick={this.closeModalImage}>Cerrar</Button>
            </div>

          </Modal>
        </div>

        <div className='static-modal'>
          <Modal title='Modal title'
            show={this.state.showModal}
            onHide={this.close}
            enforceFocus={true}
            backdrop={true}
            animation={true}
            onRequestHide={function() {}}>

            <div className='modal-body'>
              <SimpleProductList
                data={this.state.modifiedProducts}
                removeFromModified={this.removeFromModified}
                edit={true}
              />
            </div>

            <div className='modal-footer'>
              <Button onClick={this.close}>Cerrar</Button>
              <Button onClick={this.confirmOutput} bsStyle='primary'>Guardar salida</Button>
            </div>

          </Modal>
        </div>
        <div className='static-modal'>
          <Modal title='Modal title'
            show={this.state.showModalEdit}
            onHide={this.editClose}
            enforceFocus={true}
            backdrop={true}
            animation={true}
            onRequestHide={function() {}}>

            <div className="modal-header">
              <Modal.Title>Edición</Modal.Title>
            </div>

            {this.state.currentProduct ?
                <form className="form-group row">
                  <div className="col-xs-2"></div>
                  <div className="col-xs-8">
                    <div>Cantidad: <input className={"form-control"} value={this.state.currentProduct.cantidad} onChange={ e => this.handleChange("cantidad", e)} /></div>
                    <div>Codigo: <input className={"form-control"} value={this.state.currentProduct.codigo} onChange={ e => this.handleChange("codigo", e)} /> </div>
                    <div>Nombre: <input className={"form-control"} value={this.state.currentProduct.nombre} onChange={ e => this.handleChange("nombre", e)} /> </div>
                    <div>Ubicación: <input className={"form-control"} value={this.state.currentProduct.ubicacion} onChange={e => this.handleChange("ubicacion", e)} /> </div>
                    <div>Sección: <input className={"form-control"} value={this.state.currentProduct.seccion} onChange={ e => this.handleChange("seccion", e)} /> </div>

                    <div>Cantidad Inicial: <input className={"form-control"} value={this.state.currentProduct.initQty} onChange={ e => this.handleChange("initQty", e)} /></div>
                    <div>Unid x Caja: <input className={"form-control"} value={this.state.currentProduct.unitXBox} onChange={ e => this.handleChange("unitXBox", e)} /></div>
                    <div>RMB: <input className={"form-control"} value={this.state.currentProduct.rmb} onChange={ e => this.handleChange("rmb", e)} /></div>
                    <div>Precio Unit: <input className={"form-control"} value={this.state.currentProduct.priceUnit} onChange={ e => this.handleChange("priceUnit", e)} /></div>
                    <div>Precio Doc.: <input className={"form-control"} value={this.state.currentProduct.priceDoc} onChange={ e => this.handleChange("priceDoc", e)} /></div>
                    <div>Precio Caja: <input className={"form-control"} value={this.state.currentProduct.priceBox} onChange={ e => this.handleChange("priceBox", e)} /></div>
                    <div>Contenedor: <input className={"form-control"} value={this.state.currentProduct.contenedor} onChange={ e => this.handleChange("contenedor", e)} /></div>
                  </div>
                </form>
                :
              null
            }


            <div className='modal-footer'>
              <Button onClick={this.editClose}>Cerrar</Button>
              <Button onClick={this.editConfirm} bsStyle='primary'>Confirmar cambios</Button>
            </div>

          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.entitiesReducer.products,
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
)(Dimensions()(Layout));
