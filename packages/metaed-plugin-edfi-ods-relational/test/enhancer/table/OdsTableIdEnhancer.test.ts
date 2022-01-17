import {
  newDescriptor,
  newDomainEntity,
  newEnumeration,
  newMetaEdEnvironment,
  newSchoolYearEnumeration,
  newNamespace,
} from '@edfi/metaed-core';
import {
  Descriptor,
  DomainEntity,
  Enumeration,
  MetaEdEnvironment,
  SchoolYearEnumeration,
  Namespace,
} from '@edfi/metaed-core';
import { enhance } from '../../../src/enhancer/OdsTableIdEnhancer';

describe('when enhancing a domain entity with ods table name', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      namespace,
      data: {
        edfiOdsRelational: {},
      },
    });
    namespace.entity.domainEntity.set(domainEntityName, domainEntity);
    enhance(metaEd);
  });

  it('should have ods table name', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(domainEntityName);
    expect(domainEntity.data.edfiOdsRelational.odsTableId).toBe(domainEntityName);
  });
});

describe('when enhancing a descriptor with ods table name', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const descriptorName = 'DescriptorName';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsDescriptorName: descriptorName,
        },
      },
    });
    namespace.entity.descriptor.set(descriptorName, descriptor);
    enhance(metaEd);
  });

  it('should have ods table name', (): void => {
    const descriptor: any = namespace.entity.descriptor.get(descriptorName);
    expect(descriptor.data.edfiOdsRelational.odsTableId).toBe(descriptorName);
  });
});

describe('when enhancing an enumeration with ods table name', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const enumerationName = 'EnumerationName';

  beforeAll(() => {
    const enumeration: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: enumerationName,
      namespace,
      data: {
        edfiOdsRelational: {},
      },
    });
    namespace.entity.enumeration.set(enumerationName, enumeration);
    enhance(metaEd);
  });

  it('should have ods table name', (): void => {
    const enumeration: any = namespace.entity.enumeration.get(enumerationName);
    expect(enumeration.data.edfiOdsRelational.odsTableId).toBe(`${enumerationName}Type`);
  });
});

describe('when enhancing an school year enumeration with ods table name', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const schoolYearEnumerationName = 'SchoolYearEnumerationName';

  beforeAll(() => {
    const schoolYearEnumeration: SchoolYearEnumeration = Object.assign(newSchoolYearEnumeration(), {
      metaEdName: schoolYearEnumerationName,
      namespace,
      data: {
        edfiOdsRelational: {},
      },
    });
    namespace.entity.schoolYearEnumeration.set(schoolYearEnumerationName, schoolYearEnumeration);
    enhance(metaEd);
  });

  it('should have ods table name', (): void => {
    const schoolYearEnumeration: any = namespace.entity.schoolYearEnumeration.get(schoolYearEnumerationName);
    expect(schoolYearEnumeration.data.edfiOdsRelational.odsTableId).toBe(`${schoolYearEnumerationName}Type`);
  });
});
