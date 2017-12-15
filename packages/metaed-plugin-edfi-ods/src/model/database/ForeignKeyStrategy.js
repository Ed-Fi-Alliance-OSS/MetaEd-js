// @flow
/* eslint-disable class-methods-use-this, no-use-before-define */
import type { Column } from './Column';

export class ForeignKeyStrategy {
  _decoratedStrategy: ForeignKeyStrategy;

  static foreignColumnRename(foreignColumnName: string): ForeignKeyStrategy {
    return new RenameForeignColumn(ForeignKeyStrategyDefault, foreignColumnName);
  }

  static foreignColumnCascade(deleteCascade: boolean, updateCascade: boolean): ForeignKeyStrategy {
    if (deleteCascade && updateCascade) return ForeignKeyStrategyUpdateDeleteCascade;
    if (deleteCascade) return ForeignKeyStrategyDeleteCascade;
    if (updateCascade) return ForeignKeyStrategyUpdateCascade;
    return ForeignKeyStrategyDefault;
  }

  hasDeleteCascade() { return false; }
  hasUpdateCascade() { return false; }
  parentColumnName(column: Column) { return column.name; }
  foreignColumnName(column: Column) { return column.name; }
}

class AddDeleteCascade extends ForeignKeyStrategy {
  constructor(decoratedStrategy: ForeignKeyStrategy) {
    super();
    this._decoratedStrategy = decoratedStrategy;
  }

  hasDeleteCascade() { return true; }
  hasUpdateCascade() { return this._decoratedStrategy.hasUpdateCascade(); }
  parentColumnName(column: Column) { return this._decoratedStrategy.parentColumnName(column); }
  foreignColumnName(column: Column) { return this._decoratedStrategy.foreignColumnName(column); }
}

class AddUpdateCascade extends ForeignKeyStrategy {
  constructor(decoratedStrategy: ForeignKeyStrategy) {
    super();
    this._decoratedStrategy = decoratedStrategy;
  }

  hasDeleteCascade() { return this._decoratedStrategy.hasDeleteCascade(); }
  hasUpdateCascade() { return true; }
  parentColumnName(column: Column) { return this._decoratedStrategy.parentColumnName(column); }
  foreignColumnName(column: Column) { return this._decoratedStrategy.foreignColumnName(column); }
}

class RenameForeignColumn extends ForeignKeyStrategy {
  _foreignColumnName: string;

  constructor(decoratedStrategy: ForeignKeyStrategy, foreignColumnName: string) {
    super();
    this._decoratedStrategy = decoratedStrategy;
    this._foreignColumnName = foreignColumnName;
  }

  hasDeleteCascade() { return this._decoratedStrategy.hasDeleteCascade(); }
  hasUpdateCascade() { return this._decoratedStrategy.hasUpdateCascade(); }
  parentColumnName(column: Column) { return this._decoratedStrategy.parentColumnName(column); }
  // eslint-disable-next-line no-unused-vars,
  foreignColumnName(column: Column) { return this._foreignColumnName; }
}

export const ForeignKeyStrategyDefault: ForeignKeyStrategy = new ForeignKeyStrategy();
export const ForeignKeyStrategyDeleteCascade: ForeignKeyStrategy = new AddDeleteCascade(ForeignKeyStrategyDefault);
export const ForeignKeyStrategyUpdateCascade: ForeignKeyStrategy = new AddUpdateCascade(ForeignKeyStrategyDefault);
export const ForeignKeyStrategyUpdateDeleteCascade: ForeignKeyStrategy = new AddUpdateCascade(ForeignKeyStrategyDeleteCascade);
