import React from 'react';
import { ISchema, ITranslations } from './types';
interface RuleProps {
    id: string;
    parentId: string;
    field: string;
    operator: string;
    value: any;
    translations: ITranslations;
    schema: ISchema;
}
declare const Rule: React.FC<RuleProps>;
export default Rule;
