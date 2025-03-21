// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { TableNameGroup, TableNameComponent, isTableNameComponent } from './Table';

export function flattenNameComponentsFromGroup(nameGroup: TableNameGroup): TableNameComponent[] {
  const result: TableNameComponent[] = [];
  nameGroup.nameElements.forEach((nameElement) => {
    if (isTableNameComponent(nameElement)) {
      result.push(nameElement as TableNameComponent);
    } else {
      result.push(...flattenNameComponentsFromGroup(nameElement as TableNameGroup));
    }
  });
  return result;
}

export function simpleTableNameGroupConcat(nameGroup: TableNameGroup): string {
  return flattenNameComponentsFromGroup(nameGroup)
    .map((nameComponent) => nameComponent.name)
    .reduce((a, b) => a + b, '');
}
