import { ModelBase, EntityProperty } from '@edfi/metaed-core';

export function groupByMetaEdName<T extends ModelBase | EntityProperty>(modelItems: T[]): Map<string, T[]> {
  return modelItems.reduce((structure: Map<string, T[]>, modelItem: T) => {
    if (!structure.has(modelItem.metaEdName)) structure.set(modelItem.metaEdName, []);
    // @ts-ignore: previous line guarantees get will not be undefined
    structure.get(modelItem.metaEdName).push(modelItem);
    return structure;
  }, new Map());
}
