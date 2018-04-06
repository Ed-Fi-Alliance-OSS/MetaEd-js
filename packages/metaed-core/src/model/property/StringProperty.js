// @flow
import type { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import type { EntityProperty } from './EntityProperty';
import type { SourceMap } from './../SourceMap';
import { NoSourceMap } from './../SourceMap';

export type StringPropertySourceMap = {
  ...$Exact<SimplePropertySourceMap>,
  minLength: SourceMap,
  maxLength: SourceMap,
};

export function newStringPropertySourceMap(): StringPropertySourceMap {
  return {
    ...newSimplePropertySourceMap(),
    minLength: NoSourceMap,
    maxLength: NoSourceMap,
  };
}

export type StringProperty = {
  sourceMap: StringPropertySourceMap,
  ...$Exact<SimpleProperty>,
  minLength: ?string,
  maxLength: ?string,
};

export function newStringProperty(): StringProperty {
  return {
    ...newSimpleProperty(),
    type: 'string',
    typeHumanizedName: 'String Property',
    minLength: null,
    maxLength: null,
    sourceMap: newStringPropertySourceMap(),
  };
}

export const asStringProperty = (x: EntityProperty): StringProperty => ((x: any): StringProperty);
