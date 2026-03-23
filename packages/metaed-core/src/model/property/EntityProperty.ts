// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { newNamespace } from '../Namespace';
import { Namespace } from '../Namespace';
import { newTopLevelEntity } from '../TopLevelEntity';
import { TopLevelEntity } from '../TopLevelEntity';
import { SourceMap } from '../SourceMap';
import { NoSourceMap } from '../SourceMap';
import { PropertyType } from './PropertyType';
import { ReferentialProperty } from './ReferentialProperty';
import { SimpleProperty } from './SimpleProperty';
import { MergeDirectiveInfo } from './MergeDirectiveInfo';

/**
 *
 */
export type HasReferencedEntity = ReferentialProperty | SimpleProperty;

/**
 *
 */
export interface EntityPropertySourceMap {
  type: SourceMap;
  isDeprecated: SourceMap;
  deprecationReason: SourceMap;
  documentation: SourceMap;
  documentationInherited: SourceMap;
  metaEdName: SourceMap;
  namespace: SourceMap;
  baseKeyName: SourceMap;
  shortenTo: SourceMap;
  fullPropertyName: SourceMap;
  parentEntityName: SourceMap;
  parentEntity: SourceMap;
  isPartOfIdentity: SourceMap;
  isIdentityRename: SourceMap;
  isRequired: SourceMap;
  isOptional: SourceMap;
  isRequiredCollection: SourceMap;
  isOptionalCollection: SourceMap;
  isCollection: SourceMap;
  isQueryableOnly: SourceMap;
  roleName: SourceMap;
  hasRestriction: SourceMap;
  referencedType: SourceMap;
  referencedNamespaceName: SourceMap;
  mergeTargetedBy: SourceMap;
}

/**
 *
 */
export function newEntityPropertySourceMap(): EntityPropertySourceMap {
  return {
    type: NoSourceMap,
    isDeprecated: NoSourceMap,
    deprecationReason: NoSourceMap,
    documentation: NoSourceMap,
    documentationInherited: NoSourceMap,
    metaEdName: NoSourceMap,
    namespace: NoSourceMap,
    baseKeyName: NoSourceMap,
    shortenTo: NoSourceMap,
    fullPropertyName: NoSourceMap,
    parentEntityName: NoSourceMap,
    parentEntity: NoSourceMap,
    isPartOfIdentity: NoSourceMap,
    isIdentityRename: NoSourceMap,
    isRequired: NoSourceMap,
    isOptional: NoSourceMap,
    isRequiredCollection: NoSourceMap,
    isOptionalCollection: NoSourceMap,
    isCollection: NoSourceMap,
    isQueryableOnly: NoSourceMap,
    roleName: NoSourceMap,
    hasRestriction: NoSourceMap,
    referencedType: NoSourceMap,
    referencedNamespaceName: NoSourceMap,
    mergeTargetedBy: NoSourceMap,
  };
}

/**
 * EntityProperty is the base type for all properties.
 *
 * **propertyUuid** is a unique identifier for this property. It is transient, meaning it will differ between runs.
 *
 * **type** is the property type as a string enumeration.  Examples are "domainEntity", "descriptor", "sharedString".
 *
 * **typeHumanizedName** is the property type as a displayable string for end user messages.
 *
 * **isDeprecated** is true if this property is marked as deprecated.
 *
 * **deprecationReason** is the reason why this property was deprecated.
 *
 * **documentation** is the property documentation corresponding to the "documentation" keyword.
 *
 * **documentationInherited** is true if the "documentation inherited" keyword was used.
 *
 * **metaEdName** is the property name as defined by the identifier.  The metaEdName uniquely identifies a property on an entity.
 *
 * **namespace** is a reference to the namespace this property (and its parent entity) is in.
 *
 * **baseKeyName** is the optional metaEdName for a given identity property rename.
 *
 * **shortenTo** is the optional shortenTo name for a role name -> shorten to directive.
 *
 * **fullPropertyName** is the property name, prepended with the optional roleName name.
 *
 * **parentEntityName** is the metaEdName of the parent entity
 *
 * **parentEntity** is a reference to the parent entity.
 *
 * **isPartOfIdentity** is true if the "is part of identity" keyword applies.
 *
 * **isIdentityRename** is true if the "renames identity property" keyword applies.
 *
 * **isRequired** is true if the "is required" keyword applies.
 *
 * **isOptional** is true if the "is optional" keyword applies.
 *
 * **isRequiredCollection** is true if the "is required collection" keyword applies.
 *
 * **isOptionalCollection** is true if the "is optional collection" keyword applies.
 *
 * **isCollection** is true if the property is an optional or required collection.
 *
 * **isQueryableOnly** is true if the "is queryable only" keyword applies.
 *
 * **roleName** is true if the "renames identity property" keyword applies.
 *
 * **hasRestriction** is true if the property has a value restriction for its type, such as "min length" or "max value".
 *
 * **referencedType** is the optional metaEdName of the type being referenced, when it differs from the property's metaEdName.
 *
 * **referencedNamespaceName** is the name of the namespace of the entity this property references, if any.
 *
 * **mergeSourcedBy** is the list of all MergeDirectives that are sourcing this property for a merge.
 *
 * **mergeTargetedBy** is the list of all MergeDirectives that are targeting this property for a merge.
 *
 * **sourceMap** annotates where in the .metaed files each piece of data for this property derives from.
 *
 * **data** is the place where plugins are allowed to annotate the property with their own plugin-specfic data.
 */
export interface EntityProperty {
  propertyUuid: string;
  type: PropertyType;
  typeHumanizedName: string;
  isDeprecated: boolean;
  deprecationReason: string;
  documentation: string;
  documentationInherited: boolean;
  metaEdName: string;
  namespace: Namespace;
  baseKeyName: string;
  shortenTo: string;
  fullPropertyName: string;
  parentEntityName: string;
  parentEntity: TopLevelEntity;
  isPartOfIdentity: boolean;
  isIdentityRename: boolean;
  isRequired: boolean;
  isOptional: boolean;
  isRequiredCollection: boolean;
  isOptionalCollection: boolean;
  isCollection: boolean;
  isQueryableOnly: boolean;
  roleName: string;
  hasRestriction: boolean;
  referencedType: string;
  referencedNamespaceName: string;
  mergeSourcedBy: MergeDirectiveInfo[];
  mergeTargetedBy: MergeDirectiveInfo[];
  sourceMap: EntityPropertySourceMap;
  data: any;
}

/**
 *
 */
export function newEntityProperty(): EntityProperty {
  return {
    propertyUuid: '',
    type: 'unknown',
    typeHumanizedName: '',
    isDeprecated: false,
    deprecationReason: '',
    documentation: '',
    documentationInherited: false,
    metaEdName: '',
    namespace: newNamespace(),
    baseKeyName: '',
    shortenTo: '',
    fullPropertyName: '',
    parentEntityName: '',
    parentEntity: newTopLevelEntity(),
    isPartOfIdentity: false,
    isIdentityRename: false,
    isRequired: false,
    isOptional: false,
    isRequiredCollection: false,
    isOptionalCollection: false,
    isCollection: false,
    isQueryableOnly: false,
    roleName: '',
    hasRestriction: false,
    referencedType: '',
    referencedNamespaceName: '',
    mergeSourcedBy: [],
    mergeTargetedBy: [],
    sourceMap: newEntityPropertySourceMap(),
    data: {},
  };
}

/**
 *
 */
export const NoEntityProperty: EntityProperty = deepFreeze({
  ...newEntityProperty(),
  metaEdName: 'NoEntityProperty',
});
