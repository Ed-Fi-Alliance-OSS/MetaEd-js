// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, CommonExtension } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { metaEdNameWithExtensionIncludingSuffix } from './shared/AddMetaEdNameWithExtension';

export interface CommonExtensionEdfiXsd {
  xsdMetaEdNameWithExtension: () => string;
}

const enhancerName = 'CommonExtensionSetupEnhancer';

export function addCommonExtensionEdfiXsdTo(commonExtension: CommonExtension) {
  if (commonExtension.data.edfiXsd == null) commonExtension.data.edfiXsd = {};

  Object.assign(commonExtension.data.edfiXsd, {
    xsdMetaEdNameWithExtension: metaEdNameWithExtensionIncludingSuffix(commonExtension),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'commonExtension') as CommonExtension[]).forEach((commonExtension: CommonExtension) => {
    addCommonExtensionEdfiXsdTo(commonExtension);
  });

  return {
    enhancerName,
    success: true,
  };
}
