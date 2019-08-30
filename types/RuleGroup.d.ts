import React from 'react';
import { IRule, IRuleGroup, ISchema, ITranslations } from './types';
interface RuleGroupProps {
    id: string;
    parentId?: string;
    combinator: string;
    rules: (IRule | IRuleGroup)[];
    translations: ITranslations;
    schema: ISchema;
}
declare const RuleGroup: React.FC<RuleGroupProps>;
export default RuleGroup;
