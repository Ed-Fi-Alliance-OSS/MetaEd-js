// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export interface AssociationSourceMap extends TopLevelEntitySourceMap {
  isAbstract: SourceMap;
}

/**
 *
 */
export function newAssociationSourceMap(): AssociationSourceMap {
  return {
    ...newTopLevelEntitySourceMap(),
    isAbstract: NoSourceMap,
  };
}

export interface Association extends TopLevelEntity {
  sourceMap: AssociationSourceMap;
  isAbstract: boolean;
}

/**
 *
 */
export function newAssociation(): Association {
  return {
    ...newTopLevelEntity(),
    type: 'association',
    typeHumanizedName: 'Association',
    isAbstract: false,
    sourceMap: newAssociationSourceMap(),
  };
}

/**
 *
 */
export const NoAssociation: Association = deepFreeze({
  ...newAssociation(),
  metaEdName: 'NoAssociation',
});
