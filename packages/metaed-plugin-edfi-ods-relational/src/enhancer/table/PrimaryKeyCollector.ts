import { MetaEdPropertyPath, ReferentialProperty, SemVer, TopLevelEntity, versionSatisfies } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { createColumnFor } from './ColumnCreator';
import { appendToPropertyPath } from '../EnhancerHelper';

/**
 * Collects the primary keys for a given entity. Includes BuildStrategy to adjust column naming/attributes.
 * Collects currentPropertyPath to assign to columns, and originalEntity to track the initial source.
 * originalEntity differs from entity when, for example, the referencedEntity of a ReferentialProperty is followed.
 */
export function collectPrimaryKeys(
  originalEntity: TopLevelEntity,
  entity: TopLevelEntity,
  strategy: BuildStrategy,
  currentPropertyPath: MetaEdPropertyPath,
  targetTechnologyVersion: SemVer,
): Column[] {
  if (!entity.data.edfiOdsRelational) return [];

  const columns: Column[] = [];

  entity.data.edfiOdsRelational.odsIdentityProperties.forEach((property: ReferentialProperty) => {
    columns.push(
      ...createColumnFor(
        originalEntity,
        property,
        strategy,
        appendToPropertyPath(currentPropertyPath, property),
        targetTechnologyVersion,
      ),
    );
  });

  entity.data.edfiOdsRelational.odsProperties.forEach((property: ReferentialProperty) => {
    if (property.type !== 'inlineCommon') return;
    columns.push(
      ...collectPrimaryKeys(
        originalEntity,
        property.referencedEntity,
        strategy.appendParentContextProperty(property),
        appendToPropertyPath(currentPropertyPath, property),
        targetTechnologyVersion,
      ),
    );
  });

  // For ODS/API 7+, collected primary keys need to be sorted
  if (versionSatisfies(targetTechnologyVersion, '>=7.0.0')) {
    columns.sort((a: Column, b: Column) => a.columnId.localeCompare(b.columnId));
  }

  return columns;
}
