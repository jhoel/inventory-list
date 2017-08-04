import React, { Component } from 'react';

export default class ListSelect extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentActive: -1,
    };
  }

  onClickItem(id, index) {
    this.props.onClickItem(id, index);
    this.setState({currentActive: index});
  }

  render() {
    return (
      <div className="list-group">
        <div className="list-group-item active">{this.props.description}</div>
        {
          this.props.items.map( (item, index) => {
            return (
              <button
                key={index}
                className={this.state.currentActive === index ? "list-group-item list-group-item-info" : "list-group-item"}
                onClick={
                  () => this.onClickItem(item.id, index)
                }
              > {item.name || item}
              </button>
            )
          })
        }
      </div>
    );
  }
}
