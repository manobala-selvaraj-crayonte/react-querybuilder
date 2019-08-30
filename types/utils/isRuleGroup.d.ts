import { IRule, IRuleGroup } from "../types";
/**
 * Determines if this is a RuleGroup
 */
declare const isRuleGroup: (ruleOrGroup: IRule | IRuleGroup) => ruleOrGroup is IRuleGroup;
export default isRuleGroup;
