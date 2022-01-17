import { MetaEdPlugin } from '@edfi/metaed-core';
import { newMetaEdPlugin } from '@edfi/metaed-core';

import { generate as CreateTrackedDeleteSchemasGenerator } from './generator/CreateTrackedDeleteSchemasGenerator';
import { generate as CreateTrackedDeleteTablesGenerator } from './generator/CreateTrackedDeleteTablesGenerator';
import { generate as CreateDeletedForTrackingTriggersGenerator } from './generator/CreateDeletedForTrackingTriggersGenerator';
import { generate as CreateChangeVersionSequenceGenerator } from './generator/CreateChangeVersionSequenceGenerator';
import { generate as CreateChangesSchemaGenerator } from './generator/CreateChangesSchemaGenerator';
import { generate as CreateTriggerUpdateChangeVersionGenerator } from './generator/CreateTriggerUpdateChangeVersionGenerator';
import { generate as AddColumnChangeVersionForTableGenerator } from './generator/AddColumnChangeVersionForTableGenerator';
import { generate as AddIndexChangeVersionForTableGenerator } from './generator/AddIndexChangeVersionForTableGenerator';

import { enhance as edFiOdsChangeQueryEntityRepository } from './enhancer/EdFiOdsChangeQueryEntityRepositoryEnhancer';
import { enhance as associationChangeQueryEnhancer } from './enhancer/AssociationChangeQueryEnhancer';
import { enhance as associationSubclassChangeQueryEnhancer } from './enhancer/AssociationSubclassChangeQueryEnhancer';
import { enhance as baseDescriptorChangeQueryEnhancer } from './enhancer/BaseDescriptorChangeQueryEnhancer';
import { enhance as descriptorChangeQueryEnhancer } from './enhancer/DescriptorChangeQueryEnhancer';
import { enhance as domainEntityChangeQueryEnhancer } from './enhancer/DomainEntityChangeQueryEnhancer';
import { enhance as domainEntitySubclassChangeQueryEnhancer } from './enhancer/DomainEntitySubclassChangeQueryEnhancer';
import { enhance as enumerationChangeQueryEnhancer } from './enhancer/EnumerationChangeQueryEnhancer';
import { enhance as addColumnChangeVersionForTableEnhancer } from './enhancer/AddColumnChangeVersionForTableEnhancer';
import { enhance as createTriggerUpdateChangeVersionEnhancer } from './enhancer/CreateTriggerUpdateChangeVersionEnhancer';

export function initialize(): MetaEdPlugin {
  return {
    ...newMetaEdPlugin(),
    enhancer: [
      edFiOdsChangeQueryEntityRepository,
      associationChangeQueryEnhancer,
      associationSubclassChangeQueryEnhancer,
      baseDescriptorChangeQueryEnhancer,
      descriptorChangeQueryEnhancer,
      domainEntityChangeQueryEnhancer,
      domainEntitySubclassChangeQueryEnhancer,
      enumerationChangeQueryEnhancer,
      addColumnChangeVersionForTableEnhancer,
      createTriggerUpdateChangeVersionEnhancer,
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
    ],
  };
}
