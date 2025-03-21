// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { defaultPluginTechVersion, newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { GeneratorResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { generate } from '../../src/generator/SchemaGenerator';

describe('when generating schemas for core namespace', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: 'EdFi',
      isExtension: false,
    };
    metaEd.namespace.set('EdFi', namespace);
    metaEd.plugin.set('edfiOdsPostgresql', {
      targetTechnologyVersion: defaultPluginTechVersion,
      shortName: '',
      namespace: new Map(),
    });

    result = await generate(metaEd);
  });

  it('should generate correct schema', (): void => {
    expect(result.generatorName).toEqual('edfiOdsPostgresql.SchemaGenerator');
    expect(result.generatedOutput[0].fileName).toBe('0010-Schemas.sql');
    expect(result.generatedOutput[0].namespace).toBe('EdFi');
    expect(result.generatedOutput[0].folderName).toBe('/Database/PostgreSQL/ODS/Structure/');
    expect(result.generatedOutput[0].name).toBe('ODS PostgreSQL Schema');
    expect(result.generatedOutput[0].resultStream).toBeNull();
    expect(result.generatedOutput[0].resultString).toMatchInlineSnapshot(`
      "CREATE SCHEMA IF NOT EXISTS auth AUTHORIZATION postgres;
      CREATE SCHEMA IF NOT EXISTS edfi AUTHORIZATION postgres;
      CREATE SCHEMA IF NOT EXISTS util AUTHORIZATION postgres;
      "
    `);
  });
});

describe('when generating schemas for extension namespace', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: 'Extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
    };
    metaEd.namespace.set('Extension', namespace);

    result = await generate(metaEd);
  });

  it('should generate correct schema', (): void => {
    expect(result.generatorName).toEqual('edfiOdsPostgresql.SchemaGenerator');
    expect(result.generatedOutput[0].fileName).toBe('0010-EXTENSION-Extension-Schemas.sql');
    expect(result.generatedOutput[0].namespace).toBe('Extension');
    expect(result.generatedOutput[0].folderName).toBe('/Database/PostgreSQL/ODS/Structure/');
    expect(result.generatedOutput[0].name).toBe('ODS PostgreSQL Schema');
    expect(result.generatedOutput[0].resultStream).toBeNull();
    expect(result.generatedOutput[0].resultString).toMatchInlineSnapshot(`
      "CREATE SCHEMA extension AUTHORIZATION postgres;
      "
    `);
  });
});
