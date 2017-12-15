// @flow
import type { EntityProperty, ReferentialProperty } from 'metaed-core';
import { asReferentialProperty } from 'metaed-core';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import type { BuildStrategy } from './BuildStrategy';
import type { Column } from '../../model/database/Column';
import type { ColumnCreator } from './ColumnCreator';
import type { ColumnCreatorFactory } from './ColumnCreatorFactory';

export function referencePropertyColumnCreator(factory: ColumnCreatorFactory): ColumnCreator {
  return {
    createColumns: (property: EntityProperty, strategy: BuildStrategy): Array<Column> => {
      if (!strategy.buildColumns(property) || property.data.edfiOds.ods_IsCollection) return [];

      const referentialProperty: ReferentialProperty = asReferentialProperty(property);
      let buildStrategy: BuildStrategy = strategy.appendParentContext(referentialProperty.data.edfiOds.ods_ContextPrefix);
      // NOTE: Add test coverage here once we understand how skip path should work? see SkipPathStrategy class in BuildStrategy
      buildStrategy = referentialProperty.mergedProperties.length > 0
        ? buildStrategy.skipPath(referentialProperty.mergedProperties.map(x => x.mergePropertyPath.slice(1)))
        : buildStrategy;

      const columns: Array<Column> = collectPrimaryKeys(referentialProperty.referencedEntity, buildStrategy, factory);
      columns.forEach((column: Column) => {
        column.referenceContext = referentialProperty.data.edfiOds.ods_Name + column.referenceContext;
      });
      return columns;
    },
  };
}
