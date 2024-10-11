import {
  addEntityForNamespace,
  addProperty,
  newDomainEntity,
  newDomainEntityExtension,
  newDomainEntityProperty,
  newMergeDirective,
  newMetaEdEnvironment,
  newNamespace,
  newIntegerProperty,
  IntegerProperty,
} from '@edfi/metaed-core';
import { DomainEntityProperty, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/MergeDirectiveEnhancer';

describe('when enhancing top level entity with no merge directives', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName2 = 'DomainEntityPropertyName1';

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';

    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    const domainEntity1Referencing2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing2);
    addEntityForNamespace(domainEntity1);
    addProperty(metaEd.propertyIndex, domainEntity1Referencing2);

    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2, namespace });
    addEntityForNamespace(domainEntity2);

    enhance(metaEd);
  });

  it('should have no merge directives', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName2)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives).toHaveLength(0);
  });
});

describe('when enhancing top level entity with nested reference to top level reference', (): void => {
  /*
   * DomainEntity 1
   *   DomainEntity 2
   *   DomainEntity 3
   *     merge 3.2 with 2
   */
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName3 = 'DomainEntityName3';
  let domainEntity1Referencing2: DomainEntityProperty;
  let domainEntity1Referencing3: DomainEntityProperty;
  let domainEntity3Referencing2: DomainEntityProperty;
  beforeAll(() => {
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2, namespace });
    addEntityForNamespace(domainEntity2);

    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3, namespace });
    domainEntity3Referencing2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName3,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity3.properties.push(domainEntity3Referencing2);
    addEntityForNamespace(domainEntity3);

    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    domainEntity1Referencing2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing2);
    domainEntity1Referencing3 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      fullPropertyName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing3);
    addProperty(metaEd.propertyIndex, domainEntity1Referencing3);
    const mergeDirective = Object.assign(newMergeDirective(), {
      sourcePropertyPathStrings: [domainEntityName3, domainEntityName2],
      targetPropertyPathStrings: [domainEntityName2],
    });
    domainEntity1Referencing3.mergeDirectives.push(mergeDirective);
    addEntityForNamespace(domainEntity1);

    enhance(metaEd);
  });

  it('should have correct source property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].sourceProperty).toBe(domainEntity3Referencing2);
    expect(property.mergeDirectives[0].sourcePropertyChain).toHaveLength(2);
    expect(property.mergeDirectives[0].sourcePropertyChain[0]).toBe(domainEntity1Referencing3);
    expect(property.mergeDirectives[0].sourcePropertyChain[1]).toBe(domainEntity3Referencing2);
    expect(property.mergeDirectives[0].sourceMap.sourceProperty).toMatchInlineSnapshot(`
      Object {
        "column": 0,
        "line": 0,
        "tokenText": "NoSourceMap",
      }
    `);
    expect(property.mergeDirectives[0].sourceMap.sourcePropertyChain).toMatchInlineSnapshot(`
      Object {
        "column": 0,
        "line": 0,
        "tokenText": "NoSourceMap",
      }
    `);
  });

  it('should have correct target property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].targetProperty).toBe(domainEntity1Referencing2);
    expect(property.mergeDirectives[0].targetPropertyChain).toHaveLength(1);
    expect(property.mergeDirectives[0].targetPropertyChain[0]).toBe(domainEntity1Referencing2);
    expect(property.mergeDirectives[0].sourceMap.targetProperty).toMatchInlineSnapshot(`
      Object {
        "column": 0,
        "line": 0,
        "tokenText": "NoSourceMap",
      }
    `);
    expect(property.mergeDirectives[0].sourceMap.targetPropertyChain).toMatchInlineSnapshot(`
      Object {
        "column": 0,
        "line": 0,
        "tokenText": "NoSourceMap",
      }
    `);
  });

  it('should have correct source targeted by property', (): void => {
    expect(domainEntity1Referencing2.mergeSourcedBy).toHaveLength(0);
    expect(domainEntity3Referencing2.mergeSourcedBy).toHaveLength(1);
    expect(domainEntity3Referencing2.mergeSourcedBy[0].parentProperty).toBe(domainEntity1Referencing3);
  });

  it('should have correct merge targeted by property', (): void => {
    expect(domainEntity3Referencing2.mergeTargetedBy).toHaveLength(0);
    expect(domainEntity1Referencing2.mergeTargetedBy).toHaveLength(1);
    expect(domainEntity1Referencing2.mergeTargetedBy[0].parentProperty).toBe(domainEntity1Referencing3);
  });
});

