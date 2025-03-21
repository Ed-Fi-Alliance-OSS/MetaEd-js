// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, ModelBase } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { metaEdNameWithExtension } from './shared/AddMetaEdNameWithExtension';

export interface ModelBaseEdfiXsd {
  xsdMetaEdNameWithExtension: () => string;
}

const enhancerName = 'ModelBaseSetupEnhancer';

export function addModelBaseEdfiXsdTo(modelBase: ModelBase) {
  if (modelBase.data.edfiXsd == null) modelBase.data.edfiXsd = {};

  Object.assign(modelBase.data.edfiXsd, {
    xsdMetaEdNameWithExtension: metaEdNameWithExtension(modelBase),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'association',
    'associationSubclass',
    'choice',
    'common',
    'commonSubclass',
    'decimalType',
    'domain',
    'domainEntity',
    'domainEntitySubclass',
    'enumeration',
    'integerType',
    'interchange',
    'interchangeExtension',
    'mapTypeEnumeration',
    'schoolYearEnumeration',
    'sharedDecimal',
    'sharedInteger',
    'sharedString',
    'stringType',
  ).forEach((entity) => {
    addModelBaseEdfiXsdTo(entity);
  });

  return {
    enhancerName,
    success: true,
  };
}
