// @flow
import type { SourceMap } from './SourceMap';
import { ModelBase, ModelBaseSourceMap } from './ModelBase';
import type { EntityProperty } from './property/EntityProperty';
import { newNamespaceInfo } from './NamespaceInfo';

export class IntegerTypeSourceMap extends ModelBaseSourceMap {
  documentationInherited: ?SourceMap;
  isShort: ?SourceMap;
  minValue: ?SourceMap;
  maxValue: ?SourceMap;
}

// Note these are XSD specific with the advent of SharedInteger, and creation should be move to XSD enhancers
export class IntegerType extends ModelBase {
  generatedSimpleType: boolean;
  documentationInherited: boolean;
  typeHumanizedName: string;
  isShort: boolean;
  minValue: string;
  maxValue: string;
  referringSimpleProperties: Array<EntityProperty>;
  sourceMap: IntegerTypeSourceMap;
}

export function newIntegerType(): IntegerType {
  return Object.assign(new IntegerType(), {
    type: 'integerType',
    documentation: '',
    metaEdName: '',
    metaEdId: '',
    namespaceInfo: newNamespaceInfo(),
    typeHumanizedName: 'Integer Type',
    isShort: false,
    minValue: '',
    maxValue: '',
    referringSimpleProperties: [],
    sourceMap: new IntegerTypeSourceMap(),
    data: {},
  });
}

export function newShortType(): IntegerType {
  return Object.assign(new IntegerType(), {
    type: 'integerType',
    typeHumanizedName: 'Integer Type',
    isShort: true,
    minValue: '',
    maxValue: '',
    referringSimpleProperties: [],
    sourceMap: new IntegerTypeSourceMap(),
    data: {},
  });
}

export const NoIntegerType: IntegerType = Object.assign(newIntegerType(), {
  metaEdName: 'NoIntegerType',
});

export const asIntegerType = (x: ModelBase): IntegerType => ((x: any): IntegerType);