describe('when enhancing top level entity with top level reference to nested reference', (): void => {
  /*
   * DomainEntity 1
   *   DomainEntity 2
   *   DomainEntity 3
   *     merge 3 with 2.3
   */
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName3 = 'DomainEntityName3';
  let domainEntity1Referencing2: DomainEntityProperty;
  let domainEntity1Referencing3: DomainEntityProperty;
  let domainEntity2Referencing3: DomainEntityProperty;
  beforeAll(() => {
    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3, namespace });
    addEntityForNamespace(domainEntity3);

    const domainEntityName2 = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2, namespace });
    domainEntity2Referencing3 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      fullPropertyName: domainEntityName3,
      parentEntityName: domainEntityName2,
      parentEntity: domainEntity2,
      referencedEntity: domainEntity3,
      namespace,
    });
    domainEntity2.properties.push(domainEntity2Referencing3);
    addEntityForNamespace(domainEntity2);

    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    domainEntity1Referencing2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing2);
    domainEntity1Referencing3 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      fullPropertyName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing3);
    addProperty(metaEd.propertyIndex, domainEntity1Referencing3);
    const mergeDirective = Object.assign(newMergeDirective(), {
      sourcePropertyPathStrings: [domainEntityName3],
      targetPropertyPathStrings: [domainEntityName2, domainEntityName3],
    });
    domainEntity1Referencing3.mergeDirectives.push(mergeDirective);
    addEntityForNamespace(domainEntity1);

    enhance(metaEd);
  });

  it('should have correct source property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].sourceProperty).toBe(domainEntity1Referencing3);
    expect(property.mergeDirectives[0].sourcePropertyChain).toHaveLength(1);
    expect(property.mergeDirectives[0].sourcePropertyChain[0]).toBe(domainEntity1Referencing3);
  });

  it('should have correct target property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].targetProperty).toBe(domainEntity2Referencing3);
    expect(property.mergeDirectives[0].targetPropertyChain).toHaveLength(2);
    expect(property.mergeDirectives[0].targetPropertyChain[0]).toBe(domainEntity1Referencing2);
    expect(property.mergeDirectives[0].targetPropertyChain[1]).toBe(domainEntity2Referencing3);
  });

  it('should have correct source targeted by property', (): void => {
    expect(domainEntity2Referencing3.mergeSourcedBy).toHaveLength(0);
    expect(domainEntity1Referencing3.mergeSourcedBy).toHaveLength(1);
    expect(domainEntity1Referencing3.mergeSourcedBy[0].parentProperty).toBe(domainEntity1Referencing3);
  });

  it('should have correct merge targeted by property', (): void => {
    expect(domainEntity1Referencing3.mergeTargetedBy).toHaveLength(0);
    expect(domainEntity2Referencing3.mergeTargetedBy).toHaveLength(1);
    expect(domainEntity2Referencing3.mergeTargetedBy[0].parentProperty).toBe(domainEntity1Referencing3);
  });
});

