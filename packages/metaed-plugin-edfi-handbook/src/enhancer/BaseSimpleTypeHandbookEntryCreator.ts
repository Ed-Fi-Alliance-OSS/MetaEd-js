// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getPropertiesOfType, EntityProperty, PropertyType, MetaEdEnvironment } from '@edfi/metaed-core';
import { HandbookEntry, newHandbookEntry } from '../model/HandbookEntry';
import { HandbookUsedByProperty } from '../model/HandbookUsedByProperty';

function generatedTableSqlFor(name: string, columnDefinition: string): string[] {
  return [`${name} ${columnDefinition}`];
}

function getCardinalityStringFor(property: EntityProperty, isHandbookEntityReferenceProperty: boolean = false): string {
  if (isHandbookEntityReferenceProperty && (property.isRequired || property.isPartOfIdentity || property.isIdentityRename))
    return 'required';
  if (property.isPartOfIdentity) return 'identity';
  if (property.isRequired) return 'required';
  if (property.isRequiredCollection) return 'required collection';
  if (property.isOptional) return 'optional';
  if (property.isOptionalCollection) return 'optional collection';
  return 'UNKNOWN CARDINALITY';
}

function parentNameAndPropertyCardinalityProperties(
  metaEd: MetaEdEnvironment,
  propertyType: PropertyType,
): HandbookUsedByProperty[] {
  const properties: HandbookUsedByProperty[] = [];
  const validPropertyTypes: PropertyType[] = [propertyType];

  getPropertiesOfType(metaEd.propertyIndex, ...validPropertyTypes).forEach((property) => {
    const item: HandbookUsedByProperty = {
      referenceUniqueIdentifier: property.parentEntity.metaEdName + property.parentEntity.entityUuid,
      name: property.parentEntity.metaEdName,
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
