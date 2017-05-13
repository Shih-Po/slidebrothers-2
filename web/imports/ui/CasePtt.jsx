import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CasePtt extends Component {
  static href(_id) {
    return `/case/ptt/${_id}`;
  }

  render() {
    return (
      <a className="collection-item" href={CasePtt.href(this.props.casePtt._id)}>
        {this.props.casePtt.title}
      </a>
    );
  }
}

CasePtt.propTypes = {
  casePtt: PropTypes.shape().isRequired,
};
