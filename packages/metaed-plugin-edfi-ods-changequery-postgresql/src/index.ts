// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPlugin } from '@edfi/metaed-core';

import { generate as CreateTrackedDeleteSchemasGenerator } from './generator/CreateTrackedDeleteSchemasGenerator';
import { generate as CreateTrackedDeleteTablesGenerator } from './generator/CreateTrackedDeleteTablesGenerator';
import { generate as CreateDeletedForTrackingTriggersGenerator } from './generator/CreateDeletedForTrackingTriggersGenerator';
import { generate as CreateChangeVersionSequenceGenerator } from './generator/CreateChangeVersionSequenceGenerator';
import { generate as CreateChangesSchemaGenerator } from './generator/CreateChangesSchemaGenerator';
import { generate as CreateTriggerUpdateChangeVersionGenerator } from './generator/CreateTriggerUpdateChangeVersionGenerator';
import { generate as AddColumnChangeVersionForTableGenerator } from './generator/AddColumnChangeVersionForTableGenerator';
import { generate as AddIndexChangeVersionForTableGenerator } from './generator/AddIndexChangeVersionForTableGenerator';
import { generate as CreateIndirectUpdateCascadeTriggerGenerator } from './generator/CreateIndirectUpdateCascadeTriggerGenerator';

import { enhance as edFiOdsChangeQueryEntityRepository } from './enhancer/EdFiOdsChangeQueryEntityRepositoryEnhancer';
import { enhance as associationChangeQueryEnhancer } from './enhancer/AssociationChangeQueryEnhancer';
import { enhance as associationSubclassChangeQueryEnhancer } from './enhancer/AssociationSubclassChangeQueryEnhancer';
import { enhance as baseDescriptorChangeQueryEnhancer } from './enhancer/BaseDescriptorChangeQueryEnhancer';
import { enhance as descriptorChangeQueryEnhancer } from './enhancer/DescriptorChangeQueryEnhancer';
import { enhance as domainEntityChangeQueryEnhancer } from './enhancer/DomainEntityChangeQueryEnhancer';
import { enhance as domainEntitySubclassChangeQueryEnhancer } from './enhancer/DomainEntitySubclassChangeQueryEnhancer';
import { enhance as enumerationChangeQueryEnhancer } from './enhancer/EnumerationChangeQueryEnhancer';
import { enhance as schoolYearEnumerationChangeQueryEnhancer } from './enhancer/SchoolYearEnumerationChangeQueryEnhancer';
import { enhance as addColumnChangeVersionForTableEnhancer } from './enhancer/AddColumnChangeVersionForTableEnhancer';
import { enhance as createTriggerUpdateChangeVersionEnhancer } from './enhancer/CreateTriggerUpdateChangeVersionEnhancer';
import { enhance as indirectUpdateCascadeTriggerEnhancer } from './enhancer/IndirectUpdateCascadeTriggerEnhancer';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [
      edFiOdsChangeQueryEntityRepository,
      associationChangeQueryEnhancer,
      associationSubclassChangeQueryEnhancer,
      baseDescriptorChangeQueryEnhancer,
      descriptorChangeQueryEnhancer,
      domainEntityChangeQueryEnhancer,
      domainEntitySubclassChangeQueryEnhancer,
      enumerationChangeQueryEnhancer,
      schoolYearEnumerationChangeQueryEnhancer,
      addColumnChangeVersionForTableEnhancer,
      createTriggerUpdateChangeVersionEnhancer,
      indirectUpdateCascadeTriggerEnhancer,
    ],
    generator: [
      CreateTrackedDeleteSchemasGenerator,
      CreateTrackedDeleteTablesGenerator,
      CreateDeletedForTrackingTriggersGenerator,
      CreateChangeVersionSequenceGenerator,
      CreateChangesSchemaGenerator,
      CreateTriggerUpdateChangeVersionGenerator,
      AddColumnChangeVersionForTableGenerator,
      AddIndexChangeVersionForTableGenerator,
      CreateIndirectUpdateCascadeTriggerGenerator,
    ],
    shortName: 'edfiOdsChangeQueryPostgresql',
  };
}
