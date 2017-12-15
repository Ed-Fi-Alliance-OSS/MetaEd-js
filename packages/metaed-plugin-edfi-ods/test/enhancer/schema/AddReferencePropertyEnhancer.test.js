// @flow
import { newAssociationProperty, newDomainEntityProperty, newMetaEdEnvironment } from 'metaed-core';
import type { AssociationProperty, DomainEntityProperty, MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../../src/model/property/ReferenceProperty';

describe('when ReferenceProperty enhances association property', () => {
  let associationProperty: AssociationProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    associationProperty = newAssociationProperty();
    metaEd.propertyIndex.association.push(associationProperty);
    enhance(metaEd);
  });

  it('should have false ods delete cascade primary key', () => {
    expect(associationProperty.data.edfiOds.ods_DeleteCascadePrimaryKey).toBe(false);
  });

  it('should have false ods causes cyclic update cascade', () => {
    expect(associationProperty.data.edfiOds.ods_CausesCyclicUpdateCascade).toBe(false);
  });
});

describe('when ReferenceProperty enhances domain entity property', () => {
  let domainEntityProperty: DomainEntityProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    domainEntityProperty = newDomainEntityProperty();

    metaEd.propertyIndex.domainEntity.push(domainEntityProperty);
    enhance(metaEd);
  });

  it('should have false ods delete cascade primary key', () => {
    expect(domainEntityProperty.data.edfiOds.ods_DeleteCascadePrimaryKey).toBe(false);
  });

  it('should have false ods causes cyclic update cascade', () => {
    expect(domainEntityProperty.data.edfiOds.ods_CausesCyclicUpdateCascade).toBe(false);
  });
});
