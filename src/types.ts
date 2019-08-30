import React from 'react';

export interface NameLabelPair {
  name: string;
  label: string;
}

export interface IRule {
  id: string;
  field: string;
  operator: string;
  value: any;
}

export interface IRuleGroup {
  id: string;
  combinator: string;
  rules: (IRule | IRuleGroup)[];
}

export type ValueEditorType = 'text' | 'select' | 'checkbox' | 'radio';

interface CommonControlProps {
  /**
   * CSS classNames to be applied
   */
  className: string;
  /**
   * The level of the current group
   */
  level: number;
  /**
   * The title for this control
   */
  title?: string;
}

export interface ActionControlProps extends CommonControlProps {
  label?: string;
  handleOnClick?(): void;
}

export interface ActionControlWithRulesProps extends ActionControlProps {
  /**
   * Rules already present for this group
   */
  rules?: IRule[];
}

interface SelectorEditorProps extends CommonControlProps {
  value?: string;
  handleOnChange(value: any): void;
}

export interface CombinatorSelectorProps extends SelectorEditorProps {
  options: NameLabelPair[];
  rules?: IRule[];
}

export interface FieldSelectorProps extends SelectorEditorProps {
  options: NameLabelPair[];
}

export interface OperatorSelectorProps extends SelectorEditorProps {
  field?: string;
  options: NameLabelPair[];
}

export interface ValueEditorProps extends SelectorEditorProps {
  field?: string;
  operator?: string;
  type?: ValueEditorType;
  inputType?: string;
  values?: any[];
}

export interface Field extends NameLabelPair {
  id?: string;
}

export interface ITranslations {
  fields: {
    title: string;
  };
  operators: {
    title: string;
  };
  value: {
    title: string;
  };
  removeRule: {
    label: string;
    title: string;
  };
  removeGroup: {
    label: string;
    title: string;
  };
  addRule: {
    label: string;
    title: string;
  };
  addGroup: {
    label: string;
    title: string;
  };
  combinators: {
    title: string;
  };
}

export interface ISchema {
  classNames: {[x: string]: string;};
  combinators: NameLabelPair[];
  controls: {[x: string]: React.ComponentType<any>;};
  createRule: () => IRule;
  createRuleGroup: () => IRuleGroup;
  fields: NameLabelPair[];
  getInputType: (field: string, operator: string) => string;
  getLevel: (id: string) => number;
  getOperators: (field: string) => NameLabelPair[];
  getValueEditorType: (field: string, operator: string) => ValueEditorType;
  getValues: (field: string, operator: string) => NameLabelPair[];
  isRuleGroup: (ruleOrGroup: IRule|IRuleGroup) => ruleOrGroup is IRuleGroup;
  onGroupAdd: (group: IRuleGroup, parentId: string) => void;
  onGroupRemove: (groupId: string, parentId: string) => void;
  onPropChange: (prop: string, value: any, ruleId: string) => void;
  onRuleAdd: (rule: IRule, parentId: string) => void;
  onRuleRemove: (id: string, parentId: string) => void;
  showCombinatorsBetweenRules: boolean;
}