// @flow
import { InterchangeBuilder } from '../../src/builder/InterchangeBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getInterchange, getInterchangeExtension } from '../TestHelper';
import type { InterchangeSourceMap } from '../../src/model/Interchange';
import type { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building single interchange', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = 'InterchangeName';
  const interchangeMetaEdId: string = '1';
  const interchangeDocumentation: string = 'InterchangeDocumentation';
  const extendedDocumentation: string = 'ExtendedDocumentation';
  const useCaseDocumentation: string = 'UseCaseDocumentation';
  const interchangeElementName: string = 'InterchangeElementName';
  const interchangeElementMetaEdId: string = '2';
  const interchangeIdentityTemplateName: string = 'InterchangeIdentityTemplateName';
  const interchangeIdentityTemplateMetaEdId: string = '3';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchange(interchangeName, interchangeMetaEdId)
      .withDocumentation(interchangeDocumentation)
      .withExtendedDocumentation(extendedDocumentation)
      .withUseCaseDocumentation(useCaseDocumentation)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withAssociationIdentityTemplate(interchangeIdentityTemplateName, interchangeIdentityTemplateMetaEdId)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getInterchange(metaEd.entity, interchangeName)).toBeDefined();
    expect(getInterchange(metaEd.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getInterchange(metaEd.entity, interchangeName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getInterchange(metaEd.entity, interchangeName).metaEdId).toBe(interchangeMetaEdId);
  });

  it('should have project extension', () => {
    expect(getInterchange(metaEd.entity, interchangeName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have interchange documentation', () => {
    expect(getInterchange(metaEd.entity, interchangeName).documentation).toBe(interchangeDocumentation);
  });

  it('should have extended documentation', () => {
    expect(getInterchange(metaEd.entity, interchangeName).extendedDocumentation).toBe(extendedDocumentation);
  });

  it('should have use case documentation', () => {
    expect(getInterchange(metaEd.entity, interchangeName).useCaseDocumentation).toBe(useCaseDocumentation);
  });

  it('should have one element', () => {
    expect(getInterchange(metaEd.entity, interchangeName).elements).toHaveLength(1);
    expect(getInterchange(metaEd.entity, interchangeName).elements[0].metaEdName).toBe(interchangeElementName);
    expect(getInterchange(metaEd.entity, interchangeName).elements[0].metaEdId).toBe(interchangeElementMetaEdId);
    expect(getInterchange(metaEd.entity, interchangeName).elements[0].referencedType).toEqual([
      'domainEntity',
      'domainEntitySubclass',
    ]);
  });

  it('should have one identity template', () => {
    expect(getInterchange(metaEd.entity, interchangeName).identityTemplates).toHaveLength(1);
    expect(getInterchange(metaEd.entity, interchangeName).identityTemplates[0].metaEdName).toBe(
      interchangeIdentityTemplateName,
    );
    expect(getInterchange(metaEd.entity, interchangeName).identityTemplates[0].metaEdId).toBe(
      interchangeIdentityTemplateMetaEdId,
    );
    expect(getInterchange(metaEd.entity, interchangeName).identityTemplates[0].referencedType).toEqual([
      'association',
      'associationSubclass',
    ]);
  });
});

describe('when building interchange with additional element and identity types', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];

  const interchangeName: string = 'InterchangeName';
  const interchangeElementName1: string = 'InterchangeElementName1';
  const interchangeElementName2: string = 'InterchangeElementName2';
  const interchangeIdentityTemplateName: string = 'InterchangeIdentityTemplateName';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartInterchange(interchangeName, '1')
      .withDocumentation('doc')
      .withExtendedDocumentation('doc')
      .withUseCaseDocumentation('doc')
      .withAssociationElement(interchangeElementName1, '2')
      .withDescriptorElement(interchangeElementName2, '3')
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName, '4')
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should have two element', () => {
    expect(getInterchange(metaEd.entity, interchangeName).elements).toHaveLength(2);
    expect(getInterchange(metaEd.entity, interchangeName).elements[0].metaEdName).toBe(interchangeElementName1);
    expect(getInterchange(metaEd.entity, interchangeName).elements[0].referencedType).toEqual([
      'association',
      'associationSubclass',
    ]);
    expect(getInterchange(metaEd.entity, interchangeName).elements[1].metaEdName).toBe(interchangeElementName2);
    expect(getInterchange(metaEd.entity, interchangeName).elements[1].referencedType).toEqual(['descriptor']);
  });

  it('should have one identity template', () => {
    expect(getInterchange(metaEd.entity, interchangeName).identityTemplates).toHaveLength(1);
    expect(getInterchange(metaEd.entity, interchangeName).identityTemplates[0].metaEdName).toBe(
      interchangeIdentityTemplateName,
    );
    expect(getInterchange(metaEd.entity, interchangeName).identityTemplates[0].referencedType).toEqual([
      'domainEntity',
      'domainEntitySubclass',
    ]);
  });
});

