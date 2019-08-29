import { Rule, RuleGroup } from "../types";

/**
 * Determines if this is a RuleGroup
 */
const isRuleGroup = (ruleOrGroup: Rule|RuleGroup): ruleOrGroup is RuleGroup => {
  const rg = ruleOrGroup as RuleGroup;
  return !!(rg.combinator && rg.rules);
};

export default isRuleGroup;
