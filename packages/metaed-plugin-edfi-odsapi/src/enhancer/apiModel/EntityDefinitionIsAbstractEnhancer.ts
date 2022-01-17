import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { asAssociation, asDomainEntity } from '@edfi/metaed-core';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { EntityDefinition } from '../../model/apiModel/EntityDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { tableFor } from './EnhancerHelper';

const enhancerName = 'EntityDefinitionIsAbstractEnhancer';

function isAbstract(table: Table): boolean {
  // true for the hardcoded Descriptor table
  if (table.tableId === 'Descriptor' && table.schema === 'edfi') return true;
  // true for the main table of an Abstract Entity
  return (
    (table.parentEntity.type === 'domainEntity' &&
      asDomainEntity(table.parentEntity).isAbstract &&
      table.isEntityMainTable) ||
    (table.parentEntity.type === 'association' && asAssociation(table.parentEntity).isAbstract && table.isEntityMainTable)
  );
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const { entityDefinitions } = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition;

    entityDefinitions.forEach((entityDefinition: EntityDefinition) => {
      const table = tableFor(metaEd, namespace, entityDefinition.name);
      if (table == null) return;

      entityDefinition.isAbstract = isAbstract(table);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
