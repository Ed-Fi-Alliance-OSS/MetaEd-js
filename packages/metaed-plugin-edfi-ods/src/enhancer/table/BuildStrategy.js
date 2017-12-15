// @flow
/* eslint-disable class-methods-use-this, no-use-before-define */
import type { EntityProperty } from 'metaed-core';
import { defaultColumnNamer, withContextIgnoringColumnNamer } from '../../model/database/ColumnNamer';
import { ColumnTransformMakeNull } from '../../model/database/ColumnTransform';
import type { ColumnNamer } from '../../model/database/ColumnNamer';
import type { ColumnTransform } from '../../model/database/ColumnTransform';

export class BuildStrategy {
  _decoratedStrategy: ?BuildStrategy;

  constructor(decoratedStrategy: ?BuildStrategy = null) {
    this._decoratedStrategy = decoratedStrategy;
  }

  parentContext(): string {
    return this._decoratedStrategy != null ? this._decoratedStrategy.parentContext() : '';
  }

  leafColumns(strategy: ColumnTransform): ColumnTransform {
    return this._decoratedStrategy != null ? this._decoratedStrategy.leafColumns(strategy) : strategy;
  }

  columnNamer(inlineContext: string, withContext: string, baseName: string): ColumnNamer {
    return this._decoratedStrategy != null
      ? this._decoratedStrategy.columnNamer(inlineContext, withContext, baseName)
      : defaultColumnNamer(inlineContext, withContext, baseName);
  }

  buildColumns(property: EntityProperty): boolean {
    return this._decoratedStrategy != null ? this._decoratedStrategy.buildColumns(property) : true;
  }

  suppressPrimaryKeyCreation(): boolean {
    return this._decoratedStrategy != null ? this._decoratedStrategy.suppressPrimaryKeyCreation() : false;
  }

  // #region strategy configuration methods
  columnNamerIgnoresWithContext(): BuildStrategy {
    return new ColumnNamerIgnoresWithContextStrategy(this);
  }

  appendParentContext(context: string): BuildStrategy {
    return new AppendParentContextStrategy(this, context);
  }

  appendInlineContext(context: string): BuildStrategy {
    return new AppendInlineContextStrategy(this, context);
  }

  skipPath(eligiblePropertyPaths: Array<Array<string>>): BuildStrategy {
    return new SkipPathStrategy(this, eligiblePropertyPaths);
  }
  // #endregion strategy configuration methods

  static _filterOutLeafColumnsNullable(previous: BuildStrategy, current: ?BuildStrategy): void {
    if (current == null) return;
    if (current instanceof MakeLeafColumnNullableStrategy) {
      previous._decoratedStrategy = current._decoratedStrategy;
      BuildStrategy._filterOutLeafColumnsNullable(previous, current._decoratedStrategy);
    } else {
      BuildStrategy._filterOutLeafColumnsNullable(current, current._decoratedStrategy);
    }
  }

  static _filterOutSuppressPrimaryKeyCreationFromProperties(previous: BuildStrategy, current: ?BuildStrategy): void {
    if (current == null) return;
    if (current instanceof SuppressPrimaryKeyCreationFromPropertiesStrategy) {
      previous._decoratedStrategy = current._decoratedStrategy;
      BuildStrategy._filterOutSuppressPrimaryKeyCreationFromProperties(previous, current._decoratedStrategy);
    } else {
      BuildStrategy._filterOutSuppressPrimaryKeyCreationFromProperties(current, current._decoratedStrategy);
    }
  }

  suppressPrimaryKeyCreationFromPropertiesStrategy(): BuildStrategy {
    return new SuppressPrimaryKeyCreationFromPropertiesStrategy(this);
  }

  undoSuppressPrimaryKeyCreationFromProperties(): ?BuildStrategy {
    if (this instanceof SuppressPrimaryKeyCreationFromPropertiesStrategy) return this._decoratedStrategy;
    BuildStrategy._filterOutSuppressPrimaryKeyCreationFromProperties(this, this._decoratedStrategy);
    return this;
  }

