import React from 'react';
import { ActionControlProps, ActionControlWithRulesProps, CombinatorSelectorProps, Field, FieldSelectorProps, IRuleGroup, ITranslations, NameLabelPair, OperatorSelectorProps, ValueEditorProps } from './types';
interface QueryBuilderProps {
    query?: IRuleGroup;
    /**
     * The array of fields that should be used. Each field should be an object
     * with {name: String, label: String}
     */
    fields: Field[];
    /**
     * The array of operators that should be used.
     * @default
     * [
     *     {name: 'null', label: 'Is Null'},
     *     {name: 'notNull', label: 'Is Not Null'},
     *     {name: 'in', label: 'In'},
     *     {name: 'notIn', label: 'Not In'},
     *     {name: '=', label: '='},
     *     {name: '!=', label: '!='},
     *     {name: '<', label: '<'},
     *     {name: '>', label: '>'},
     *     {name: '<=', label: '<='},
     *     {name: '>=', label: '>='},
     * ]
     */
    operators?: NameLabelPair[];
    /**
     * The array of combinators that should be used for RuleGroups.
     * @default
     * [
     *     {name: 'and', label: 'AND'},
     *     {name: 'or', label: 'OR'},
     * ]
     */
    combinators?: NameLabelPair[];
    controlElements?: {
        addGroupAction?: React.ComponentType<ActionControlWithRulesProps>;
        removeGroupAction?: React.ComponentType<ActionControlWithRulesProps>;
        addRuleAction?: React.ComponentType<ActionControlWithRulesProps>;
        removeRuleAction?: React.ComponentType<ActionControlProps>;
        combinatorSelector?: React.ComponentType<CombinatorSelectorProps>;
        fieldSelector?: React.ComponentType<FieldSelectorProps>;
        operatorSelector?: React.ComponentType<OperatorSelectorProps>;
        valueEditor?: React.ComponentType<ValueEditorProps>;
    };
    /**
     * This is a callback function invoked to get the list of allowed
     * operators for the given field.
     */
    getOperators?(field: string): Field[];
    /**
     * This is a callback function invoked to get the type of `ValueEditor`
     * for the given field and operator.
     */
    getValueEditorType?(field: string, operator: string): 'text' | 'select' | 'checkbox' | 'radio';
    /**
     * This is a callback function invoked to get the `type` of `<input />`
     * for the given field and operator (only applicable when
     * `getValueEditorType` returns `"text"` or a falsy value). If no
     * function is provided, `"text"` is used as the default.
     */
    getInputType?(field: string, operator: string): string;
    /**
     * This is a callback function invoked to get the list of allowed
     * values for the given field and operator (only applicable when
     * `getValueEditorType` returns `"select"` or `"radio"`). If no
     * function is provided, an empty array is used as the default.
     */
    getValues?(field: string, operator: string): NameLabelPair[];
    /**
     * This is a notification that is invoked anytime the query configuration changes.
     */
    onQueryChange(query: IRuleGroup): void;
    /**
     * This can be used to assign specific CSS classes to various controls
     * that are created by the `<QueryBuilder />`.
     */
    controlClassnames?: {
        /**
         * Root `<div>` element
         */
        queryBuilder?: string;
        /**
         * `<div>` containing the RuleGroup
         */
        ruleGroup?: string;
        /**
         * `<select>` control for combinators
         */
        combinators?: string;
        /**
         * `<button>` to add a Rule
         */
        addRule?: string;
        /**
         * `<button>` to add a RuleGroup
         */
        addGroup?: string;
        /**
         * `<button>` to remove a RuleGroup
         */
        removeGroup?: string;
        /**
         * `<div>` containing the Rule
         */
        rule?: string;
        /**
         * `<select>` control for fields
         */
        fields?: string;
        /**
         * `<select>` control for operators
         */
        operators?: string;
        /**
         * `<input>` for the field value
         */
        value?: string;
        /**
         * `<button>` to remove a Rule
         */
        removeRule?: string;
    };
    /**
     * This can be used to override translatable texts applied to various
     * controls that are created by the `<QueryBuilder />`.
     */
    translations?: Partial<ITranslations>;
    /**
     * Show the combinators between rules and rule groups instead of at the top of rule groups.
     */
    showCombinatorsBetweenRules?: boolean;
}
declare const QueryBuilder: React.FC<QueryBuilderProps>;
export default QueryBuilder;
