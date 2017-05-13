import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Case104 extends Component {
  static href(_id) {
    return `/case/104/${_id}`;
  }

  render() {
    return (
      <a className="collection-item orange-text" href={Case104.href(this.props.case104._id)}>
        {this.props.case104.title}
      </a>
    );
  }
}

Case104.propTypes = {
  case104: PropTypes.shape().isRequired,
};
