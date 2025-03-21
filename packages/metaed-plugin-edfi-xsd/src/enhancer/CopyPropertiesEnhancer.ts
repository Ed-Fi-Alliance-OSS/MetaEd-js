// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { getAllTopLevelEntitiesForNamespaces } from '@edfi/metaed-core';
import { TopLevelEntityEdfiXsd } from '../model/TopLevelEntity';

const enhancerName = 'CopyPropertiesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllTopLevelEntitiesForNamespaces(Array.from(metaEd.namespace.values())).forEach((entity) => {
    (entity.data.edfiXsd as TopLevelEntityEdfiXsd).xsdIdentityProperties.push(...entity.identityProperties);
  });

  return {
    enhancerName,
    success: true,
  };
}