describe('when building duplicate interchanges', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = 'InterchangeName';
  const interchangeMetaEdId: string = '1';
  const interchangeDocumentation: string = 'InterchangeDocumentation';
  const extendedDocumentation: string = 'ExtendedDocumentation';
  const useCaseDocumentation: string = 'UseCaseDocumentation';
  const interchangeElementName: string = 'InterchangeElementName';
  const interchangeElementMetaEdId: string = '2';
  const interchangeIdentityTemplateName: string = 'InterchangeIdentityTemplateName';
  const interchangeIdentityTemplateMetaEdId: string = '3';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchange(interchangeName, interchangeMetaEdId)
      .withDocumentation(interchangeDocumentation)
      .withExtendedDocumentation(extendedDocumentation)
      .withUseCaseDocumentation(useCaseDocumentation)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName, interchangeIdentityTemplateMetaEdId)
      .withEndInterchange()

      .withStartInterchange(interchangeName, interchangeMetaEdId)
      .withDocumentation(interchangeDocumentation)
      .withExtendedDocumentation(extendedDocumentation)
      .withUseCaseDocumentation(useCaseDocumentation)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName, interchangeIdentityTemplateMetaEdId)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getInterchange(metaEd.entity, interchangeName)).toBeDefined();
    expect(getInterchange(metaEd.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have two validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('InterchangeBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchSnapshot(
      'when building duplicate interchanges should have validation failures for each entity -> Interchange 1 message',
    );
    expect(validationFailures[0].sourceMap).toMatchSnapshot(
      'when building duplicate interchanges should have validation failures for each entity -> Interchange 1 sourceMap',
    );

    expect(validationFailures[1].validatorName).toBe('InterchangeBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchSnapshot(
      'when building duplicate interchanges should have validation failures for each entity -> Interchange 2 message',
    );
    expect(validationFailures[1].sourceMap).toMatchSnapshot(
      'when building duplicate interchanges should have validation failures for each entity -> Interchange 2 sourceMap',
    );
  });
});

describe('when building single interchange extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = 'InterchangeName';
  const interchangeMetaEdId: string = '1';
  const interchangeElementName: string = 'InterchangeElementName';
  const interchangeElementMetaEdId: string = '2';
  const interchangeIdentityTemplateName: string = 'InterchangeIdentityTemplateName';
  const interchangeIdentityTemplateMetaEdId: string = '3';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchangeExtension(interchangeName, interchangeMetaEdId)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName, interchangeIdentityTemplateMetaEdId)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName)).toBeDefined();
    expect(getInterchangeExtension(metaEd.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have namespace', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName).metaEdId).toBe(interchangeMetaEdId);
  });

  it('should have project extension', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have one element', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName).elements).toHaveLength(1);
    expect(getInterchangeExtension(metaEd.entity, interchangeName).elements[0].metaEdName).toBe(interchangeElementName);
    expect(getInterchangeExtension(metaEd.entity, interchangeName).elements[0].metaEdId).toBe(interchangeElementMetaEdId);
  });

  it('should have one identity template', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName).identityTemplates).toHaveLength(1);
    expect(getInterchangeExtension(metaEd.entity, interchangeName).identityTemplates[0].metaEdName).toBe(
      interchangeIdentityTemplateName,
    );
    expect(getInterchangeExtension(metaEd.entity, interchangeName).identityTemplates[0].metaEdId).toBe(
      interchangeIdentityTemplateMetaEdId,
    );
  });
});

