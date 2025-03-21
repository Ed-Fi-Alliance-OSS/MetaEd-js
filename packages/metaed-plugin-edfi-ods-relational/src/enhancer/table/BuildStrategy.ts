// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/* eslint-disable class-methods-use-this, no-use-before-define, max-classes-per-file */
import { EntityProperty } from '@edfi/metaed-core';
import { ColumnTransformMakeNull } from '../../model/database/ColumnTransform';
import { ColumnTransform } from '../../model/database/ColumnTransform';
import { ColumnNameComponent, newColumnNameComponent, ColumnNaming } from '../../model/database/Column';

function defaultColumnNamer(
  parentContext: string,
  parentContextProperties: EntityProperty[],
  roleName: string,
  roleNameColumnNameComponent: ColumnNameComponent,
  baseName: string,
  baseNameColumnNameComponent: ColumnNameComponent,
): () => ColumnNaming {
  return () => {
    const nameComponents: ColumnNameComponent[] = [];
    parentContextProperties.forEach((parentContextProperty) => {
      if (parentContextProperty.data.edfiOdsRelational.odsContextPrefix !== '') {
        nameComponents.push({
          ...newColumnNameComponent(),
          name: parentContextProperty.data.edfiOdsRelational.odsContextPrefix,
          isParentPropertyContext: true,
        });
      }
    });
    if (roleName !== '') nameComponents.push(roleNameColumnNameComponent);
    if (baseName !== '') nameComponents.push(baseNameColumnNameComponent);

    return {
      columnId: parentContext + roleName + baseName,
      nameComponents,
    };
  };
}

function roleNameIgnoringColumnNamer(
  parentContext: string,
  parentContextProperties: EntityProperty[],
  baseName: string,
  baseNameColumnNameComponent: ColumnNameComponent,
): () => ColumnNaming {
  return () => {
    const nameComponents: ColumnNameComponent[] = [];
    parentContextProperties.forEach((parentContextProperty) => {
      if (parentContextProperty.data.edfiOdsRelational.odsContextPrefix !== '') {
        nameComponents.push({
          ...newColumnNameComponent(),
          name: parentContextProperty.data.edfiOdsRelational.odsContextPrefix,
          isParentPropertyContext: true,
        });
      }
    });
    if (baseName !== '') nameComponents.push(baseNameColumnNameComponent);

    return {
      columnId: parentContext + baseName,
      nameComponents,
    };
  };
}

export class BuildStrategy {
  myDecoratedStrategy: BuildStrategy | null;

  constructor(decoratedStrategy: BuildStrategy | null = null) {
    this.myDecoratedStrategy = decoratedStrategy;
  }

  parentContext(): string {
    return this.myDecoratedStrategy != null ? this.myDecoratedStrategy.parentContext() : '';
  }

  parentContextProperties(): EntityProperty[] {
    return this.myDecoratedStrategy != null ? this.myDecoratedStrategy.parentContextProperties() : [];
  }

  leafColumns(strategy: ColumnTransform): ColumnTransform {
    return this.myDecoratedStrategy != null ? this.myDecoratedStrategy.leafColumns(strategy) : strategy;
  }

  columnNamer(
    parentContext: string,
    parentContextProperties: EntityProperty[],
    roleName: string,
    roleNameColumnNameComponent: ColumnNameComponent,
    baseName: string,
    baseNameColumnNameComponent: ColumnNameComponent,
  ): () => ColumnNaming {
    return this.myDecoratedStrategy != null
      ? this.myDecoratedStrategy.columnNamer(
          parentContext,
          parentContextProperties,
          roleName,
          roleNameColumnNameComponent,
          baseName,
          baseNameColumnNameComponent,
        )
      : defaultColumnNamer(
          parentContext,
          parentContextProperties,
          roleName,
          roleNameColumnNameComponent,
          baseName,
          baseNameColumnNameComponent,
        );
  }

  buildColumns(property: EntityProperty): boolean {
    return this.myDecoratedStrategy != null ? this.myDecoratedStrategy.buildColumns(property) : true;
  }

  suppressPrimaryKeyCreation(): boolean {
    return this.myDecoratedStrategy != null ? this.myDecoratedStrategy.suppressPrimaryKeyCreation() : false;
  }

  // #region strategy configuration methods
  columnNamerIgnoresRoleName(): BuildStrategy {
    return new ColumnNamerIgnoresRoleNameStrategy(this);
  }

  appendParentContextProperty(property: EntityProperty): BuildStrategy {
    return new AppendParentContextPropertyStrategy(this, property);
  }

  skipPath(eligiblePropertyPaths: string[][]): BuildStrategy {
    return new SkipPathStrategy(this, eligiblePropertyPaths);
  }
  // #endregion strategy configuration methods

  static filterOutLeafColumnsNullable(previous: BuildStrategy, current: BuildStrategy | null): void {
    if (current == null) return;
    if (current instanceof MakeLeafColumnNullableStrategy) {
      previous.myDecoratedStrategy = current.myDecoratedStrategy;
      BuildStrategy.filterOutLeafColumnsNullable(previous, current.myDecoratedStrategy);
    } else {
      BuildStrategy.filterOutLeafColumnsNullable(current, current.myDecoratedStrategy);
    }
  }