describe('when enhancing top level entity with nested reference to nested reference', (): void => {
  /*
   * DomainEntity 1
   *   DomainEntity 2
   *   DomainEntity 3
   *     merge 3.4 with 2.4
   */
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName3 = 'DomainEntityName3';
  let domainEntity2Referencing4: DomainEntityProperty;
  let domainEntity3Referencing4: DomainEntityProperty;
  let domainEntity1Referencing2: DomainEntityProperty;
  let domainEntity1Referencing3: DomainEntityProperty;
  beforeAll(() => {
    const domainEntityName4 = 'DomainEntityName4';
    const domainEntity4 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName4, namespace });
    addEntityForNamespace(domainEntity4);

    const domainEntityName2 = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2, namespace });
    domainEntity2Referencing4 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName4,
      fullPropertyName: domainEntityName4,
      parentEntityName: domainEntityName2,
      parentEntity: domainEntity2,
      referencedEntity: domainEntity4,
      namespace,
    });
    domainEntity2.properties.push(domainEntity2Referencing4);
    addEntityForNamespace(domainEntity2);

    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3, namespace });
    domainEntity3Referencing4 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName4,
      fullPropertyName: domainEntityName4,
      parentEntityName: domainEntityName3,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity4,
      namespace,
    });
    domainEntity3.properties.push(domainEntity3Referencing4);
    addEntityForNamespace(domainEntity3);

    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    domainEntity1Referencing2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing2);
    domainEntity1Referencing3 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      fullPropertyName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing3);
    addProperty(metaEd.propertyIndex, domainEntity1Referencing3);
    const mergeDirective = Object.assign(newMergeDirective(), {
      sourcePropertyPathStrings: [domainEntityName3, domainEntityName4],
      targetPropertyPathStrings: [domainEntityName2, domainEntityName4],
    });
    domainEntity1Referencing3.mergeDirectives.push(mergeDirective);
    addEntityForNamespace(domainEntity1);

    enhance(metaEd);
  });

  it('should have correct source property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].sourceProperty).toBe(domainEntity3Referencing4);
    expect(property.mergeDirectives[0].sourcePropertyChain).toHaveLength(2);
    expect(property.mergeDirectives[0].sourcePropertyChain[0]).toBe(domainEntity1Referencing3);
    expect(property.mergeDirectives[0].sourcePropertyChain[1]).toBe(domainEntity3Referencing4);
  });

  it('should have correct target property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].targetProperty).toBe(domainEntity2Referencing4);
    expect(property.mergeDirectives[0].targetPropertyChain).toHaveLength(2);
    expect(property.mergeDirectives[0].targetPropertyChain[0]).toBe(domainEntity1Referencing2);
    expect(property.mergeDirectives[0].targetPropertyChain[1]).toBe(domainEntity2Referencing4);
  });

  it('should have correct source targeted by property', (): void => {
    expect(domainEntity2Referencing4.mergeSourcedBy).toHaveLength(0);
    expect(domainEntity3Referencing4.mergeSourcedBy).toHaveLength(1);
    expect(domainEntity3Referencing4.mergeSourcedBy[0].parentProperty).toBe(domainEntity1Referencing3);
  });

  it('should have correct merge targeted by property', (): void => {
    expect(domainEntity3Referencing4.mergeTargetedBy).toHaveLength(0);
    expect(domainEntity2Referencing4.mergeTargetedBy).toHaveLength(1);
    expect(domainEntity2Referencing4.mergeTargetedBy[0].parentProperty).toBe(domainEntity1Referencing3);
  });
});

