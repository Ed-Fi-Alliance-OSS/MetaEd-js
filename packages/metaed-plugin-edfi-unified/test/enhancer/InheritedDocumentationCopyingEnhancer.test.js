// @flow
import R from 'ramda';
import {
  newMetaEdEnvironment,
  newDomainEntity,
  newDomainEntityProperty,
  newIntegerType,
  newSharedIntegerProperty,
  addEntity,
  addProperty,
} from '../../../metaed-core/index';
import type { MetaEdEnvironment } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/InheritedDocumentationCopyingEnhancer';

describe('when enhancing shared integer property with inherited documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityDocumentation: string = 'ReferencedEntityDocumentation';
  const referencedEntityName: string = 'ReferencedEntityName';

  beforeAll(() => {
    const referencedEntity = Object.assign(newIntegerType(), {
      metaEdName: referencedEntityName,
      documentation: referencedEntityDocumentation,
    });

    const property = Object.assign(newSharedIntegerProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
      referencedEntity,
      documentationInherited: true,
    });

    const parentEntity = Object.assign(newDomainEntity(), {
      metaEdName: parentEntityName,
      properties: [property],
    });

    addEntity(metaEd.entity, referencedEntity);
    addEntity(metaEd.entity, parentEntity);
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have correct referenced entity()', () => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter(p => p.metaEdName === referencedEntityName));
    expect(property.documentation).toBe(referencedEntityDocumentation);
  });
});

describe('when enhancing domain entity property with inherited documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const parentEntityName: string = 'ParentEntityName';
  const referencedEntityDocumentation: string = 'ReferencedEntityDocumentation';
  const referencedEntityName: string = 'ReferencedEntityName';

  beforeAll(() => {
    const referencedEntity = Object.assign(newDomainEntity(), {
      metaEdName: referencedEntityName,
      documentation: referencedEntityDocumentation,
    });

    const property = Object.assign(newDomainEntityProperty(), {
      metaEdName: referencedEntityName,
      parentEntityName,
      referencedEntity,
      documentationInherited: true,
    });

    const parentEntity = Object.assign(newDomainEntity(), {
      metaEdName: parentEntityName,
      properties: [property],
    });

    addEntity(metaEd.entity, referencedEntity);
    addEntity(metaEd.entity, parentEntity);
    addProperty(metaEd.propertyIndex, property);

    enhance(metaEd);
  });

  it('should have correct referenced entity()', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(p => p.metaEdName === referencedEntityName));
    expect(property.documentation).toBe(referencedEntityDocumentation);
  });
});
