import React, { Component } from 'react';
import {Table, Column, Cell} from 'fixed-data-table';
var { Button } = require('react-bootstrap');

const TextCell = ({rowIndex, data, columnKey, ...props}) => {
  return (
    <Cell {...props}>
      {data.getObjectAt(rowIndex)[columnKey]}
    </Cell>
  )
};

const CancelCell = ({rowIndex, columnKey, removeFromModified, ...props}) => {
  return (
  <Button
    bsStyle="danger"
    bsSize="xsmall"
    {...this.props}
    onClick={() => removeFromModified(rowIndex) }
  >
    X
  </Button>
  )
}

class SimpleProductList extends Component {

  render() {
    return (
      <div className="center-table"> 
        <Table
          rowHeight={30}
          rowsCount={this.props.data.getSize()}
          headerHeight={30}
          width={this.props.edit ? 330 : 300}
          height={500}
          {...this.props}
        >
          <Column
            header={<Cell>Código</Cell>}
            columnKey="code"
            cell={<TextCell data={this.props.data} />}
            fixed={true}
            width={200}
          />
          <Column
            header={<Cell>Cantidad</Cell>}
            columnKey="discountQty"
            cell={<TextCell data={this.props.data} />}
            fixed={true}
            width={100}
          />  
          {this.props.edit ?
              <Column
                {...this.props}
                cell={<CancelCell removeFromModified={this.props.removeFromModified}/>}
                fixed={true}
                width={30}
              />  
              :
              null
          }
        </Table>
      </div>
    )
  }
}

export default SimpleProductList;
