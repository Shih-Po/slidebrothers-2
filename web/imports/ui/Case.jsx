import React from 'react';
import PropTypes from 'prop-types';

const Case = ({ aCase }) => {
  const source = aCase.source;
  let color;
  if (source === '104') color = 'orange-text';
  else if (source === '518') color = 'green-text';
  else color = 'purple-text';
  return (
    <a
      className={`collection-item ${color}`}
      href={`/case/${aCase.source}/${aCase._id}`}
    >
      {aCase.post_date.toDateString()} - {aCase.title}
    </a>
  );
};

// noinspection JSUnresolvedFunction
Case.propTypes = {
  aCase: PropTypes.shape().isRequired,
};

export default Case;