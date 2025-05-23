// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { defaultPluginTechVersion, newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { GeneratorResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newSchemaContainer } from '../../src/model/SchemaContainer';
import { generate } from '../../src/generator/OdsGenerator';

describe('when generating output for namespace', (): void => {
  const namespaceName = 'namespaceName';
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsPostgresql', {
      targetTechnologyVersion: defaultPluginTechVersion,
      shortName: '',
      namespace: new Map(),
    });
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName,
      isExtension: false,
      data: {
        edfiOdsPostgresql: {
          odsSchema: newSchemaContainer(),
        },
      },
    };
    metaEd.namespace.set(namespaceName, namespace);

    result = await generate(metaEd);
  });

  it('should generate empty output', (): void => {
    expect(result.generatorName).toEqual('edfiOdsPostgresql.OdsGenerator');
    expect(result.generatedOutput[0].fileName).toBe(`0020-${namespaceName}-Tables.sql`);
    expect(result.generatedOutput[0].namespace).toBe(namespaceName);
    expect(result.generatedOutput[0].folderName).toBe('/Database/PostgreSQL/ODS/Structure/');
    expect(result.generatedOutput[0].name).toBe('ODS PostgreSQL Tables');
    expect(result.generatedOutput[0].resultStream).toBeNull();
    expect(result.generatedOutput[0].resultString).toBe('');
  });
});

describe('when generating output for core namespace', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsPostgresql', {
      targetTechnologyVersion: defaultPluginTechVersion,
      shortName: '',
      namespace: new Map(),
    });
    const namespaceName = 'EdFi';
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName,
      isExtension: false,
      data: {
        edfiOdsPostgresql: {
          odsSchema: newSchemaContainer(),
        },
      },
    };
    metaEd.namespace.set(namespaceName, namespace);

    result = await generate(metaEd);
  });

  it('should generate correct file name', (): void => {
    expect(result.generatedOutput[0].fileName).toBe('0020-Tables.sql');
  });
});

describe('when generating output for extension namespace', (): void => {
  const namespaceName = 'Extension';
  const projectExtension = 'EXTENSION';
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsPostgresql', {
      targetTechnologyVersion: defaultPluginTechVersion,
      shortName: '',
      namespace: new Map(),
    });
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName,
      projectExtension,
      isExtension: true,
      data: {
        edfiOdsPostgresql: {
          odsSchema: newSchemaContainer(),
        },
      },
    };
    metaEd.namespace.set(namespaceName, namespace);

    result = await generate(metaEd);
  });

  it('should generate correct file name', (): void => {
    expect(result.generatedOutput[0].fileName).toBe(`0020-${projectExtension}-${namespaceName}-Tables.sql`);
  });
});
