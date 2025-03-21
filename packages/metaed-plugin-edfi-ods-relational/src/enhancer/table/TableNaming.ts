// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EntityProperty } from '@edfi/metaed-core';
import { TableNameGroup, newTableNameComponent, newTableNameGroup, TableNameComponent } from '../../model/database/Table';
import { TableStrategy } from '../../model/database/TableStrategy';
import { BuildStrategy } from './BuildStrategy';

export interface TableNaming {
  tableId: string;
  nameGroup: TableNameGroup;
}

function getRoleName(property: EntityProperty): string {
  return property.roleName !== property.metaEdName ? property.roleName : '';
}

export function joinTableNamer(
  property: EntityProperty,
  parentTableStrategy: TableStrategy,
  buildStrategyForParentContext: BuildStrategy,
): TableNaming {
  const nameComponents: TableNameComponent[] = [];

  nameComponents.push(
    ...buildStrategyForParentContext
      .parentContextProperties()
      .filter(
        (parentContextProperty) =>
          parentContextProperty.data.edfiOdsRelational.odsContextPrefix != null &&
          parentContextProperty.data.edfiOdsRelational.odsContextPrefix !== '',
      )
      .map((parentContextProperty) => ({
        ...newTableNameComponent(),
        name: parentContextProperty.data.edfiOdsRelational.odsContextPrefix,
        isParentPropertyContext: true,
        sourceProperty: parentContextProperty,
      })),
  );

  const contextName: string = getRoleName(property);

  if (contextName !== '') {
    nameComponents.push({
      ...newTableNameComponent(),
      name: contextName,
      isPropertyRoleName: true,
      sourceProperty: property,
    });
  }

  nameComponents.push({
    ...newTableNameComponent(),
    name: property.metaEdName,
    isPropertyMetaEdName: true,
    sourceProperty: property,
  });

  return {
    tableId: parentTableStrategy.tableId + buildStrategyForParentContext.parentContext() + contextName + property.metaEdName,
    nameGroup: {
      ...newTableNameGroup(),
      nameElements: [parentTableStrategy.nameGroup, ...nameComponents],
      sourceProperty: property,
    },
  };
}
