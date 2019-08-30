import { IRule, IRuleGroup } from '../types';
declare const findRule: (id: string, parent: IRuleGroup) => IRule | IRuleGroup | null;
export default findRule;