  static filterOutSuppressPrimaryKeyCreationFromProperties(previous: BuildStrategy, current: BuildStrategy | null): void {
    if (current == null) return;
    if (current instanceof SuppressPrimaryKeyCreationFromPropertiesStrategy) {
      previous.myDecoratedStrategy = current.myDecoratedStrategy;
      BuildStrategy.filterOutSuppressPrimaryKeyCreationFromProperties(previous, current.myDecoratedStrategy);
    } else {
      BuildStrategy.filterOutSuppressPrimaryKeyCreationFromProperties(current, current.myDecoratedStrategy);
    }
  }

  suppressPrimaryKeyCreationFromPropertiesStrategy(): BuildStrategy {
    return new SuppressPrimaryKeyCreationFromPropertiesStrategy(this);
  }

  undoSuppressPrimaryKeyCreationFromProperties(): BuildStrategy {
    if (this instanceof SuppressPrimaryKeyCreationFromPropertiesStrategy) {
      return this.myDecoratedStrategy == null ? this : this.myDecoratedStrategy;
    }
    BuildStrategy.filterOutSuppressPrimaryKeyCreationFromProperties(this, this.myDecoratedStrategy);
    return this;
  }

  makeLeafColumnsNullable(): BuildStrategy {
    return new MakeLeafColumnNullableStrategy(this);
  }

  undoLeafColumnsNullable(): BuildStrategy {
    if (this instanceof MakeLeafColumnNullableStrategy) {
      return this.myDecoratedStrategy == null ? this : this.myDecoratedStrategy;
    }
    BuildStrategy.filterOutLeafColumnsNullable(this, this.myDecoratedStrategy);
    return this;
  }
}

class AppendParentContextPropertyStrategy extends BuildStrategy {
  myParentContextProperty: EntityProperty;

  constructor(decoratedStrategy: BuildStrategy | null, parentContextProperty: EntityProperty) {
    super(decoratedStrategy);
    this.myParentContextProperty = parentContextProperty;
  }

  parentContext(): string {
    return super.parentContext() + this.myParentContextProperty.data.edfiOdsRelational.odsContextPrefix;
  }

  parentContextProperties(): EntityProperty[] {
    return super.parentContextProperties().concat(this.myParentContextProperty);
  }
}

class ColumnNamerIgnoresRoleNameStrategy extends BuildStrategy {
  columnNamer(
    parentContext: string,
    parentContextProperties: EntityProperty[],
    _roleName: string,
    _roleNameColumnNameComponent: ColumnNameComponent,
    baseName: string,
    baseNameColumnNameComponent: ColumnNameComponent,
  ): () => ColumnNaming {
    return roleNameIgnoringColumnNamer(parentContext, parentContextProperties, baseName, baseNameColumnNameComponent);
  }
}

class MakeLeafColumnNullableStrategy extends BuildStrategy {
  leafColumns(strategy: ColumnTransform): ColumnTransform {
    return new ColumnTransformMakeNull(strategy);
  }
}

// NOTE: getDecoratedStrategy() returns a reference to the previous decorator rather than itself.
// The result is that if skip path is not called last the skip path decorator is removed from the decorator chain
// and skip path's buildColumns method is never called.
class SkipPathStrategy extends BuildStrategy {
  myEligiblePropertyPaths: string[][];

  onPathPropertyPaths: string[][];

  constructor(decoratedStrategy: BuildStrategy | null, eligiblePropertyPaths: string[][]) {
    super(decoratedStrategy);
    this.myEligiblePropertyPaths = eligiblePropertyPaths;
  }

  buildColumns(property: EntityProperty): boolean {
    this.onPathPropertyPaths = this.myEligiblePropertyPaths.filter(
      (x) => x.length > 0 && x[0] === property.fullPropertyName,
    );
    return this.onPathPropertyPaths.length === 0 || this.onPathPropertyPaths.some((x) => x.length > 1);
  }

  // #region strategy configuration methods
  getDecoratedStrategy(): BuildStrategy | null {
    return this.onPathPropertyPaths != null && this.onPathPropertyPaths.length > 0
      ? new SkipPathStrategy(
          this.myDecoratedStrategy,
          this.onPathPropertyPaths.map((x) => x.slice(1)),
        )
      : this.myDecoratedStrategy;
  }

  columnNamerIgnoresRoleName(): BuildStrategy {
    const strategy = this.getDecoratedStrategy();
    return new ColumnNamerIgnoresRoleNameStrategy(strategy);
  }

  appendParentContextProperty(property: EntityProperty): BuildStrategy {
    const strategy = this.getDecoratedStrategy();
    return new AppendParentContextPropertyStrategy(strategy, property);
  }

  skipPath(eligiblePropertyPaths: string[][]): BuildStrategy {
    const strategy = this.getDecoratedStrategy();
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
