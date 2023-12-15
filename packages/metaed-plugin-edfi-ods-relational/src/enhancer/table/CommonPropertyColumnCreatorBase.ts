import { CommonProperty, EntityProperty, SemVer } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { createColumnFor } from './ColumnCreator';

export function collectColumns(
  entityProperty: EntityProperty,
  strategy: BuildStrategy,
  targetTechnologyVersion: SemVer,
): Column[] {
  const { referencedEntity } = entityProperty as CommonProperty;

  return referencedEntity.data.edfiOdsRelational.odsProperties.reduce(
    (columns: Column[], property: EntityProperty): Column[] => {
      if (property.data.edfiOdsRelational.odsIsCollection) return columns;

      return columns.concat(createColumnFor(property, strategy, targetTechnologyVersion));
    },
    [],
  );
}
