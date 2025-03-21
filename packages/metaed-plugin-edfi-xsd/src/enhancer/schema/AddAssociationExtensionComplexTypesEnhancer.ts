// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, AssociationExtension } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { TopLevelEntityEdfiXsd } from '../../model/TopLevelEntity';
import {
  typeGroupAssociation,
  createDefaultComplexType,
  createCoreRestrictionForExtensionParent,
  restrictionName,
} from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddAssociationExtensionComplexTypesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'associationExtension') as AssociationExtension[]).forEach(
    (associationExtension: AssociationExtension) => {
      if (associationExtension.data.edfiXsd.xsdHasExtensionOverrideProperties()) {
        const associationExtensionEdfiXsd: TopLevelEntityEdfiXsd = associationExtension.data.edfiXsd;
        associationExtensionEdfiXsd.xsdComplexTypes = [createCoreRestrictionForExtensionParent(associationExtension)];
        associationExtensionEdfiXsd.xsdComplexTypes.push(
          ...createDefaultComplexType(associationExtension, typeGroupAssociation, restrictionName(associationExtension)),
        );
      } else {
        if (associationExtension.baseEntity == null) return;

        associationExtension.data.edfiXsd.xsdComplexTypes = createDefaultComplexType(
          associationExtension,
          typeGroupAssociation,
          associationExtension.baseEntity.data.edfiXsd.xsdMetaEdNameWithExtension(),
        );
      }
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
