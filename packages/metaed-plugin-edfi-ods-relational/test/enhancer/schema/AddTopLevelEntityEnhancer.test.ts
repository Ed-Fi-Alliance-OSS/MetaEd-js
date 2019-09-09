import { newDomainEntity, newIntegerProperty, newMetaEdEnvironment, newNamespace } from 'metaed-core';
import { DomainEntity, IntegerProperty, MetaEdEnvironment, Namespace } from 'metaed-core';
import { enhance } from '../../../src/model/TopLevelEntity';
import { NoTable } from '../../../src/model/database/Table';

describe('when enhancing domainEntity with string properties', (): void => {
  let domainEntity: DomainEntity;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.namespace.set(namespace.namespaceName, namespace);
    const domainEntityName = 'DomainEntityName';

    domainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      namespace,
    });

    namespace.entity.domainEntity.set(domainEntityName, domainEntity);
    enhance(metaEd);
  });

  it('should have ods table name', (): void => {
    expect(domainEntity.data.edfiOdsRelational.odsTableId).toBeDefined();
    expect(domainEntity.data.edfiOdsRelational.odsTableId).toBe('');
  });

  it('should have ods cascade primary key updates', (): void => {
    expect(domainEntity.data.edfiOdsRelational.odsCascadePrimaryKeyUpdates).toBeDefined();
    expect(domainEntity.data.edfiOdsRelational.odsCascadePrimaryKeyUpdates).toBe(false);
  });

  it('should have ods entity table', (): void => {
    expect(domainEntity.data.edfiOdsRelational.odsEntityTable).toBeDefined();
    expect(domainEntity.data.edfiOdsRelational.odsEntityTable).toBe(NoTable);
  });

  it('should have ods tables', (): void => {
    expect(domainEntity.data.edfiOdsRelational.odsTables).toBeDefined();
    expect(domainEntity.data.edfiOdsRelational.odsTables).toHaveLength(0);
  });
});

describe('when enhancing domainEntity with string properties', (): void => {
  let domainEntity: DomainEntity;
  let integerIdentityProperty: IntegerProperty;
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.namespace.set(namespace.namespaceName, namespace);
    const domainEntityName = 'DomainEntityName';

    integerIdentityProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'integerIdentityPropertyName',
      isPartOfIdentity: true,
    });
    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'IntegerPropertyName',
      isPartOfIdentity: false,
    });
    domainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      namespace,
      properties: [integerIdentityProperty, integerProperty],
      identityProperties: [integerIdentityProperty],
    });

    namespace.entity.domainEntity.set(domainEntityName, domainEntity);
    enhance(metaEd);
  });

  it('should add identity property to ods identity properties', (): void => {
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties.length).toBe(1);
    expect(domainEntity.data.edfiOdsRelational.odsIdentityProperties[0]).toBe(integerIdentityProperty);
  });

  it('should add properties to ods properties', (): void => {
    expect(domainEntity.data.edfiOdsRelational.odsProperties.length).toBe(2);
    expect(domainEntity.data.edfiOdsRelational.odsProperties[0]).toBe(integerIdentityProperty);
    expect(domainEntity.data.edfiOdsRelational.odsProperties[1]).toBe(integerProperty);
  });
});
