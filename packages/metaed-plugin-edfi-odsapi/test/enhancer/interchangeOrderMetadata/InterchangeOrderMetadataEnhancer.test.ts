import graphlib, { Graph } from '@dagrejs/graphlib';
import {
  newMetaEdEnvironment,
  newNamespace,
  newDomainEntity,
  newInterchangeItem,
  newDomainEntityProperty,
  newIntegerProperty,
  newDomainEntityExtension,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace, DomainEntity, InterchangeItem, DomainEntityExtension } from '@edfi/metaed-core';
import {
  newMergedInterchange,
  addMergedInterchangeToRepository,
  addEdFiXsdEntityRepositoryTo,
} from '@edfi/metaed-plugin-edfi-xsd';
import { MergedInterchange } from '@edfi/metaed-plugin-edfi-xsd';
import { addMergedInterchangeEdfiOdsApiTo } from '../../../src/model/MergedInterchange';
import { addInterchangeItemEdfiOdsApiTo } from '../../../src/model/InterchangeItem';
import { enhance, sortGraph } from '../../../src/enhancer/interchangeOrderMetadata/InterchangeOrderMetadataEnhancer';

describe('when sorting graph with no cycles', (): void => {
  const graph = new Graph();

  beforeAll(() => {
    graph.setEdge('B', 'C', { isRequired: false });
    graph.setEdge('A', 'C', { isRequired: false });
    graph.setEdge('A', 'B', { isRequired: false });
  });

  it('should sort correctly', (): void => {
    expect(sortGraph(graph)).toEqual(['A', 'B', 'C']);
  });
});

describe('when sorting graph with reflexive cycle', (): void => {
  const graph = new Graph();

  beforeAll(() => {
    graph.setEdge('B', 'C', { isRequired: false });
    graph.setEdge('A', 'C', { isRequired: false });
    graph.setEdge('A', 'B', { isRequired: false });
    graph.setEdge('C', 'D', { isRequired: false });
    graph.setEdge('D', 'D', { isRequired: true });
  });

  it('should have cycle edge', (): void => {
    expect(graphlib.alg.findCycles(graph)[0]).toEqual(['D']);
  });

  it('should sort correctly', (): void => {
    expect(sortGraph(graph)).toEqual(['A', 'B', 'C', 'D']);
  });
});

describe('when sorting graph with symmetric cycle', (): void => {
  const graph = new Graph();

  beforeAll(() => {
    graph.setEdge('B', 'C', { isRequired: false });
    graph.setEdge('A', 'C', { isRequired: false });
    graph.setEdge('A', 'B', { isRequired: false });
    graph.setEdge('C', 'D', { isRequired: false });
    graph.setEdge('D', 'E', { isRequired: true });
    graph.setEdge('E', 'D', { isRequired: true });
  });

  it('should have cycle edges', (): void => {
    expect(graphlib.alg.findCycles(graph)[0]).toEqual(['E', 'D']);
  });

  it('should sort correctly', (): void => {
    expect(sortGraph(graph)).toEqual(['A', 'B', 'C', 'E', 'D']);
  });
});

describe('when sorting graph with transitive cycle', (): void => {
  const graph = new Graph();

  beforeAll(() => {
    graph.setEdge('B', 'C', { isRequired: false });
    graph.setEdge('A', 'C', { isRequired: false });
    graph.setEdge('A', 'B', { isRequired: false });
  });

  it('should not have cycle edges', (): void => {
    expect(graphlib.alg.findCycles(graph)).toEqual([]);
  });

  it('should sort correctly', (): void => {
    expect(sortGraph(graph)).toEqual(['A', 'B', 'C']);
  });
});

