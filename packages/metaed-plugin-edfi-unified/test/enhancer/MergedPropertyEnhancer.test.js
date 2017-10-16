// @flow
import R from 'ramda';
import {
  addEntity,
  addProperty,
  newDomainEntity,
  newDomainEntityProperty,
  newMergedProperty,
  newMetaEdEnvironment,
} from '../../../metaed-core/index';
import type { DomainEntityProperty, MetaEdEnvironment } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/MergedPropertyEnhancer';

describe('when enhancing top level entity with no merged properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName2: string = 'DomainEntityPropertyName1';

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';

    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1 });
    const domainEntityProperty1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
    });
    domainEntity1.properties.push(domainEntityProperty1);
    addEntity(metaEd.entity, domainEntity1);
    addProperty(metaEd.propertyIndex, domainEntityProperty1);

    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2 });
    addEntity(metaEd.entity, domainEntity2);

    enhance(metaEd);
  });

  it('should have no merged properties', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === domainEntityName2));
    expect(property).toBeDefined();
    expect(property.mergedProperties).toHaveLength(0);
  });
});

describe('when enhancing top level entity with nested reference to top level reference', () => {
  /*
  * DomainEntity 1
  *   DomainEntity 2
  *   DomainEntity 3
  *     merge 3.2 with 2
  */
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName3: string = 'DomainEntityName3';
  let domainEntity1Property1: DomainEntityProperty;
  let domainEntity3Property1: DomainEntityProperty;
  beforeAll(() => {
    const domainEntityName2: string = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2 });
    addEntity(metaEd.entity, domainEntity2);

    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3 });
    domainEntity3Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      propertyPathName: domainEntityName2,
      parentEntityName: domainEntityName3,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity2,
    });
    domainEntity3.properties.push(domainEntity3Property1);
    addEntity(metaEd.entity, domainEntity3);

    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1 });
    domainEntity1Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      propertyPathName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
    });
    domainEntity1.properties.push(domainEntity1Property1);
    const domainEntity1Property2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      propertyPathName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
    });
    domainEntity1.properties.push(domainEntity1Property2);
    addProperty(metaEd.propertyIndex, domainEntity1Property2);
    const mergedProperty = Object.assign(newMergedProperty(), {
      mergePropertyPath: [domainEntityName3, domainEntityName2],
      targetPropertyPath: [domainEntityName2],
    });
    domainEntity1Property2.mergedProperties.push(mergedProperty);
    addEntity(metaEd.entity, domainEntity1);

    enhance(metaEd);
  });

  it('should have correct merge property', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === domainEntityName3));
    expect(property).toBeDefined();
    expect(R.head(property.mergedProperties).mergeProperty).toBe(domainEntity3Property1);
  });

  it('should have correct target property', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === domainEntityName3));
    expect(property).toBeDefined();
    expect(R.head(property.mergedProperties).targetProperty).toBe(domainEntity1Property1);
  });
});

describe('when enhancing top level entity with top level reference to nested reference', () => {
  /*
  * DomainEntity 1
  *   DomainEntity 2
  *   DomainEntity 3
  *     merge 3 with 2.3
  */
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName3: string = 'DomainEntityName3';
  let domainEntity1Property2: DomainEntityProperty;
  let domainEntity2Property1: DomainEntityProperty;
  beforeAll(() => {
    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3 });
    addEntity(metaEd.entity, domainEntity3);

    const domainEntityName2: string = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2 });
    domainEntity2Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      propertyPathName: domainEntityName3,
      parentEntityName: domainEntityName2,
      parentEntity: domainEntity2,
      referencedEntity: domainEntity3,
    });
    domainEntity2.properties.push(domainEntity2Property1);
    addEntity(metaEd.entity, domainEntity2);

    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1 });
    const domainEntity1Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      propertyPathName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
    });
    domainEntity1.properties.push(domainEntity1Property1);
    domainEntity1Property2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      propertyPathName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
    });
    domainEntity1.properties.push(domainEntity1Property2);
    addProperty(metaEd.propertyIndex, domainEntity1Property2);
    const mergedProperty = Object.assign(newMergedProperty(), {
      mergePropertyPath: [domainEntityName3],
      targetPropertyPath: [domainEntityName2, domainEntityName3],
    });
    domainEntity1Property2.mergedProperties.push(mergedProperty);
    addEntity(metaEd.entity, domainEntity1);

    enhance(metaEd);
  });

  it('should have correct merge property', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === domainEntityName3));
    expect(property).toBeDefined();
    expect(R.head(property.mergedProperties).mergeProperty).toBe(domainEntity1Property2);
  });

  it('should have correct target property', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === domainEntityName3));
    expect(property).toBeDefined();
    expect(R.head(property.mergedProperties).targetProperty).toBe(domainEntity2Property1);
  });
});

