// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  getAllEntitiesOfType,
  MetaEdPropertyFullName,
} from '@edfi/metaed-core';
import invariant from 'ts-invariant';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { JsonPath } from '../../model/api-schema/JsonPath';
import { JsonPathsInfo } from '../../model/JsonPathsMapping';
import { EducationOrganizationSecurableElement } from '../../model/api-schema/EducationOrganizationSecurableElement';

/**
 * Finds the EducationOrganizationId elements that can be EducationOrganization
 * securable elements for the document. This includes EducationOrganizationId renames on
 * EducationOrganization subclasses
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Hardcoded find of data standard EducationOrganization
  const edfiEducationOrganization: TopLevelEntity | undefined = metaEd.namespace
    .get('EdFi')
    ?.entity.domainEntity.get('EducationOrganization');
  if (edfiEducationOrganization == null) {
    throw new Error(
      'EducationOrganizationSecurableElementEnhancer: Fatal Error: EducationOrganization not found in EdFi Data Standard project',
    );
  }

  const allEducationOrganizations: TopLevelEntity[] = [...edfiEducationOrganization.subclassedBy, edfiEducationOrganization];

  // Add securable elements for entities that have non-rolenamed reference to EducationOrganization as part of their identity
  // Also handle EducationOrganization special cases
  (
    getAllEntitiesOfType(
      metaEd,
      'domainEntity',
      'association',
      'domainEntitySubclass',
      'associationSubclass',
      'domainEntityExtension',
      'associationExtension',
    ) as TopLevelEntity[]
  ).forEach((entity) => {
    // Using Map to remove duplicate JsonPaths
    const result: Map<JsonPath, EducationOrganizationSecurableElement> = new Map();

    const { identityFullnames, allJsonPathsMapping, educationOrganizationSecurableElements } = entity.data
      .edfiApiSchema as EntityApiSchemaData;

    identityFullnames.forEach((identityFullname: MetaEdPropertyFullName) => {
      const matchingJsonPathsInfo: JsonPathsInfo = allJsonPathsMapping[identityFullname];
      invariant(matchingJsonPathsInfo != null, 'identityFullname did not match an allJsonPathsMapping');

      matchingJsonPathsInfo.jsonPathPropertyPairs.forEach((jppp) => {
        const hasRoleNameInPropertyChain = [jppp.sourceProperty, ...jppp.flattenedIdentityProperty.propertyChain].some(
          (property) => property.roleName !== '',
        );

        if (
          allEducationOrganizations.includes(jppp.flattenedIdentityProperty.identityProperty.parentEntity) &&
          !hasRoleNameInPropertyChain
        ) {
          result.set(jppp.jsonPath, {
            metaEdName: jppp.sourceProperty.metaEdName,
            jsonPath: jppp.jsonPath,
          });
        }

        // Add securable elements for renamed educationOrganizationIds on each EducationOrganization subclass
        if (
          allEducationOrganizations.includes(entity) &&
          jppp.sourceProperty.isIdentityRename &&
          jppp.sourceProperty.parentEntity === entity
        ) {
          result.set(jppp.jsonPath, {
            metaEdName: jppp.sourceProperty.metaEdName,
            jsonPath: jppp.jsonPath,
          });
        }
      });
    });

    educationOrganizationSecurableElements.push(
      ...[...result.values()].sort((a, b) => a.metaEdName.localeCompare(b.metaEdName)),
    );
  });

  return {
    enhancerName: 'EducationOrganizationSecurableElementEnhancer',
    success: true,
  };
}
