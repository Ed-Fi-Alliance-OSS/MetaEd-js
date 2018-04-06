// @flow
import type { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import type { EnumerationItem } from './EnumerationItem';
import type { SourceMap } from './SourceMap';
import type { ModelBase } from './ModelBase';

export type EnumerationSourceMap = {
  ...$Exact<TopLevelEntitySourceMap>,
  enumerationItems: Array<SourceMap>,
};

export function newEnumerationSourceMap(): EnumerationSourceMap {
  return {
    ...newTopLevelEntitySourceMap(),
    enumerationItems: [],
  };
}

export type Enumeration = {
  sourceMap: EnumerationSourceMap,
  ...$Exact<TopLevelEntity>,
  enumerationItems: Array<EnumerationItem>,
};

export function newEnumeration(): Enumeration {
  return {
    ...newTopLevelEntity(),
    type: 'enumeration',
    typeHumanizedName: 'Enumeration',
    enumerationItems: [],
    sourceMap: newEnumerationSourceMap(),
  };
}

export const asEnumeration = (x: ModelBase): Enumeration => ((x: any): Enumeration);
