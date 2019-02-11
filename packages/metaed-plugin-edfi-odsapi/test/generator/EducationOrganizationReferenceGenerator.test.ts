import { newMetaEdEnvironment, newNamespace } from 'metaed-core';
import { MetaEdEnvironment, Namespace, GeneratorResult } from 'metaed-core';
import { newEducationOrganizationReference } from '../../src/model/educationOrganizationReferenceMetadata/EducationOrganizationReference';
import { EducationOrganizationReference } from '../../src/model/educationOrganizationReferenceMetadata/EducationOrganizationReference';
import { generate } from '../../src/generator/educationOrganizationReferenceMetadata/EducationOrganizationReferenceMetadataGenerator';

describe('when generating education organization reference for core', () => {
  let result = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const educationOrganizationReference: EducationOrganizationReference = {
      ...newEducationOrganizationReference(),
      name: 'School',
      identityPropertyName: 'SchoolId',
    };

    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'EdFi',
      data: {
        edfiOdsApi: {
          apiEducationOrganizationReferences: [educationOrganizationReference],
        },
      },
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate education organization reference element', () => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating education organization reference for extension', () => {
  let result = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const educationOrganizationReference: EducationOrganizationReference = {
      ...newEducationOrganizationReference(),
      name: 'EducationProvider',
      identityPropertyName: 'EducationProviderId',
    };

    const namespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'Extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
      data: {
        edfiOdsApi: {
          apiEducationOrganizationReferences: [educationOrganizationReference],
        },
      },
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);
    result = (await generate(metaEd)).generatedOutput[0].resultString;
  });

  it('should generate education organization reference element', () => {
    expect(result).toMatchSnapshot();
  });
});

describe('when generating education organization reference for both core and extensions', () => {
  let coreResult = '';
  let extensionResult = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const coreEducationOrganizationReference: EducationOrganizationReference = {
      ...newEducationOrganizationReference(),
      name: 'School',
      identityPropertyName: 'SchoolId',
    };
    const coreNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'EdFi',
      data: {
        edfiOdsApi: {
          apiEducationOrganizationReferences: [coreEducationOrganizationReference],
        },
      },
    });
    metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);

    const extensionEducationOrganizationReference: EducationOrganizationReference = {
      ...newEducationOrganizationReference(),
      name: 'EducationProvider',
      identityPropertyName: 'EducationProviderId',
    };
    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'Extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
      data: {
        edfiOdsApi: {
          apiEducationOrganizationReferences: [extensionEducationOrganizationReference],
        },
      },
    });
    metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);

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
  let coreResult = '';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const coreEducationOrganizationReference: EducationOrganizationReference = {
      ...newEducationOrganizationReference(),
      name: 'School',
      identityPropertyName: 'SchoolId',
    };
    const coreNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'EdFi',
      data: {
        edfiOdsApi: {
          apiEducationOrganizationReferences: [coreEducationOrganizationReference],
        },
      },
    });
    metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);

    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: 'Extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
      data: {
        edfiOdsApi: {
          apiEducationOrganizationReferences: [],
        },
      },
    });
    metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);

    const generatedResult: GeneratorResult = await generate(metaEd);
    expect(generatedResult.generatedOutput).toHaveLength(1);
    coreResult = generatedResult.generatedOutput[0].resultString;
  });

  it('should only generate core education organization reference element', () => {
    expect(coreResult).toMatchSnapshot();
  });
});
