import { EntityProperty } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column, newColumn, newColumnNameComponent, ColumnNaming } from '../../model/database/Column';
import { ColumnCreator } from './ColumnCreator';

export function enumerationPropertyColumnCreator(): ColumnCreator {
  return {
    createColumns: (property: EntityProperty, strategy: BuildStrategy): Column[] => {
      if (!strategy.buildColumns(property)) return [];

      const baseName = property.isIdentityRename
        ? property.baseKeyName
        : property.data.edfiOdsRelational.odsTypeifiedBaseName;
      const columnNamer: () => ColumnNaming = strategy.columnNamer(
        strategy.parentContext(),
        strategy.parentContextProperties(),
        property.data.edfiOdsRelational.odsContextPrefix,
        {
          ...newColumnNameComponent(),
          name: property.data.edfiOdsRelational.odsContextPrefix,
          isPropertyRoleName: true,
          sourceProperty: property,
        },
        baseName,
        {
          ...newColumnNameComponent(),
          name: baseName,
          isDerivedFromMetaEdName: true,
          sourceProperty: property,
        },
      );
      const columnNaming: ColumnNaming = columnNamer();
      const column: Column = {
        ...newColumn(),
        type: 'integer',
        columnId: `${columnNaming.columnId}Id`,
        nameComponents: [...columnNaming.nameComponents, { ...newColumnNameComponent(), name: 'Id', isSynthetic: true }],
        description: property.documentation,
        isNullable: property.isOptional,
        isPartOfPrimaryKey:
          !strategy.suppressPrimaryKeyCreation() && (property.isPartOfIdentity || property.isIdentityRename),
        referenceContext: property.data.edfiOdsRelational.odsName,
        mergedReferenceContexts: [property.data.edfiOdsRelational.odsName],
        sourceEntityProperties: [property],
      };
      return [column];
    },
  };
}
