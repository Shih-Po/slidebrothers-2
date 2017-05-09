import React from 'react';

export default function MainLayout({content}) {
  return (
    <div className="container">
      <header>
        <h1>接案佈告欄</h1>
      </header>
      <main>
        {content}
      </main>
    </div>
  );
}
