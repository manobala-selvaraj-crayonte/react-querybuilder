import cloneDeep from 'lodash/cloneDeep';
import React, { useEffect, useState } from 'react';
import uniqueId from 'uuid/v4';
import { ActionElement, ValueEditor, ValueSelector } from './controls/index';
import RuleGroup from './RuleGroup';
import {
  ActionControlProps,
  ActionControlWithRulesProps,
  CombinatorSelectorProps,
  Field,
  FieldSelectorProps,
  IRule,
  IRuleGroup,
  ISchema,
  ITranslations,
  NameLabelPair,
  OperatorSelectorProps,
  ValueEditorProps
} from './types';
import { findRule, generateValidQuery, getLevel, isRuleGroup } from './utils/index';

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

const defaultTranslations = {
  fields: {
    title: 'Fields'
  },
  operators: {
    title: 'Operators'
  },
  value: {
    title: 'Value'
  },
  removeRule: {
    label: 'x',
    title: 'Remove rule'
  },
  removeGroup: {
    label: 'x',
    title: 'Remove group'
  },
  addRule: {
    label: '+Rule',
    title: 'Add rule'
  },
  addGroup: {
    label: '+Group',
    title: 'Add group'
  },
  combinators: {
    title: 'Combinators'
  }
};

const defaultOperators: NameLabelPair[] = [
  { name: 'null', label: 'Is Null' },
  { name: 'notNull', label: 'Is Not Null' },
  { name: 'in', label: 'In' },
  { name: 'notIn', label: 'Not In' },
  { name: '=', label: '=' },
  { name: '!=', label: '!=' },
  { name: '<', label: '<' },
  { name: '>', label: '>' },
  { name: '<=', label: '<=' },
  { name: '>=', label: '>=' }
];

const defaultCombinators: NameLabelPair[] = [
  { name: 'and', label: 'AND' },
  { name: 'or', label: 'OR' }
];

const defaultControlClassnames = {
  queryBuilder: '',

  ruleGroup: '',
  combinators: '',
  addRule: '',
  addGroup: '',
  removeGroup: '',

  rule: '',
  fields: '',
  operators: '',
  value: '',
  removeRule: ''
};

const defaultControlElements = {
  addGroupAction: ActionElement,
  removeGroupAction: ActionElement,
  addRuleAction: ActionElement,
  removeRuleAction: ActionElement,
  combinatorSelector: ValueSelector,
  fieldSelector: ValueSelector,
  operatorSelector: ValueSelector,
  valueEditor: ValueEditor
};

