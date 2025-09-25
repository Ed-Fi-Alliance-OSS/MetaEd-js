// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newTopLevelEntity } from '@edfi/metaed-core/src/model/TopLevelEntity';
import {
  createRootTable,
  createChildTable,
  appendChildTable,
  toTableBaseName,
  toTableJsonPath,
  toTableDiscriminator,
} from '../../../../src/enhancer/flattening/helpers/TableBuilder';

function buildEntity(type: string, name: string) {
  const entity = newTopLevelEntity();
  entity.type = type as any;
  entity.metaEdName = name;
  return entity;
}

describe('TableBuilder helpers', () => {
  it('creates core root table metadata', () => {
    const entity = buildEntity('domainEntity', 'School');

    const table = createRootTable(entity);

    expect(table.baseName).toBe('School');
    expect(table.jsonPath).toBe('$');
    expect(table.isExtensionTable).toBeUndefined();
  });

  it('creates extension root table metadata', () => {
    const baseEntity = buildEntity('domainEntity', 'School');
    const extension = buildEntity('domainEntityExtension', 'School');
    extension.baseEntity = baseEntity;

    const table = createRootTable(extension, toTableDiscriminator('School'));

    expect(table.baseName).toBe('SchoolExtension');
    expect(table.isExtensionTable).toBe(true);
    expect(table.discriminatorValue).toBe('School');
  });

  it('appends child tables immutably', () => {
    const entity = buildEntity('domainEntity', 'School');

    const root = createRootTable(entity);
    const child = createChildTable(toTableBaseName('SchoolAddress'), toTableJsonPath('$.addresses[*]'));

    const updated = appendChildTable(root, child);

    expect(root.childTables).toHaveLength(0);
    expect(updated.childTables).toHaveLength(1);
    expect(updated.childTables[0].baseName).toBe('SchoolAddress');
  });
});
