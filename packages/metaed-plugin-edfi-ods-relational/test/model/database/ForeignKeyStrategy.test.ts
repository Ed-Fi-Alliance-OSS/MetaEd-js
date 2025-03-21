// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  ForeignKeyStrategy,
  ForeignKeyStrategyDefault,
  ForeignKeyStrategyDeleteCascade,
  ForeignKeyStrategyUpdateCascade,
  ForeignKeyStrategyUpdateDeleteCascade,
} from '../../../src/model/database/ForeignKeyStrategy';
import { newColumn, Column } from '../../../src/model/database/Column';

describe('when using default foreign kay strategy', (): void => {
  const integerColumnName = 'IntegerColumnName';
  let strategy: ForeignKeyStrategy;
  let column: Column;

  beforeAll(() => {
    strategy = ForeignKeyStrategyDefault;
    column = { ...newColumn(), type: 'integer', columnId: integerColumnName };
  });

  it('should not have delete cascade', (): void => {
    expect(strategy.hasDeleteCascade()).toBe(false);
  });

  it('should not have delete cascade', (): void => {
    expect(strategy.hasUpdateCascade()).toBe(false);
  });

  it('should have parent column name', (): void => {
    expect(strategy.parentColumnId(column)).toBe(integerColumnName);
  });

  it('should have foreign column name', (): void => {
    expect(strategy.foreignColumnId(column)).toBe(integerColumnName);
  });
});

describe('when using delete cascade foreign key strategy', (): void => {
  const integerColumnName = 'IntegerColumnName';
  let strategy: ForeignKeyStrategy;
  let column: Column;

  beforeAll(() => {
    strategy = ForeignKeyStrategyDeleteCascade;
    column = { ...newColumn(), type: 'integer', columnId: integerColumnName };
  });

  it('should have delete cascade', (): void => {
    expect(strategy.hasDeleteCascade()).toBe(true);
  });

  it('should not have delete cascade', (): void => {
    expect(strategy.hasUpdateCascade()).toBe(false);
  });

  it('should have parent column name', (): void => {
    expect(strategy.parentColumnId(column)).toBe(integerColumnName);
  });

  it('should have foreign column name', (): void => {
    expect(strategy.foreignColumnId(column)).toBe(integerColumnName);
  });
});

describe('when using update cascade foreign key strategy', (): void => {
  const integerColumnName = 'IntegerColumnName';
  let strategy: ForeignKeyStrategy;
  let column: Column;

  beforeAll(() => {
    strategy = ForeignKeyStrategyUpdateCascade;
    column = { ...newColumn(), type: 'integer', columnId: integerColumnName };
  });

  it('should have delete cascade', (): void => {
    expect(strategy.hasDeleteCascade()).toBe(false);
  });

  it('should not have delete cascade', (): void => {
    expect(strategy.hasUpdateCascade()).toBe(true);
  });

  it('should have parent column name', (): void => {
    expect(strategy.parentColumnId(column)).toBe(integerColumnName);
  });

  it('should have foreign column name', (): void => {
    expect(strategy.foreignColumnId(column)).toBe(integerColumnName);
  });
});

describe('when using update delete cascade foreign key strategy', (): void => {
  const integerColumnName = 'IntegerColumnName';
  let strategy: ForeignKeyStrategy;
  let column: Column;

  beforeAll(() => {
    strategy = ForeignKeyStrategyUpdateDeleteCascade;
    column = { ...newColumn(), type: 'integer', columnId: integerColumnName };
  });

  it('should have delete cascade', (): void => {
    expect(strategy.hasDeleteCascade()).toBe(true);
  });

  it('should not have delete cascade', (): void => {
    expect(strategy.hasUpdateCascade()).toBe(true);
  });

  it('should have parent column name', (): void => {
    expect(strategy.parentColumnId(column)).toBe(integerColumnName);
  });

  it('should have foreign column name', (): void => {
    expect(strategy.foreignColumnId(column)).toBe(integerColumnName);
  });
});

describe('when using foreign column cascade', (): void => {
  const strategy: (deleteCascade: boolean, updateCascade: boolean) => ForeignKeyStrategy =
    ForeignKeyStrategy.foreignColumnCascade;

  it('should return default strategy', (): void => {
    expect(strategy(false, false)).toBe(ForeignKeyStrategyDefault);
  });

  it('should return delete cascade strategy', (): void => {
    expect(strategy(true, false)).toBe(ForeignKeyStrategyDeleteCascade);
  });

  it('should return update cascade strategy', (): void => {
    expect(strategy(false, true)).toBe(ForeignKeyStrategyUpdateCascade);
  });

  it('should return update delete cascade strategy', (): void => {
    expect(strategy(true, true)).toBe(ForeignKeyStrategyUpdateDeleteCascade);
  });

  it('should return default strategy', (): void => {
    // @ts-ignore: type is incompatible with the expected param type of boolean
    expect(strategy(null, null)).toBe(ForeignKeyStrategyDefault);
  });
});
