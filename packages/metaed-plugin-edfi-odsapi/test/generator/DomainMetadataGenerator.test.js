// @flow
import { newMetaEdEnvironment, newNamespaceInfo } from 'metaed-core';
import type { MetaEdEnvironment, NamespaceInfo } from 'metaed-core';
import { generate } from '../../src/generator/domainMetadata/DomainMetadataGenerator';
import type { Aggregate } from '../../src/model/domainMetadata/Aggregate';

describe('when generating aggregate for edfi', () => {
  const namespace: string = 'edfi';
  let result: string = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema: namespace,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: 'Entity2',
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: namespace,
          hasIsA: false,
          requiresSchema: false,
        },
        {
          table: 'Entity3',
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: namespace,
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      isExtension: false,
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', () => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating aggregate for extensions', () => {
  const namespace: string = 'extension';
  let result: string = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema: namespace,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: 'Entity2',
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: namespace,
          hasIsA: false,
          requiresSchema: true,
        },
      ],
    };

    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      isExtension: true,
      projectExtension: 'EXTENSION',
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', () => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating aggregate with subclass for edfi', () => {
  const namespace: string = 'edfi';
  let result: string = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema: namespace,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: 'Entity2',
          isA: 'Entity4',
          isAbstract: false,
          isRequiredCollection: false,
          schema: namespace,
          hasIsA: true,
          requiresSchema: false,
        },
      ],
    };

    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      isExtension: false,
      projectExtension: '',
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', () => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating aggregate extensions', () => {
  const namespace: string = 'extension';
  let result: string = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema: namespace,
      allowPrimaryKeyUpdates: false,
      isExtension: true,
      entityTables: [
        {
          table: 'Entity2',
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: namespace,
          hasIsA: false,
          requiresSchema: true,
        },
      ],
    };

    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      isExtension: true,
      projectExtension: 'EXTENSION',
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', () => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating abstract aggregate for edfi', () => {
  const namespace: string = 'edfi';
  let result: string = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema: namespace,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: 'Entity2',
          isA: null,
          isAbstract: true,
          isRequiredCollection: false,
          schema: namespace,
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      isExtension: false,
      projectExtension: '',
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', () => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating aggregate with primary key update', () => {
  const namespace: string = 'edfi';
  let result: string = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema: namespace,
      allowPrimaryKeyUpdates: true,
      isExtension: false,
      entityTables: [
        {
          table: 'Entity1',
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: namespace,
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      isExtension: false,
      projectExtension: '',
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', () => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating aggregate with required collection table', () => {
  const namespace: string = 'edfi';
  let result: string = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const aggregate: Aggregate = {
      root: 'Entity1',
      schema: namespace,
      allowPrimaryKeyUpdates: true,
      isExtension: false,
      entityTables: [
        {
          table: 'Entity1',
          isA: null,
          isAbstract: false,
          isRequiredCollection: true,
          schema: namespace,
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      isExtension: false,
      projectExtension: '',
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate aggregate element', () => {
    expect(result).toMatchSnapshot();
  });
});