describe('when sorting graph with extended cycle', (): void => {
  const graph = new Graph();

  beforeAll(() => {
    graph.setEdge('B', 'C', { isRequired: false });
    graph.setEdge('A', 'C', { isRequired: false });
    graph.setEdge('A', 'B', { isRequired: false });
    graph.setEdge('C', 'D', { isRequired: false });
    graph.setEdge('D', 'E', { isRequired: true });
    graph.setEdge('E', 'F', { isRequired: true });
    graph.setEdge('F', 'D', { isRequired: true });
  });

  it('should have cycle edges', (): void => {
    expect(graphlib.alg.findCycles(graph)[0]).toEqual(['F', 'E', 'D']);
  });

  it('should sort correctly', (): void => {
    expect(sortGraph(graph)).toEqual(['A', 'B', 'C', 'E', 'F', 'D']);
  });
});

describe('when sorting graph with optional cycle', (): void => {
  const graph = new Graph();

  beforeAll(() => {
    graph.setEdge('B', 'C', { isRequired: false });
    graph.setEdge('A', 'C', { isRequired: false });
    graph.setEdge('A', 'B', { isRequired: false });
    graph.setEdge('C', 'D', { isRequired: false });
    // Reflexive
    graph.setEdge('D', 'D', { isRequired: false });
    graph.setEdge('D', 'E', { isRequired: false });
    // Symmetric
    graph.setEdge('E', 'F', { isRequired: false });
    graph.setEdge('F', 'E', { isRequired: false });
    graph.setEdge('F', 'G', { isRequired: false });
    // Cyclic
    graph.setEdge('G', 'H', { isRequired: false });
    graph.setEdge('H', 'I', { isRequired: false });
    graph.setEdge('I', 'G', { isRequired: false });
  });

  it('should have cycle edges', (): void => {
    expect(graphlib.alg.findCycles(graph)[0]).toEqual(['I', 'H', 'G']);
  });

  it('should sort correctly', (): void => {
    expect(sortGraph(graph)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);
  });
});

describe('when InterchangeOrderMetadataEnhancer enhances interchange', (): void => {
  let mergedInterchange: MergedInterchange;
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion: '3.2.0-c' });
    const namespace: Namespace = Object.assign(newNamespace(), { namespaceName });
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiXsdEntityRepositoryTo(metaEd);
    const referencedEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName,
    });
    const interchangeItem1: InterchangeItem = Object.assign(newInterchangeItem(), {
      namespace,
      metaEdName: domainEntityName,
      referencedEntity: referencedEntity1,
    });
    mergedInterchange = Object.assign(newMergedInterchange(), {
      namespace,
      elements: [interchangeItem1],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange);
    addMergedInterchangeEdfiOdsApiTo(mergedInterchange);
    addInterchangeItemEdfiOdsApiTo(interchangeItem1);

    enhance(metaEd);
  });

  it('should have interchange order properties', (): void => {
    expect(mergedInterchange.data.edfiOdsApi.apiOrder).toBe(10);
    expect(mergedInterchange.data.edfiOdsApi.apiOrderedElements).toEqual([
      { globalDependencyOrder: 1, name: domainEntityName },
    ]);
  });
});

describe('when InterchangeOrderMetadataEnhancer enhances interchange with DS 3.0', (): void => {
  let mergedInterchange: MergedInterchange;
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion: '3.2.0-c' });
    const namespace: Namespace = Object.assign(newNamespace(), { namespaceName });
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiXsdEntityRepositoryTo(metaEd);
    const referencedEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName,
    });
    const interchangeItem1: InterchangeItem = Object.assign(newInterchangeItem(), {
      namespace,
      metaEdName: domainEntityName,
      referencedEntity: referencedEntity1,
    });
    mergedInterchange = Object.assign(newMergedInterchange(), {
      namespace,
      elements: [interchangeItem1],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange);
    addMergedInterchangeEdfiOdsApiTo(mergedInterchange);
    addInterchangeItemEdfiOdsApiTo(interchangeItem1);

    enhance(metaEd);
  });

  it('should have interchange order properties', (): void => {
    expect(mergedInterchange.data.edfiOdsApi.apiOrder).toBe(10);
    expect(mergedInterchange.data.edfiOdsApi.apiOrderedElements).toEqual([
      { globalDependencyOrder: 1, name: domainEntityName },
    ]);
  });
});

