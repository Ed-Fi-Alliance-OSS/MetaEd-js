// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getPropertiesOfType, PropertyType, MetaEdEnvironment } from '@edfi/metaed-core';
import { HandbookEntry, newHandbookEntry } from '../model/HandbookEntry';
import { HandbookUsedByProperty } from '../model/HandbookUsedByProperty';
import { getCardinalityStringFor } from './HandbookCardinality';

function generatedTableSqlFor(name: string, columnDefinition: string): string[] {
  return [`${name} ${columnDefinition}`];
}

// In function parentNameAndPropertyCardinalityProperties
function parentNameAndPropertyCardinalityProperties(
  metaEd: MetaEdEnvironment,
  propertyType: PropertyType,
): HandbookUsedByProperty[] {
  const properties: HandbookUsedByProperty[] = [];
  const validPropertyTypes: PropertyType[] = [propertyType];

  getPropertiesOfType(metaEd.propertyIndex, ...validPropertyTypes).forEach((property) => {
    const item: HandbookUsedByProperty = {
      referenceUniqueIdentifier: property.parentEntity.metaEdName + property.parentEntity.entityUuid,
      entityName: property.parentEntity.metaEdName,
      propertyName:
        property.roleName === property.metaEdName ? property.metaEdName : property.roleName + property.metaEdName,
      cardinality: getCardinalityStringFor(property),
    };
    properties.push(item);
  });
  return properties;
}

export function createDefaultHandbookEntry({
  entityUuid,
  name,
  definition,
  columnDefinition,
  propertyType,
  metaEd,
}: {
  entityUuid: string;
  name: string;
  definition: string;
  columnDefinition: string;
  propertyType: PropertyType;
  metaEd: MetaEdEnvironment;
}): HandbookEntry {
  return {
    ...newHandbookEntry(),
    definition,
    // This is the way the UI searches for entities
    uniqueIdentifier: name + entityUuid,
    metaEdType: `${name} Base Type`,
    modelReferencesUsedBy: [],
    modelReferencesUsedByProperties: parentNameAndPropertyCardinalityProperties(metaEd, propertyType),
    umlType: name,
    name,
    projectName: 'EdFi',
    odsFragment: generatedTableSqlFor(name, columnDefinition),
    optionList: [],
    typeCharacteristics: [],
  };
}
