import { EntityProperty } from '@edfi/metaed-core';
import { Column } from '../../model/database/Column';
import { BuildStrategy } from './BuildStrategy';

export interface ColumnCreator {
  createColumns(property: EntityProperty, strategy: BuildStrategy): Column[];
}

export function nullColumnCreator() {
  return {
    createColumns: (_property: EntityProperty, _strategy: BuildStrategy): Column[] => [],
  };
}
