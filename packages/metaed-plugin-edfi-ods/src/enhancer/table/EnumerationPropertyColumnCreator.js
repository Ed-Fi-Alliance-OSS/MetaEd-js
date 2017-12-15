// @flow
import type { EntityProperty } from 'metaed-core';
import { newIntegerColumn } from '../../model/database/Column';
import type { BuildStrategy } from './BuildStrategy';
import type { Column } from '../../model/database/Column';
import type { ColumnCreator } from './ColumnCreator';
import type { ColumnNamer } from '../../model/database/ColumnNamer';

export function enumerationPropertyColumnCreator(): ColumnCreator {
  return {
    createColumns: (property: EntityProperty, strategy: BuildStrategy): Array<Column> => {
      if (!strategy.buildColumns(property)) return [];

      const columnNamer: ColumnNamer = strategy.columnNamer(
        strategy.parentContext(),
        property.data.edfiOds.ods_ContextPrefix,
        property.isIdentityRename
          ? property.baseKeyName
          : property.data.edfiOds.ods_TypeifiedBaseName,
      );
      const column: Column = Object.assign(newIntegerColumn(), {
        name: `${columnNamer()}Id`,
        description: property.documentation,
        isNullable: property.isOptional,
        isPartOfPrimaryKey: !strategy.suppressPrimaryKeyCreation()
          && (property.isPartOfIdentity || property.isIdentityRename),
        referenceContext: property.data.edfiOds.ods_Name,
        sourceEntityProperties: [property],
      });
      return [column];
    },
  };
}
