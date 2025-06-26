// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';
import { SourceMap } from '../SourceMap';
import { NoSourceMap } from '../SourceMap';

export interface DomainEntityPropertySourceMap extends ReferentialPropertySourceMap {
  potentiallyLogical: SourceMap;
  isWeak: SourceMap;
  definesAssociation: SourceMap;
}

/**
 *
 */
export function newDomainEntityPropertySourceMap(): DomainEntityPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
    potentiallyLogical: NoSourceMap,
    isWeak: NoSourceMap,
    definesAssociation: NoSourceMap,
  };
}

export interface DomainEntityProperty extends ReferentialProperty {
  sourceMap: DomainEntityPropertySourceMap;
  potentiallyLogical: boolean;
  isWeak: boolean;
  definesAssociation: boolean;
}

/**
 *
 */
export function newDomainEntityProperty(): DomainEntityProperty {
  return {
    ...newReferentialProperty(),
    type: 'domainEntity',
    typeHumanizedName: 'Domain Entity Property',
    potentiallyLogical: false,
    isWeak: false,
    definesAssociation: false,
    sourceMap: newDomainEntityPropertySourceMap(),
  };
}
