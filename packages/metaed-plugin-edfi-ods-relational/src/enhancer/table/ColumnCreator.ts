import { EntityProperty } from '@edfi/metaed-core';
import { Column } from '../../model/database/Column';
import { BuildStrategy } from './BuildStrategy';

export interface ColumnCreator {
  createColumns(property: EntityProperty, strategy: BuildStrategy): Column[];
}

export function nullColumnCreator() {
  return {
    // @ts-ignore - all unused parameter names
    createColumns: (property: EntityProperty, strategy: BuildStrategy): Column[] => [],
  };
}
