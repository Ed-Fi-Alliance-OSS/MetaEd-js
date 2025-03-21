// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { MetaEdEnvironment, EnhancerResult, Interchange, InterchangeExtension } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { MergedInterchange } from '../model/MergedInterchange';
import { newMergedInterchange, addMergedInterchangeToRepository } from '../model/MergedInterchange';
import { ModelBaseEdfiXsd } from '../model/ModelBase';

const enhancerName = 'MergedInterchangeEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Build merged interchanges for all the interchanges, in any namespace
  (getAllEntitiesOfType(metaEd, 'interchange') as Interchange[]).forEach((interchange: Interchange) => {
    const mergedInterchange: MergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchange.metaEdName,
      repositoryId: interchange.metaEdName,
      documentation: interchange.documentation,
      extendedDocumentation: interchange.extendedDocumentation,
      useCaseDocumentation: interchange.useCaseDocumentation,
      namespace: interchange.namespace,
      elements: interchange.elements,
      identityTemplates: interchange.identityTemplates,
    };

    addMergedInterchangeToRepository(metaEd, mergedInterchange);
  });

  // Build merged interchanges for all the extensions in the extension namespace
  (getAllEntitiesOfType(metaEd, 'interchangeExtension') as InterchangeExtension[]).forEach(
    (interchangeExtension: InterchangeExtension) => {
      const interchange = interchangeExtension.baseEntity;
      if (!interchange) return;
      const mergedInterchange: MergedInterchange = {
        ...newMergedInterchange(),
        metaEdName: interchange.metaEdName,
        repositoryId: (interchangeExtension.data.edfiXsd as ModelBaseEdfiXsd).xsdMetaEdNameWithExtension(),
        documentation: interchange.documentation,
        extendedDocumentation: interchange.extendedDocumentation,
        useCaseDocumentation: interchange.useCaseDocumentation,
        namespace: interchangeExtension.namespace,
      };
      Object.assign(mergedInterchange, {
        elements: R.union(
          interchange.elements.filter((e) => mergedInterchange.elements.every((mie) => mie.metaEdName !== e.metaEdName)),
          interchangeExtension.elements,
        ),
        identityTemplates: R.union(
          interchangeExtension.identityTemplates,
          interchange.identityTemplates.filter((e) =>
            mergedInterchange.identityTemplates.every((mie) => mie.metaEdName !== e.metaEdName),
          ),
        ),
      });

      addMergedInterchangeToRepository(metaEd, mergedInterchange);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
