// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  addEntityForNamespace,
  addProperty,
  newDomainEntity,
  newDomainEntityProperty,
  newSharedIntegerProperty,
  newMergeDirective,
  newMetaEdEnvironment,
  newNamespace,
} from '@edfi/metaed-core';
import { SharedIntegerProperty, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/MergeDirectiveEnhancer';

describe('when enhancing top level entity with nested reference to top level reference', (): void => {
  /*
   * DomainEntity 1
   *   SharedInteger 2
   *   DomainEntity 3
   *     merge 3.2 with 2
   */
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName3 = 'DomainEntityName3';
  let domainEntity1Property1: SharedIntegerProperty;
  let domainEntity3Property1: SharedIntegerProperty;
  beforeAll(() => {
    const SharedIntegerName2 = 'SharedIntegerName2';

    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3, namespace });
    domainEntity3Property1 = Object.assign(newSharedIntegerProperty(), {
      metaEdName: SharedIntegerName2,
      fullPropertyName: SharedIntegerName2,
      parentEntityName: domainEntityName3,
      parentEntity: domainEntity3,
      namespace,
    });
    domainEntity3.properties.push(domainEntity3Property1);
    addEntityForNamespace(domainEntity3);

    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    domainEntity1Property1 = Object.assign(newSharedIntegerProperty(), {
      metaEdName: SharedIntegerName2,
      fullPropertyName: SharedIntegerName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Property1);
    const domainEntity1Property2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      fullPropertyName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Property2);
    addProperty(metaEd.propertyIndex, domainEntity1Property2);
    const mergedProperty = Object.assign(newMergeDirective(), {
      sourcePropertyPathStrings: [domainEntityName3, SharedIntegerName2],
      targetPropertyPathStrings: [SharedIntegerName2],
    });
    domainEntity1Property2.mergeDirectives.push(mergedProperty);
    addEntityForNamespace(domainEntity1);

    enhance(metaEd);
  });

  it('should have correct merge property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].sourceProperty).toBe(domainEntity3Property1);
  });

  it('should have correct target property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].targetProperty).toBe(domainEntity1Property1);
  });
});

