import './sizerangebar.styl';

import React, { Component } from 'react';
import classNames from 'classnames';

class Sizerangebar extends Component {
  constructor (...args) {
    super(...args);
    this.state = {
      isActive: false,
    };
  }

  onChange (ev) {
    this.props.setSize(ev.target.value);
  }

  onMouseDown () {
    this.setState({ isActive: true });
  }

  onMouseUp (ev) {
    this.setState({ isActive: false });
    /* UNFORTUNATELY IE11 DOESN'T HANDLE ONCHANGE EVENT, SO NEED TO SUBSCRIBE TO ONMOUSEUP AS WELL */
    this.onChange(ev);
  }

  render () {
    const classes = classNames(
      'sizerangebar__value',
      {
        'active': this.state.isActive
      });

    return (
      <div className="sizerangebar">
        <div className="sizerangebar__label">Size</div>
        <input
          className="sizerangebar__input"
          type="range"
          step="1"
          min="1"
          max="10"
          value={this.props.currentSize}
          onChange={this.onChange.bind(this)}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.onMouseUp.bind(this)} />
        <input
          type="number"
          min="1"
          max="10"
          className={classes}
          value={this.props.currentSize}
          onChange={this.onChange.bind(this)}>
        </input>
      </div>
    );
  }
}

export default Sizerangebar;
