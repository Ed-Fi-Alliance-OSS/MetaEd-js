// @flow
import type { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';
import type { SourceMap } from './../SourceMap';
import { NoSourceMap } from './../SourceMap';
import type { EntityProperty } from './EntityProperty';

export type DomainEntityPropertySourceMap = {
  ...$Exact<ReferentialPropertySourceMap>,
  isWeak: SourceMap,
};

export function newDomainEntityPropertySourceMap(): DomainEntityPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
    isWeak: NoSourceMap,
  };
}

export type DomainEntityProperty = {
  sourceMap: DomainEntityPropertySourceMap,
  ...$Exact<ReferentialProperty>,
  isWeak: boolean,
};

export function newDomainEntityProperty(): DomainEntityProperty {
  return {
    ...newReferentialProperty(),
    type: 'domainEntity',
    typeHumanizedName: 'Domain Entity Property',
    isWeak: false,
    sourceMap: newDomainEntityPropertySourceMap(),
  };
}

export const asDomainEntityProperty = (x: EntityProperty): DomainEntityProperty => ((x: any): DomainEntityProperty);
