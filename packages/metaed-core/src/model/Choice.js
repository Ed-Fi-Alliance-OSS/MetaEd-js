// @flow
import type { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import type { ModelBase } from './ModelBase';

export type ChoiceSourceMap = TopLevelEntitySourceMap;

export function newChoiceSourceMap(): ChoiceSourceMap {
  return newTopLevelEntitySourceMap();
}

export type Choice = {
  sourceMap: ChoiceSourceMap,
  ...$Exact<TopLevelEntity>,
};

export function newChoice(): Choice {
  return {
    ...newTopLevelEntity(),
    type: 'choice',
    typeHumanizedName: 'Choice',
    sourceMap: newChoiceSourceMap(),
  };
}

export const asChoice = (x: ModelBase): Choice => ((x: any): Choice);
