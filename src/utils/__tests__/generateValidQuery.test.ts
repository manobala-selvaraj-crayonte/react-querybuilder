import { generateValidQuery } from '..';
import { IRule, IRuleGroup } from '../../types';

describe('generateValidQuery', () => {
  describe('when initial query, with ID, is provided', () => {
    const queryWithID: IRuleGroup = {
      id: 'g-12345',
      combinator: 'and',
      rules: [
        {
          id: 'r-12345',
          field: 'firstName',
          value: 'Test',
          operator: '='
        }
      ]
    };

    it('should not generate new ID if query provides ID', () => {
      const validQuery = generateValidQuery(queryWithID) as IRuleGroup;
      expect(validQuery.id).to.equal('g-12345');
      expect(validQuery.rules[0].id).to.equal('r-12345');
    });
  });

  describe('when initial query, without ID, is provided', () => {
    const queryWithoutID: Partial<IRuleGroup> = {
      combinator: 'and',
      rules: [
        {
          field: 'firstName',
          value: 'Test without ID',
          operator: '='
        } as IRule
      ]
    };

    it('should generate IDs if missing in query', () => {
      expect(queryWithoutID).to.not.haveOwnProperty('id');
      const validQuery = generateValidQuery(queryWithoutID as IRuleGroup) as IRuleGroup;
      expect(validQuery).haveOwnProperty('id');
      expect(validQuery.rules[0]).haveOwnProperty('id');
    });
  });
});