describe('when building duplicate interchange extensions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = 'InterchangeName';
  const interchangeMetaEdId: string = '1';
  const interchangeElementName: string = 'InterchangeElementName';
  const interchangeElementMetaEdId: string = '2';
  const interchangeIdentityTemplateName: string = 'InterchangeIdentityTemplateName';
  const interchangeIdentityTemplateMetaEdId: string = '3';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchangeExtension(interchangeName, interchangeMetaEdId)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName, interchangeIdentityTemplateMetaEdId)
      .withEndInterchangeExtension()

      .withStartInterchangeExtension(interchangeName, interchangeMetaEdId)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName, interchangeIdentityTemplateMetaEdId)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one interchange extension', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName)).toBeDefined();
    expect(getInterchangeExtension(metaEd.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have two validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('InterchangeBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchSnapshot(
      'when building duplicate interchanges should have validation failures for each entity -> Interchange 1 message',
    );
    expect(validationFailures[0].sourceMap).toMatchSnapshot(
      'when building duplicate interchanges should have validation failures for each entity -> Interchange 1 sourceMap',
    );

    expect(validationFailures[1].validatorName).toBe('InterchangeBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchSnapshot(
      'when building duplicate interchanges should have validation failures for each entity -> Interchange 2 message',
    );
    expect(validationFailures[1].sourceMap).toMatchSnapshot(
      'when building duplicate interchanges should have validation failures for each entity -> Interchange 2 sourceMap',
    );
  });
});

