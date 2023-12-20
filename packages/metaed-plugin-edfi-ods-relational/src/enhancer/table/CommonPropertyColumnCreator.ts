import { EntityProperty, MetaEdPropertyPath, SemVer, TopLevelEntity } from '@edfi/metaed-core';
import { collectColumns } from './CommonAndChoicePropertyColumnCreatorBase';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';

export function commonPropertyColumnCreator(
  originalEntity: TopLevelEntity,
  property: EntityProperty,
  strategy: BuildStrategy,
  currentPropertyPath: MetaEdPropertyPath,
  targetTechnologyVersion: SemVer,
): Column[] {
  return collectColumns(originalEntity, property, strategy, currentPropertyPath, targetTechnologyVersion);
}
