import { ReferentialProperty, TopLevelEntity } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { ColumnCreator } from './ColumnCreator';
import { ColumnCreatorFactory } from './ColumnCreatorFactory';

export function collectPrimaryKeys(
  entity: TopLevelEntity,
  strategy: BuildStrategy,
  factory: ColumnCreatorFactory,
): Column[] {
  if (!entity.data.edfiOdsRelational) return [];

  const columns: Column[] = [];

  entity.data.edfiOdsRelational.odsIdentityProperties.forEach((property: ReferentialProperty) => {
    const columnCreator: ColumnCreator = factory.columnCreatorFor(property);
    columns.push(...columnCreator.createColumns(property, strategy));
  });

  entity.data.edfiOdsRelational.odsProperties.forEach((property: ReferentialProperty) => {
    if (property.type !== 'inlineCommon') return;
    columns.push(...collectPrimaryKeys(property.referencedEntity, strategy.appendParentContextProperty(property), factory));
  });

  return columns;
}
