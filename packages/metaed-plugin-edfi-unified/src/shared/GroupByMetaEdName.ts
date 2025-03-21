// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ModelBase, EntityProperty } from '@edfi/metaed-core';

export function groupByMetaEdName<T extends ModelBase | EntityProperty>(modelItems: T[]): Map<string, T[]> {
  return modelItems.reduce((structure: Map<string, T[]>, modelItem: T) => {
    if (!structure.has(modelItem.metaEdName)) structure.set(modelItem.metaEdName, []);
    // @ts-ignore: previous line guarantees get will not be undefined
    structure.get(modelItem.metaEdName).push(modelItem);
    return structure;
  }, new Map());
}
