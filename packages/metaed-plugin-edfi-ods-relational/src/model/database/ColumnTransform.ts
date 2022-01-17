/* eslint-disable class-methods-use-this, no-use-before-define, max-classes-per-file */
import { EntityProperty } from '@edfi/metaed-core';
import { addMergedReferenceContext, cloneColumn, ColumnNameComponent, newColumnNameComponent } from './Column';
import { Column } from './Column';

export class ColumnTransform {
  myDecoratedStrategy: ColumnTransform | null;

  constructor(decoratedStrategy: ColumnTransform | null = null) {
    this.myDecoratedStrategy = decoratedStrategy;
  }

  static primaryKeyRoleName(property: EntityProperty): ColumnTransform {
    return new PrefixRoleName(ColumnTransformPrimaryKey, property);
  }

  static primaryKeyRoleNameCollapsible(property: EntityProperty): ColumnTransform {
    return new ColumnTransformPrefixRoleNameCollapsible(ColumnTransformPrimaryKey, property);
  }

  static primaryKeyWithNewReferenceContext(referenceContext: string): ColumnTransform {
    return new ColumnTransformPrependReferenceContext(ColumnTransformPrimaryKey, referenceContext);
  }

  static notNullRoleName(property: EntityProperty): ColumnTransform {
    return new PrefixRoleName(ColumnTransformNotNull, property);
  }

  static nullRoleName(property: EntityProperty): ColumnTransform {
    return new PrefixRoleName(ColumnTransformNull, property);
  }

  static myInvertStrategies(strategyStack: ColumnTransform[], strategy: ColumnTransform | null): void {
    if (strategy == null) return;
    strategyStack.push(strategy);
    ColumnTransform.myInvertStrategies(strategyStack, strategy.myDecoratedStrategy);
  }

  static myTransformTopOfStack(strategyStack: ColumnTransform[], originalColumns: Column[]): Column[] {
    if (strategyStack.length === 0) return originalColumns;

    const currentStrategy: ColumnTransform = strategyStack.pop() as ColumnTransform;

    const newColumns: Column[] = originalColumns.map((x) => cloneColumn(x));
    newColumns.forEach((column: Column) => currentStrategy.transformSingle(column));

    return ColumnTransform.myTransformTopOfStack(strategyStack, newColumns);
  }

  transform(originalColumns: Column[]): Column[] {
    const invertStrategies = [];
    ColumnTransform.myInvertStrategies(invertStrategies, this);
    return ColumnTransform.myTransformTopOfStack(invertStrategies, originalColumns);
  }

  // @ts-ignore,
  transformSingle(column: Column): void {
    /* noop */
  }
}

class PrefixRoleName extends ColumnTransform {
  myProperty: EntityProperty;

  constructor(decoratedStrategy: ColumnTransform, property: EntityProperty) {
    super(decoratedStrategy);
    this.myProperty = property;
  }

  transformSingle(column: Column): void {
    const contextPrefix = this.myProperty.data.edfiOdsRelational.odsContextPrefix || '';
    const contextPrefixNameComponent: ColumnNameComponent = {
      ...newColumnNameComponent(),
      name: contextPrefix,
      isParentPropertyContext: true,
      sourceProperty: this.myProperty,
    };
    column.nameComponents = [contextPrefixNameComponent, ...column.nameComponents];
    column.columnId = contextPrefix + column.columnId;
  }
}

class ColumnTransformPrefixRoleNameCollapsible extends ColumnTransform {
  myProperty: EntityProperty;

  constructor(decoratedStrategy: ColumnTransform, property: EntityProperty) {
    super(decoratedStrategy);
    this.myProperty = property;
  }

  transformSingle(column: Column): void {
    const contextPrefix = this.myProperty.data.edfiOdsRelational.odsContextPrefix || '';
    if (column.originalContextPrefix !== contextPrefix) {
      const contextPrefixNameComponent: ColumnNameComponent = {
        ...newColumnNameComponent(),
        name: contextPrefix,
        isParentPropertyContext: true,
        sourceProperty: this.myProperty,
      };

      column.nameComponents = [contextPrefixNameComponent, ...column.nameComponents];
      column.columnId = contextPrefix + column.columnId;
    }
  }
}

class ColumnTransformPrependReferenceContext extends ColumnTransform {
  myNewReferenceContext: string;

  constructor(decoratedStrategy: ColumnTransform, newReferenceContext: string) {
    super(decoratedStrategy);
    this.myNewReferenceContext = newReferenceContext;
  }

  transformSingle(column: Column): void {
    column.referenceContext = this.myNewReferenceContext + column.referenceContext;
    addMergedReferenceContext(column, column.referenceContext);
  }
}

class ColumnTransformMakePrimaryKey extends ColumnTransform {
  transformSingle(column: Column): void {
    Object.assign(column, {
      isPartOfPrimaryKey: true,
      isNullable: false,
      isIdentityDatabaseType: false,
    });
  }
}

class ColumnTransformMakeNotNull extends ColumnTransform {
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
