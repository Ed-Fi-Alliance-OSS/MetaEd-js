import { EntityProperty, SemVer } from '@edfi/metaed-core';
import { collectColumns } from './CommonPropertyColumnCreatorBase';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { ColumnCreator } from './ColumnCreator';
import { ColumnCreatorFactory } from './ColumnCreatorFactory';

export function commonPropertyColumnCreator(factory: ColumnCreatorFactory, targetTechnologyVersion: SemVer): ColumnCreator {
  return {
    createColumns: (property: EntityProperty, strategy: BuildStrategy): Column[] =>
      collectColumns(property, strategy, factory, targetTechnologyVersion),
  };
}
