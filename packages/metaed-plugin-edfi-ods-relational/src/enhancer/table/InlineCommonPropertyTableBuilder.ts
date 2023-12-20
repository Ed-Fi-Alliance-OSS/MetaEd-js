import { EntityProperty, ReferentialProperty } from '@edfi/metaed-core';
import { asReferentialProperty } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { TableBuilderParameters, buildTableFor } from './TableBuilder';
import { appendToPropertyPath } from '../EnhancerHelper';

export function inlineCommonPropertyTableBuilder({
  originalEntity,
  property,
  parentTableStrategy,
  parentPrimaryKeys,
  buildStrategy,
  tables,
  currentPropertyPath,
  targetTechnologyVersion,
}: TableBuilderParameters): void {
  const inlineCommonProperty: ReferentialProperty = asReferentialProperty(property);

  let strategy: BuildStrategy = buildStrategy.appendParentContextProperty(inlineCommonProperty);
  if (inlineCommonProperty.isOptional) {
    strategy = strategy.makeLeafColumnsNullable();
  }

  inlineCommonProperty.referencedEntity.data.edfiOdsRelational.odsProperties.forEach((odsProperty: EntityProperty) => {
    buildTableFor({
      originalEntity,
      property: odsProperty,
      parentTableStrategy,
      parentPrimaryKeys,
      buildStrategy: strategy,
      tables,
      targetTechnologyVersion,
      parentIsRequired: inlineCommonProperty.isRequired,
      currentPropertyPath: appendToPropertyPath(currentPropertyPath, odsProperty),
    });
  });
}
