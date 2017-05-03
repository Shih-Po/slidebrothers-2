import React from 'react';
import PropTypes from 'prop-types';

export default function Case104(props) {
  return (
    <li className="case-104">
      <span className="text">
        <strong>{props.case104.title}</strong>
      </span>
    </li>
  );
}

Case104.propTypes = {
  case104: PropTypes.shape().isRequired,
};
