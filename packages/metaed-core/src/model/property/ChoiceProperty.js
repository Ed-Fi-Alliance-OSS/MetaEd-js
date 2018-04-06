// @flow
import type { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';
import type { EntityProperty } from './EntityProperty';

export type ChoicePropertySourceMap = ReferentialPropertySourceMap;

export function newChoicePropertySourceMap(): ChoicePropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
  };
}

export type ChoiceProperty = {
  sourceMap: ChoicePropertySourceMap,
  ...$Exact<ReferentialProperty>,
};

export function newChoiceProperty(): ChoiceProperty {
  return {
    ...newReferentialProperty(),
    type: 'choice',
    typeHumanizedName: 'Choice Property',
    sourceMap: newChoicePropertySourceMap(),
  };
}

export const asChoiceProperty = (x: EntityProperty): ChoiceProperty => ((x: any): ChoiceProperty);
