import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CasePtt extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <li className="collection-item">
        <label className="text">
          <strong>{this.props.casePtt.title}</strong>
        </label>
      </li>
    );
  }
}

CasePtt.propTypes = {
  casePtt: PropTypes.object.isRequired,
};
