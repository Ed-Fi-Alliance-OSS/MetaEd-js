// @flow
import type { AggregateDefinition } from './AggregateDefinition';
import type { AggregateExtensionDefinition } from './AggregateExtensionDefinition';
import type { AssociationDefinition } from './AssociationDefinition';
import type { EntityDefinition } from './EntityDefinition';
import type { SchemaDefinition } from './SchemaDefinition';

import { NoSchemaDefinition } from './SchemaDefinition';

export type DomainModelDefinition = {
  odsApiVersion: string,
  schemaDefinition: SchemaDefinition,
  aggregateDefinitions: Array<AggregateDefinition>,
  aggregateExtensionDefinitions: Array<AggregateExtensionDefinition>,
  entityDefinitions: Array<EntityDefinition>,
  associationDefinitions: Array<AssociationDefinition>,
};

export function newDomainModelDefinition(): DomainModelDefinition {
  return {
    odsApiVersion: '',
    schemaDefinition: NoSchemaDefinition,
    aggregateDefinitions: [],
    aggregateExtensionDefinitions: [],
    entityDefinitions: [],
    associationDefinitions: [],
  };
}