describe('when InterchangeOrderMetadataEnhancer enhances interchange with different interchange item name', (): void => {
  let mergedInterchange: MergedInterchange;
  const namespaceName = 'EdFi';
  const interchangeItemName = 'InterchangeItemName';

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion: '3.2.0-c' });
    const namespace: Namespace = Object.assign(newNamespace(), { namespaceName });
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiXsdEntityRepositoryTo(metaEd);

    const referencedEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: 'DomainEntityName',
    });
    const interchangeItem1: InterchangeItem = Object.assign(newInterchangeItem(), {
      namespace,
      metaEdName: interchangeItemName,
      referencedEntity: referencedEntity1,
    });
    mergedInterchange = Object.assign(newMergedInterchange(), {
      namespace,
      elements: [interchangeItem1],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange);
    addMergedInterchangeEdfiOdsApiTo(mergedInterchange);
    addInterchangeItemEdfiOdsApiTo(interchangeItem1);

    enhance(metaEd);
  });

  it('should have interchange order properties', (): void => {
    expect(mergedInterchange.data.edfiOdsApi.apiOrder).toBe(10);
    expect(mergedInterchange.data.edfiOdsApi.apiOrderedElements).toEqual([
      { globalDependencyOrder: 1, name: interchangeItemName },
    ]);
  });
});

describe('when InterchangeOrderMetadataEnhancer enhances interchange with internal dependency', (): void => {
  let mergedInterchange: MergedInterchange;
  const namespaceName = 'EdFi';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion: '3.2.0-c' });
    const namespace: Namespace = Object.assign(newNamespace(), { namespaceName });
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiXsdEntityRepositoryTo(metaEd);

    const referencedEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName1,
      properties: [],
    });
    const referencedEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName2,
    });
    referencedEntity1.properties.push(
      ...[
        Object.assign(newDomainEntityProperty(), {
          referencedEntity: referencedEntity1,
        }),
        Object.assign(newDomainEntityProperty(), {
          referencedEntity: referencedEntity2,
        }),
      ],
    );
    const interchangeItem1: InterchangeItem = Object.assign(newInterchangeItem(), {
      namespace,
      metaEdName: domainEntityName1,
      referencedEntity: referencedEntity1,
    });
    const interchangeItem2: InterchangeItem = Object.assign(newInterchangeItem(), {
      namespace,
      metaEdName: domainEntityName2,
      referencedEntity: referencedEntity2,
    });
    mergedInterchange = Object.assign(newMergedInterchange(), {
      namespace,
      elements: [interchangeItem1, interchangeItem2],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange);
    addMergedInterchangeEdfiOdsApiTo(mergedInterchange);
    addInterchangeItemEdfiOdsApiTo(interchangeItem1);
    addInterchangeItemEdfiOdsApiTo(interchangeItem2);

    enhance(metaEd);
  });

  it('should have interchange order properties', (): void => {
    expect(mergedInterchange.data.edfiOdsApi.apiOrder).toBe(10);
    expect(mergedInterchange.data.edfiOdsApi.apiOrderedElements).toEqual([
      { globalDependencyOrder: 1, name: domainEntityName2 },
      { globalDependencyOrder: 2, name: domainEntityName1 },
    ]);
  });
});