describe('when enhancing top level entity with deep nested reference to deep nested reference', (): void => {
  /*
   * DomainEntity 1
   *   DomainEntity 2
   *   DomainEntity 3
   *     merge 3.4.6 with 2.5.6
   */
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName3 = 'DomainEntityName3';
  let domainEntity1Referencing2: DomainEntityProperty;
  let domainEntity1Referencing3: DomainEntityProperty;
  let domainEntity2Referencing5: DomainEntityProperty;
  let domainEntity3Referencing4: DomainEntityProperty;
  let domainEntity4Referencing6: DomainEntityProperty;
  let domainEntity5Referencing6: DomainEntityProperty;
  beforeAll(() => {
    const domainEntityName6 = 'DomainEntityName6';
    const domainEntity6 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName6, namespace });
    addEntityForNamespace(domainEntity6);

    const domainEntityName4 = 'DomainEntityName4';
    const domainEntity4 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName4, namespace });
    domainEntity4Referencing6 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName6,
      fullPropertyName: domainEntityName6,
      parentEntityName: domainEntityName4,
      parentEntity: domainEntity4,
      referencedEntity: domainEntity6,
      namespace,
    });
    domainEntity4.properties.push(domainEntity4Referencing6);
    addEntityForNamespace(domainEntity4);

    const domainEntityName5 = 'DomainEntityName5';
    const domainEntity5 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName5, namespace });
    domainEntity5Referencing6 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName6,
      fullPropertyName: domainEntityName6,
      parentEntityName: domainEntityName5,
      parentEntity: domainEntity5,
      referencedEntity: domainEntity6,
      namespace,
    });
    domainEntity5.properties.push(domainEntity5Referencing6);
    addEntityForNamespace(domainEntity5);

    const domainEntityName2 = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2, namespace });
    domainEntity2Referencing5 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName5,
      fullPropertyName: domainEntityName5,
      parentEntityName: domainEntityName2,
      parentEntity: domainEntity2,
      referencedEntity: domainEntity5,
      namespace,
    });
    domainEntity2.properties.push(domainEntity2Referencing5);
    addEntityForNamespace(domainEntity2);

    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3, namespace });
    domainEntity3Referencing4 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName4,
      fullPropertyName: domainEntityName4,
      parentEntityName: domainEntityName3,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity4,
      namespace,
    });
    domainEntity3.properties.push(domainEntity3Referencing4);
    addEntityForNamespace(domainEntity3);

    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    domainEntity1Referencing2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing2);
    domainEntity1Referencing3 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      fullPropertyName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing3);
    addProperty(metaEd.propertyIndex, domainEntity1Referencing3);
    const mergeDirective = Object.assign(newMergeDirective(), {
      sourcePropertyPathStrings: [domainEntityName3, domainEntityName4, domainEntityName6],
      targetPropertyPathStrings: [domainEntityName2, domainEntityName5, domainEntityName6],
    });
    domainEntity1Referencing3.mergeDirectives.push(mergeDirective);
    addEntityForNamespace(domainEntity1);

    enhance(metaEd);
  });

  it('should have correct source property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].sourceProperty).toBe(domainEntity4Referencing6);
    expect(property.mergeDirectives[0].sourcePropertyChain).toHaveLength(3);
    expect(property.mergeDirectives[0].sourcePropertyChain[0]).toBe(domainEntity1Referencing3);
    expect(property.mergeDirectives[0].sourcePropertyChain[1]).toBe(domainEntity3Referencing4);
    expect(property.mergeDirectives[0].sourcePropertyChain[2]).toBe(domainEntity4Referencing6);
  });

  it('should have correct target property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].targetProperty).toBe(domainEntity5Referencing6);
    expect(property.mergeDirectives[0].targetPropertyChain).toHaveLength(3);
    expect(property.mergeDirectives[0].targetPropertyChain[0]).toBe(domainEntity1Referencing2);
    expect(property.mergeDirectives[0].targetPropertyChain[1]).toBe(domainEntity2Referencing5);
    expect(property.mergeDirectives[0].targetPropertyChain[2]).toBe(domainEntity5Referencing6);
  });

  it('should have correct source targeted by property', (): void => {
    expect(domainEntity5Referencing6.mergeSourcedBy).toHaveLength(0);
    expect(domainEntity4Referencing6.mergeSourcedBy).toHaveLength(1);
    expect(domainEntity4Referencing6.mergeSourcedBy[0].parentProperty).toBe(domainEntity1Referencing3);
  });

  it('should have correct merge targeted by property', (): void => {
    expect(domainEntity4Referencing6.mergeTargetedBy).toHaveLength(0);
    expect(domainEntity5Referencing6.mergeTargetedBy).toHaveLength(1);
    expect(domainEntity5Referencing6.mergeTargetedBy[0].parentProperty).toBe(domainEntity1Referencing3);
  });
});

