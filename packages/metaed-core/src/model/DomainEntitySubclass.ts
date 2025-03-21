// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import { ModelBase } from './ModelBase';

/**
 *
 */
export type DomainEntitySubclassSourceMap = TopLevelEntitySourceMap;

/**
 *
 */
export function newDomainEntitySubclassSourceMap(): DomainEntitySubclassSourceMap {
  return newTopLevelEntitySourceMap();
}

export interface DomainEntitySubclass extends TopLevelEntity {
  sourceMap: DomainEntitySubclassSourceMap;
}

/**
 *
 */
export function newDomainEntitySubclass(): DomainEntitySubclass {
  return {
    ...newTopLevelEntity(),
    type: 'domainEntitySubclass',
    typeHumanizedName: 'Domain Entity Subclass',
    sourceMap: newDomainEntitySubclassSourceMap(),
  };
}

/**
 *
 */
export const asDomainEntitySubclass = (x: ModelBase): DomainEntitySubclass => x as DomainEntitySubclass;