describe('when building interchange with no interchange name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = '';
  const interchangeMetaEdId: string = '1';
  const interchangeDocumentation: string = 'InterchangeDocumentation';
  const interchangeElementName: string = 'InterchangeElementName';
  const interchangeElementMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchange(interchangeName, interchangeMetaEdId)
      .withDocumentation(interchangeDocumentation)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should not build interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(0);
  });

  it('should have no viable alternative error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building interchange with lowercase interchange name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = 'interchangeName';
  const interchangeMetaEdId: string = '1';
  const interchangeDocumentation: string = 'InterchangeDocumentation';
  const interchangeElementName: string = 'InterchangeElementName';
  const interchangeElementMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchange(interchangeName, interchangeMetaEdId)
      .withDocumentation(interchangeDocumentation)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should not build interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(0);
  });

  it('should have no viable alternative error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building interchange with no documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = 'InterchangeName';
  const interchangeMetaEdId: string = '1';
  const interchangeElementName: string = 'InterchangeElementName';
  const interchangeElementMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchange(interchangeName, interchangeMetaEdId)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getInterchange(metaEd.entity, interchangeName)).toBeDefined();
    expect(getInterchange(metaEd.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have namespace', () => {
    expect(getInterchange(metaEd.entity, interchangeName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getInterchange(metaEd.entity, interchangeName).metaEdId).toBe(interchangeMetaEdId);
  });

  it('should have project extension', () => {
    expect(getInterchange(metaEd.entity, interchangeName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', () => {
    expect(getInterchange(metaEd.entity, interchangeName).documentation).toBe('');
  });

  it('should have one element', () => {
    expect(getInterchange(metaEd.entity, interchangeName).elements).toHaveLength(1);
    expect(getInterchange(metaEd.entity, interchangeName).elements[0].metaEdName).toBe(interchangeElementName);
    expect(getInterchange(metaEd.entity, interchangeName).elements[0].metaEdId).toBe(interchangeElementMetaEdId);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building interchange with no interchange component property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = 'InterchangeName';
  const interchangeMetaEdId: string = '1';
  const interchangeDocumentation: string = 'InterchangeDocumentation';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchange(interchangeName, interchangeMetaEdId)
      .withDocumentation(interchangeDocumentation)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(builder);
  });
  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getInterchange(metaEd.entity, interchangeName)).toBeDefined();
    expect(getInterchange(metaEd.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have namespace', () => {
    expect(getInterchange(metaEd.entity, interchangeName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getInterchange(metaEd.entity, interchangeName).metaEdId).toBe(interchangeMetaEdId);
  });

  it('should have project extension', () => {
    expect(getInterchange(metaEd.entity, interchangeName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', () => {
    expect(getInterchange(metaEd.entity, interchangeName).documentation).toBe(interchangeDocumentation);
  });

  it('should have no element', () => {
    expect(getInterchange(metaEd.entity, interchangeName).elements).toHaveLength(0);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building interchange with invalid trailing text', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = 'InterchangeName';
  const interchangeMetaEdId: string = '1';
  const interchangeDocumentation: string = 'InterchangeDocumentation';
  const interchangeElementName: string = 'InterchangeElementName';
  const interchangeElementMetaEdId: string = '2';
  const trailingText: string = '\r\nTrailingText';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchange(interchangeName, interchangeMetaEdId)
      .withDocumentation(interchangeDocumentation)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withTrailingText(trailingText)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getInterchange(metaEd.entity, interchangeName)).toBeDefined();
    expect(getInterchange(metaEd.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have namespace', () => {
    expect(getInterchange(metaEd.entity, interchangeName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getInterchange(metaEd.entity, interchangeName).metaEdId).toBe(interchangeMetaEdId);
  });

  it('should have project extension', () => {
    expect(getInterchange(metaEd.entity, interchangeName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', () => {
    expect(getInterchange(metaEd.entity, interchangeName).documentation).toBe(interchangeDocumentation);
  });

  it('should have one element', () => {
    expect(getInterchange(metaEd.entity, interchangeName).elements).toHaveLength(1);
    expect(getInterchange(metaEd.entity, interchangeName).elements[0].metaEdName).toBe(interchangeElementName);
    expect(getInterchange(metaEd.entity, interchangeName).elements[0].metaEdId).toBe(interchangeElementMetaEdId);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building interchange extension with no interchange extension name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = '';
  const interchangeMetaEdId: string = '1';
  const interchangeElementName: string = 'InterchangeElementName';
  const interchangeElementMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchangeExtension(interchangeName, interchangeMetaEdId)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should not build interchange extension', () => {
    expect(metaEd.entity.interchange.size).toBe(0);
  });

  it('should have no viable alternative error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building interchange extension with lowercase interchange extension name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = 'interchangeName';
  const interchangeMetaEdId: string = '1';
  const interchangeElementName: string = 'InterchangeElementName';
  const interchangeElementMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchangeExtension(interchangeName, interchangeMetaEdId)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should not build interchange extension', () => {
    expect(metaEd.entity.interchange.size).toBe(0);
  });

  it('should have no viable alternative error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building interchange extension with no element property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = 'InterchangeName';
  const interchangeMetaEdId: string = '1';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchangeExtension(interchangeName, interchangeMetaEdId)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName)).toBeDefined();
    expect(getInterchangeExtension(metaEd.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have namespace', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName).metaEdId).toBe(interchangeMetaEdId);
  });

  it('should have project extension', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have no element', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName).elements).toHaveLength(0);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building interchange extension with invalid trailing text', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = 'InterchangeName';
  const interchangeMetaEdId: string = '1';
  const interchangeElementName: string = 'InterchangeElementName';
  const interchangeElementMetaEdId: string = '2';
  const trailingText: string = '\r\nTrailingText';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchangeExtension(interchangeName, interchangeMetaEdId)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withTrailingText(trailingText)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName)).toBeDefined();
    expect(getInterchangeExtension(metaEd.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have namespace', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName).metaEdId).toBe(interchangeMetaEdId);
  });

  it('should have one element', () => {
    expect(getInterchangeExtension(metaEd.entity, interchangeName).elements).toHaveLength(1);
    expect(getInterchangeExtension(metaEd.entity, interchangeName).elements[0].metaEdName).toBe(interchangeElementName);
    expect(getInterchangeExtension(metaEd.entity, interchangeName).elements[0].metaEdId).toBe(interchangeElementMetaEdId);
  });

  it('should have no viable alternative error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building single interchange source map', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const interchangeName: string = 'InterchangeName';
  const interchangeMetaEdId: string = '1';
  const interchangeDocumentation: string = 'InterchangeDocumentation';
  const extendedDocumentation: string = 'ExtendedDocumentation';
  const useCaseDocumentation: string = 'UseCaseDocumentation';
  const interchangeElementName: string = 'InterchangeElementName';
  const interchangeElementMetaEdId: string = '2';
  const interchangeIdentityTemplateName: string = 'InterchangeIdentityTemplateName';
  const interchangeIdentityTemplateMetaEdId: string = '3';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartInterchange(interchangeName, interchangeMetaEdId)
      .withDocumentation(interchangeDocumentation)
      .withExtendedDocumentation(extendedDocumentation)
      .withUseCaseDocumentation(useCaseDocumentation)
      .withDomainEntityElement(interchangeElementName, interchangeElementMetaEdId)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName, interchangeIdentityTemplateMetaEdId)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(builder);
  });

  // ModelBaseSourceMap
  it('should have type', () => {
    expect(getInterchange(metaEd.entity, interchangeName).sourceMap.type).toBeDefined();
  });

  it('should have documentation', () => {
    expect(getInterchange(metaEd.entity, interchangeName).sourceMap.documentation).toBeDefined();
  });

  it('should have metaEdName', () => {
    expect(getInterchange(metaEd.entity, interchangeName).sourceMap.metaEdName).toBeDefined();
    expect(getInterchange(metaEd.entity, interchangeName).sourceMap.metaEdName.tokenText).toBe(interchangeName);
  });

  it('should have metaEdId', () => {
    expect(getInterchange(metaEd.entity, interchangeName).sourceMap.metaEdId).toBeDefined();
    expect(getInterchange(metaEd.entity, interchangeName).sourceMap.metaEdId.tokenText).toBe(`[${interchangeMetaEdId}]`);
  });

  it('should have namespaceInfo', () => {
    expect(getInterchange(metaEd.entity, interchangeName).sourceMap.namespaceInfo).toBeDefined();
  });

  // InterchangeSourceMap
  it('should have extendedDocumentation', () => {
    expect(
      ((getInterchange(metaEd.entity, interchangeName).sourceMap: any): InterchangeSourceMap).extendedDocumentation,
    ).toBeDefined();
  });

  it('should have useCaseDocumentation', () => {
    expect(
      ((getInterchange(metaEd.entity, interchangeName).sourceMap: any): InterchangeSourceMap).useCaseDocumentation,
    ).toBeDefined();
  });

  it('should have one element', () => {
    expect(((getInterchange(metaEd.entity, interchangeName).sourceMap: any): InterchangeSourceMap).elements).toHaveLength(1);
  });

  it('should have one identityTemplate', () => {
    expect(
      ((getInterchange(metaEd.entity, interchangeName).sourceMap: any): InterchangeSourceMap).identityTemplates,
    ).toHaveLength(1);
  });

  it('should have line, column, text for each property', () => {
    expect(getInterchange(metaEd.entity, interchangeName).sourceMap).toMatchSnapshot();
  });

  // InterchangeItemSourceMap
  it('should have element type', () => {
    expect(getInterchange(metaEd.entity, interchangeName).elements[0].sourceMap.type).toBeDefined();
  });

  it('should have element metaEdName', () => {
    expect(getInterchange(metaEd.entity, interchangeName).elements[0].sourceMap.metaEdName).toBeDefined();
  });

  it('should have element metaEdId', () => {
    expect(getInterchange(metaEd.entity, interchangeName).elements[0].sourceMap.metaEdId).toBeDefined();
  });

  it('should have element line, column, text for each property', () => {
    expect(getInterchange(metaEd.entity, interchangeName).elements[0].sourceMap).toMatchSnapshot();
  });

  it('should have identityTemplate type', () => {
    expect(getInterchange(metaEd.entity, interchangeName).identityTemplates[0].sourceMap.type).toBeDefined();
  });

  it('should have identityTemplate metaEdName', () => {
    expect(getInterchange(metaEd.entity, interchangeName).identityTemplates[0].sourceMap.metaEdName).toBeDefined();
  });

  it('should have identityTemplate metaEdId', () => {
    expect(getInterchange(metaEd.entity, interchangeName).identityTemplates[0].sourceMap.metaEdId).toBeDefined();
  });

  it('should have identityTemplate line, column, text for each property', () => {
    expect(getInterchange(metaEd.entity, interchangeName).identityTemplates[0].sourceMap).toMatchSnapshot();
  });
});
