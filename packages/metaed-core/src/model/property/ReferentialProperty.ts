// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EntityProperty, EntityPropertySourceMap } from './EntityProperty';
import { newEntityPropertySourceMap, newEntityProperty } from './EntityProperty';
import { SourceMap } from '../SourceMap';
import { NoSourceMap } from '../SourceMap';
import { TopLevelEntity } from '../TopLevelEntity';
import { NoTopLevelEntity } from '../TopLevelEntity';
import { MergeDirective } from './MergeDirective';

export interface ReferentialPropertySourceMap extends EntityPropertySourceMap {
  referencedEntity: SourceMap;
  referencedEntityDeprecated: SourceMap;
  mergeDirectives: SourceMap[];
}

/**
 *
 */
export function newReferentialPropertySourceMap(): ReferentialPropertySourceMap {
  return {
    ...newEntityPropertySourceMap(),
    referencedEntity: NoSourceMap,
    referencedEntityDeprecated: NoSourceMap,
    mergeDirectives: [],
  };
}

export interface ReferentialProperty extends EntityProperty {
  sourceMap: ReferentialPropertySourceMap;
  referencedEntity: TopLevelEntity;
  referencedEntityDeprecated: boolean;
  mergeDirectives: MergeDirective[];
}

/**
 *
 */
export function newReferentialProperty(): ReferentialProperty {
  return {
    ...newEntityProperty(),
    referencedEntity: NoTopLevelEntity,
    referencedEntityDeprecated: false,
    mergeDirectives: [],
    sourceMap: newReferentialPropertySourceMap(),
  };
}
