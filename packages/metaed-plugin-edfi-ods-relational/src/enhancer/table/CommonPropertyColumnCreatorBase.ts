import * as R from 'ramda';
import { EntityProperty, SemVer, TopLevelEntity } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { columnCreatorFor } from './ColumnCreator';

export function collectColumns(
  entityProperty: EntityProperty,
  strategy: BuildStrategy,
  targetTechnologyVersion: SemVer,
): Column[] {
  const entity: TopLevelEntity = R.prop('referencedEntity', entityProperty);

  return entity.data.edfiOdsRelational.odsProperties.reduce((columns: Column[], property: EntityProperty): Column[] => {
    if (property.data.edfiOdsRelational.odsIsCollection) return columns;

    return columns.concat(columnCreatorFor(property, strategy, targetTechnologyVersion));
  }, []);
}
