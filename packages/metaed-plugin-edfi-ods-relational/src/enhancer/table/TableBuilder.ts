// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { CommonProperty, EntityProperty, MetaEdPropertyPath, SemVer, TopLevelEntity } from '@edfi/metaed-core';
import { choicePropertyTableBuilder } from './ChoicePropertyTableBuilder';
import { commonExtensionPropertyTableBuilder } from './CommonExtensionPropertyTableBuilder';
import { commonPropertyTableBuilder } from './CommonPropertyTableBuilder';
import { descriptorPropertyTableBuilder } from './DescriptorPropertyTableBuilder';
import { enumerationPropertyTableBuilder } from './EnumerationPropertyTableBuilder';
import { inlineCommonPropertyTableBuilder } from './InlineCommonPropertyTableBuilder';
import { referencePropertyTableBuilder } from './ReferencePropertyTableBuilder';
import { simplePropertyTableBuilder } from './SimplePropertyTableBuilder';
import { Column } from '../../model/database/Column';
import { Table } from '../../model/database/Table';
import { TableStrategy } from '../../model/database/TableStrategy';
import { BuildStrategy } from './BuildStrategy';

export type TableBuilderParameters = {
  property: EntityProperty;
  parentTableStrategy: TableStrategy;
  parentPrimaryKeys: Column[];
  buildStrategy: BuildStrategy;
  tables: Table[];
  targetTechnologyVersion: SemVer;
  parentIsRequired: boolean | null;
  /** The current property path for the given property */
  currentPropertyPath: MetaEdPropertyPath;
  /** The original entity responsible for creating this table/column */
  originalEntity: TopLevelEntity;
};

export function buildTableFor(tableBuilderParameters: TableBuilderParameters): void {
  switch (tableBuilderParameters.property.type) {
    case 'association':
    case 'domainEntity':
      return referencePropertyTableBuilder(tableBuilderParameters);

    case 'choice':
      return choicePropertyTableBuilder(tableBuilderParameters);
    case 'common':
      return (tableBuilderParameters.property as CommonProperty).isExtensionOverride
        ? commonExtensionPropertyTableBuilder(tableBuilderParameters)
        : commonPropertyTableBuilder(tableBuilderParameters);
    case 'inlineCommon':
      return inlineCommonPropertyTableBuilder(tableBuilderParameters);
    case 'descriptor':
      return descriptorPropertyTableBuilder(tableBuilderParameters);

    case 'enumeration':
    case 'schoolYearEnumeration':
      return enumerationPropertyTableBuilder(tableBuilderParameters);

    case 'boolean':
    case 'currency':
    case 'date':
    case 'datetime':
    case 'decimal':
    case 'duration':
    case 'integer':
    case 'percent':
    case 'sharedDecimal':
    case 'sharedInteger':
    case 'sharedShort':
    case 'sharedString':
    case 'short':
    case 'string':
    case 'time':
    case 'year':
      return simplePropertyTableBuilder(tableBuilderParameters);

    default:
      return undefined;
  }
}
