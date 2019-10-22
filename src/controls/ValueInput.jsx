import React from 'react';

const ValueInput = ({ className, onDragOver, onDrop, handleOnChange, title, value }) => (
  <input
    onDragOver={(e) => onDragOver(e)}
    onDrop={(e) => onDrop(e)}
    type={'text'}
    value={value}
    title={title}
    className={className}
    onChange={(e) => handleOnChange(e.target.value)}
  />
);

ValueInput.displayName = 'ValueInput';

export default ValueInput;
