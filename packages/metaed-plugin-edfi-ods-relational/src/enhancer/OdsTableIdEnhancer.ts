// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllTopLevelEntitiesForNamespaces, normalizeEnumerationSuffix } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, ModelBase } from '@edfi/metaed-core';
import { DescriptorEdfiOds } from '../model/Descriptor';

const enhancerName = 'OdsTableIdEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllTopLevelEntitiesForNamespaces(Array.from(metaEd.namespace.values())).forEach((entity: ModelBase) => {
    if (entity.type === 'descriptor') {
      entity.data.edfiOdsRelational.odsTableId = (entity.data.edfiOdsRelational as DescriptorEdfiOds).odsDescriptorName;
    } else if (entity.type === 'enumeration' || entity.type === 'schoolYearEnumeration') {
      entity.data.edfiOdsRelational.odsTableId = normalizeEnumerationSuffix(entity.metaEdName);
    } else {
      entity.data.edfiOdsRelational.odsTableId = entity.metaEdName;
    }
  });

  return {
    enhancerName,
    success: true,
  };
}
