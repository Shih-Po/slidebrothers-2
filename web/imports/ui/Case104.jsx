import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Case104 extends Component {
  static href(_id) {
    return `/case/104/${_id}`;
  }

  render() {
    return (
      <li className="case-104">
        <span className="text">
          <a href={Case104.href(this.props.case104._id)}>{this.props.case104.title}</a>
        </span>
      </li>
    );
  }
}

Case104.propTypes = {
  case104: PropTypes.shape().isRequired,
};
