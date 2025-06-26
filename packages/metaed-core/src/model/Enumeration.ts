// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import { EnumerationItem } from './EnumerationItem';
import { SourceMap } from './SourceMap';

export interface EnumerationSourceMap extends TopLevelEntitySourceMap {
  enumerationItems: SourceMap[];
}

/**
 *
 */
export function newEnumerationSourceMap(): EnumerationSourceMap {
  return {
    ...newTopLevelEntitySourceMap(),
    enumerationItems: [],
  };
}

export interface Enumeration extends TopLevelEntity {
  sourceMap: EnumerationSourceMap;
  enumerationItems: EnumerationItem[];
}

/**
 *
 */
export function newEnumeration(): Enumeration {
  return {
    ...newTopLevelEntity(),
    type: 'enumeration',
    typeHumanizedName: 'Enumeration',
    enumerationItems: [],
    sourceMap: newEnumerationSourceMap(),
  };
}
