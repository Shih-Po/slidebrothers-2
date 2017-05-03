import React from 'react';
import PropTypes from 'prop-types';

export default function CasePtt(props) {
  return (
    <li className="case-ptt">
      <span className="text">
        <strong>{props.casePtt.title}</strong>
      </span>
    </li>
  );
}

CasePtt.propTypes = {
  casePtt: PropTypes.shape().isRequired,
};