  makeLeafColumnsNullable(): BuildStrategy {
    return new MakeLeafColumnNullableStrategy(this);
  }

  undoLeafColumnsNullable(): ?BuildStrategy {
    if (this instanceof MakeLeafColumnNullableStrategy) return this._decoratedStrategy;
    BuildStrategy._filterOutLeafColumnsNullable(this, this._decoratedStrategy);
    return this;
  }
}

class AppendParentContextStrategy extends BuildStrategy {
  _parentContextAppend: string;

  constructor(decoratedStrategy: ?BuildStrategy, parentContextAppend: string) {
    super(decoratedStrategy);
    this._parentContextAppend = parentContextAppend;
  }

  parentContext(): string {
    return super.parentContext() + this._parentContextAppend;
  }
}

class AppendInlineContextStrategy extends BuildStrategy {
  _inlineContextAppend: string;

  constructor(decoratedStrategy: ?BuildStrategy, inlineContextAppend: string) {
    super(decoratedStrategy);
    this._inlineContextAppend = inlineContextAppend;
  }

  parentContext(): string {
    return super.parentContext() + this._inlineContextAppend;
  }
}

class ColumnNamerIgnoresWithContextStrategy extends BuildStrategy {
  columnNamer(inlineContext: string, withContext: string, baseName: string): ColumnNamer {
    return withContextIgnoringColumnNamer(inlineContext, baseName);
  }
}

class MakeLeafColumnNullableStrategy extends BuildStrategy {
  leafColumns(strategy: ColumnTransform): ColumnTransform {
    return new ColumnTransformMakeNull(strategy);
  }
}

// NOTE: _getDecoratedStrategy() returns a reference to the previous decorator rather than itself.
// The result is that if skip path is not called last the skip path decorator is removed from the decorator chain
// and skip path's buildColumns method is never called.
class SkipPathStrategy extends BuildStrategy {
  _eligiblePropertyPaths: Array<Array<string>>;
  _onPathPropertyPaths: Array<Array<string>>;

  constructor(decoratedStrategy: ?BuildStrategy, eligiblePropertyPaths: Array<Array<string>>) {
    super(decoratedStrategy);
    this._eligiblePropertyPaths = eligiblePropertyPaths;
  }

  buildColumns(property: EntityProperty): boolean {
    this._onPathPropertyPaths = this._eligiblePropertyPaths.filter(x => x.length > 0 && x[0] === property.propertyPathName);
    return this._onPathPropertyPaths.length === 0 || this._onPathPropertyPaths.some(x => x.length > 1);
  }

  // #region strategy configuration methods
  _getDecoratedStrategy(): ?BuildStrategy {
    return this._onPathPropertyPaths != null && this._onPathPropertyPaths.length > 0
      ? new SkipPathStrategy(this._decoratedStrategy, this._onPathPropertyPaths.map(x => x.slice(1)))
      : this._decoratedStrategy;
  }

  columnNamerIgnoresWithContext(): BuildStrategy {
    const strategy = this._getDecoratedStrategy();
    return new ColumnNamerIgnoresWithContextStrategy(strategy);
  }

  appendParentContext(context: string): BuildStrategy {
    const strategy = this._getDecoratedStrategy();
    return new AppendParentContextStrategy(strategy, context);
  }

  appendInlineContext(context: string): BuildStrategy {
    const strategy = this._getDecoratedStrategy();
    return new AppendInlineContextStrategy(strategy, context);
  }

  skipPath(eligiblePropertyPaths: Array<Array<string>>): BuildStrategy {
    const strategy = this._getDecoratedStrategy();
    return new SkipPathStrategy(strategy, eligiblePropertyPaths);
  }
  // #endregion strategy configuration methods
}

class SuppressPrimaryKeyCreationFromPropertiesStrategy extends BuildStrategy {
  suppressPrimaryKeyCreation(): boolean {
    return true;
  }
}

export const BuildStrategyDefault: BuildStrategy = new BuildStrategy();
