import { newAssociationProperty, newDomainEntityProperty, newMetaEdEnvironment } from '@edfi/metaed-core';
import { AssociationProperty, DomainEntityProperty, MetaEdEnvironment } from '@edfi/metaed-core';
import { enhance } from '../../../src/model/property/ReferenceProperty';

describe('when ReferenceProperty enhances association property', (): void => {
  let associationProperty: AssociationProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    associationProperty = newAssociationProperty();
    metaEd.propertyIndex.association.push(associationProperty);
    enhance(metaEd);
  });

  it('should have false ods delete cascade primary key', (): void => {
    expect(associationProperty.data.edfiOdsRelational.odsDeleteCascadePrimaryKey).toBe(false);
  });

  it('should have false ods causes cyclic update cascade', (): void => {
    expect(associationProperty.data.edfiOdsRelational.odsCausesCyclicUpdateCascade).toBe(false);
  });
});

describe('when ReferenceProperty enhances domain entity property', (): void => {
  let domainEntityProperty: DomainEntityProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    domainEntityProperty = newDomainEntityProperty();

    metaEd.propertyIndex.domainEntity.push(domainEntityProperty);
    enhance(metaEd);
  });

  it('should have false ods delete cascade primary key', (): void => {
    expect(domainEntityProperty.data.edfiOdsRelational.odsDeleteCascadePrimaryKey).toBe(false);
  });

  it('should have false ods causes cyclic update cascade', (): void => {
    expect(domainEntityProperty.data.edfiOdsRelational.odsCausesCyclicUpdateCascade).toBe(false);
  });
});
