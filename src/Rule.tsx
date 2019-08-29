import React from 'react';
import { ISchema, ITranslations } from './types';

interface RuleProps {
  id: string;
  parentId: string;
  field: string;
  operator: string;
  value: any;
  translations: ITranslations;
  schema: ISchema;
}

const Rule: React.FC<RuleProps> = ({
  id,
  parentId,
  field,
  operator,
  value,
  translations,
  schema: {
    classNames,
    controls,
    fields,
    getInputType,
    getLevel,
    getOperators,
    getValueEditorType,
    getValues,
    onPropChange,
    onRuleRemove
  }
}) => {
  const onElementChanged = (property: string, value: any) => {
    onPropChange(property, value, id);
  };

  const onFieldChanged = (value: any) => {
    onElementChanged('field', value);
  };

  const onOperatorChanged = (value: any) => {
    onElementChanged('operator', value);
  };

  const onValueChanged = (value: any) => {
    onElementChanged('value', value);
  };

  const removeRule = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    onRuleRemove(id, parentId);
  };

  const level = getLevel(id);

  return (
    <div className={`rule ${classNames.rule}`}>
      <controls.fieldSelector
        options={fields}
        title={translations.fields.title}
        value={field}
        className={`rule-fields ${classNames.fields}`}
        handleOnChange={onFieldChanged}
        level={level}
      />
      <controls.operatorSelector
        field={field}
        title={translations.operators.title}
        options={getOperators(field)}
        value={operator}
        className={`rule-operators ${classNames.operators}`}
        handleOnChange={onOperatorChanged}
        level={level}
      />
      <controls.valueEditor
        field={field}
        title={translations.value.title}
        operator={operator}
        value={value}
        type={getValueEditorType(field, operator)}
        inputType={getInputType(field, operator)}
        values={getValues(field, operator)}
        className={`rule-value ${classNames.value}`}
        handleOnChange={onValueChanged}
        level={level}
      />
      <controls.removeRuleAction
        label={translations.removeRule.label}
        title={translations.removeRule.title}
        className={`rule-remove ${classNames.removeRule}`}
        handleOnClick={removeRule}
        level={level}
      />
    </div>
  );
};

Rule.displayName = 'Rule';

export default Rule;
