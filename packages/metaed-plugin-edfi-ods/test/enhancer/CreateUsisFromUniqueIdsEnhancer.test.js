// @flow
import { newDomainEntity, newIntegerProperty, newMetaEdEnvironment, newNamespaceInfo } from 'metaed-core';
import type { DomainEntity, IntegerProperty, MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/enhancer/CreateUsisFromUniqueIdsEnhancer';

describe('when enhancing entity with unique id property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName: string = 'DomainEntityName';
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'UniqueId',
      withContext: 'WithContextName',
      shortenTo: 'ShortenToName',
      documentation: 'IntegerPropertyDocumentation',
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      namespaceInfo: Object.assign(newNamespaceInfo(), { isExtension: false }),
      data: {
        edfiOds: {
          ods_Properties: [integerProperty],
          ods_IdentityProperties: [integerProperty],
        },
      },
    });

    metaEd.entity.domainEntity.set(domainEntityName, domainEntity);
    enhance(metaEd);
  });

  it('should remove unique id property', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName);
    expect(domainEntity.data.edfiOds.ods_Properties).not.toContain(integerProperty);
    expect(domainEntity.data.edfiOds.ods_IdentityProperties).not.toContain(integerProperty);
  });

  it('should add unique id copy as not part of identity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName);
    const property: any = domainEntity.data.edfiOds.ods_Properties.find(x => x.metaEdName === integerProperty.metaEdName);
    expect(property).toBeDefined();
    expect(property.metaEdName).toBe(integerProperty.metaEdName);
    expect(property.withContext).toBe(integerProperty.withContext);
    expect(property.shortenTo).toBe(integerProperty.shortenTo);
    expect(property.documentation).toBe(integerProperty.documentation);
    expect(property.isPartOfIdentity).toBe(false);
    expect(property.data.edfiOds.ods_IsIdentityDatabaseType).toBe(false);
    expect(property.data.edfiOds.ods_IsUniqueIndex).toBe(true);
  });

  it('should add usi property', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName);
    const property: any = domainEntity.data.edfiOds.ods_Properties.find(x => x.metaEdName === 'USI');
    expect(property).toBeDefined();
    expect(property.metaEdName).toBe('USI');
    expect(property.withContext).toBe(integerProperty.withContext);
    expect(property.shortenTo).toBe(integerProperty.shortenTo);
    expect(property.documentation).toBe(integerProperty.documentation);
    expect(property.isPartOfIdentity).toBe(true);
    expect(property.parentEntityName).toBe(integerProperty.parentEntityName);
    expect(property.parentEntity).toBe(integerProperty.parentEntity);
    expect(property.data.edfiOds.ods_Name).toBe(`${integerProperty.withContext}USI`);
    expect(property.data.edfiOds.ods_IsCollection).toBe(false);
    expect(property.data.edfiOds.ods_ContextPrefix).toBe(integerProperty.shortenTo);
    expect(property.data.edfiOds.ods_IsIdentityDatabaseType).toBe(true);
    expect(property.data.edfiOds.ods_IsUniqueIndex).toBe(false);
    expect(domainEntity.data.edfiOds.ods_Properties).toContain(property);
    expect(domainEntity.data.edfiOds.ods_IdentityProperties).toContain(property);
  });
});

describe('when enhancing entity with non unique id property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName: string = 'DomainEntityName';
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    integerProperty = Object.assign(newIntegerProperty(), {

      metaEdName: 'UniqueID',
      withContext: 'WithContextName',
      shortenTo: 'ShortenToName',
      documentation: 'IntegerPropertyDocumentation',
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      namespaceInfo: Object.assign(newNamespaceInfo(), { isExtension: false }),
      data: {
        edfiOds: {
          ods_Properties: [integerProperty],
          ods_IdentityProperties: [integerProperty],
        },
      },
    });

    metaEd.entity.domainEntity.set(domainEntityName, domainEntity);
    enhance(metaEd);
  });

  it('should not remove property', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName);
    expect(domainEntity.data.edfiOds.ods_Properties).toContain(integerProperty);
    expect(domainEntity.data.edfiOds.ods_IdentityProperties).toContain(integerProperty);
  });

  it('should not add additional properties', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName);
    expect(domainEntity.data.edfiOds.ods_Properties).toHaveLength(1);
    expect(domainEntity.data.edfiOds.ods_IdentityProperties).toHaveLength(1);
  });
});

describe('when enhancing entity with unique id property in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName: string = 'DomainEntityName';
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    integerProperty = Object.assign(newIntegerProperty(), {

      metaEdName: 'UniqueID',
      withContext: 'WithContextName',
      shortenTo: 'ShortenToName',
      documentation: 'IntegerPropertyDocumentation',
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      namespaceInfo: Object.assign(newNamespaceInfo(), { isExtension: true }),
      data: {
        edfiOds: {
          ods_Properties: [integerProperty],
          ods_IdentityProperties: [integerProperty],
        },
      },
    });

    metaEd.entity.domainEntity.set(domainEntityName, domainEntity);
    enhance(metaEd);
  });

  it('should not remove property', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName);
    expect(domainEntity.data.edfiOds.ods_Properties).toContain(integerProperty);
    expect(domainEntity.data.edfiOds.ods_IdentityProperties).toContain(integerProperty);
  });

  it('should not add additional properties', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(domainEntityName);
    expect(domainEntity.data.edfiOds.ods_Properties).toHaveLength(1);
    expect(domainEntity.data.edfiOds.ods_IdentityProperties).toHaveLength(1);
  });
});