describe('when enhancing top level entity with nested reference to nested reference', () => {
  /*
  * DomainEntity 1
  *   DomainEntity 2
  *   DomainEntity 3
  *     merge 3.4 with 2.4
  */
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName3: string = 'DomainEntityName3';
  let domainEntity2Property1: DomainEntityProperty;
  let domainEntity3Property1: DomainEntityProperty;
  beforeAll(() => {
    const domainEntityName4: string = 'DomainEntityName4';
    const domainEntity4 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName4 });
    addEntity(metaEd.entity, domainEntity4);

    const domainEntityName2: string = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2 });
    domainEntity2Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName4,
      propertyPathName: domainEntityName4,
      parentEntityName: domainEntityName2,
      parentEntity: domainEntity2,
      referencedEntity: domainEntity4,
    });
    domainEntity2.properties.push(domainEntity2Property1);
    addEntity(metaEd.entity, domainEntity2);

    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3 });
    domainEntity3Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName4,
      propertyPathName: domainEntityName4,
      parentEntityName: domainEntityName3,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity4,
    });
    domainEntity3.properties.push(domainEntity3Property1);
    addEntity(metaEd.entity, domainEntity3);

    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1 });
    const domainEntity1Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      propertyPathName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
    });
    domainEntity1.properties.push(domainEntity1Property1);
    const domainEntity1Property2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      propertyPathName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
    });
    domainEntity1.properties.push(domainEntity1Property2);
    addProperty(metaEd.propertyIndex, domainEntity1Property2);
    const mergedProperty = Object.assign(newMergedProperty(), {
      mergePropertyPath: [domainEntityName3, domainEntityName4],
      targetPropertyPath: [domainEntityName2, domainEntityName4],
    });
    domainEntity1Property2.mergedProperties.push(mergedProperty);
    addEntity(metaEd.entity, domainEntity1);

    enhance(metaEd);
  });

  it('should have correct merge property', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === domainEntityName3));
    expect(property).toBeDefined();
    expect(R.head(property.mergedProperties).mergeProperty).toBe(domainEntity3Property1);
  });

  it('should have correct target property', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === domainEntityName3));
    expect(property).toBeDefined();
    expect(R.head(property.mergedProperties).targetProperty).toBe(domainEntity2Property1);
  });
});

describe('when enhancing top level entity with deep nested reference to deep nested reference', () => {
  /*
  * DomainEntity 1
  *   DomainEntity 2
  *   DomainEntity 3
  *     merge 3.4.6 with 2.5.6
  */
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName3: string = 'DomainEntityName3';
  let domainEntity4Property1: DomainEntityProperty;
  let domainEntity5Property1: DomainEntityProperty;
  beforeAll(() => {
    const domainEntityName6: string = 'DomainEntityName6';
    const domainEntity6 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName6 });
    addEntity(metaEd.entity, domainEntity6);

    const domainEntityName4: string = 'DomainEntityName4';
    const domainEntity4 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName4 });
    domainEntity4Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName6,
      propertyPathName: domainEntityName6,
      parentEntityName: domainEntityName4,
      parentEntity: domainEntity4,
      referencedEntity: domainEntity6,
    });
    domainEntity4.properties.push(domainEntity4Property1);
    addEntity(metaEd.entity, domainEntity4);

    const domainEntityName5: string = 'DomainEntityName5';
    const domainEntity5 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName5 });
    domainEntity5Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName6,
      propertyPathName: domainEntityName6,
      parentEntityName: domainEntityName5,
      parentEntity: domainEntity5,
      referencedEntity: domainEntity6,
    });
    domainEntity5.properties.push(domainEntity5Property1);
    addEntity(metaEd.entity, domainEntity5);

    const domainEntityName2: string = 'DomainEntityName2';
    const domainEntity2 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName2 });
    const domainEntity2Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName5,
      propertyPathName: domainEntityName5,
      parentEntityName: domainEntityName2,
      parentEntity: domainEntity2,
      referencedEntity: domainEntity5,
    });
    domainEntity2.properties.push(domainEntity2Property1);
    addEntity(metaEd.entity, domainEntity2);

    const domainEntity3 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName3 });
    const domainEntity3Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName4,
      propertyPathName: domainEntityName4,
      parentEntityName: domainEntityName3,
      parentEntity: domainEntity3,
      referencedEntity: domainEntity4,
    });
    domainEntity3.properties.push(domainEntity3Property1);
    addEntity(metaEd.entity, domainEntity3);

    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntity1 = Object.assign(newDomainEntity(), { metaEdName: domainEntityName1 });
    const domainEntity1Property1 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      propertyPathName: domainEntityName2,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity2,
    });
    domainEntity1.properties.push(domainEntity1Property1);
    const domainEntity1Property2 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      propertyPathName: domainEntityName3,
      parentEntityName: domainEntityName1,
      parentEntity: domainEntity1,
      referencedEntity: domainEntity3,
    });
    domainEntity1.properties.push(domainEntity1Property2);
    addProperty(metaEd.propertyIndex, domainEntity1Property2);
    const mergedProperty = Object.assign(newMergedProperty(), {
      mergePropertyPath: [domainEntityName3, domainEntityName4, domainEntityName6],
      targetPropertyPath: [domainEntityName2, domainEntityName5, domainEntityName6],
    });
    domainEntity1Property2.mergedProperties.push(mergedProperty);
    addEntity(metaEd.entity, domainEntity1);

    enhance(metaEd);
  });

  it('should have correct merge property', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === domainEntityName3));
    expect(property).toBeDefined();
    expect(R.head(property.mergedProperties).mergeProperty).toBe(domainEntity4Property1);
  });

  it('should have correct target property', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === domainEntityName3));
    expect(property).toBeDefined();
    expect(R.head(property.mergedProperties).targetProperty).toBe(domainEntity5Property1);
  });
});
