import React from 'react';
import { Field } from '../types';
interface ValueSelectorProps {
    className?: string;
    handleOnChange: (value: string) => void;
    options: Field[];
    title?: string;
    value?: any;
}
declare const ValueSelector: React.FC<ValueSelectorProps>;
export default ValueSelector;
