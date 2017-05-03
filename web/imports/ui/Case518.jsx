import React from 'react';
import PropTypes from 'prop-types';

export default function Case518(props) {
  return (
    <li className="case-518">
      <span className="text">
        <strong>{props.case518.title}</strong>
      </span>
    </li>
  );
}

Case518.propTypes = {
  case518: PropTypes.shape().isRequired,
};
