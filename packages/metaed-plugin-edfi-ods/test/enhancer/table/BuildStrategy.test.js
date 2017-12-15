// @flow
import { newIntegerProperty } from 'metaed-core';
import { ColumnTransformUnchanged, ColumnTransformMakeNull } from '../../../src/model/database/ColumnTransform';
import { BuildStrategy, BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';

describe('when using default build strategy', () => {
  let strategy: BuildStrategy;

  beforeAll(() => {
    strategy = BuildStrategyDefault;
  });

  it('should return empty string when calling parent context', () => {
    expect(strategy.parentContext()).toBe('');
  });

  it('should return same column transform strategy when calling leaf columns', () => {
    expect(strategy.leafColumns(ColumnTransformUnchanged)).toBe(ColumnTransformUnchanged);
  });

  it('should use default column namer strategy', () => {
    const inlineContext: string = 'InlineContext';
    const withContext: string = 'WithContext';
    const baseName: string = 'BaseName';
    expect(strategy.columnNamer(inlineContext, withContext, baseName)()).toBe(inlineContext + withContext + baseName);
  });

  it('should return true when calling build columns', () => {
    expect(strategy.buildColumns(newIntegerProperty())).toBe(true);
  });

  it('should return false when calling suppress primary key creation', () => {
    expect(strategy.suppressPrimaryKeyCreation()).toBe(false);
  });
});

describe('when composing default, append parent context, append inline context, column namer ignores with context, make leaf columns nullable, suppress primary key creation from properties build strategies', () => {
  const parentContext: string = 'ParentContext';
  const inlineContext: string = 'InlineContext';
  let strategy: BuildStrategy;

  beforeAll(() => {
    strategy = BuildStrategyDefault
      .appendParentContext(parentContext)
      .appendInlineContext(inlineContext)
      .columnNamerIgnoresWithContext()
      .makeLeafColumnsNullable()
      .suppressPrimaryKeyCreationFromPropertiesStrategy();
  });

  it('should return parent context with inline context when calling parent context', () => {
    expect(strategy.parentContext()).toBe(parentContext + inlineContext);
  });

  it('should return make null column transform strategy when calling leaf columns', () => {
    expect(strategy.leafColumns(ColumnTransformUnchanged)).toBeInstanceOf(ColumnTransformMakeNull);
  });

  it('should use ignore with context column namer strategy', () => {
    const baseName: string = 'BaseName';
    expect(strategy.columnNamer(inlineContext, 'WithContext', baseName)()).toBe(inlineContext + baseName);
  });

  it('should return true when calling build columns', () => {
    expect(strategy.buildColumns(newIntegerProperty())).toBe(true);
  });

  it('should return true when calling suppress primary key creation', () => {
    expect(strategy.suppressPrimaryKeyCreation()).toBe(true);
  });
});

describe('when using skip path build strategy with no eligible property paths', () => {
  let strategy: BuildStrategy;

  beforeAll(() => {
    strategy = BuildStrategyDefault
      .skipPath([]);
  });

  it('should return empty string when calling parent context', () => {
    expect(strategy.parentContext()).toBe('');
  });

  it('should return same column transform strategy when calling leaf columns', () => {
    expect(strategy.leafColumns(ColumnTransformUnchanged)).toBe(ColumnTransformUnchanged);
  });

  it('should use default column namer strategy', () => {
    const inlineContext: string = 'InlineContext';
    const withContext: string = 'WithContext';
    const baseName: string = 'BaseName';
    expect(strategy.columnNamer(inlineContext, withContext, baseName)()).toBe(inlineContext + withContext + baseName);
  });

  it('should return true when calling build columns', () => {
    expect(strategy.buildColumns(newIntegerProperty())).toBe(true);
  });

  it('should return false when calling suppress primary key creation', () => {
    expect(strategy.suppressPrimaryKeyCreation()).toBe(false);
  });
});

describe('when composing skip path with no eligible property paths, append parent context, append inline context, column namer ignores with context, make leaf columns nullable, suppress primary key creation from properties build strategies', () => {
  const parentContext: string = 'ParentContext';
  const inlineContext: string = 'InlineContext';
  let strategy: BuildStrategy;

  beforeAll(() => {
    strategy = BuildStrategyDefault
      .skipPath([])
      .appendParentContext(parentContext)
      .appendInlineContext(inlineContext)
      .columnNamerIgnoresWithContext()
      .makeLeafColumnsNullable()
      .suppressPrimaryKeyCreationFromPropertiesStrategy();
  });

  it('should return parent context with inline context when calling parent context', () => {
    expect(strategy.parentContext()).toBe(parentContext + inlineContext);
  });

  it('should return make null column transform strategy when calling leaf columns', () => {
    expect(strategy.leafColumns(ColumnTransformUnchanged)).toBeInstanceOf(ColumnTransformMakeNull);
  });

  it('should use ignore with context column namer strategy', () => {
    const baseName: string = 'BaseName';
    expect(strategy.columnNamer(inlineContext, 'WithContext', baseName)()).toBe(inlineContext + baseName);
  });

  it('should return true when calling build columns', () => {
    expect(strategy.buildColumns(newIntegerProperty())).toBe(true);
  });

  it('should return true when calling suppress primary key creation', () => {
    expect(strategy.suppressPrimaryKeyCreation()).toBe(true);
  });
});

describe('when composing skip path with eligible property paths, append parent context, append inline context, column namer ignores with context, make leaf columns nullable, suppress primary key creation from properties build strategies', () => {
  const integerPropertyPathName: string = 'IntegerPropertyPathName';
  const parentContext: string = 'ParentContext';
  const inlineContext: string = 'InlineContext';
  let strategy: BuildStrategy;

  beforeAll(() => {
    strategy = BuildStrategyDefault
      .skipPath([[integerPropertyPathName]])
      .appendParentContext(parentContext)
      .appendInlineContext(inlineContext)
      .columnNamerIgnoresWithContext()
      .makeLeafColumnsNullable()
      .suppressPrimaryKeyCreationFromPropertiesStrategy();
  });

  it('should return parent context with inline context when calling parent context', () => {
    expect(strategy.parentContext()).toBe(parentContext + inlineContext);
  });

  it('should return make null column transform strategy when calling leaf columns', () => {
    expect(strategy.leafColumns(ColumnTransformUnchanged)).toBeInstanceOf(ColumnTransformMakeNull);
  });

  it('should use ignore with context column namer strategy', () => {
    const baseName: string = 'BaseName';
    expect(strategy.columnNamer(inlineContext, 'WithContext', baseName)()).toBe(inlineContext + baseName);
  });

  it('should return true when calling build columns', () => {
    // NOTE: This would be false if the skip path decorator wasn't removing itself from the decorator chain. see SkipPathStrategy class in BuildStrategy
    const integerProperty = Object.assign(newIntegerProperty(), { propertyPathName: integerPropertyPathName });
    expect(strategy.buildColumns(integerProperty)).toBe(true);
  });

  it('should return true when calling suppress primary key creation', () => {
    expect(strategy.suppressPrimaryKeyCreation()).toBe(true);
  });
});

describe('when composing skip path with eligible property paths, append parent context, append inline context, column namer ignores with context, make leaf columns nullable, suppress primary key creation from properties build strategies', () => {
  const integerPropertyPathName: string = 'IntegerPropertyPathName';
  const parentContext: string = 'ParentContext';
  const inlineContext: string = 'InlineContext';
  let strategy: BuildStrategy;

  beforeAll(() => {
    strategy = BuildStrategyDefault
      .skipPath([[integerPropertyPathName, 'PropertyName']])
      .appendParentContext(parentContext)
      .appendInlineContext(inlineContext)
      .columnNamerIgnoresWithContext()
      .makeLeafColumnsNullable()
      .suppressPrimaryKeyCreationFromPropertiesStrategy();
  });

  it('should return parent context with inline context when calling parent context', () => {
    expect(strategy.parentContext()).toBe(parentContext + inlineContext);
  });

  it('should return make null column transform strategy when calling leaf columns', () => {
    expect(strategy.leafColumns(ColumnTransformUnchanged)).toBeInstanceOf(ColumnTransformMakeNull);
  });

  it('should use ignore with context column namer strategy', () => {
    const baseName: string = 'BaseName';
    expect(strategy.columnNamer(inlineContext, 'WithContext', baseName)()).toBe(inlineContext + baseName);
  });

  it('should return true when calling build columns', () => {
    const integerProperty = Object.assign(newIntegerProperty(), { propertyPathName: integerPropertyPathName });
    expect(strategy.buildColumns(integerProperty)).toBe(true);
  });

  it('should return true when calling suppress primary key creation', () => {
    expect(strategy.suppressPrimaryKeyCreation()).toBe(true);
  });
});
