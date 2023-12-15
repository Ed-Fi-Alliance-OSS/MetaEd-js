import { ReferentialProperty, SemVer, TopLevelEntity, versionSatisfies } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { createColumnFor } from './ColumnCreator';

export function collectPrimaryKeys(
  entity: TopLevelEntity,
  strategy: BuildStrategy,
  targetTechnologyVersion: SemVer,
): Column[] {
  if (!entity.data.edfiOdsRelational) return [];

  const columns: Column[] = [];

  entity.data.edfiOdsRelational.odsIdentityProperties.forEach((property: ReferentialProperty) => {
    columns.push(...createColumnFor(property, strategy, targetTechnologyVersion));
  });

  entity.data.edfiOdsRelational.odsProperties.forEach((property: ReferentialProperty) => {
    if (property.type !== 'inlineCommon') return;
    columns.push(
      ...collectPrimaryKeys(
        property.referencedEntity,
        strategy.appendParentContextProperty(property),
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
