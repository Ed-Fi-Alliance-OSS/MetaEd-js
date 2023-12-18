import type { EntityProperty, MergeDirective, ReferentialProperty } from '@edfi/metaed-core';
import { cloneColumn } from '../../model/database/Column';
import { BuildStrategy } from './BuildStrategy';
import { TableBuilderParameters, buildTableFor } from './TableBuilder';
import { appendToPropertyPath } from '../EnhancerHelper';

export function choicePropertyTableBuilder({
  property,
  parentTableStrategy,
  parentPrimaryKeys,
  buildStrategy,
  tables,
  targetTechnologyVersion,
  currentPropertyPath,
}: TableBuilderParameters): void {
  const choice: ReferentialProperty = property as ReferentialProperty;
  let strategy: BuildStrategy = buildStrategy;

  if (choice.mergeDirectives.length > 0) {
    strategy = strategy.skipPath(choice.mergeDirectives.map((x: MergeDirective) => x.sourcePropertyPathStrings.slice(1)));
  }

  choice.referencedEntity.data.edfiOdsRelational.odsProperties.forEach((odsProperty: EntityProperty) => {
    buildTableFor({
      property: odsProperty,
      parentTableStrategy,
      parentPrimaryKeys: parentPrimaryKeys.map((pk) => cloneColumn(pk)),
      buildStrategy: strategy.makeLeafColumnsNullable(),
      tables,
      targetTechnologyVersion,
      parentIsRequired: choice.isRequired,
      currentPropertyPath: appendToPropertyPath(currentPropertyPath, odsProperty),
    });
  });
}
