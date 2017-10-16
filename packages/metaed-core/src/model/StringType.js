// @flow
import type { SourceMap } from './SourceMap';
import { ModelBase, ModelBaseSourceMap } from './ModelBase';
import type { EntityProperty } from './property/EntityProperty';
import { newNamespaceInfo } from './NamespaceInfo';

export class StringTypeSourceMap extends ModelBaseSourceMap {
  documentationInherited: ?SourceMap;
  minLength: ?SourceMap;
  maxLength: ?SourceMap;
}

export class StringType extends ModelBase {
  generatedSimpleType: boolean;
  documentationInherited: boolean;
  typeHumanizedName: string;
  minLength: string;
  maxLength: string;
  referringSimpleProperties: Array<EntityProperty>;
  sourceMap: StringTypeSourceMap;
}

export function newStringType(): StringType {
  return Object.assign(new StringType(), {
    type: 'stringType',
    documentation: '',
    metaEdName: '',
    metaEdId: '',
    namespaceInfo: newNamespaceInfo(),
    typeHumanizedName: 'String Type',
    minLength: '',
    maxLength: '',
    referringSimpleProperties: [],
    sourceMap: new StringTypeSourceMap(),
    data: {},
  });
}

export const NoStringType: StringType = Object.assign(newStringType(), {
  metaEdName: 'NoStringType',
});

export const asStringType = (x: ModelBase): StringType => ((x: any): StringType);
