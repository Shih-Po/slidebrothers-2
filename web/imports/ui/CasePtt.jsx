import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CasePtt extends Component {
  static href(_id) {
    return `/case/ptt/${_id}`;
  }

  render() {
    return (
      <li className="case-ptt">
        <span className="text">
          <a href={CasePtt.href(this.props.casePtt._id)}>{this.props.casePtt.title}</a>
        </span>
      </li>
    );
  }
}

CasePtt.propTypes = {
  casePtt: PropTypes.shape().isRequired,
};
