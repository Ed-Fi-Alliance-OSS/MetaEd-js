// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { Namespace } from '@edfi/metaed-core';
import { newTopLevelEntity } from '@edfi/metaed-core/src/model/TopLevelEntity';
import { addEntityApiSchemaDataTo, EntityApiSchemaData } from '../../../../src/model/EntityApiSchemaData';

/**
 * Build a lightweight Namespace stub for unit tests.
 */
export function buildNamespace(overrides: Partial<Namespace> = {}): Namespace {
  return {
    entity: {} as any,
    namespaceName: 'Sample',
    isExtension: false,
    dependencies: [],
    projectExtension: '',
    projectName: 'Sample',
    projectVersion: '1.0.0',
    projectDescription: '',
    extensionEntitySuffix: 'Extension',
    data: {},
    ...overrides,
  };
}

/**
 * Build an {@link EntityApiSchemaData} fixture suitable for helper tests.
 */
export function buildApiSchemaData(overrides: Partial<EntityApiSchemaData> = {}): EntityApiSchemaData {
  const template = newTopLevelEntity();
  addEntityApiSchemaDataTo(template);

  return {
    ...(template.data.edfiApiSchema as EntityApiSchemaData),
    collectedApiProperties: [],
    allProperties: [],
    identityJsonPaths: [] as any,
    documentPathsMapping: {},
    allJsonPathsMapping: {},
    mergeJsonPathsMapping: {},
    numericJsonPaths: [],
    booleanJsonPaths: [],
    dateJsonPaths: [],
    dateTimeJsonPaths: [],
    decimalPropertyValidationInfos: [],
    openApiFragments: {},
    authorizationPathways: [],
    educationOrganizationSecurableElements: [],
    namespaceSecurableElements: [],
    studentSecurableElements: [],
    contactSecurableElements: [],
    staffSecurableElements: [],
    arrayUniquenessConstraints: [],
    ...overrides,
  };
}
