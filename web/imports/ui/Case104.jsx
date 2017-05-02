import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Case104 extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <li className="collection-item">
        <label className="text">
          <strong>{this.props.case104.title}</strong>
        </label>
      </li>
    );
  }
}

Case104.propTypes = {
  case104: PropTypes.object.isRequired,
};
