// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { ForeignKey } from '@edfi/metaed-plugin-edfi-ods-relational';
import { AssociationDefinition } from '../../model/apiModel/AssociationDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { foreignKeyFor } from './EnhancerHelper';

const enhancerName = 'AssociationDefinitionIsIdentifyingEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const { associationDefinitions } = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition;

    associationDefinitions.forEach((associationDefinition: AssociationDefinition) => {
      const foreignKey: ForeignKey | undefined = foreignKeyFor(metaEd, namespace, associationDefinition.fullName.name);
      if (foreignKey == null) return;

      associationDefinition.isIdentifying = foreignKey.sourceReference.isIdentifying;
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
