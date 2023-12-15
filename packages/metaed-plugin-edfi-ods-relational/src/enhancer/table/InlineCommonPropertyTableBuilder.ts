import { EntityProperty, ReferentialProperty } from '@edfi/metaed-core';
import { asReferentialProperty } from '@edfi/metaed-core';
import { BuildStrategy } from './BuildStrategy';
import { TableBuilderParameters, buildTableFor } from './TableBuilder';

export function inlineCommonPropertyTableBuilder({
  property,
  parentTableStrategy,
  parentPrimaryKeys,
  buildStrategy,
  tables,
  targetTechnologyVersion,
}: TableBuilderParameters): void {
  const inlineCommonProperty: ReferentialProperty = asReferentialProperty(property);

  let strategy: BuildStrategy = buildStrategy.appendParentContextProperty(inlineCommonProperty);
  if (inlineCommonProperty.isOptional) {
    strategy = strategy.makeLeafColumnsNullable();
  }

  inlineCommonProperty.referencedEntity.data.edfiOdsRelational.odsProperties.forEach((odsProperty: EntityProperty) => {
    buildTableFor({
      property: odsProperty,
      parentTableStrategy,
      parentPrimaryKeys,
      buildStrategy: strategy,
      tables,
      targetTechnologyVersion,
      parentIsRequired: inlineCommonProperty.isRequired,
    });
  });
}
