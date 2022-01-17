import { EntityProperty } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column, newColumn, ColumnNaming, newColumnNameComponent } from '../../model/database/Column';
import { ColumnCreator } from './ColumnCreator';

export function descriptorPropertyColumnCreator(): ColumnCreator {
  return {
    createColumns: (property: EntityProperty, strategy: BuildStrategy): Column[] => {
      if (!strategy.buildColumns(property)) return [];

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
        property.data.edfiOdsRelational.odsDescriptorifiedBaseName,
        {
          ...newColumnNameComponent(),
          name: property.data.edfiOdsRelational.odsDescriptorifiedBaseName,
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
          !strategy.suppressPrimaryKeyCreation() &&
          (property.isPartOfIdentity || property.data.edfiOdsRelational.odsIsCollection),
        isUniqueIndex: property.data.edfiOdsRelational.odsIsUniqueIndex,
        referenceContext: property.data.edfiOdsRelational.odsName,
        mergedReferenceContexts: [property.data.edfiOdsRelational.odsName],
        sourceEntityProperties: [property],
      };
      return [column];
    },
  };
}
