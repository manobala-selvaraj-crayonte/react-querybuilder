import { IRule, IRuleGroup } from '../types';
import { isRuleGroup } from './index';

const findRule = (id: string, parent: IRuleGroup): IRule|IRuleGroup|null => {
  if (parent.id === id) {
    return parent;
  }

  for (const rule of parent.rules) {
    if (rule.id === id) {
      return rule;
    } else if (isRuleGroup(rule)) {
      const subRule = findRule(id, rule);
      if (subRule) {
        return subRule;
      }
    }
  }

  return null;
};

export default findRule;
