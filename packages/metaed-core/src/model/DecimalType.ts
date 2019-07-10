import deepFreeze from 'deep-freeze';
import { SourceMap, NoSourceMap } from './SourceMap';
import { ModelBase, ModelBaseSourceMap, newModelBaseSourceMap, newModelBase } from './ModelBase';
import { EntityProperty } from './property/EntityProperty';
import { newNamespace } from './Namespace';

export interface DecimalTypeSourceMap extends ModelBaseSourceMap {
  documentationInherited: SourceMap;
  totalDigits: SourceMap;
  decimalPlaces: SourceMap;
  minValue: SourceMap;
  maxValue: SourceMap;
}

export function newDecimalTypeSourceMap(): DecimalTypeSourceMap {
  return {
    ...newModelBaseSourceMap(),
    documentationInherited: NoSourceMap,
    totalDigits: NoSourceMap,
    decimalPlaces: NoSourceMap,
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
  };
}

// Note these are XSD specific with the advent of SharedDecimal, and creation should be move to XSD enhancers
export interface DecimalType extends ModelBase {
  generatedSimpleType: boolean;
  documentationInherited: boolean;
  typeHumanizedName: string;
  totalDigits: string;
  decimalPlaces: string;
  minValue: string;
  maxValue: string;
  referringSimpleProperties: EntityProperty[];
  sourceMap: DecimalTypeSourceMap;
}

export function newDecimalType(): DecimalType {
  return {
    ...newModelBase(),
    namespace: newNamespace(),
    type: 'decimalType',
    generatedSimpleType: false,
    documentationInherited: false,
    typeHumanizedName: 'Decimal Type',
    totalDigits: '',
    decimalPlaces: '',
    minValue: '',
    maxValue: '',
    referringSimpleProperties: [],
    sourceMap: newDecimalTypeSourceMap(),
  };
}

export const NoDecimalType: DecimalType = deepFreeze({
  ...newDecimalType(),
  metaEdName: 'NoDecimalType',
});

export const asDecimalType = (x: ModelBase): DecimalType => x as DecimalType;