describe('when InterchangeOrderMetadataEnhancer enhances interchange with external dependency', (): void => {
  let mergedInterchange1: MergedInterchange;
  let mergedInterchange2: MergedInterchange;
  const namespaceName = 'EdFi';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion: '3.2.0-c' });
    const namespace: Namespace = Object.assign(newNamespace(), { namespaceName });
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiXsdEntityRepositoryTo(metaEd);

    const referencedEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName1,
      properties: [newIntegerProperty()],
    });
    const referencedEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName2,
    });
    referencedEntity1.properties.push(
      ...[
        Object.assign(newDomainEntityProperty(), {
          referencedEntity: referencedEntity1,
        }),
        Object.assign(newDomainEntityProperty(), {
          referencedEntity: referencedEntity2,
        }),
      ],
    );
    const interchangeItem1: InterchangeItem = Object.assign(newInterchangeItem(), {
      namespace,
      metaEdName: domainEntityName1,
      referencedEntity: referencedEntity1,
    });
    addInterchangeItemEdfiOdsApiTo(interchangeItem1);
    const interchangeItem2: InterchangeItem = Object.assign(newInterchangeItem(), {
      namespace,
      metaEdName: domainEntityName2,
      referencedEntity: referencedEntity2,
    });
    addInterchangeItemEdfiOdsApiTo(interchangeItem2);
    mergedInterchange1 = Object.assign(newMergedInterchange(), {
      namespace,
      metaEdName: 'MergedInterchangeName1',
      elements: [interchangeItem1],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange1);
    addMergedInterchangeEdfiOdsApiTo(mergedInterchange1);

    mergedInterchange2 = Object.assign(newMergedInterchange(), {
      namespace,
      metaEdName: 'MergedInterchangeName2',
      elements: [interchangeItem2],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange2);
    addMergedInterchangeEdfiOdsApiTo(mergedInterchange2);

    enhance(metaEd);
  });

  it('should have interchange order properties', (): void => {
    expect(mergedInterchange1.data.edfiOdsApi.apiOrder).toBe(20);
    expect(mergedInterchange1.data.edfiOdsApi.apiOrderedElements).toEqual([
      { globalDependencyOrder: 2, name: domainEntityName1 },
    ]);

    expect(mergedInterchange2.data.edfiOdsApi.apiOrder).toBe(10);
    expect(mergedInterchange2.data.edfiOdsApi.apiOrderedElements).toEqual([
      { globalDependencyOrder: 1, name: domainEntityName2 },
    ]);
  });
});

describe('when InterchangeOrderMetadataEnhancer enhances interchange with external dependency in extension', (): void => {
  let mergedInterchange1: MergedInterchange;
  let mergedInterchange2: MergedInterchange;
  let mergedInterchange2Extension: MergedInterchange;
  const namespaceName = 'EdFi';
  const extensionNamespaceName = 'Extension';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion: '3.2.0-c' });
    const namespace: Namespace = Object.assign(newNamespace(), { namespaceName });
    metaEd.namespace.set(namespace.namespaceName, namespace);
    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: extensionNamespaceName,
      isExtension: true,
    });
    metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
    extensionNamespace.dependencies.push(namespace);
    addEdFiXsdEntityRepositoryTo(metaEd);

    const referencedEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityName1,
      properties: [newIntegerProperty()],
    });
    const referencedEntity1Extension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityName1,
      baseEntity: referencedEntity1,
      properties: [newIntegerProperty()],
    });
    const referencedEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName2,
    });
    referencedEntity1.properties.push(
      Object.assign(newDomainEntityProperty(), {
        referencedEntity: referencedEntity2,
      }),
    );
    const interchangeItem1: InterchangeItem = Object.assign(newInterchangeItem(), {
      namespace,
      metaEdName: domainEntityName1,
      referencedEntity: referencedEntity1,
    });
    addInterchangeItemEdfiOdsApiTo(interchangeItem1);
    const interchangeItem2: InterchangeItem = Object.assign(newInterchangeItem(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityName2,
      referencedEntity: referencedEntity2,
    });
    addInterchangeItemEdfiOdsApiTo(interchangeItem2);
    mergedInterchange1 = Object.assign(newMergedInterchange(), {
      namespace: extensionNamespace,
      metaEdName: 'MergedInterchangeName1',
      elements: [interchangeItem2],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange1);
    addMergedInterchangeEdfiOdsApiTo(mergedInterchange1);
    mergedInterchange2 = Object.assign(newMergedInterchange(), {
      namespace,
      metaEdName: 'MergedInterchangeName2',
      elements: [interchangeItem1],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange2);
    addMergedInterchangeEdfiOdsApiTo(mergedInterchange2);
    mergedInterchange2Extension = Object.assign(newMergedInterchange(), {
      namespace: extensionNamespace,
      metaEdName: 'MergedInterchangeName2',
      elements: [
        Object.assign(interchangeItem1, {
          namespace: extensionNamespace,
          referencedEntity: referencedEntity1Extension,
        }),
      ],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange2Extension);
    addMergedInterchangeEdfiOdsApiTo(mergedInterchange2Extension);

    enhance(metaEd);
  });

  it('should have interchange order properties', (): void => {
    expect(mergedInterchange1.data.edfiOdsApi.apiOrder).toBe(10);
    expect(mergedInterchange1.data.edfiOdsApi.apiOrderedElements).toEqual([
      { globalDependencyOrder: 1, name: domainEntityName2 },
    ]);

    expect(mergedInterchange2.data.edfiOdsApi.apiOrder).toBe(10);
    expect(mergedInterchange2.data.edfiOdsApi.apiOrderedElements).toEqual([
      { globalDependencyOrder: 1, name: domainEntityName1 },
    ]);

    expect(mergedInterchange2Extension.data.edfiOdsApi.apiOrder).toBe(20);
    expect(mergedInterchange2Extension.data.edfiOdsApi.apiOrderedElements).toEqual([
      { globalDependencyOrder: 2, name: domainEntityName1 },
    ]);
  });
});

