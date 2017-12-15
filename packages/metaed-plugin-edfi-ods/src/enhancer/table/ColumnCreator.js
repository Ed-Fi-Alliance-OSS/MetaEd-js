// @flow
import type { EntityProperty } from 'metaed-core';
import type { Column } from '../../model/database/Column';
import type { BuildStrategy } from './BuildStrategy';

export type ColumnCreator = {
  createColumns(property: EntityProperty, strategy: BuildStrategy): Array<Column>;
}
