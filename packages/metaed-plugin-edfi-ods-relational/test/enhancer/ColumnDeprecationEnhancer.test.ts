// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  Namespace,
  newDomainEntity,
  newMetaEdEnvironment,
  newNamespace,
  newBooleanProperty,
} from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/ColumnDeprecationEnhancer';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { newColumn } from '../../src/model/database/Column';

describe('when column source property has deprecation', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const deprecationReason = 'DeprecationReason';
  const property = { ...newBooleanProperty(), isDeprecated: true, deprecationReason };
  const parentEntity = { ...newDomainEntity(), properties: [property] };
  const column = { ...newColumn(), sourceEntityProperties: [property] };
  const table = { ...newTable(), name: 'TableName', parentEntity, columns: [column] };

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    tableEntities(metaEd, namespace).set(table.tableId, table);

    enhance(metaEd);
  });

  it('should have correct deprecation status', (): void => {
    expect(table.isDeprecated).toBe(false);

    expect(column.isDeprecated).toBe(true);
    expect(column.deprecationReasons).toHaveLength(1);
    expect(column.deprecationReasons[0]).toBe(deprecationReason);
  });
});
