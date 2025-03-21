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
export type AssociationSubclassSourceMap = TopLevelEntitySourceMap;

/**
 *
 */
export function newAssociationSubclassSourceMap(): AssociationSubclassSourceMap {
  return newTopLevelEntitySourceMap();
}

export interface AssociationSubclass extends TopLevelEntity {
  sourceMap: AssociationSubclassSourceMap;
}

/**
 *
 */
export function newAssociationSubclass(): AssociationSubclass {
  return {
    ...newTopLevelEntity(),
    type: 'associationSubclass',
    typeHumanizedName: 'Association Subclass',
    sourceMap: newAssociationSubclassSourceMap(),
  };
}

/**
 *
 */
export const asAssociationSubclass = (x: ModelBase): AssociationSubclass => x as AssociationSubclass;
