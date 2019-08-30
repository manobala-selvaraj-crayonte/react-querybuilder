import { IRule, IRuleGroup } from '../types';
/**
 * Generates a valid query object
 */
declare const generateValidQuery: (query: IRule | IRuleGroup) => IRule | IRuleGroup;
export default generateValidQuery;
