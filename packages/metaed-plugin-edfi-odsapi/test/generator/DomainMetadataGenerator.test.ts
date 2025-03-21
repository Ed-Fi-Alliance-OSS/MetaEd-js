// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { GeneratedOutput, newMetaEdEnvironment, newNamespace, newPluginEnvironment } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { generate } from '../../src/generator/domainMetadata/DomainMetadataGenerator';
import { Aggregate } from '../../src/model/domainMetadata/Aggregate';

describe('when generating aggregate for edfi', (): void => {
  const namespaceName = 'EdFi';
  const schema = namespaceName.toLowerCase();
  const projectName = 'Ed-Fi';
  let result = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsApi', {
      ...newPluginEnvironment(),
      targetTechnologyVersion: '5.0.0',
    });

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema: namespaceName,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: 'Entity2',
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema,
          hasIsA: false,
          requiresSchema: false,
        },
        {
          table: 'Entity3',
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema,
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      projectName,
      isExtension: false,
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', (): void => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating aggregate for extensions', (): void => {
  const namespaceName = 'Extension';
  const schema = namespaceName.toLowerCase();
  const projectName = 'Extension';
  let result = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsApi', {
      ...newPluginEnvironment(),
      targetTechnologyVersion: '5.0.0',
    });

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: 'Entity2',
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema,
          hasIsA: false,
          requiresSchema: true,
        },
      ],
    };

    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      projectName,
      isExtension: true,
      projectExtension: 'EXTENSION',
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', (): void => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating aggregate with subclass for edfi', (): void => {
  const namespaceName = 'EdFi';
  const schema = namespaceName.toLowerCase();
  const projectName = 'Ed-Fi';
  let result = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsApi', {
      ...newPluginEnvironment(),
      targetTechnologyVersion: '5.0.0',
    });

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: 'Entity2',
          isA: 'Entity4',
          isAbstract: false,
          isRequiredCollection: false,
          schema,
          hasIsA: true,
          requiresSchema: false,
        },
      ],
    };

    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      projectName,
      isExtension: false,
      projectExtension: '',
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', (): void => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating aggregate extensions', (): void => {
  const namespaceName = 'Extension';
  const schema = namespaceName.toLowerCase();
  const projectName = 'Extension';
  let result = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsApi', {
      ...newPluginEnvironment(),
      targetTechnologyVersion: '5.0.0',
    });

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema,
      allowPrimaryKeyUpdates: false,
      isExtension: true,
      entityTables: [
        {
          table: 'Entity2',
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema,
          hasIsA: false,
          requiresSchema: true,
        },
      ],
    };

    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      projectName,
      isExtension: true,
      projectExtension: 'EXTENSION',
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', (): void => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating abstract aggregate for edfi', (): void => {
  const namespaceName = 'EdFi';
  const schema = namespaceName.toLowerCase();
  const projectName = 'Ed-Fi';
  let result = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsApi', {
      ...newPluginEnvironment(),
      targetTechnologyVersion: '5.0.0',
    });

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: 'Entity2',
          isA: null,
          isAbstract: true,
          isRequiredCollection: false,
          schema,
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      projectName,
      isExtension: false,
      projectExtension: '',
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', (): void => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating aggregate with primary key update', (): void => {
  const namespaceName = 'EdFi';
  const schema = namespaceName.toLowerCase();
  const projectName = 'Ed-Fi';
  let result = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsApi', {
      ...newPluginEnvironment(),
      targetTechnologyVersion: '5.0.0',
    });

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema,
      allowPrimaryKeyUpdates: true,
      isExtension: false,
      entityTables: [
        {
          table: 'Entity1',
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema,
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      projectName,
      isExtension: false,
      projectExtension: '',
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', (): void => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating aggregate with required collection table', (): void => {
  const namespaceName = 'EdFi';
  const schema = namespaceName.toLowerCase();
  const projectName = 'Ed-Fi';
  let result = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsApi', {
      ...newPluginEnvironment(),
      targetTechnologyVersion: '5.0.0',
    });

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema,
      allowPrimaryKeyUpdates: true,
      isExtension: false,
      entityTables: [
        {
          table: 'Entity1',
          isA: null,
          isAbstract: false,
          isRequiredCollection: true,
          schema,
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      projectName,
      isExtension: false,
      projectExtension: '',
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', (): void => {
    expect(result).toMatchSnapshot();
  });
});

describe('when targeting ODS/API version 6.0.0 or greater', () => {
  const namespaceName = 'EdFi';
  const schema = namespaceName.toLowerCase();
  const projectName = 'Ed-Fi';
  let result: GeneratedOutput[] = [];

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsApi', {
      ...newPluginEnvironment(),
      targetTechnologyVersion: '6.0.0',
    });

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema: namespaceName,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: 'Entity2',
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema,
          hasIsA: false,
          requiresSchema: false,
        },
        {
          table: 'Entity3',
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema,
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName,
      projectName,
      isExtension: false,
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    };

    metaEd.namespace.set(namespace.namespaceName, namespace);
    result = (await generate(metaEd)).generatedOutput;
  });

  it('should not generate domain metadata', () => {
    expect(result).toHaveLength(0);
  });
});
