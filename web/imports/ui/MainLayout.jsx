import PropTypes from 'prop-types';
import React from 'react';

export default function MainLayout({ content }) {
  return (
    <div className="container">
      <header>
        <a className="header" href="/">接案佈告欄</a>
      </header>
      <main>
        { content }
      </main>
    </div>
  );
}

MainLayout.propTypes = {
  content: PropTypes.element.isRequired,
};
