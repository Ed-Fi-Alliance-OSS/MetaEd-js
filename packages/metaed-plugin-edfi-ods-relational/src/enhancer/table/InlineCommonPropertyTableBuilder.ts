// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EntityProperty, ReferentialProperty } from '@edfi/metaed-core';
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
  const inlineCommonProperty: ReferentialProperty = property as ReferentialProperty;

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
