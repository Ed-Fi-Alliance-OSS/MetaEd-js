// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EntityProperty, MetaEdPropertyPath, TopLevelEntity } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { Column, newColumn, newColumnNameComponent, ColumnNaming } from '../../model/database/Column';

export function enumerationPropertyColumnCreator(
  originalEntity: TopLevelEntity,
  property: EntityProperty,
  strategy: BuildStrategy,
  currentPropertyPath: MetaEdPropertyPath,
): Column[] {
  if (!strategy.buildColumns(property)) return [];

  const baseName = property.isIdentityRename ? property.baseKeyName : property.data.edfiOdsRelational.odsTypeifiedBaseName;
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
    isPartOfPrimaryKey: !strategy.suppressPrimaryKeyCreation() && (property.isPartOfIdentity || property.isIdentityRename),
    referenceContext: property.data.edfiOdsRelational.odsName,
    mergedReferenceContexts: [property.data.edfiOdsRelational.odsName],
    sourceEntityProperties: [property],
    propertyPath: currentPropertyPath,
    originalEntity,
    isFromReferenceProperty: true, // Enumeration properties are reference properties
  };
  return [column];
}
