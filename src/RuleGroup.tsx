import React, { Fragment } from 'react';
import Rule from './Rule';
import { IRule, IRuleGroup, ISchema, ITranslations } from './types';

interface RuleGroupProps {
  id: string;
  parentId?: string;
  combinator: string;
  rules: (IRule | IRuleGroup)[];
  translations: ITranslations;
  schema: ISchema;
}

const RuleGroup: React.FC<RuleGroupProps> = ({
  id,
  parentId,
  combinator,
  rules,
  translations,
  schema
}) => {
  const {
    classNames,
    combinators,
    controls,
    createRule,
    createRuleGroup,
    getLevel,
    isRuleGroup,
    onGroupAdd,
    onGroupRemove,
    onPropChange,
    onRuleAdd,
    showCombinatorsBetweenRules
  } = schema;

  const hasParentGroup = () => !!parentId;

  const onCombinatorChange = (value: any) => {
    onPropChange('combinator', value, id);
  };

  const addRule = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const newRule = createRule();
    onRuleAdd(newRule, id);
  };

  const addGroup = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const newGroup = createRuleGroup();
    onGroupAdd(newGroup, id);
  };

  const removeGroup = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    onGroupRemove(id, parentId!);
  };

  const level = getLevel(id);

  return (
    <div className={`ruleGroup ${classNames.ruleGroup}`}>
      {showCombinatorsBetweenRules ? null : (
        <controls.combinatorSelector
          options={combinators}
          value={combinator}
          title={translations.combinators.title}
          className={`ruleGroup-combinators ${classNames.combinators}`}
          handleOnChange={onCombinatorChange}
          rules={rules}
          level={level}
        />
      )}
      <controls.addRuleAction
        label={translations.addRule.label}
        title={translations.addRule.title}
        className={`ruleGroup-addRule ${classNames.addRule}`}
        handleOnClick={addRule}
        rules={rules}
        level={level}
      />
      <controls.addGroupAction
        label={translations.addGroup.label}
        title={translations.addGroup.title}
        className={`ruleGroup-addGroup ${classNames.addGroup}`}
        handleOnClick={addGroup}
        rules={rules}
        level={level}
      />
      {hasParentGroup() ? (
        <controls.removeGroupAction
          label={translations.removeGroup.label}
          title={translations.removeGroup.title}
          className={`ruleGroup-remove ${classNames.removeGroup}`}
          handleOnClick={removeGroup}
          rules={rules}
          level={level}
        />
      ) : null}
      {rules.map((r, idx) => (
        <Fragment key={r.id}>
          {idx && showCombinatorsBetweenRules ? (
            <controls.combinatorSelector
              options={combinators}
              value={combinator}
              title={translations.combinators.title}
              className={`ruleGroup-combinators betweenRules ${classNames.combinators}`}
              handleOnChange={onCombinatorChange}
              rules={rules}
              level={level}
            />
          ) : null}
          {isRuleGroup(r) ? (
            <RuleGroup
              id={r.id}
              schema={schema}
              parentId={id}
              combinator={r.combinator}
              translations={translations}
              rules={r.rules}
            />
          ) : (
            <Rule
              id={r.id}
              field={r.field}
              value={r.value}
              operator={r.operator}
              schema={schema}
              parentId={id}
              translations={translations}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};

RuleGroup.defaultProps = {
  rules: [],
  combinator: 'and'
};

RuleGroup.displayName = 'RuleGroup';

export default RuleGroup;
