import { EntityProperty, SemVer } from '@edfi/metaed-core';
import { collectColumns } from './CommonPropertyColumnCreatorBase';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';

export function inlineCommonPropertyColumnCreator(
  property: EntityProperty,
  strategy: BuildStrategy,
  targetTechnologyVersion: SemVer,
): Column[] {
  return collectColumns(property, strategy.appendParentContextProperty(property), targetTechnologyVersion);
}
