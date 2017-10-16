// @flow
import type { SourceMap } from './SourceMap';
import { ModelBase, ModelBaseSourceMap } from './ModelBase';
import type { EntityProperty } from './property/EntityProperty';
import { newNamespaceInfo } from './NamespaceInfo';

export class DecimalTypeSourceMap extends ModelBaseSourceMap {
  documentationInherited: ?SourceMap;
  totalDigits: ?SourceMap;
  decimalPlaces: ?SourceMap;
  minValue: ?SourceMap;
  maxValue: ?SourceMap;
}

// Note these are XSD specific with the advent of SharedDecimal, and creation should be move to XSD enhancers
export class DecimalType extends ModelBase {
  generatedSimpleType: boolean;
  documentationInherited: boolean;
  typeHumanizedName: string;
  totalDigits: string;
  decimalPlaces: string;
  minValue: string;
  maxValue: string;
  referringSimpleProperties: Array<EntityProperty>;
  sourceMap: DecimalTypeSourceMap;
}

export function newDecimalType(): DecimalType {
  return Object.assign(new DecimalType(), {
    type: 'decimalType',
    documentation: '',
    metaEdName: '',
    metaEdId: '',
    namespaceInfo: newNamespaceInfo(),
    typeHumanizedName: 'Decimal Type',
    totalDigits: '',
    decimalPlaces: '',
    minValue: '',
    maxValue: '',
    referringSimpleProperties: [],
    sourceMap: new DecimalTypeSourceMap(),
    data: {},
  });
}

export const NoDecimalType: DecimalType = Object.assign(newDecimalType(), {
  metaEdName: 'NoDecimalType',
});

export const asDecimalType = (x: ModelBase): DecimalType => ((x: any): DecimalType);
