import { IRuleGroup } from '../types';
/**
 * Formats a query in the requested output format.  The optional
 * `valueProcessor` argument can be used to format the values differently
 * based on a given field, operator, and value.  By default, values are
 * processed assuming the default operators are being used.
 */
declare const formatQuery: (ruleGroup: IRuleGroup, format: "json" | "sql", valueProcessor: (field: string, operator: string, value: any) => string) => string;
export default formatQuery;
