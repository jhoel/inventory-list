import React from 'react';
import { browserHistory } from 'react-router';
var { Button, DropdownButton, MenuItem, ButtonGroup } = require('react-bootstrap');



class SideBar extends React.Component {
  render() {
    return (
      <ButtonGroup vertical className="side-nav">
      <MenuItem header>Contenedores</MenuItem>
      <Button onClick={() => window.location.reload()}>Todos  </Button>
      <DropdownButton title="2017" id="bg-vertical-dropdown-1">
        <MenuItem eventKey="1" onClick={() => this.props.getProductsByContainer("17-1")}>Cont. 1</MenuItem>
        <MenuItem eventKey="2" onClick={() => this.props.getProductsByContainer("17-2")}>Cont. 2</MenuItem>
        <MenuItem eventKey="3" onClick={() => this.props.getProductsByContainer("17-3")}>Cont. 3</MenuItem>
        <MenuItem eventKey="4" onClick={() => this.props.getProductsByContainer("17-4")}>Cont. 4</MenuItem>
        <MenuItem eventKey="5" onClick={() => this.props.getProductsByContainer("17-5")}>Cont. 5</MenuItem>
        <MenuItem eventKey="6" onClick={() => this.props.getProductsByContainer("17-6")}>Cont. 6</MenuItem>
        <MenuItem eventKey="7" onClick={() => this.props.getProductsByContainer("17-7")}>Cont. 7</MenuItem>
      </DropdownButton>
      <DropdownButton title="2016" id="bg-vertical-dropdown-1">
        <MenuItem eventKey="1" onClick={() => this.props.getProductsByContainer("16-1")}>Cont. 1</MenuItem>
        <MenuItem eventKey="2" onClick={() => this.props.getProductsByContainer("16-2")}>Cont. 2</MenuItem>
        <MenuItem eventKey="3" onClick={() => this.props.getProductsByContainer("16-3")}>Cont. 3</MenuItem>
        <MenuItem eventKey="4" onclick={() => this.props.getproductsbycontainer("16-4")}>Cont. 4</MenuItem>
        <MenuItem eventKey="5" onClick={() => this.props.getProductsByContainer("16-5")}>Cont. 5</MenuItem>
        <MenuItem eventKey="6" onClick={() => this.props.getProductsByContainer("16-6")}>Cont. 6</MenuItem>
      </DropdownButton>
        <Button onClick={() =>  browserHistory.push('/salidas') }>Salidas</Button>
    </ButtonGroup>
    );
  }
}

export default SideBar;
