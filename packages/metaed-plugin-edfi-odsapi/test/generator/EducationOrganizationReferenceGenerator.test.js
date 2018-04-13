// @flow
import { newMetaEdEnvironment, newNamespaceInfo } from 'metaed-core';
import type { MetaEdEnvironment, NamespaceInfo, GeneratorResult } from 'metaed-core';
import { newEducationOrganizationReference } from '../../src/model/educationOrganizationReferenceMetadata/EducationOrganizationReference';
import type { EducationOrganizationReference } from '../../src/model/educationOrganizationReferenceMetadata/EducationOrganizationReference';
import { generate } from '../../src/generator/educationOrganizationReferenceMetadata/EducationOrganizationReferenceMetadataGenerator';

describe('when generating education organization reference for core', () => {
  let result: string = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const educationOrganizationReference: EducationOrganizationReference = {
      ...newEducationOrganizationReference(),
      name: 'School',
      identityPropertyName: 'SchoolId',
    };

    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'edfi',
      data: {
        edfiOdsApi: {
          api_EducationOrganizationReferences: [educationOrganizationReference],
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate education organization reference element', () => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating education organization reference for extension', () => {
  let result: string = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const educationOrganizationReference: EducationOrganizationReference = {
      ...newEducationOrganizationReference(),
      name: 'EducationProvider',
      identityPropertyName: 'EducationProviderId',
    };

    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
      data: {
        edfiOdsApi: {
          api_EducationOrganizationReferences: [educationOrganizationReference],
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate education organization reference element', () => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating education organization reference for both core and extensions', () => {
  let coreResult: string = '';
  let extensionResult: string = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const coreEducationOrganizationReference: EducationOrganizationReference = {
      ...newEducationOrganizationReference(),
      name: 'School',
      identityPropertyName: 'SchoolId',
    };
    const coreNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'edfi',
      data: {
        edfiOdsApi: {
          api_EducationOrganizationReferences: [coreEducationOrganizationReference],
        },
      },
    });
    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);

    const extensionEducationOrganizationReference: EducationOrganizationReference = {
      ...newEducationOrganizationReference(),
      name: 'EducationProvider',
      identityPropertyName: 'EducationProviderId',
    };
    const extensionNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
      data: {
        edfiOdsApi: {
          api_EducationOrganizationReferences: [extensionEducationOrganizationReference],
        },
      },
    });
    metaEd.entity.namespaceInfo.set(extensionNamespaceInfo.namespace, extensionNamespaceInfo);

    const generatedResult: GeneratorResult = await generate(metaEd);
    coreResult = generatedResult.generatedOutput[0].resultString;
    extensionResult = generatedResult.generatedOutput[1].resultString;
  });

  it('should generate core education organization reference element', () => {
    expect(coreResult).toMatchSnapshot();
  });

  it('should generate extension education organization reference element', () => {
    expect(extensionResult).toMatchSnapshot();
  });
});

describe('when generating education organization reference for both core and empty extension', () => {
  let coreResult: string = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const coreEducationOrganizationReference: EducationOrganizationReference = {
      ...newEducationOrganizationReference(),
      name: 'School',
      identityPropertyName: 'SchoolId',
    };
    const coreNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'edfi',
      data: {
        edfiOdsApi: {
          api_EducationOrganizationReferences: [coreEducationOrganizationReference],
        },
      },
    });
    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);

    const extensionNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
      data: {
        edfiOdsApi: {
          api_EducationOrganizationReferences: [],
        },
      },
    });
    metaEd.entity.namespaceInfo.set(extensionNamespaceInfo.namespace, extensionNamespaceInfo);

    const generatedResult: GeneratorResult = await generate(metaEd);
    expect(generatedResult.generatedOutput).toHaveLength(1);
    coreResult = generatedResult.generatedOutput[0].resultString;
  });

  it('should only generate core education organization reference element', () => {
    expect(coreResult).toMatchSnapshot();
  });
});
