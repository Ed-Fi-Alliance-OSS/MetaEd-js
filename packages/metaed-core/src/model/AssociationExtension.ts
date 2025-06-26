// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';

/**
 *
 */
export type AssociationExtensionSourceMap = TopLevelEntitySourceMap;

/**
 *
 */
export function newAssociationExtensionSourceMap(): AssociationExtensionSourceMap {
  return newTopLevelEntitySourceMap();
}

export interface AssociationExtension extends TopLevelEntity {
  sourceMap: AssociationExtensionSourceMap;
}

/**
 *
 */
export function newAssociationExtension(): AssociationExtension {
  return {
    ...newTopLevelEntity(),
    type: 'associationExtension',
    typeHumanizedName: 'Association Extension',
    sourceMap: newAssociationExtensionSourceMap(),
  };
}
