import uniqueId from 'uuid/v4';
import { IRule, IRuleGroup } from '../types';
import { isRuleGroup } from '.';

/**
 * Generates a valid query object
 */
const generateValidQuery = (query: IRule|IRuleGroup): IRule|IRuleGroup => {
  if (isRuleGroup(query)) {
    return {
      id: query.id || `g-${uniqueId()}`,
      rules: query.rules.map((rule) => generateValidQuery(rule)),
      combinator: query.combinator
    };
  }
  return {
    id: query.id || `r-${uniqueId()}`,
    ...query
  };
};

export default generateValidQuery;
