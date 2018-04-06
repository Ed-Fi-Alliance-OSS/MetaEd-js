// @flow
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import type { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';
import type { ModelBase } from './ModelBase';

export type DomainEntitySourceMap = {
  ...$Exact<TopLevelEntitySourceMap>,
  isAbstract: SourceMap,
};

export function newDomainEntitySourceMap(): DomainEntitySourceMap {
  return {
    ...newTopLevelEntitySourceMap(),
    isAbstract: NoSourceMap,
  };
}

export type DomainEntity = {
  sourceMap: DomainEntitySourceMap,
  ...$Exact<TopLevelEntity>,
  isAbstract: boolean,
};

export function newDomainEntity(): DomainEntity {
  return {
    ...newTopLevelEntity(),
    type: 'domainEntity',
    typeHumanizedName: 'Domain Entity',
    isAbstract: false,
    sourceMap: newDomainEntitySourceMap(),
  };
}

export function newAbstractEntity(): DomainEntity {
  return {
    ...newDomainEntity(),
    typeHumanizedName: 'Abstract Entity',
    isAbstract: true,
  };
}

export const NoDomainEntity: DomainEntity = {
  ...newDomainEntity(),
  metaEdName: 'NoDomainEntity',
};

export const asDomainEntity = (x: ModelBase): DomainEntity => ((x: any): DomainEntity);