describe('when enhancing top level entity with top level reference to nested reference', (): void => {
  /*
   * DomainEntity 1
   *   DomainEntity 2
   *   SharedInteger 3
   *     merge 3 with 2.3
   */
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const sharedIntegerName3 = 'SharedIntegerName3';
  let domainEntity1Property2: SharedIntegerProperty;
  let domainEntity2Property1: SharedIntegerProperty;
  beforeAll(() => {
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2, namespace });
    domainEntity2Property1 = Object.assign(newSharedIntegerProperty(), {
      metaEdName: sharedIntegerName3,
      fullPropertyName: sharedIntegerName3,
      parentEntityName: domainEntityName2,
      parentEntity: domainEntity2,
      namespace,
    });
    domainEntity2.properties.push(domainEntity2Property1);
    addEntityForNamespace(domainEntity2);

    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    const domainEntity1Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Property1);
    domainEntity1Property2 = Object.assign(newSharedIntegerProperty(), {
      metaEdName: sharedIntegerName3,
      fullPropertyName: sharedIntegerName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Property2);
    addProperty(metaEd.propertyIndex, domainEntity1Property2);
    const mergedProperty = Object.assign(newMergeDirective(), {
      sourcePropertyPathStrings: [sharedIntegerName3],
      targetPropertyPathStrings: [domainEntityName2, sharedIntegerName3],
    });
    domainEntity1Property2.mergeDirectives.push(mergedProperty);
    addEntityForNamespace(domainEntity1);

    enhance(metaEd);
  });

  it('should have correct merge property', (): void => {
    const property = metaEd.propertyIndex.sharedInteger.filter((p) => p.metaEdName === sharedIntegerName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].sourceProperty).toBe(domainEntity1Property2);
  });

  it('should have correct target property', (): void => {
    const property = metaEd.propertyIndex.sharedInteger.filter((p) => p.metaEdName === sharedIntegerName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].targetProperty).toBe(domainEntity2Property1);
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
  let domainEntity2Property1: SharedIntegerProperty;
  let domainEntity3Property1: SharedIntegerProperty;
  beforeAll(() => {
    const sharedIntegerName4 = 'SharedIntegerName4';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2, namespace });
    domainEntity2Property1 = Object.assign(newSharedIntegerProperty(), {
      metaEdName: sharedIntegerName4,
      fullPropertyName: sharedIntegerName4,
      parentEntityName: domainEntityName2,
      parentEntity: domainEntity2,
      namespace,
    });
    domainEntity2.properties.push(domainEntity2Property1);
    addEntityForNamespace(domainEntity2);

    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3, namespace });
    domainEntity3Property1 = Object.assign(newSharedIntegerProperty(), {
      metaEdName: sharedIntegerName4,
      fullPropertyName: sharedIntegerName4,
      parentEntityName: domainEntityName3,
      parentEntity: domainEntity3,
      namespace,
    });
    domainEntity3.properties.push(domainEntity3Property1);
    addEntityForNamespace(domainEntity3);

    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    const domainEntity1Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Property1);
    const domainEntity1Property2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      fullPropertyName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Property2);
    addProperty(metaEd.propertyIndex, domainEntity1Property2);
    const mergedProperty = Object.assign(newMergeDirective(), {
      sourcePropertyPathStrings: [domainEntityName3, sharedIntegerName4],
      targetPropertyPathStrings: [domainEntityName2, sharedIntegerName4],
    });
    domainEntity1Property2.mergeDirectives.push(mergedProperty);
    addEntityForNamespace(domainEntity1);

    enhance(metaEd);
  });

  it('should have correct merge property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].sourceProperty).toBe(domainEntity3Property1);
  });

  it('should have correct target property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].targetProperty).toBe(domainEntity2Property1);
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
  let domainEntity4Property1: SharedIntegerProperty;
  let domainEntity5Property1: SharedIntegerProperty;
  beforeAll(() => {
    const sharedIntegerName6 = 'SharedIntegerName6';

    const domainEntityName4 = 'DomainEntityName4';
    const domainEntity4 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName4, namespace });
    domainEntity4Property1 = Object.assign(newSharedIntegerProperty(), {
      metaEdName: sharedIntegerName6,
      fullPropertyName: sharedIntegerName6,
      parentEntityName: domainEntityName4,
      parentEntity: domainEntity4,
      namespace,
    });
    domainEntity4.properties.push(domainEntity4Property1);
    addEntityForNamespace(domainEntity4);

    const domainEntityName5 = 'DomainEntityName5';
    const domainEntity5 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName5, namespace });
    domainEntity5Property1 = Object.assign(newSharedIntegerProperty(), {
      metaEdName: sharedIntegerName6,
      fullPropertyName: sharedIntegerName6,
      parentEntityName: domainEntityName5,
      parentEntity: domainEntity5,
      namespace,
    });
    domainEntity5.properties.push(domainEntity5Property1);
    addEntityForNamespace(domainEntity5);

    const domainEntityName2 = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2, namespace });
    const domainEntity2Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName5,
      fullPropertyName: domainEntityName5,
      parentEntityName: domainEntityName2,
      parentEntity: domainEntity2,
      referencedEntity: domainEntity5,
      namespace,
    });
    domainEntity2.properties.push(domainEntity2Property1);
    addEntityForNamespace(domainEntity2);

    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3, namespace });
    const domainEntity3Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName4,
      fullPropertyName: domainEntityName4,
      parentEntityName: domainEntityName3,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity4,
      namespace,
    });
    domainEntity3.properties.push(domainEntity3Property1);
    addEntityForNamespace(domainEntity3);

    const domainEntityName1 = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1, namespace });
    const domainEntity1Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      fullPropertyName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Property1);
    const domainEntity1Property2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      fullPropertyName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
      namespace,
    });
    domainEntity1.properties.push(domainEntity1Property2);
    addProperty(metaEd.propertyIndex, domainEntity1Property2);
    const mergedProperty = Object.assign(newMergeDirective(), {
      sourcePropertyPathStrings: [domainEntityName3, domainEntityName4, sharedIntegerName6],
      targetPropertyPathStrings: [domainEntityName2, domainEntityName5, sharedIntegerName6],
    });
    domainEntity1Property2.mergeDirectives.push(mergedProperty);
    addEntityForNamespace(domainEntity1);

    enhance(metaEd);
  });

  it('should have correct merge property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].sourceProperty).toBe(domainEntity4Property1);
  });

  it('should have correct target property', (): void => {
    const property = metaEd.propertyIndex.domainEntity.filter((p) => p.metaEdName === domainEntityName3)[0];
    expect(property).toBeDefined();
    expect(property.mergeDirectives[0].targetProperty).toBe(domainEntity5Property1);
  });
});
