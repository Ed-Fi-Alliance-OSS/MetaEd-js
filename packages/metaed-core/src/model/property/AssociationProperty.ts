// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';
import { SourceMap } from '../SourceMap';
import { NoSourceMap } from '../SourceMap';

export interface AssociationPropertySourceMap extends ReferentialPropertySourceMap {
  potentiallyLogical: SourceMap;
  isWeak: SourceMap;
}

/**
 *
 */
export function newAssociationPropertySourceMap(): AssociationPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
    potentiallyLogical: NoSourceMap,
    isWeak: NoSourceMap,
  };
}

export interface AssociationProperty extends ReferentialProperty {
  sourceMap: AssociationPropertySourceMap;
  potentiallyLogical: boolean;
  isWeak: boolean;
}

/**
 *
 */
export function newAssociationProperty(): AssociationProperty {
  return {
    ...newReferentialProperty(),
    type: 'association',
    typeHumanizedName: 'Association Property',
    potentiallyLogical: false,
    isWeak: false,
    sourceMap: newAssociationPropertySourceMap(),
  };
}
