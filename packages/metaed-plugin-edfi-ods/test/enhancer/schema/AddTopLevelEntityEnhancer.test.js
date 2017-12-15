// @flow
import { newDomainEntity, newIntegerProperty, newMetaEdEnvironment } from 'metaed-core';
import type { DomainEntity, IntegerProperty, MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../../src/model/TopLevelEntity';
import { NoTable } from '../../../src/model/database/Table';

describe('when enhancing domainEntity with string properties', () => {
  let domainEntity: DomainEntity;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const domainEntityName: string = 'DomainEntityName';

    domainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
    });

    metaEd.entity.domainEntity.set(domainEntityName, domainEntity);
    enhance(metaEd);
  });

  it('should have ods table name', () => {
    expect(domainEntity.data.edfiOds.ods_TableName).toBeDefined();
    expect(domainEntity.data.edfiOds.ods_TableName).toBe('');
  });

  it('should have ods cascade primary key updates', () => {
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBeDefined();
    expect(domainEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates).toBe(false);
  });

  it('should have ods entity table', () => {
    expect(domainEntity.data.edfiOds.ods_EntityTable).toBeDefined();
    expect(domainEntity.data.edfiOds.ods_EntityTable).toBe(NoTable);
  });

  it('should have ods tables', () => {
    expect(domainEntity.data.edfiOds.ods_Tables).toBeDefined();
    expect(domainEntity.data.edfiOds.ods_Tables).toHaveLength(0);
  });
});

describe('when enhancing domainEntity with string properties', () => {
  let domainEntity: DomainEntity;
  let integerIdentityProperty: IntegerProperty;
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const domainEntityName: string = 'DomainEntityName';

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
      properties: [
        integerIdentityProperty,
        integerProperty,
      ],
      identityProperties: [
        integerIdentityProperty,
      ],
    });

    metaEd.entity.domainEntity.set(domainEntityName, domainEntity);
    enhance(metaEd);
  });

  it('should add identity property to ods identity properties', () => {
    expect(domainEntity.data.edfiOds.ods_IdentityProperties.length).toBe(1);
    expect(domainEntity.data.edfiOds.ods_IdentityProperties[0]).toBe(integerIdentityProperty);
  });

  it('should add properties to ods properties', () => {
    expect(domainEntity.data.edfiOds.ods_Properties.length).toBe(2);
    expect(domainEntity.data.edfiOds.ods_Properties[0]).toBe(integerIdentityProperty);
    expect(domainEntity.data.edfiOds.ods_Properties[1]).toBe(integerProperty);
  });
});
