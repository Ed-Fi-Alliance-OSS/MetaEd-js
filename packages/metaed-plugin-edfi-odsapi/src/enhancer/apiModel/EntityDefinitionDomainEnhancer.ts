// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { EntityDefinition } from '../../model/apiModel/EntityDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { TopLevelEntityEdfiOdsApi } from '../../model/TopLevelEntity';
import { tableFor } from './EnhancerHelper';

const enhancerName = 'EntityDefinitionDomainEnhancer';

/**
 * Transfers domain membership information from TopLevelEntity objects to their corresponding
 * EntityDefinition objects in the API model, ensuring domain information is available in
 * the generated ApiModel.json output.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const namespaceOdsApi: NamespaceEdfiOdsApi = namespace.data.edfiOdsApi as NamespaceEdfiOdsApi;
    const { entityDefinitions }: { entityDefinitions: EntityDefinition[] } = namespaceOdsApi.domainModelDefinition;

    entityDefinitions.forEach((entityDefinition: EntityDefinition) => {
      const table = tableFor(metaEd, namespace, entityDefinition.name);
      if (table == null) return;

      // Get the parent entity from the table
      const { parentEntity } = table;
      if (!parentEntity) return;

      // Get the domains from the parent entity's edfiOdsApi data
      const edfiOdsApiData: TopLevelEntityEdfiOdsApi | undefined = parentEntity.data.edfiOdsApi as TopLevelEntityEdfiOdsApi;
      if (!edfiOdsApiData || !edfiOdsApiData.domains) return;

      // Copy the domains array to the entityDefinition
      entityDefinition.domains = [...edfiOdsApiData.domains];
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
