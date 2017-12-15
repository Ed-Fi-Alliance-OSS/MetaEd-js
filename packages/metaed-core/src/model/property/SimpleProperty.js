// @flow
import { EntityProperty, EntityPropertySourceMap, newEntityPropertyFields } from './EntityProperty';
import { NoSharedSimple } from '../SharedSimple';
import type { SharedDecimal } from '../SharedDecimal';
import type { SharedInteger } from '../SharedInteger';
import type { SharedSimple } from '../SharedSimple';
import type { SharedString } from '../SharedString';
import type { SourceMap } from './../SourceMap';

export class SimplePropertySourceMap extends EntityPropertySourceMap {
  referencedEntity: ?SourceMap;
}

export class SimpleProperty extends EntityProperty {
  referencedEntity: SharedDecimal | SharedInteger | SharedString | SharedSimple;
}

export function newSimplePropertyFields() {
  return Object.assign({}, newEntityPropertyFields(), {
    referencedEntity: NoSharedSimple,
  });
}

export function newSimpleProperty(): SimpleProperty {
  return Object.assign(new SimpleProperty(), newSimplePropertyFields());
}

export const asSimpleProperty = (x: EntityProperty): SimpleProperty => ((x: any): SimpleProperty);
