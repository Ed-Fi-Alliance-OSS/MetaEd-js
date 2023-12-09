import { EntityProperty, ReferentialProperty, SemVer } from '@edfi/metaed-core';
import { asReferentialProperty } from '@edfi/metaed-core';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { ColumnCreator } from './ColumnCreator';

export function referencePropertyColumnCreator(targetTechnologyVersion: SemVer): ColumnCreator {
  return {
    createColumns: (property: EntityProperty, strategy: BuildStrategy): Column[] => {
      if (!strategy.buildColumns(property) || property.data.edfiOdsRelational.odsIsCollection) return [];

      const referentialProperty: ReferentialProperty = asReferentialProperty(property);
      let buildStrategy: BuildStrategy = strategy.appendParentContextProperty(referentialProperty);
      // NOTE: Add test coverage here once we understand how skip path should work? see SkipPathStrategy class in BuildStrategy
      buildStrategy =
        referentialProperty.mergeDirectives.length > 0
          ? buildStrategy.skipPath(referentialProperty.mergeDirectives.map((x) => x.sourcePropertyPathStrings.slice(1)))
          : buildStrategy;

      const columns: Column[] = collectPrimaryKeys(
        referentialProperty.referencedEntity,
        buildStrategy,
        targetTechnologyVersion,
      );
      columns.forEach((column: Column) => {
        column.referenceContext = referentialProperty.data.edfiOdsRelational.odsName + column.referenceContext;
      });
      return columns;
    },
  };
}
