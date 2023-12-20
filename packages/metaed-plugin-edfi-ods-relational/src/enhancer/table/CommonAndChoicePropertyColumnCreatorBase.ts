import { CommonProperty, EntityProperty, MetaEdPropertyPath, SemVer, TopLevelEntity } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { createColumnFor } from './ColumnCreator';
import { appendToPropertyPath } from '../EnhancerHelper';

export function collectColumns(
  originalEntity: TopLevelEntity,
  entityProperty: EntityProperty,
  strategy: BuildStrategy,
  currentPropertyPath: MetaEdPropertyPath,
  targetTechnologyVersion: SemVer,
): Column[] {
  const { referencedEntity } = entityProperty as CommonProperty;

  return referencedEntity.data.edfiOdsRelational.odsProperties.reduce(
    (columns: Column[], property: EntityProperty): Column[] => {
      if (property.data.edfiOdsRelational.odsIsCollection) return columns;

      return columns.concat(
        createColumnFor(
          originalEntity,
          property,
          strategy,
          appendToPropertyPath(currentPropertyPath, property),
          targetTechnologyVersion,
        ),
      );
    },
    [],
  );
}
