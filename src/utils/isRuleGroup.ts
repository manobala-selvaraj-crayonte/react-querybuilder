import { IRule, IRuleGroup } from "../types";

/**
 * Determines if this is a RuleGroup
 */
const isRuleGroup = (ruleOrGroup: IRule|IRuleGroup): ruleOrGroup is IRuleGroup => {
  const rg = ruleOrGroup as IRuleGroup;
  return !!(rg.combinator && rg.rules);
};

export default isRuleGroup;