describe('when enhancing top level entity with nested reference through an extension to top level reference', (): void => {
  /*
   * merges through extensions
   *
   * DomainEntityExtension 3
   *   DomainEntity 2
   *
   * DomainEntity 1
   *   DomainEntity 2
   *   DomainEntity 3
   *     merge 3.2 with 2
   */
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName3 = 'DomainEntityName3';
  let domainEntity1Referencing2: DomainEntityProperty;
  let domainEntity1Referencing3: DomainEntityProperty;
  let domainEntityExtension3Referencing2: DomainEntityProperty;
  beforeAll(() => {
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2, namespace });
    addEntityForNamespace(domainEntity2);

    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3, namespace });
    addEntityForNamespace(domainEntity3);

    const domainEntity3Extension = Object.assign(newDomainEntityExtension(), {
      metaEdName: domainEntityName3,
      namespace,
      baseEntityName: domainEntityName3,
      baseEntity: domainEntity3,
    });
    domainEntityExtension3Referencing2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName3,
      parentEntity: domainEntity3Extension,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity3Extension.properties.push(domainEntityExtension3Referencing2);
    addEntityForNamespace(domainEntity3Extension);
    domainEntity3.extendedBy.push(domainEntity3Extension);

    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    domainEntity1Referencing2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing2);
    domainEntity1Referencing3 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      fullPropertyName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing3);
    addProperty(metaEd.propertyIndex, domainEntity1Referencing3);
    const mergeDirective = Object.assign(newMergeDirective(), {
      sourcePropertyPathStrings: [domainEntityName3, domainEntityName2],
      targetPropertyPathStrings: [domainEntityName2],
    });
    domainEntity1Referencing3.mergeDirectives.push(mergeDirective);
    addEntityForNamespace(domainEntity1);

    enhance(metaEd);
  });

  it('should have correct source property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].sourceProperty).toBe(domainEntityExtension3Referencing2);
    expect(property.mergeDirectives[0].sourcePropertyChain).toHaveLength(2);
    expect(property.mergeDirectives[0].sourcePropertyChain[0]).toBe(domainEntity1Referencing3);
    expect(property.mergeDirectives[0].sourcePropertyChain[1]).toBe(domainEntityExtension3Referencing2);
  });

  it('should have correct target property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].targetProperty).toBe(domainEntity1Referencing2);
    expect(property.mergeDirectives[0].targetPropertyChain).toHaveLength(1);
    expect(property.mergeDirectives[0].targetPropertyChain[0]).toBe(domainEntity1Referencing2);
  });

  it('should have correct source targeted by property', (): void => {
    expect(domainEntity1Referencing2.mergeSourcedBy).toHaveLength(0);
    expect(domainEntityExtension3Referencing2.mergeSourcedBy).toHaveLength(1);
    expect(domainEntityExtension3Referencing2.mergeSourcedBy[0].parentProperty).toBe(domainEntity1Referencing3);
  });

  it('should have correct merge targeted by property', (): void => {
    expect(domainEntityExtension3Referencing2.mergeTargetedBy).toHaveLength(0);
    expect(domainEntity1Referencing2.mergeTargetedBy).toHaveLength(1);
    expect(domainEntity1Referencing2.mergeTargetedBy[0].parentProperty).toBe(domainEntity1Referencing3);
  });
});

describe('when enhancing top level entity with extraneous target property reference', (): void => {
  /*
   * DomainEntity 1
   *   DomainEntity 2
   *   DomainEntity 3
   *     merge 3.2 with 2.9
   */
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName3 = 'DomainEntityName3';
  let domainEntity1Referencing2: DomainEntityProperty;
  let domainEntity1Referencing3: DomainEntityProperty;
  let domainEntity3Referencing2: DomainEntityProperty;
  beforeAll(() => {
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2, namespace });
    addEntityForNamespace(domainEntity2);

    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3, namespace });
    domainEntity3Referencing2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName3,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity3.properties.push(domainEntity3Referencing2);
    addEntityForNamespace(domainEntity3);

    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    domainEntity1Referencing2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing2);
    domainEntity1Referencing3 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      fullPropertyName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing3);
    addProperty(metaEd.propertyIndex, domainEntity1Referencing3);
    const mergeDirective = Object.assign(newMergeDirective(), {
      sourcePropertyPathStrings: [domainEntityName3, domainEntityName2],
      targetPropertyPathStrings: ['domainEntityName9'],
    });
    domainEntity1Referencing3.mergeDirectives.push(mergeDirective);
    addEntityForNamespace(domainEntity1);

    enhance(metaEd);
  });

  it('should have correct source property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].sourceProperty).toBe(domainEntity3Referencing2);
    expect(property.mergeDirectives[0].sourcePropertyChain).toHaveLength(2);
    expect(property.mergeDirectives[0].sourcePropertyChain[0]).toBe(domainEntity1Referencing3);
    expect(property.mergeDirectives[0].sourcePropertyChain[1]).toBe(domainEntity3Referencing2);
    expect(property.mergeDirectives[0].sourceMap.sourceProperty).toMatchInlineSnapshot(`
      Object {
        "column": 0,
        "line": 0,
        "tokenText": "NoSourceMap",
      }
    `);
    expect(property.mergeDirectives[0].sourceMap.sourcePropertyChain).toMatchInlineSnapshot(`
      Object {
        "column": 0,
        "line": 0,
        "tokenText": "NoSourceMap",
      }
    `);
  });

  it('should have null target property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property.mergeDirectives[0].targetProperty).toBeNull();
    expect(property.mergeDirectives[0].targetPropertyChain).toHaveLength(0);
  });

  it('should have correct source targeted by property', (): void => {
    expect(domainEntity1Referencing2.mergeSourcedBy).toHaveLength(0);
    expect(domainEntity3Referencing2.mergeSourcedBy).toHaveLength(1);
    expect(domainEntity3Referencing2.mergeSourcedBy[0].parentProperty).toBe(domainEntity1Referencing3);
  });

  it('should have no merge targeted by property', (): void => {
    expect(domainEntity3Referencing2.mergeTargetedBy).toHaveLength(0);
    expect(domainEntity1Referencing2.mergeTargetedBy).toHaveLength(0);
  });
});

