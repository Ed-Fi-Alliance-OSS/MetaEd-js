import deepFreeze from 'deep-freeze';
import { EntityProperty, NoEntityProperty } from './EntityProperty';
import { MergeDirective, NoMergeDirective } from './MergeDirective';

/**
 * A single MergeDirective and the parent property where it is located.
 */
export type MergeDirectiveInfo = {
  parentProperty: EntityProperty;
  mergeDirective: MergeDirective;
};

/**
 *
 */
export function newMergeDirectiveInfo(): MergeDirectiveInfo {
  return {
    parentProperty: NoEntityProperty,
    mergeDirective: NoMergeDirective,
  };
}

/**
 *
 */
export const NoMergeDirectiveInfo: MergeDirectiveInfo = deepFreeze({
  ...newMergeDirectiveInfo(),
});
