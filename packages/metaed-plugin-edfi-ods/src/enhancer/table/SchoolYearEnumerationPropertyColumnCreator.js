// @flow
import type { EntityProperty } from 'metaed-core';
import { newShortColumn } from '../../model/database/Column';
import type { BuildStrategy } from './BuildStrategy';
import type { Column } from '../../model/database/Column';
import type { ColumnCreator } from './ColumnCreator';

export function schoolYearEnumerationPropertyColumnCreator(): ColumnCreator {
  return {
    createColumns: (property: EntityProperty, strategy: BuildStrategy): Array<Column> => {
      const column: Column = Object.assign(newShortColumn(), {
        name: `${strategy.parentContext()}${property.data.edfiOds.ods_ContextPrefix}SchoolYear`,
        description: property.documentation,
        isNullable: property.isOptional,
        isPartOfPrimaryKey: !strategy.suppressPrimaryKeyCreation()
          && (property.isPartOfIdentity || property.isIdentityRename),
        sourceEntityProperties: [property],
      });
      return [column];
    },
  };
}
