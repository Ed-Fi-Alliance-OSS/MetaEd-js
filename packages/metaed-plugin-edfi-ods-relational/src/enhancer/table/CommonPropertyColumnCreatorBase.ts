import * as R from 'ramda';
import { EntityProperty, SemVer, TopLevelEntity } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { ColumnCreator } from './ColumnCreator';
import { ColumnCreatorFactory } from './ColumnCreatorFactory';

export function collectColumns(
  entityProperty: EntityProperty,
  strategy: BuildStrategy,
  factory: ColumnCreatorFactory,
  targetTechnologyVersion: SemVer,
): Column[] {
  const entity: TopLevelEntity = R.prop('referencedEntity', entityProperty);

  return entity.data.edfiOdsRelational.odsProperties.reduce((columns: Column[], property: EntityProperty): Column[] => {
    if (property.data.edfiOdsRelational.odsIsCollection) return columns;

    const columnCreator: ColumnCreator = factory.columnCreatorFor(property, targetTechnologyVersion);
    return columns.concat(columnCreator.createColumns(property, strategy));
  }, []);
}
