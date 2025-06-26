// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export interface DomainEntitySourceMap extends TopLevelEntitySourceMap {
  isAbstract: SourceMap;
}

/**
 *
 */
export function newDomainEntitySourceMap(): DomainEntitySourceMap {
  return {
    ...newTopLevelEntitySourceMap(),
    isAbstract: NoSourceMap,
  };
}

export interface DomainEntity extends TopLevelEntity {
  sourceMap: DomainEntitySourceMap;
  isAbstract: boolean;
}

/**
 *
 */
export function newDomainEntity(): DomainEntity {
  return {
    ...newTopLevelEntity(),
    type: 'domainEntity',
    typeHumanizedName: 'Domain Entity',
    isAbstract: false,
    sourceMap: newDomainEntitySourceMap(),
  };
}

/**
 *
 */
export function newAbstractEntity(): DomainEntity {
  return {
    ...newDomainEntity(),
    typeHumanizedName: 'Abstract Entity',
    isAbstract: true,
  };
}

/**
 *
 */
export const NoDomainEntity: DomainEntity = deepFreeze({
  ...newDomainEntity(),
  metaEdName: 'NoDomainEntity',
});
