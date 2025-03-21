// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { ModelBase, ModelBaseSourceMap, newModelBaseSourceMap, newModelBase } from './ModelBase';
import { TopLevelEntity, NoTopLevelEntity } from './TopLevelEntity';
import { ModelType } from './ModelType';
import { SourceMap, NoSourceMap } from './SourceMap';

export interface DomainItemSourceMap extends ModelBaseSourceMap {
  referencedType: SourceMap;
  referencedNamespaceName: SourceMap;
  referencedEntity: SourceMap;
  referencedEntityDeprecated: SourceMap;
  typeHumanizedName: SourceMap;
}

/**
 *
 */
export function newDomainItemSourceMap(): DomainItemSourceMap {
  return {
    ...newModelBaseSourceMap(),
    referencedType: NoSourceMap,
    referencedNamespaceName: NoSourceMap,
    referencedEntity: NoSourceMap,
    referencedEntityDeprecated: NoSourceMap,
    typeHumanizedName: NoSourceMap,
  };
}

export interface DomainItem extends ModelBase {
  sourceMap: DomainItemSourceMap;
  referencedType: ModelType;
  referencedNamespaceName: string;
  referencedEntity: TopLevelEntity;
  referencedEntityDeprecated: boolean;
  typeHumanizedName: string;
}

/**
 *
 */
export function newDomainItem(): DomainItem {
  return {
    ...newModelBase(),
    type: 'domainItem',
    typeHumanizedName: 'Domain Item',
    referencedType: 'unknown',
    referencedNamespaceName: '',
    referencedEntity: NoTopLevelEntity,
    referencedEntityDeprecated: false,
    sourceMap: newDomainItemSourceMap(),
  };
}

/**
 *
 */
export const NoDomainItem: DomainItem = deepFreeze({
  ...newDomainItem(),
  metaEdName: 'NoDomainItem',
});

/**
 *
 */
export const asDomainItem = (x: ModelBase): DomainItem => x as DomainItem;
