// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { InterchangeItem } from './InterchangeItem';
import { SourceMap, NoSourceMap } from './SourceMap';
import { ModelBaseSourceMap, newModelBaseSourceMap, newModelBase, ModelBase } from './ModelBase';

export interface InterchangeSourceMap extends ModelBaseSourceMap {
  elements: SourceMap[];
  identityTemplates: SourceMap[];
  extendedDocumentation: SourceMap;
  useCaseDocumentation: SourceMap;
  baseEntityName: SourceMap;
  baseEntityNamespaceName: SourceMap;
  baseEntity: SourceMap;
}

/**
 *
 */
export function newInterchangeSourceMap(): InterchangeSourceMap {
  return {
    ...newModelBaseSourceMap(),
    elements: [],
    identityTemplates: [],
    extendedDocumentation: NoSourceMap,
    useCaseDocumentation: NoSourceMap,
    baseEntityName: NoSourceMap,
    baseEntityNamespaceName: NoSourceMap,
    baseEntity: NoSourceMap,
  };
}

export interface Interchange extends ModelBase {
  typeHumanizedName: string;
  elements: InterchangeItem[];
  identityTemplates: InterchangeItem[];
  extendedDocumentation: string;
  useCaseDocumentation: string;
  baseEntityName: string;
  baseEntityNamespaceName: string;
  baseEntity: Interchange | null;
  sourceMap: InterchangeSourceMap;
}

/**
 *
 */
export function newInterchange(): Interchange {
  return {
    ...newModelBase(),
    type: 'interchange',
    typeHumanizedName: 'Interchange',
    elements: [],
    identityTemplates: [],
    extendedDocumentation: '',
    useCaseDocumentation: '',
    baseEntityName: '',
    baseEntityNamespaceName: '',
    baseEntity: null,
    sourceMap: newInterchangeSourceMap(),
  };
}

/**
 *
 */
export const NoInterchange: Interchange = deepFreeze({
  ...newInterchange(),
  metaEdName: 'NoInterchange',
});
