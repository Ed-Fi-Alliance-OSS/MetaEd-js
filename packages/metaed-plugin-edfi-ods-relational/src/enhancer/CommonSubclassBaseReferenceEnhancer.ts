// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, CommonSubclass } from '@edfi/metaed-core';

const enhancerName = 'CommonSubclassBaseReferenceEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'commonSubclass').forEach((entity) => {
    const commonSubclass = entity as CommonSubclass;
    if (commonSubclass.baseEntity == null) return;
    commonSubclass.data.edfiOdsRelational.odsProperties.push(
      ...commonSubclass.baseEntity.data.edfiOdsRelational.odsProperties,
    );
    commonSubclass.data.edfiOdsRelational.odsIdentityProperties.push(
      ...commonSubclass.baseEntity.data.edfiOdsRelational.odsIdentityProperties,
    );
  });

  return {
    enhancerName,
    success: true,
  };
}