const QueryBuilder: React.FC<QueryBuilderProps> = (props) => {
  /**
   * Gets the initial query
   * @returns {RuleGroupType}
   */
  const getInitialQuery = (): IRuleGroup => {
    const { query } = props;
    return (query && (generateValidQuery(query) as IRuleGroup)) || createRuleGroup();
  };

  const createRule = (): IRule => {
    const { fields } = props;
    const field = fields[0].name;

    return {
      id: `r-${uniqueId()}`,
      field,
      value: '',
      operator: getOperators(field)[0].name
    };
  };

  const createRuleGroup = (): IRuleGroup => ({
    id: `g-${uniqueId()}`,
    rules: [],
    combinator: props.combinators![0].name
  });

  /**
   * Gets the ValueEditor type for a given field and operator
   */
  const getValueEditorType = (field: string, operator: string) => {
    if (props.getValueEditorType) {
      const vet = props.getValueEditorType(field, operator);
      if (vet) return vet;
    }

    return 'text';
  };

  /**
   * Gets the `<input />` type for a given field and operator
   */
  const getInputType = (field: string, operator: string) => {
    if (props.getInputType) {
      const inputType = props.getInputType(field, operator);
      if (inputType) return inputType;
    }

    return 'text';
  };

  /**
   * Gets the list of valid values for a given field and operator
   * @param {string} field
   * @param {string} operator
   * @returns {{name: string; label: string;}[]}
   */
  const getValues = (field: string, operator: string): NameLabelPair[] => {
    if (props.getValues) {
      const vals = props.getValues(field, operator);
      if (vals) return vals;
    }

    return [];
  };

  /**
   * Gets the operators for a given field
   */
  const getOperators = (field: string): NameLabelPair[] => {
    if (props.getOperators) {
      const ops = props.getOperators(field);
      if (ops) return ops;
    }

    return props.operators!;
  };

  /**
   * Adds a rule to the query
   */
  const onRuleAdd = (rule: IRule, parentId: string) => {
    const rootCopy = { ...root };
    const parent = findRule(parentId, rootCopy) as IRuleGroup;
    parent.rules.push(rule);
    setRoot(rootCopy);
    _notifyQueryChange(rootCopy);
  };

  /**
   * Adds a rule group to the query
   */
  const onGroupAdd = (group: IRuleGroup, parentId: string) => {
    const rootCopy = { ...root };
    const parent = findRule(parentId, rootCopy) as IRuleGroup;
    parent.rules.push(group);
    setRoot(rootCopy);
    _notifyQueryChange(rootCopy);
  };

  const onPropChange = (prop: string, value: any, ruleId: string) => {
    const rootCopy = { ...root };
    const rule = findRule(ruleId, rootCopy) as IRule;
    Object.assign(rule, { [prop]: value });

    // Reset operator and value for field change
    if (prop === 'field') {
      Object.assign(rule, { operator: getOperators(rule.field)[0].name, value: '' });
    }

    setRoot(rootCopy);
    _notifyQueryChange(rootCopy);
  };

  /**
   * Removes a rule from the query
   */
  const onRuleRemove = (ruleId: string, parentId: string) => {
    const rootCopy = { ...root };
    const parent = findRule(parentId, rootCopy) as IRuleGroup;
    const index = parent.rules.findIndex((x) => x.id === ruleId);

    parent.rules.splice(index, 1);

    setRoot(rootCopy);
    _notifyQueryChange(rootCopy);
  };

  /**
   * Removes a rule group from the query
   */
  const onGroupRemove = (groupId: string, parentId: string) => {
    const rootCopy = { ...root };
    const parent = findRule(parentId, rootCopy) as IRuleGroup;
    const index = parent.rules.findIndex((x) => x.id === groupId);

    parent.rules.splice(index, 1);

    setRoot(rootCopy);
    _notifyQueryChange(rootCopy);
  };

  /**
   * Gets the level of the rule with the provided ID
   */
  const getLevelFromRoot = (id: string) => {
    return getLevel(id, 0, root);
  };

  /**
   * Executes the `onQueryChange` function, if provided
   */
  const _notifyQueryChange = (newRoot: IRuleGroup) => {
    const { onQueryChange } = props;
    if (onQueryChange) {
      const query = cloneDeep(newRoot);
      onQueryChange(query);
    }
  };

  const [root, setRoot] = useState(getInitialQuery());

  const schema: ISchema = {
    fields: props.fields,
    combinators: props.combinators!,
    classNames: { ...defaultControlClassnames, ...props.controlClassnames },
    createRule,
    createRuleGroup,
    onRuleAdd,
    onGroupAdd,
    onRuleRemove,
    onGroupRemove,
    onPropChange,
    getLevel: getLevelFromRoot,
    isRuleGroup,
    controls: { ...defaultControlElements, ...props.controlElements },
    getOperators,
    getValueEditorType,
    getInputType,
    getValues,
    showCombinatorsBetweenRules: !!props.showCombinatorsBetweenRules
  };

  // Set the query state when a new query prop comes in
  useEffect(() => {
    setRoot(generateValidQuery(props.query || getInitialQuery()) as IRuleGroup);
  }, [props.query]);

  // Notify a query change on mount
  useEffect(() => {
    _notifyQueryChange(root);
  }, []);

  return (
    <div className={`queryBuilder ${schema.classNames.queryBuilder}`}>
      <RuleGroup
        translations={{ ...defaultTranslations, ...props.translations }}
        rules={root.rules}
        combinator={root.combinator}
        schema={schema}
        id={root.id}
        parentId={undefined}
      />
    </div>
  );
};

QueryBuilder.defaultProps = {
  fields: [],
  operators: defaultOperators,
  combinators: defaultCombinators,
  translations: defaultTranslations,
  controlElements: {},
  showCombinatorsBetweenRules: false
};

QueryBuilder.displayName = 'QueryBuilder';

export default QueryBuilder;
