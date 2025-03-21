// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, AssociationSubclass } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import {
  typeGroupAssociation,
  createDefaultComplexType,
  createIdentityType,
  createReferenceType,
} from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddAssociationSubclassComplexTypesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'associationSubclass') as AssociationSubclass[]).forEach(
    (associationSubclass: AssociationSubclass) => {
      if (associationSubclass.baseEntity == null) return;

      associationSubclass.data.edfiXsd.xsdComplexTypes = createDefaultComplexType(
        associationSubclass,
        typeGroupAssociation,
        associationSubclass.baseEntity.data.edfiXsd.xsdMetaEdNameWithExtension(),
      );
      associationSubclass.data.edfiXsd.xsdIdentityType = createIdentityType(associationSubclass);
      associationSubclass.data.edfiXsd.xsdReferenceType = createReferenceType(associationSubclass);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