describe('when enhancing top level entity with extraneous source property reference', (): void => {
  /*
   * DomainEntity 1
   *   DomainEntity 2
   *   DomainEntity 3
   *     merge 3.2.9 with 2
   */
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName3 = 'DomainEntityName3';
  let domainEntity1Referencing2: DomainEntityProperty;
  let domainEntity1Referencing3: DomainEntityProperty;
  let domainEntity3Referencing2: DomainEntityProperty;
  beforeAll(() => {
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2, namespace });
    addEntityForNamespace(domainEntity2);

    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3, namespace });
    domainEntity3Referencing2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName3,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity3.properties.push(domainEntity3Referencing2);
    addEntityForNamespace(domainEntity3);

    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    domainEntity1Referencing2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing2);
    domainEntity1Referencing3 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      fullPropertyName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing3);
    addProperty(metaEd.propertyIndex, domainEntity1Referencing3);
    const mergeDirective = Object.assign(newMergeDirective(), {
      sourcePropertyPathStrings: [domainEntityName3, domainEntityName2, 'domainEntityName9'],
      targetPropertyPathStrings: [domainEntityName2],
    });
    domainEntity1Referencing3.mergeDirectives.push(mergeDirective);
    addEntityForNamespace(domainEntity1);

    enhance(metaEd);
  });

  it('should have null source property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property.mergeDirectives[0].sourceProperty).toBeNull();
  });

  it('should have correct target property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].targetProperty).toBe(domainEntity1Referencing2);
    expect(property.mergeDirectives[0].targetPropertyChain).toHaveLength(1);
    expect(property.mergeDirectives[0].targetPropertyChain[0]).toBe(domainEntity1Referencing2);
    expect(property.mergeDirectives[0].sourceMap.targetProperty).toMatchInlineSnapshot(`
      Object {
        "column": 0,
        "line": 0,
        "tokenText": "NoSourceMap",
      }
    `);
    expect(property.mergeDirectives[0].sourceMap.targetPropertyChain).toMatchInlineSnapshot(`
      Object {
        "column": 0,
        "line": 0,
        "tokenText": "NoSourceMap",
      }
    `);
  });

  it('should have no source targeted by property', (): void => {
    expect(domainEntity1Referencing2.mergeSourcedBy).toHaveLength(0);
    expect(domainEntity3Referencing2.mergeSourcedBy).toHaveLength(0);
  });

  it('should have correct merge targeted by property', (): void => {
    expect(domainEntity3Referencing2.mergeTargetedBy).toHaveLength(0);
    expect(domainEntity1Referencing2.mergeTargetedBy).toHaveLength(1);
    expect(domainEntity1Referencing2.mergeTargetedBy[0].parentProperty).toBe(domainEntity1Referencing3);
  });
});

