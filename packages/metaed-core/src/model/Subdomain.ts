// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newDomain } from './Domain';
import { Domain } from './Domain';
import { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';
import { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import { DomainItem } from './DomainItem';

export interface SubdomainSourceMap extends TopLevelEntitySourceMap {
  domainItems: SourceMap[];
  entities: SourceMap[];
  parent: SourceMap;
  parentMetaEdName: SourceMap;
  position: SourceMap;
}

/**
 *
 */
export function newSubdomainSourceMap(): SubdomainSourceMap {
  return {
    ...newTopLevelEntitySourceMap(),
    domainItems: [],
    entities: [],
    parent: NoSourceMap,
    parentMetaEdName: NoSourceMap,
    position: NoSourceMap,
  };
}

export interface Subdomain extends TopLevelEntity {
  sourceMap: SubdomainSourceMap;
  domainItems: DomainItem[];
  entities: TopLevelEntity[];
  parent: Domain;
  parentMetaEdName: string;
  position: number;
}

/**
 *
 */
export function newSubdomain(): Subdomain {
  return {
    ...newTopLevelEntity(),
    type: 'subdomain',
    typeHumanizedName: 'Subdomain',
    domainItems: [],
    entities: [],
    parent: newDomain(),
    parentMetaEdName: '',
    position: 0,
    sourceMap: newSubdomainSourceMap(),
  };
}
