// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdPlugin } from '@edfi/metaed-core';
import { enhance as edfiHandbookRepositorySetup } from './model/EdfiHandbookRepository';
import { enhance as associationEnhancer } from './enhancer/AssociationEnhancer';
import { enhance as associationSubclassEnhancer } from './enhancer/AssociationSubclassEnhancer';
import { enhance as booleanEnhancer } from './enhancer/BooleanEnhancer';
import { enhance as choiceEnhancer } from './enhancer/ChoiceEnhancer';
import { enhance as commonEnhancer } from './enhancer/CommonEnhancer';
import { enhance as commonSubclassEnhancer } from './enhancer/CommonSubclassEnhancer';
import { enhance as currencyEnhancer } from './enhancer/CurrencyEnhancer';
import { enhance as dateEnhancer } from './enhancer/DateEnhancer';
import { enhance as decimalEnhancer } from './enhancer/DecimalEnhancer';
import { enhance as descriptorEnhancer } from './enhancer/DescriptorEnhancer';
import { enhance as domainEntityEnhancer } from './enhancer/DomainEntityEnhancer';
import { enhance as domainEntitySubclassEnhancer } from './enhancer/DomainEntitySubclassEnhancer';
import { enhance as enumerationEnhancer } from './enhancer/EnumerationEnhancer';
import { enhance as inlineCommonEnhancer } from './enhancer/InlineCommonEnhancer';
import { enhance as integerEnhancer } from './enhancer/IntegerEnhancer';
import { enhance as percentEnhancer } from './enhancer/PercentEnhancer';
import { enhance as stringEnhancer } from './enhancer/StringEnhancer';
import { enhance as timeIntervalEnhancer } from './enhancer/TimeIntervalEnhancer';
import { enhance as timeEnhancer } from './enhancer/TimeEnhancer';
import { enhance as yearEnhancer } from './enhancer/YearEnhancer';
import { enhance as modelReferencesUsedByEnhancer } from './enhancer/ModelReferencesUsedByEnhancer';
import { enhance as domainEnhancer } from './enhancer/DomainEnhancer';
import { generate as htmlGenerator } from './generator/EdFiDataHandbookAsHtmlIndexGenerator';
import { generate as excelGenerator } from './generator/EdFiDataHandbookAsExcelGenerator';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [
      edfiHandbookRepositorySetup,
      associationEnhancer,
      associationSubclassEnhancer,
      booleanEnhancer,
      choiceEnhancer,
      commonEnhancer,
      commonSubclassEnhancer,
      currencyEnhancer,
      dateEnhancer,
      decimalEnhancer,
      descriptorEnhancer,
      domainEntityEnhancer,
      domainEntitySubclassEnhancer,
      enumerationEnhancer,
      inlineCommonEnhancer,
      integerEnhancer,
      percentEnhancer,
      stringEnhancer,
      timeIntervalEnhancer,
      timeEnhancer,
      yearEnhancer,
      modelReferencesUsedByEnhancer,
      domainEnhancer,
    ],
    generator: [htmlGenerator, excelGenerator],
    shortName: 'edfiHandbook',
    configurationSchemas: new Map(),
  };
}
