import { EntityProperty } from 'metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column, newColumn, newColumnNameComponent, ColumnNameComponent } from '../../model/database/Column';
import { ColumnCreator } from './ColumnCreator';

export function schoolYearEnumerationPropertyColumnCreator(): ColumnCreator {
  return {
    createColumns: (property: EntityProperty, strategy: BuildStrategy): Column[] => {
      const nameComponents: ColumnNameComponent[] = [];
      strategy.parentContextProperties().forEach((parentContextProperty) => {
        if (parentContextProperty.data.edfiOdsRelational.odsContextPrefix !== '') {
          nameComponents.push({
            ...newColumnNameComponent(),
            name: parentContextProperty.data.edfiOdsRelational.odsContextPrefix,
            isParentPropertyContext: true,
          });
        }
      });
      nameComponents.push(
        {
          ...newColumnNameComponent(),
          name: property.data.edfiOdsRelational.odsContextPrefix,
          isPropertyRoleName: true,
          sourceProperty: property,
        },
        {
          ...newColumnNameComponent(),
          name: 'SchoolYear',
          isSynthetic: true,
        },
      );
      const column: Column = {
        ...newColumn(),
        type: 'short',
        columnId: `${strategy.parentContext()}${property.data.edfiOdsRelational.odsContextPrefix}SchoolYear`,
        nameComponents,
        description: property.documentation,
        isNullable: property.isOptional,
        isPartOfPrimaryKey:
          !strategy.suppressPrimaryKeyCreation() && (property.isPartOfIdentity || property.isIdentityRename),
        sourceEntityProperties: [property],
      };
      return [column];
    },
  };
}
