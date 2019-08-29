import React from 'react';

interface ActionElementProps {
  className?: string;
  handleOnClick: (event: React.MouseEvent) => void;
  label?: string;
  title?: string;
}

const ActionElement: React.FC<ActionElementProps> = ({ className, handleOnClick, label, title }) => (
  <button className={className} title={title} onClick={(e) => handleOnClick(e)}>
    {label}
  </button>
);

ActionElement.displayName = 'ActionElement';

export default ActionElement;
