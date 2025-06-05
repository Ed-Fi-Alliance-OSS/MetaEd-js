// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EntityProperty, ModelBase, ModelType, PropertyType, Namespace, TopLevelEntity } from '@edfi/metaed-core';
import { asModelType, getEntityFromNamespaceChain, allEntityModelTypes } from '@edfi/metaed-core';

const referenceTypes: ModelType[] = [
  'association',
  'associationExtension',
  'associationSubclass',
  'domainEntity',
  'domainEntityExtension',
  'domainEntitySubclass',
  'choice',
  'common',
  'commonSubclass',
];

const commonTypes: PropertyType[] = ['choice', 'common', 'inlineCommon'];

const subclassSuffix = 'Subclass';
const extensionSuffix = 'Extension';

function possibleModelTypesReferencedByProperty(propertyType: ModelType | PropertyType): ModelType[] {
  const allEntityModelTypesUntyped = allEntityModelTypes as string[];
  // sketchy computation of model/property type
  const result: any = [propertyType];
  if (allEntityModelTypesUntyped.includes(`${propertyType}${extensionSuffix}`))
    result.push(`${propertyType}${extensionSuffix}`);
  if (allEntityModelTypesUntyped.includes(`${propertyType}${subclassSuffix}`))
    result.push(`${propertyType}${subclassSuffix}`);
  return result.map((x) => asModelType(x));
}

export function getReferencedEntities(
  namespace: Namespace,
  propertyName: string,
  propertyReferencedNamespace: string,
  propertyType: ModelType | PropertyType,
): ModelBase[] {
  return possibleModelTypesReferencedByProperty(propertyType).reduce(
    (result: ModelBase[], type: ModelType | PropertyType) => {
      const entity = getEntityFromNamespaceChain(propertyName, propertyReferencedNamespace, namespace, asModelType(type));
      if (entity != null) return result.concat(entity);
      return result;
    },
    [],
  );
}

function getBaseEntity(namespace: Namespace, entity: TopLevelEntity): ModelBase | null {
  if (!entity) return null;
  const modelTypes: ModelType[] = [];
  if (entity.type.match(subclassSuffix)) modelTypes.push(asModelType(entity.type.replace(subclassSuffix, '')));
  if (entity.type.match(extensionSuffix)) modelTypes.push(asModelType(entity.type.replace(extensionSuffix, '')));
  return getEntityFromNamespaceChain(entity.baseEntityName, entity.baseEntityNamespaceName, namespace, ...modelTypes);
}

export const matchAll = () => (): boolean => true;

export const matchAllIdentityReferenceProperties =
  () =>
  (property: EntityProperty, parentContext: ModelBase): boolean =>
    ['choice', 'inlineCommon'].includes(parentContext.type) ||
    ((property.isPartOfIdentity || property.isIdentityRename) &&
      [
        'association',
        'descriptor',
        'domainEntity',
        'enumeration',
        'schoolYearEnumeration',
        'sharedDecimal',
        'sharedInteger',
        'sharedShort',
        'sharedString',
      ].includes(property.type));

export const matchAllButFirstAsIdentityProperties = () => {
  let firstProperty: EntityProperty;
  return (property: EntityProperty, parentContext: ModelBase): boolean => {
    if (firstProperty == null) {
      firstProperty = property;
      return true;
    }
    if (firstProperty === property) return true;
    return matchAllIdentityReferenceProperties()(property, parentContext);
  };
};

function roleName(property: EntityProperty): string {
  if (!property.roleName) return '';
  return !property.shortenTo ? `${property.roleName}${property.metaEdName}` : `${property.shortenTo}${property.metaEdName}`;
}

export function findReferencedProperty(
  namespace: Namespace,
  initialEntity: ModelBase,
  propertyPath: string[],
  filter: (property: EntityProperty, parentContext: ModelBase) => boolean = matchAll(),
): EntityProperty | null {
  const entities: ModelBase[] = [initialEntity];
  let currentEntity: ModelBase | undefined;
  let currentProperty: EntityProperty | undefined;

  propertyPath.some((pathSegment) => {
    currentProperty = undefined;
    let currentFilter = filter;

    while (entities.length > 0 && currentProperty == null) {
      currentEntity = entities.pop();
      currentProperty = (currentEntity as TopLevelEntity).properties.find(
        // eslint-disable-next-line no-loop-func
        (property: EntityProperty) =>
          (property.metaEdName === pathSegment || roleName(property) === pathSegment) &&
          currentFilter(property, currentEntity as TopLevelEntity),
      );

      if (currentProperty != null) {
        if (!referenceTypes.includes(asModelType(currentProperty.type))) return true;
        entities.push(
          ...getReferencedEntities(
            namespace,
            currentProperty.metaEdName,
            currentProperty.referencedNamespaceName,
            asModelType(currentProperty.type),
          ),
        );
      } else {
        const baseEntity = getBaseEntity(namespace, currentEntity as TopLevelEntity);
        if (baseEntity != null) entities.push(baseEntity);
        currentFilter = matchAllIdentityReferenceProperties();
      }
    }
    if (currentProperty != null && commonTypes.includes(currentProperty.type)) currentProperty = undefined;
    return false;
  });

  return currentProperty === undefined ? null : currentProperty;
}
