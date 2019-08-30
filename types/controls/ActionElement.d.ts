import React from 'react';
interface ActionElementProps {
    className?: string;
    handleOnClick: (event: React.MouseEvent) => void;
    label?: string;
    title?: string;
}
declare const ActionElement: React.FC<ActionElementProps>;
export default ActionElement;
