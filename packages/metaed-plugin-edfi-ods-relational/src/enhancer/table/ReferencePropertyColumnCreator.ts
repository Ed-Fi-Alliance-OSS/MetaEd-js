import { EntityProperty, MetaEdPropertyPath, ReferentialProperty, SemVer, TopLevelEntity } from '@edfi/metaed-core';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';

/**
 * Creates column(s) for the given reference property. Includes BuildStrategy to adjust column naming/attributes.
 * currentPropertyPath is for the given property.
 */
export function referencePropertyColumnCreator(
  originalEntity: TopLevelEntity,
  property: EntityProperty,
  strategy: BuildStrategy,
  currentPropertyPath: MetaEdPropertyPath,
  targetTechnologyVersion: SemVer,
): Column[] {
  if (!strategy.buildColumns(property) || property.data.edfiOdsRelational.odsIsCollection) return [];

  const referentialProperty: ReferentialProperty = property as ReferentialProperty;
  let buildStrategy: BuildStrategy = strategy.appendParentContextProperty(referentialProperty);
  // NOTE: Add test coverage here once we understand how skip path should work? see SkipPathStrategy class in BuildStrategy
  buildStrategy =
    referentialProperty.mergeDirectives.length > 0
      ? buildStrategy.skipPath(referentialProperty.mergeDirectives.map((x) => x.sourcePropertyPathStrings.slice(1)))
      : buildStrategy;

  const columns: Column[] = collectPrimaryKeys(
    originalEntity,
    referentialProperty.referencedEntity,
    buildStrategy,
    currentPropertyPath,
    targetTechnologyVersion,
  );
  columns.forEach((column: Column) => {
    column.referenceContext = referentialProperty.data.edfiOdsRelational.odsName + column.referenceContext;
  });
  return columns;
}
