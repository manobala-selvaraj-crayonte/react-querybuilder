import { IRule, IRuleGroup } from '../types';
import { isRuleGroup } from '.';

/**
 * Formats a query in the requested output format.  The optional
 * `valueProcessor` argument can be used to format the values differently
 * based on a given field, operator, and value.  By default, values are
 * processed assuming the default operators are being used.
 */
const formatQuery = (
  ruleGroup: IRuleGroup,
  format: 'json' | 'sql',
  valueProcessor?: (field: string, operator: string, value: any) => string
): string|undefined => {
  if (format.toLowerCase() === 'json') {
    return JSON.stringify(ruleGroup, null, 2);
  } else if (format.toLowerCase() === 'sql') {
    const valueProc =
      valueProcessor ||
      ((field, operator, value) => {
        let val = `"${value}"`;
        if (operator.toLowerCase() === 'null' || operator.toLowerCase() === 'notnull') {
          val = '';
        } else if (operator.toLowerCase() === 'in' || operator.toLowerCase() === 'notin') {
          val = `(${value
            .split(',')
            .map((v: string) => `"${v.trim()}"`)
            .join(', ')})`;
        } else if (typeof value === 'boolean') {
          val = `${value}`.toUpperCase();
        }
        return val;
      });

    const processRule = (rule: IRule) => {
      const value = valueProc(rule.field, rule.operator, rule.value);

      let operator = rule.operator;
      if (rule.operator.toLowerCase() === 'null') {
        operator = 'is null';
      } else if (rule.operator.toLowerCase() === 'notnull') {
        operator = 'is not null';
      } else if (rule.operator.toLowerCase() === 'notin') {
        operator = 'not in';
      }

      return `${rule.field} ${operator} ${value}`.trim();
    };

    const processRuleGroup = (rg: IRuleGroup): string => {
      const processedRules = rg.rules.map((rule) => {
        if (isRuleGroup(rule)) {
          return processRuleGroup(rule);
        }
        return processRule(rule);
      });
      return '(' + processedRules.join(` ${rg.combinator} `) + ')';
    };

    return processRuleGroup(ruleGroup);
  }
};

export default formatQuery;
