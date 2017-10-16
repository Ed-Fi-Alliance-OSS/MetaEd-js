// @flow
import { newMetaEdEnvironment, newEnumeration, newNamespaceInfo, newMapTypeEnumeration, newSchoolYearEnumeration } from '../../../metaed-core/index';
import type { MetaEdEnvironment, Enumeration, MapTypeEnumeration, SchoolYearEnumeration } from '../../../metaed-core/index';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/EnumerationBasePropertiesEnhancer';

describe('when EnumerationBasePropertiesEnhancer enhances enumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const enumerationBaseName: string = 'EnumerationName';
  const enumerationName: string = 'EnumerationNameType';

  beforeAll(() => {
    const enumeration: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: enumerationBaseName,
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.enumeration.set(enumeration.metaEdName, enumeration);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_EnumerationName assigned', () => {
    const enumeration: any = metaEd.entity.enumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsd_EnumerationName).toBe(enumerationName);
  });

  it('should have xsd_EnumerationBaseNameWithExtension value same as enumerationName', () => {
    const enumeration: any = metaEd.entity.enumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsd_EnumerationNameWithExtension).toBe(enumerationName);
  });
});

describe('when EnumerationBasePropertiesEnhancer enhances enumeration with extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const projectExtension: string = 'EXTENSION';

  const enumerationBaseName: string = 'EnumerationName';
  const enumerationName: string = 'EnumerationNameType';

  beforeAll(() => {
    const enumeration: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: enumerationBaseName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
        projectExtension,
      }),
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.enumeration.set(enumeration.metaEdName, enumeration);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_EnumerationName assigned', () => {
    const enumeration: any = metaEd.entity.enumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsd_EnumerationName).toBe(enumerationName);
  });

  it('should have xsd_EnumerationBaseNameWithExtension value with extension', () => {
    const enumeration: any = metaEd.entity.enumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsd_EnumerationNameWithExtension).toBe(`${projectExtension}-${enumerationName}`);
  });
});

describe('when EnumerationBasePropertiesEnhancer enhances enumeration that ends in Type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const enumerationBaseName: string = 'EnumerationNameType';
  const enumerationName: string = 'EnumerationNameType';

  beforeAll(() => {
    const enumeration: Enumeration = Object.assign(newEnumeration(), {
      metaEdName: enumerationBaseName,
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.enumeration.set(enumeration.metaEdName, enumeration);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_EnumerationName assigned', () => {
    const enumeration: any = metaEd.entity.enumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsd_EnumerationName).toBe(enumerationName);
  });

  it('should have xsd_EnumerationBaseNameWithExtension value same as enumerationName', () => {
    const enumeration: any = metaEd.entity.enumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsd_EnumerationNameWithExtension).toBe(enumerationName);
  });
});

describe('when EnumerationBasePropertiesEnhancer enhances MapTypeEnumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const enumerationBaseName: string = 'EnumerationName';
  const enumerationName: string = 'EnumerationNameType';

  beforeAll(() => {
    const enumeration: MapTypeEnumeration = Object.assign(newMapTypeEnumeration(), {
      metaEdName: enumerationBaseName,
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.mapTypeEnumeration.set(enumeration.metaEdName, enumeration);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_EnumerationName assigned', () => {
    const enumeration: any = metaEd.entity.mapTypeEnumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsd_EnumerationName).toBe(enumerationName);
  });

  it('should have xsd_EnumerationBaseNameWithExtension value same as enumerationName', () => {
    const enumeration: any = metaEd.entity.mapTypeEnumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsd_EnumerationNameWithExtension).toBe(enumerationName);
  });
});

describe('when EnumerationBasePropertiesEnhancer enhances SchoolYearEnumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const enumerationBaseName: string = 'EnumerationName';
  const enumerationName: string = 'EnumerationNameType';

  beforeAll(() => {
    const enumeration: SchoolYearEnumeration = Object.assign(newSchoolYearEnumeration(), {
      metaEdName: enumerationBaseName,
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.schoolYearEnumeration.set(enumeration.metaEdName, enumeration);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_EnumerationName assigned', () => {
    const enumeration: any = metaEd.entity.schoolYearEnumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsd_EnumerationName).toBe(enumerationName);
  });

  it('should have xsd_EnumerationBaseNameWithExtension value same as enumerationName', () => {
    const enumeration: any = metaEd.entity.schoolYearEnumeration.get(enumerationBaseName);
    expect(enumeration.data.edfiXsd.xsd_EnumerationNameWithExtension).toBe(enumerationName);
  });
});
