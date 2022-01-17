import {
  newMetaEdEnvironment,
  newEnumeration,
  newNamespace,
  newMapTypeEnumeration,
  newSchoolYearEnumeration,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Enumeration, MapTypeEnumeration, SchoolYearEnumeration, Namespace } from '@edfi/metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/EnumerationBasePropertiesEnhancer';

describe('when EnumerationBasePropertiesEnhancer enhances enumeration', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const enumerationBaseName = 'EnumerationName';
  const enumerationName = 'EnumerationNameType';

  beforeAll(() => {
    const enumeration: Enumeration = {
      ...newEnumeration(),
      metaEdName: enumerationBaseName,
      namespace,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.enumeration.set(enumeration.metaEdName, enumeration);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsdEnumerationName assigned', (): void => {
    const enumeration: any = namespace.entity.enumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsdEnumerationName).toBe(enumerationName);
  });

  it('should have xsdEnumerationBaseNameWithExtension value same as enumerationName', (): void => {
    const enumeration: any = namespace.entity.enumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsdEnumerationNameWithExtension).toBe(enumerationName);
  });
});

describe('when EnumerationBasePropertiesEnhancer enhances enumeration with extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const projectExtension = 'EXTENSION';
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', projectExtension };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(namespace);

  const enumerationBaseName = 'EnumerationName';
  const enumerationName = 'EnumerationNameType';

  beforeAll(() => {
    const enumeration: Enumeration = {
      ...newEnumeration(),
      metaEdName: enumerationBaseName,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {},
      },
    };
    extensionNamespace.entity.enumeration.set(enumeration.metaEdName, enumeration);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsdEnumerationName assigned', (): void => {
    const enumeration: any = extensionNamespace.entity.enumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsdEnumerationName).toBe(enumerationName);
  });

  it('should have xsdEnumerationBaseNameWithExtension value with extension', (): void => {
    const enumeration: any = extensionNamespace.entity.enumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsdEnumerationNameWithExtension).toBe(`${projectExtension}-${enumerationName}`);
  });
});

describe('when EnumerationBasePropertiesEnhancer enhances enumeration that ends in Type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const enumerationBaseName = 'EnumerationNameType';
  const enumerationName = 'EnumerationNameType';

  beforeAll(() => {
    const enumeration: Enumeration = {
      ...newEnumeration(),
      metaEdName: enumerationBaseName,
      namespace,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.enumeration.set(enumeration.metaEdName, enumeration);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsdEnumerationName assigned', (): void => {
    const enumeration: any = namespace.entity.enumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsdEnumerationName).toBe(enumerationName);
  });

  it('should have xsdEnumerationBaseNameWithExtension value same as enumerationName', (): void => {
    const enumeration: any = namespace.entity.enumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsdEnumerationNameWithExtension).toBe(enumerationName);
  });
});

describe('when EnumerationBasePropertiesEnhancer enhances MapTypeEnumeration', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const enumerationBaseName = 'EnumerationName';
  const enumerationName = 'EnumerationNameType';
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);

  beforeAll(() => {
    const enumeration: MapTypeEnumeration = {
      ...newMapTypeEnumeration(),
      metaEdName: enumerationBaseName,
      namespace,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.mapTypeEnumeration.set(enumeration.metaEdName, enumeration);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsdEnumerationName assigned', (): void => {
    const enumeration: any = namespace.entity.mapTypeEnumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsdEnumerationName).toBe(enumerationName);
  });

  it('should have xsdEnumerationBaseNameWithExtension value same as enumerationName', (): void => {
    const enumeration: any = namespace.entity.mapTypeEnumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsdEnumerationNameWithExtension).toBe(enumerationName);
  });
});

describe('when EnumerationBasePropertiesEnhancer enhances SchoolYearEnumeration', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const enumerationBaseName = 'EnumerationName';
  const enumerationName = 'EnumerationNameType';
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);

  beforeAll(() => {
    const enumeration: SchoolYearEnumeration = {
      ...newSchoolYearEnumeration(),
      metaEdName: enumerationBaseName,
      namespace,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.schoolYearEnumeration.set(enumeration.metaEdName, enumeration);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsdEnumerationName assigned', (): void => {
    const enumeration: any = namespace.entity.schoolYearEnumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsdEnumerationName).toBe(enumerationName);
  });

  it('should have xsdEnumerationBaseNameWithExtension value same as enumerationName', (): void => {
    const enumeration: any = namespace.entity.schoolYearEnumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsdEnumerationNameWithExtension).toBe(enumerationName);
  });
});
