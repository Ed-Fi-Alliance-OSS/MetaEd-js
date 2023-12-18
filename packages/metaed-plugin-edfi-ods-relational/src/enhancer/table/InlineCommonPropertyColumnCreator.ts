import { EntityProperty, MetaEdPropertyPath, SemVer } from '@edfi/metaed-core';
import { collectColumns } from './CommonAndChoicePropertyColumnCreatorBase';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';

export function inlineCommonPropertyColumnCreator(
  property: EntityProperty,
  strategy: BuildStrategy,
  currentPropertyPath: MetaEdPropertyPath,
  targetTechnologyVersion: SemVer,
): Column[] {
  return collectColumns(
    property,
    strategy.appendParentContextProperty(property),
    currentPropertyPath,
    targetTechnologyVersion,
  );
}
