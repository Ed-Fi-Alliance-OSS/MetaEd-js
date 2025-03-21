// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/* eslint-disable class-methods-use-this, no-use-before-define, max-classes-per-file */
import { Column } from './Column';

export class ForeignKeyStrategy {
  myDecoratedStrategy: ForeignKeyStrategy;

  static foreignColumnIdChange(foreignColumnId: string): ForeignKeyStrategy {
    return new ChangeForeignColumnId(ForeignKeyStrategyDefault, foreignColumnId);
  }

  static foreignColumnCascade(deleteCascade: boolean, updateCascade: boolean): ForeignKeyStrategy {
    if (deleteCascade && updateCascade) return ForeignKeyStrategyUpdateDeleteCascade;
    if (deleteCascade) return ForeignKeyStrategyDeleteCascade;
    if (updateCascade) return ForeignKeyStrategyUpdateCascade;
    return ForeignKeyStrategyDefault;
  }

  hasDeleteCascade() {
    return false;
  }

  hasUpdateCascade() {
    return false;
  }

  parentColumnId(column: Column) {
    return column.columnId;
  }

  foreignColumnId(column: Column) {
    return column.columnId;
  }
}

class AddDeleteCascade extends ForeignKeyStrategy {
  constructor(decoratedStrategy: ForeignKeyStrategy) {
    super();
    this.myDecoratedStrategy = decoratedStrategy;
  }

  hasDeleteCascade() {
    return true;
  }

  hasUpdateCascade() {
    return this.myDecoratedStrategy.hasUpdateCascade();
  }

  parentColumnId(column: Column) {
    return this.myDecoratedStrategy.parentColumnId(column);
  }

  foreignColumnId(column: Column) {
    return this.myDecoratedStrategy.foreignColumnId(column);
  }
}

class AddUpdateCascade extends ForeignKeyStrategy {
  constructor(decoratedStrategy: ForeignKeyStrategy) {
    super();
    this.myDecoratedStrategy = decoratedStrategy;
  }

  hasDeleteCascade() {
    return this.myDecoratedStrategy.hasDeleteCascade();
  }

  hasUpdateCascade() {
    return true;
  }

  parentColumnId(column: Column) {
    return this.myDecoratedStrategy.parentColumnId(column);
  }

  foreignColumnId(column: Column) {
    return this.myDecoratedStrategy.foreignColumnId(column);
  }
}

class ChangeForeignColumnId extends ForeignKeyStrategy {
  myForeignColumnId: string;

  constructor(decoratedStrategy: ForeignKeyStrategy, foreignColumnId: string) {
    super();
    this.myDecoratedStrategy = decoratedStrategy;
    this.myForeignColumnId = foreignColumnId;
  }

  hasDeleteCascade() {
    return this.myDecoratedStrategy.hasDeleteCascade();
  }

  hasUpdateCascade() {
    return this.myDecoratedStrategy.hasUpdateCascade();
  }

  parentColumnId(column: Column) {
    return this.myDecoratedStrategy.parentColumnId(column);
  }

  foreignColumnId(_column: Column) {
    return this.myForeignColumnId;
  }
}

export const ForeignKeyStrategyDefault: ForeignKeyStrategy = new ForeignKeyStrategy();
export const ForeignKeyStrategyDeleteCascade: ForeignKeyStrategy = new AddDeleteCascade(ForeignKeyStrategyDefault);
export const ForeignKeyStrategyUpdateCascade: ForeignKeyStrategy = new AddUpdateCascade(ForeignKeyStrategyDefault);
export const ForeignKeyStrategyUpdateDeleteCascade: ForeignKeyStrategy = new AddUpdateCascade(
  ForeignKeyStrategyDeleteCascade,
);
