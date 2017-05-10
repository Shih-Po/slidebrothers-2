import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Case518 extends Component {
  static href(_id) {
    return `/case/518/${_id}`;
  }

  render() {
    return (
      <li className="case-518">
        <span className="text">
          <a href={Case518.href(this.props.case518._id)}>{this.props.case518.title}</a>
        </span>
      </li>
    );
  }
}

Case518.propTypes = {
  case518: PropTypes.shape().isRequired,
};
