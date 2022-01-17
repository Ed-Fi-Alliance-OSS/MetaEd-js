import {
  newCommon,
  Common,
  newCommonSubclass,
  CommonSubclass,
  newIntegerProperty,
  IntegerProperty,
  newMetaEdEnvironment,
  MetaEdEnvironment,
  newNamespace,
  Namespace,
} from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/CommonSubclassBaseReferenceEnhancer';

describe('when enhancing common subclass', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const commonName = 'DomainEntityName';
  const commonSubclassName = 'DomainEntitySubclassName';
  const integerProperty1Name = 'IntegerProperty1Name';
  const integerProperty2Name = 'IntegerProperty2Name';

  beforeAll(() => {
    const integerProperty1: IntegerProperty = {
      ...newIntegerProperty(),
      metaEdName: integerProperty1Name,
      namespace,
      isPartOfIdentity: true,
    };
    const common: Common = {
      ...newCommon(),
      metaEdName: commonName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsProperties: [integerProperty1],
          odsIdentityProperties: [integerProperty1],
        },
      },
    };

    const integerProperty2: IntegerProperty = {
      ...newIntegerProperty(),
      metaEdName: integerProperty2Name,
      isPartOfIdentity: true,
    };
    const commonSubclass: CommonSubclass = {
      ...newCommonSubclass(),
      metaEdName: commonSubclassName,
      namespace,
      baseEntity: common,
      data: {
        edfiOdsRelational: {
          odsProperties: [integerProperty2],
          odsIdentityProperties: [integerProperty2],
        },
      },
    };
    namespace.entity.common.set(commonName, common);
    namespace.entity.commonSubclass.set(commonSubclassName, commonSubclass);
    enhance(metaEd);
  });

  it('should not change common ods properties', (): void => {
    const common: any = namespace.entity.common.get(commonName);
    expect(common.data.edfiOdsRelational.odsProperties).toHaveLength(1);
    expect(common.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(1);

    expect(common.data.edfiOdsRelational.odsProperties[0].metaEdName).toBe(integerProperty1Name);
    expect(common.data.edfiOdsRelational.odsIdentityProperties[0].metaEdName).toBe(integerProperty1Name);
  });

  it('should add base common ods properties to common subclass', (): void => {
    const commonSubclass: any = namespace.entity.commonSubclass.get(commonSubclassName);
    expect(commonSubclass.data.edfiOdsRelational.odsProperties).toHaveLength(2);
    expect(commonSubclass.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(2);

    expect(commonSubclass.data.edfiOdsRelational.odsProperties[0].metaEdName).toBe(integerProperty2Name);
    expect(commonSubclass.data.edfiOdsRelational.odsIdentityProperties[0].metaEdName).toBe(integerProperty2Name);
    expect(commonSubclass.data.edfiOdsRelational.odsProperties[1].metaEdName).toBe(integerProperty1Name);
    expect(commonSubclass.data.edfiOdsRelational.odsIdentityProperties[1].metaEdName).toBe(integerProperty1Name);
  });
});
