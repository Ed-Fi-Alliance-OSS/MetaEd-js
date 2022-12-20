import * as R from 'ramda';
import { Column, newColumnNameComponent } from '../model/database/Column';
import { ColumnPair } from '../model/database/ColumnPair';
import { ForeignKey } from '../model/database/ForeignKey';
import { Table } from '../model/database/Table';

export function rewriteForeignKeyId(
  table: Table,
  foreignTableId: string,
  foreignColumnId: string,
  newForeignColumnId: string,
  parentColumnId: string,
  newParentColumnId: string,
): void {
  const foreignKey: ForeignKey | undefined = table.foreignKeys.find(
    (fk: ForeignKey) => fk.foreignTableId === foreignTableId,
  );
  if (foreignKey == null) return;

  const columnPair: ColumnPair | undefined = foreignKey.columnPairs.find(
    (x: ColumnPair) => x.foreignTableColumnId === foreignColumnId && x.parentTableColumnId === parentColumnId,
  );
  if (columnPair == null) return;

  columnPair.foreignTableColumnId = newForeignColumnId;
  columnPair.parentTableColumnId = newParentColumnId;
}

export function rewriteColumnId(table: Table, columnId: string, newColumnId: string): void {
  const column: Column | undefined = table.columns.find((x: Column) => x.columnId === columnId);
  if (column == null) return;

  column.columnId = newColumnId;
  column.nameComponents = [{ ...newColumnNameComponent(), name: newColumnId, isSynthetic: true }];
}

export function removeColumn(table: Table, columnId: string): void {
  table.columns = R.reject((column: Column) => column.columnId === columnId)(table.columns);
}
