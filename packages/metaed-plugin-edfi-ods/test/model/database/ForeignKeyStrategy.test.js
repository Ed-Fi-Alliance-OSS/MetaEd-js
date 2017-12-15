// @flow
import {
  ForeignKeyStrategy,
  ForeignKeyStrategyDefault,
  ForeignKeyStrategyDeleteCascade,
  ForeignKeyStrategyUpdateCascade,
  ForeignKeyStrategyUpdateDeleteCascade,
} from '../../../src/model/database/ForeignKeyStrategy';
import { newIntegerColumn } from '../../../src/model/database/Column';
import type { Column } from '../../../src/model/database/Column';

describe('when using default foreign kay strategy', () => {
  const integerColumnName: string = 'IntegerColumnName';
  let strategy: ForeignKeyStrategy;
  let column: Column;

  beforeAll(() => {
    strategy = ForeignKeyStrategyDefault;
    column = Object.assign(newIntegerColumn(), { name: integerColumnName });
  });

  it('should not have delete cascade', () => {
    expect(strategy.hasDeleteCascade()).toBe(false);
  });

  it('should not have delete cascade', () => {
    expect(strategy.hasUpdateCascade()).toBe(false);
  });

  it('should have parent column name', () => {
    expect(strategy.parentColumnName(column)).toBe(integerColumnName);
  });

  it('should have foreign column name', () => {
    expect(strategy.foreignColumnName(column)).toBe(integerColumnName);
  });
});

describe('when using delete cascade foreign key strategy', () => {
  const integerColumnName: string = 'IntegerColumnName';
  let strategy: ForeignKeyStrategy;
  let column: Column;

  beforeAll(() => {
    strategy = ForeignKeyStrategyDeleteCascade;
    column = Object.assign(newIntegerColumn(), { name: integerColumnName });
  });

  it('should have delete cascade', () => {
    expect(strategy.hasDeleteCascade()).toBe(true);
  });

  it('should not have delete cascade', () => {
    expect(strategy.hasUpdateCascade()).toBe(false);
  });

  it('should have parent column name', () => {
    expect(strategy.parentColumnName(column)).toBe(integerColumnName);
  });

  it('should have foreign column name', () => {
    expect(strategy.foreignColumnName(column)).toBe(integerColumnName);
  });
});

describe('when using update cascade foreign key strategy', () => {
  const integerColumnName: string = 'IntegerColumnName';
  let strategy: ForeignKeyStrategy;
  let column: Column;

  beforeAll(() => {
    strategy = ForeignKeyStrategyUpdateCascade;
    column = Object.assign(newIntegerColumn(), { name: integerColumnName });
  });

  it('should have delete cascade', () => {
    expect(strategy.hasDeleteCascade()).toBe(false);
  });

  it('should not have delete cascade', () => {
    expect(strategy.hasUpdateCascade()).toBe(true);
  });

  it('should have parent column name', () => {
    expect(strategy.parentColumnName(column)).toBe(integerColumnName);
  });

  it('should have foreign column name', () => {
    expect(strategy.foreignColumnName(column)).toBe(integerColumnName);
  });
});

describe('when using update delete cascade foreign key strategy', () => {
  const integerColumnName: string = 'IntegerColumnName';
  let strategy: ForeignKeyStrategy;
  let column: Column;

  beforeAll(() => {
    strategy = ForeignKeyStrategyUpdateDeleteCascade;
    column = Object.assign(newIntegerColumn(), { name: integerColumnName });
  });

  it('should have delete cascade', () => {
    expect(strategy.hasDeleteCascade()).toBe(true);
  });

  it('should not have delete cascade', () => {
    expect(strategy.hasUpdateCascade()).toBe(true);
  });

  it('should have parent column name', () => {
    expect(strategy.parentColumnName(column)).toBe(integerColumnName);
  });

  it('should have foreign column name', () => {
    expect(strategy.foreignColumnName(column)).toBe(integerColumnName);
  });
});

describe('when using foreign column rename foreign key strategy', () => {
  const integerColumnName: string = 'IntegerColumnName';
  const foreignColumnRename: string = 'ForeignColumnRename';
  let strategy: ForeignKeyStrategy;
  let column: Column;

  beforeAll(() => {
    strategy = ForeignKeyStrategy.foreignColumnRename(foreignColumnRename);
    column = Object.assign(newIntegerColumn(), { name: integerColumnName });
  });

  it('should have delete cascade', () => {
    expect(strategy.hasDeleteCascade()).toBe(false);
  });

  it('should not have delete cascade', () => {
    expect(strategy.hasUpdateCascade()).toBe(false);
  });

  it('should have parent column name', () => {
    expect(strategy.parentColumnName(column)).toBe(integerColumnName);
  });

  it('should have foreign column name', () => {
    expect(strategy.foreignColumnName(column)).toBe(foreignColumnRename);
  });
});

describe('when using foreign column cascade', () => {
  const strategy: (deleteCascade: boolean, updateCascade: boolean) => ForeignKeyStrategy = ForeignKeyStrategy.foreignColumnCascade;

  it('should return default strategy', () => {
    expect(strategy(false, false)).toBe(ForeignKeyStrategyDefault);
  });

  it('should return delete cascade strategy', () => {
    expect(strategy(true, false)).toBe(ForeignKeyStrategyDeleteCascade);
  });

  it('should return update cascade strategy', () => {
    expect(strategy(false, true)).toBe(ForeignKeyStrategyUpdateCascade);
  });

  it('should return update delete cascade strategy', () => {
    expect(strategy(true, true)).toBe(ForeignKeyStrategyUpdateDeleteCascade);
  });

  it('should return default strategy', () => {
    // $FlowIgnore - type is incompatible with the expected param type of boolean
    expect(strategy(null, null)).toBe(ForeignKeyStrategyDefault);
  });
});
