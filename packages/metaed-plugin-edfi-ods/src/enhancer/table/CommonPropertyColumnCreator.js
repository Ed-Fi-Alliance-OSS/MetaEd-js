// @flow
import type { EntityProperty } from 'metaed-core';
import { collectColumns } from './CommonPropertyColumnCreatorBase';
import type { BuildStrategy } from './BuildStrategy';
import type { Column } from '../../model/database/Column';
import type { ColumnCreator } from './ColumnCreator';
import type { ColumnCreatorFactory } from './ColumnCreatorFactory';

export function commonPropertyColumnCreator(factory: ColumnCreatorFactory): ColumnCreator {
  return {
    createColumns: (property: EntityProperty, strategy: BuildStrategy): Array<Column> => collectColumns(property, strategy, factory),
  };
}
