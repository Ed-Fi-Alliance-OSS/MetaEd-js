// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DomainEntity,
  MetaEdEnvironment,
  TopLevelEntity,
  getAllEntitiesOfType,
  type EnhancerResult,
} from '@edfi/metaed-core';
import invariant from 'ts-invariant';
import type { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import type { AbstractResourceFlatteningMetadata } from '../../model/flattening/AbstractResourceFlatteningMetadata';

/**
 * Determines whether the supplied entity should expose abstract resource metadata.
 */
function isAbstractResourceCandidate(entity: TopLevelEntity): boolean {
  if (entity.type === 'domainEntity') {
    return (entity as DomainEntity).isAbstract;
  }

  if (entity.type === 'association') {
    return entity.metaEdName === 'GeneralStudentProgramAssociation';
  }

  return false;
}

/**
 * Provides flattening metadata for abstract resources by collecting subclass endpoints and a union view name
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const entities: TopLevelEntity[] = getAllEntitiesOfType(metaEd, 'domainEntity', 'association') as TopLevelEntity[];

  entities.forEach((entity) => {
    if (!isAbstractResourceCandidate(entity)) return;

    const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

    const endpointNames: Set<string> = new Set();

    entity.subclassedBy.forEach((subclass) => {
      const subclassData = subclass.data.edfiApiSchema as EntityApiSchemaData;
      const { flatteningMetadata, endpointName } = subclassData;
      invariant(flatteningMetadata != null, `Entity ${subclass.metaEdName} is missing flatteningMetadata`);

      invariant(
        flatteningMetadata.table.discriminatorValue != null,
        `Flattening metadata for ${subclass.metaEdName} is missing discriminatorValue`,
      );

      endpointNames.add(endpointName);
    });

    if (endpointNames.size === 0) return;

    const abstractResourceFlatteningMetadata: AbstractResourceFlatteningMetadata = {
      subclassTypes: [...endpointNames].sort((left, right) => left.localeCompare(right)),
      unionViewName: entity.metaEdName,
    };

    apiSchemaData.abstractResourceFlatteningMetadata = abstractResourceFlatteningMetadata;
  });

  return {
    enhancerName: 'AbstractResourceFlatteningMetadataEnhancer',
    success: true,
  };
}
