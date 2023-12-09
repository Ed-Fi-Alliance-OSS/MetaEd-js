import { EntityProperty, SemVer } from '@edfi/metaed-core';
import { collectColumns } from './CommonPropertyColumnCreatorBase';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { ColumnCreator } from './ColumnCreator';

export function inlineCommonPropertyColumnCreator(targetTechnologyVersion: SemVer): ColumnCreator {
  return {
    createColumns: (property: EntityProperty, strategy: BuildStrategy): Column[] =>
      collectColumns(property, strategy.appendParentContextProperty(property), targetTechnologyVersion),
  };
}
