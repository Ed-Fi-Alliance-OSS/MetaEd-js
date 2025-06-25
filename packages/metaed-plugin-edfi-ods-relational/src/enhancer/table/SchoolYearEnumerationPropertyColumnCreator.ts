// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EntityProperty, MetaEdPropertyPath, TopLevelEntity } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column, newColumn, newColumnNameComponent, ColumnNameComponent } from '../../model/database/Column';

export function schoolYearEnumerationPropertyColumnCreator(
  originalEntity: TopLevelEntity,
  property: EntityProperty,
  strategy: BuildStrategy,
  currentPropertyPath: MetaEdPropertyPath,
): Column[] {
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
    isPartOfPrimaryKey: !strategy.suppressPrimaryKeyCreation() && (property.isPartOfIdentity || property.isIdentityRename),
    sourceEntityProperties: [property],
    propertyPath: currentPropertyPath,
    originalEntity,
    isFromReferenceProperty: true, // SchoolYearEnumeration properties are reference properties
  };
  return [column];
}
