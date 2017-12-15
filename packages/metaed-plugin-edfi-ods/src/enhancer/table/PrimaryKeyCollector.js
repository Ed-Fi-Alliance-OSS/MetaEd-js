// @flow
import type { ReferentialProperty, TopLevelEntity } from 'metaed-core';
import type { BuildStrategy } from './BuildStrategy';
import type { Column } from '../../model/database/Column';
import type { ColumnCreator } from './ColumnCreator';
import type { ColumnCreatorFactory } from './ColumnCreatorFactory';

export function collectPrimaryKeys(entity: TopLevelEntity, strategy: BuildStrategy, factory: ColumnCreatorFactory): Array<Column> {
  const columns: Array<Column> = [];

  entity.data.edfiOds.ods_IdentityProperties.forEach((property: ReferentialProperty) => {
    const columnCreator: ColumnCreator = factory.columnCreatorFor(property);
    columns.push(...columnCreator.createColumns(property, strategy));
  });

  entity.data.edfiOds.ods_Properties.forEach((property: ReferentialProperty) => {
    if (property.type !== 'inlineCommon') return;
    columns.push(...collectPrimaryKeys(
        property.referencedEntity,
        strategy.appendParentContext(property.data.edfiOds.ods_ContextPrefix),
        factory,
      ));
  });

  return columns;
}