describe('when enhancing top level entity with non-reference property in middle of target path', (): void => {
  /*
   * DomainEntity 1
   *   DomainEntity 2
   *   DomainEntity 3
   *     merge 3.4.6 with 2.5.6
   */
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName3 = 'DomainEntityName3';
  let domainEntity1Referencing2: DomainEntityProperty;
  let domainEntity1Referencing3: DomainEntityProperty;
  let domainEntity2SimpleProperty5: IntegerProperty;
  let domainEntity3Referencing4: DomainEntityProperty;
  let domainEntity4Referencing6: DomainEntityProperty;
  let domainEntity5Referencing6: DomainEntityProperty;
  beforeAll(() => {
    const domainEntityName6 = 'DomainEntityName6';
    const domainEntity6 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName6, namespace });
    addEntityForNamespace(domainEntity6);

    const domainEntityName4 = 'DomainEntityName4';
    const domainEntity4 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName4, namespace });
    domainEntity4Referencing6 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName6,
      fullPropertyName: domainEntityName6,
      parentEntityName: domainEntityName4,
      parentEntity: domainEntity4,
      referencedEntity: domainEntity6,
      namespace,
    });
    domainEntity4.properties.push(domainEntity4Referencing6);
    addEntityForNamespace(domainEntity4);

    const domainEntityName5 = 'DomainEntityName5';
    const domainEntity5 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName5, namespace });
    domainEntity5Referencing6 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName6,
      fullPropertyName: domainEntityName6,
      parentEntityName: domainEntityName5,
      parentEntity: domainEntity5,
      referencedEntity: domainEntity6,
      namespace,
    });
    domainEntity5.properties.push(domainEntity5Referencing6);
    addEntityForNamespace(domainEntity5);

    const domainEntityName2 = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2, namespace });
    domainEntity2SimpleProperty5 = Object.assign(newIntegerProperty(), {
      metaEdName: domainEntityName5,
      fullPropertyName: domainEntityName5,
      parentEntityName: domainEntityName2,
      parentEntity: domainEntity2,
      namespace,
    });
    domainEntity2.properties.push(domainEntity2SimpleProperty5);
    addEntityForNamespace(domainEntity2);

    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3, namespace });
    domainEntity3Referencing4 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName4,
      fullPropertyName: domainEntityName4,
      parentEntityName: domainEntityName3,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity4,
      namespace,
    });
    domainEntity3.properties.push(domainEntity3Referencing4);
    addEntityForNamespace(domainEntity3);

    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    domainEntity1Referencing2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing2);
    domainEntity1Referencing3 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      fullPropertyName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Referencing3);
    addProperty(metaEd.propertyIndex, domainEntity1Referencing3);
    const mergeDirective = Object.assign(newMergeDirective(), {
      sourcePropertyPathStrings: [domainEntityName3, domainEntityName4, domainEntityName6],
      targetPropertyPathStrings: [domainEntityName2, domainEntityName5, domainEntityName6],
    });
    domainEntity1Referencing3.mergeDirectives.push(mergeDirective);
    addEntityForNamespace(domainEntity1);

    enhance(metaEd);
  });

  it('should have correct source property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].sourceProperty).toBe(domainEntity4Referencing6);
    expect(property.mergeDirectives[0].sourcePropertyChain).toHaveLength(3);
    expect(property.mergeDirectives[0].sourcePropertyChain[0]).toBe(domainEntity1Referencing3);
    expect(property.mergeDirectives[0].sourcePropertyChain[1]).toBe(domainEntity3Referencing4);
    expect(property.mergeDirectives[0].sourcePropertyChain[2]).toBe(domainEntity4Referencing6);
  });

  it('should have no target property and only partial target chain', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].targetProperty).toBeNull();
    expect(property.mergeDirectives[0].targetPropertyChain).toHaveLength(2);
    expect(property.mergeDirectives[0].targetPropertyChain[0]).toBe(domainEntity1Referencing2);
    expect(property.mergeDirectives[0].targetPropertyChain[1]).toBe(domainEntity2SimpleProperty5);
  });

  it('should have correct source targeted by property', (): void => {
    expect(domainEntity5Referencing6.mergeSourcedBy).toHaveLength(0);
    expect(domainEntity4Referencing6.mergeSourcedBy).toHaveLength(1);
    expect(domainEntity4Referencing6.mergeSourcedBy[0].parentProperty).toBe(domainEntity1Referencing3);
  });

  it('should have no merge targeted by property', (): void => {
    expect(domainEntity4Referencing6.mergeTargetedBy).toHaveLength(0);
    expect(domainEntity5Referencing6.mergeTargetedBy).toHaveLength(0);
  });
});
