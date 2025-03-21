// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import * as R from 'ramda';
import { EntityDefinition } from '../../model/apiModel/EntityDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';

const enhancerName = 'EntityDefinitionPropertyOrderEnhancer';

const sortByPropertyName = R.sortBy(R.pipe(R.prop('propertyName'), R.toLower));

const sortByIdentifierName = R.sortBy(R.pipe(R.prop('identifierName'), R.toLower));

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const { entityDefinitions } = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition;

    entityDefinitions.forEach((entityDefinition: EntityDefinition) => {
      entityDefinition.locallyDefinedProperties = sortByPropertyName(entityDefinition.locallyDefinedProperties);
      entityDefinition.identifiers = sortByIdentifierName(entityDefinition.identifiers);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
