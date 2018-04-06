// @flow
import type { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';
import type { CommonExtension } from './CommonExtension';
import type { ModelBase } from './ModelBase';

export type CommonSourceMap = {
  ...$Exact<TopLevelEntitySourceMap>,
  extender: SourceMap,
  inlineInOds: SourceMap,
};

export function newCommonSourceMap(): CommonSourceMap {
  return {
    ...newTopLevelEntitySourceMap(),
    extender: NoSourceMap,
    inlineInOds: NoSourceMap,
  };
}

export type Common = {
  sourceMap: CommonSourceMap,
  ...$Exact<TopLevelEntity>,
  extender: ?CommonExtension,
  inlineInOds: boolean,
};

export function newCommon(): Common {
  return {
    ...newTopLevelEntity(),
    type: 'common',
    typeHumanizedName: 'Common',
    extender: null,
    // belongs in artifact-specific once 'Inline Common' is replaced by heuristic
    inlineInOds: false,
    sourceMap: newCommonSourceMap(),
  };
}

export function newInlineCommon(): Common {
  return {
    ...newCommon(),
    typeHumanizedName: 'Inline Common',
    // belongs in artifact-specific once 'Inline Common' is replaced by heuristic
    inlineInOds: true,
  };
}

export const asCommon = (x: ModelBase): Common => ((x: any): Common);

export const asInlineCommon = (x: ModelBase): Common => ((x: any): Common);
