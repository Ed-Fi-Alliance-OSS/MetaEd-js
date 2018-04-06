// @flow
/* eslint-disable class-methods-use-this, no-use-before-define */
import { appendOverlapping } from '../../shared/Utility';
import { addMergedReferenceContext, cloneColumn } from './Column';
import type { Column } from './Column';

export class ColumnTransform {
  _decoratedStrategy: ?ColumnTransform;

  constructor(decoratedStrategy: ?ColumnTransform = null) {
    this._decoratedStrategy = decoratedStrategy;
  }

  static withContext(contextPrefix: string): ColumnTransform {
    return new PrefixWithContext(ColumnTransformUnchanged, contextPrefix);
  }

  static primaryKeyWithContext(contextPrefix: string): ColumnTransform {
    return new PrefixWithContext(ColumnTransformPrimaryKey, contextPrefix);
  }

  static primaryKeyWithContextCollapsible(contextPrefix: string): ColumnTransform {
    return new ColumnTransformPrefixWithContextCollapsible(ColumnTransformPrimaryKey, contextPrefix);
  }

  static primaryKeyWithNewReferenceContext(referenceContext: string): ColumnTransform {
    return new ColumnTransformPrependReferenceContext(ColumnTransformPrimaryKey, referenceContext);
  }

  static primaryKeyWithContextCollapsibleAndNewReferenceContext(
    contextPrefix: string,
    referenceContext: string,
  ): ColumnTransform {
    return new ColumnTransformPrependReferenceContext(
      ColumnTransform.primaryKeyWithContextCollapsible(contextPrefix),
      referenceContext,
    );
  }

  static notNullWithContext(contextPrefix: string): ColumnTransform {
    return new PrefixWithContext(ColumnTransformNotNull, contextPrefix);
  }

  static nullWithContext(contextPrefix: string): ColumnTransform {
    return new PrefixWithContext(ColumnTransformNull, contextPrefix);
  }

  static _invertStrategies(strategyStack: Array<ColumnTransform>, strategy: ?ColumnTransform): void {
    if (strategy == null) return;
    strategyStack.push(strategy);
    ColumnTransform._invertStrategies(strategyStack, strategy._decoratedStrategy);
  }

  static _transformTopOfStack(strategyStack: Array<ColumnTransform>, originalColumns: Array<Column>): Array<Column> {
    if (strategyStack.length === 0) return originalColumns;

    const currentStrategy = strategyStack.pop();

    const newColumns: Array<Column> = originalColumns.map(x => cloneColumn(x));
    newColumns.forEach((column: Column) => currentStrategy.transformSingle(column));

    return ColumnTransform._transformTopOfStack(strategyStack, newColumns);
  }

  transform(originalColumns: Array<Column>): Array<Column> {
    const invertStrategies = [];
    ColumnTransform._invertStrategies(invertStrategies, this);
    return ColumnTransform._transformTopOfStack(invertStrategies, originalColumns);
  }

  // eslint-disable-next-line no-unused-vars,
  transformSingle(column: Column): void {
    /* noop */
  }
}

export class PrefixWithContext extends ColumnTransform {
  _contextPrefix: string;

  constructor(decoratedStrategy: ColumnTransform, contextPrefix: string) {
    super(decoratedStrategy);
    this._contextPrefix = contextPrefix != null ? contextPrefix : '';
  }

  transformSingle(column: Column): void {
    column.name = appendOverlapping(this._contextPrefix, column.name);
  }
}

export class ColumnTransformPrefixWithContextCollapsible extends ColumnTransform {
  _contextPrefix: string;

  constructor(decoratedStrategy: ColumnTransform, contextPrefix: string) {
    super(decoratedStrategy);
    this._contextPrefix = contextPrefix != null ? contextPrefix : '';
  }

  transformSingle(column: Column): void {
    column.name =
      column.originalContextPrefix === this._contextPrefix
        ? column.name
        : appendOverlapping(this._contextPrefix, column.name);
  }
}

export class ColumnTransformPrependReferenceContext extends ColumnTransform {
  _newReferenceContext: string;

  constructor(decoratedStrategy: ColumnTransform, newReferenceContext: string) {
    super(decoratedStrategy);
    this._newReferenceContext = newReferenceContext;
  }

  transformSingle(column: Column): void {
    column.referenceContext = this._newReferenceContext + column.referenceContext;
    addMergedReferenceContext(column, column.referenceContext);
  }
}

export class ColumnTransformMakePrimaryKey extends ColumnTransform {
  transformSingle(column: Column): void {
    Object.assign(column, {
      isPartOfPrimaryKey: true,
      isNullable: false,
      isIdentityDatabaseType: false,
    });
  }
}

export class ColumnTransformMakeNotNull extends ColumnTransform {
  transformSingle(column: Column): void {
    Object.assign(column, {
      isPartOfPrimaryKey: false,
      isNullable: false,
      isIdentityDatabaseType: false,
    });
  }
}

export class ColumnTransformMakeNull extends ColumnTransform {
  transformSingle(column: Column): void {
    Object.assign(column, {
      isPartOfPrimaryKey: false,
      isNullable: true,
      isIdentityDatabaseType: false,
    });
  }
}

export const ColumnTransformUnchanged: ColumnTransform = new ColumnTransform();
export const ColumnTransformPrimaryKey: ColumnTransform = new ColumnTransformMakePrimaryKey(ColumnTransformUnchanged);
export const ColumnTransformNotNull: ColumnTransform = new ColumnTransformMakeNotNull(ColumnTransformUnchanged);
export const ColumnTransformNull: ColumnTransform = new ColumnTransformMakeNull(ColumnTransformUnchanged);
