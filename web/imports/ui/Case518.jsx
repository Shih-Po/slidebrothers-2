import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Case518 extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <li className="collection-item">
        <label className="text">
          <strong>{this.props.case518.title}</strong>
        </label>
      </li>
    );
  }
}

Case518.propTypes = {
  case518: PropTypes.object.isRequired,
};
