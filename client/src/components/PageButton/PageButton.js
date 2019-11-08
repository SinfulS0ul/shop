import React from 'react';

const PageButton = props => {
  const { text, func } = props
  return (
    <button
      onClick={() => func()}
      style={{ border: 'none', background: 'none' }}
    >
      {text}
    </button>
  );

}

export default PageButton;