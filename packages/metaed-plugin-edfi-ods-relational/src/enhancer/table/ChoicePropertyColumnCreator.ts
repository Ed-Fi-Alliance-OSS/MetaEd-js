import { EntityProperty, SemVer } from '@edfi/metaed-core';
import { collectColumns } from './CommonPropertyColumnCreatorBase';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';

export function choicePropertyColumnCreator(
  property: EntityProperty,
  strategy: BuildStrategy,
  targetTechnologyVersion: SemVer,
): Column[] {
  return collectColumns(property, strategy, targetTechnologyVersion);
}
