// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EnhancerResult, MetaEdEnvironment, Namespace, DomainEntity, Association } from '@edfi/metaed-core';
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
      (table.parentEntity as DomainEntity).isAbstract &&
      table.existenceReason.isEntityMainTable) ||
    (table.parentEntity.type === 'association' &&
      (table.parentEntity as Association).isAbstract &&
      table.existenceReason.isEntityMainTable)
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
