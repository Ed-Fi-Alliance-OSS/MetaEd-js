// @flow
import R from 'ramda';
import type { EntityProperty, TopLevelEntity } from 'metaed-core';
import type { BuildStrategy } from './BuildStrategy';
import type { Column } from '../../model/database/Column';
import type { ColumnCreator } from './ColumnCreator';
import type { ColumnCreatorFactory } from './ColumnCreatorFactory';

export function collectColumns(entityProperty: EntityProperty, strategy: BuildStrategy, factory: ColumnCreatorFactory): Array<Column> {
  const entity: TopLevelEntity = R.prop('referencedEntity', entityProperty);

  return entity.data.edfiOds.ods_Properties
    .reduce((columns: Array<Column>, property: EntityProperty): Array<Column> => {
      if (property.data.edfiOds.ods_IsCollection) return columns;

      const columnCreator: ColumnCreator = factory.columnCreatorFor(property);
      return columns.concat(columnCreator.createColumns(property, strategy));
    }, []);
}
