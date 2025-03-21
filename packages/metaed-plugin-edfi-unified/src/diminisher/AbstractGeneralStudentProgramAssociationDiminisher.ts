// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { MetaEdEnvironment, EnhancerResult, Association, ModelBase, Namespace } from '@edfi/metaed-core';
import { versionSatisfies, V3OrGreater, getEntitiesOfType, asAssociation } from '@edfi/metaed-core';

// METAED-769
// Forces GeneralStudentProgramAssociation to be abstract
// Pending fix in METAED-766 to add language support for abstract associations.
const enhancerName = 'AbstractGeneralStudentProgramAssociationDiminisher';
const targetVersions: string = V3OrGreater;

const generalStudentProgramAssociationName = 'GeneralStudentProgramAssociation';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: true };

  const generalStudentProgramAssociation: Association = R.head(
    getEntitiesOfType(coreNamespace.entity, 'association')
      .map((entity: ModelBase) => asAssociation(entity))
      .filter((association: Association) => association.metaEdName === generalStudentProgramAssociationName),
  );

  if (generalStudentProgramAssociation != null) generalStudentProgramAssociation.isAbstract = true;

  return {
    enhancerName,
    success: true,
  };
}