describe('when InterchangeOrderMetadataEnhancer enhances interchange with external dependency in extension with duplicate name', (): void => {
  let mergedInterchange1: MergedInterchange;
  let mergedInterchange2: MergedInterchange;
  const namespaceName = 'EdFi';
  const extensionNamespaceName = 'Extension';
  const domainEntityName1 = 'DomainEntityName1';

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion: '3.2.0-c' });
    const namespace: Namespace = Object.assign(newNamespace(), { namespaceName });
    metaEd.namespace.set(namespace.namespaceName, namespace);
    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: extensionNamespaceName,
      isExtension: true,
    });
    metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
    extensionNamespace.dependencies.push(namespace);
    addEdFiXsdEntityRepositoryTo(metaEd);

    const referencedEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      namespace,
      metaEdName: domainEntityName1,
      properties: [newIntegerProperty()],
    });
    const referencedEntity1Extension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      namespace: extensionNamespace,
      metaEdName: domainEntityName1,
      baseEntity: referencedEntity1,
      properties: [newIntegerProperty()],
    });
    const interchangeItem1: InterchangeItem = Object.assign(newInterchangeItem(), {
      namespace,
      metaEdName: domainEntityName1,
      referencedEntity: referencedEntity1,
    });
    addInterchangeItemEdfiOdsApiTo(interchangeItem1);
    const interchangeItem2: InterchangeItem = Object.assign(newInterchangeItem(), {
      namespace,
      metaEdName: domainEntityName1,
      referencedEntity: referencedEntity1Extension,
    });
    addInterchangeItemEdfiOdsApiTo(interchangeItem2);
    mergedInterchange1 = Object.assign(newMergedInterchange(), {
      namespace,
      elements: [interchangeItem1],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange1);
    addMergedInterchangeEdfiOdsApiTo(mergedInterchange1);

    mergedInterchange2 = Object.assign(newMergedInterchange(), {
      namespace: extensionNamespace,
      elements: [interchangeItem2],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange2);
    addMergedInterchangeEdfiOdsApiTo(mergedInterchange2);

    enhance(metaEd);
  });

  it('should have interchange order properties', (): void => {
    expect(mergedInterchange1.data.edfiOdsApi.apiOrder).toBe(10);
    expect(mergedInterchange1.data.edfiOdsApi.apiOrderedElements).toEqual([
      { globalDependencyOrder: 1, name: domainEntityName1 },
    ]);

    expect(mergedInterchange2.data.edfiOdsApi.apiOrder).toBe(10);
    expect(mergedInterchange2.data.edfiOdsApi.apiOrderedElements).toEqual([
      { globalDependencyOrder: 1, name: domainEntityName1 },
    ]);
  });
});
