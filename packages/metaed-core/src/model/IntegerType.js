// @flow
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';
import type { ModelBase, ModelBaseSourceMap } from './ModelBase';
import { newModelBaseSourceMap } from './ModelBase';
import type { EntityProperty } from './property/EntityProperty';
import { newNamespaceInfo } from './NamespaceInfo';

export type IntegerTypeSourceMap = {
  ...$Exact<ModelBaseSourceMap>,
  generatedSimpleType: SourceMap,
  documentationInherited: SourceMap,
  isShort: SourceMap,
  minValue: SourceMap,
  maxValue: SourceMap,
};

export function newIntegerTypeSourceMap(): IntegerTypeSourceMap {
  return {
    ...newModelBaseSourceMap(),
    generatedSimpleType: NoSourceMap,
    documentationInherited: NoSourceMap,
    isShort: NoSourceMap,
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
  };
}

// Note these are XSD specific with the advent of SharedInteger, and creation should be move to XSD enhancers
export type IntegerType = {
  ...$Exact<ModelBase>,
  generatedSimpleType: boolean,
  documentationInherited: boolean,
  typeHumanizedName: string,
  isShort: boolean,
  minValue: string,
  maxValue: string,
  referringSimpleProperties: Array<EntityProperty>,
  sourceMap: IntegerTypeSourceMap,
};

export function newIntegerType(): IntegerType {
  return {
    type: 'integerType',
    documentation: '',
    metaEdName: '',
    metaEdId: '',
    namespaceInfo: newNamespaceInfo(),
    generatedSimpleType: false,
    documentationInherited: false,
    typeHumanizedName: 'Integer Type',
    isShort: false,
    minValue: '',
    maxValue: '',
    referringSimpleProperties: [],
    sourceMap: newIntegerTypeSourceMap(),
    data: {},
    config: {},
  };
}

export function newShortType(): IntegerType {
  return {
    ...newIntegerType(),
    isShort: true,
  };
}

export const NoIntegerType: IntegerType = {
  ...newIntegerType(),
  metaEdName: 'NoIntegerType',
};

export const asIntegerType = (x: ModelBase): IntegerType => ((x: any): IntegerType);
