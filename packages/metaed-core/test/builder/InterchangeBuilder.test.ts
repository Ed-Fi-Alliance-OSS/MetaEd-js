import { InterchangeBuilder } from '../../src/builder/InterchangeBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getInterchange, getInterchangeExtension } from '../TestHelper';
import { InterchangeSourceMap } from '../../src/model/Interchange';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building single interchange', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const extendedDocumentation = 'ExtendedDocumentation';
  const useCaseDocumentation = 'UseCaseDocumentation';
  const interchangeElementName = 'InterchangeElementName';
  const interchangeIdentityTemplateName = 'InterchangeIdentityTemplateName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchange(interchangeName)
      .withDocumentation(interchangeDocumentation)
      .withExtendedDocumentation(extendedDocumentation)
      .withUseCaseDocumentation(useCaseDocumentation)
      .withDomainEntityElement(interchangeElementName)
      .withAssociationIdentityTemplate(interchangeIdentityTemplateName)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one interchange', (): void => {
    expect(namespace.entity.interchange.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getInterchange(namespace.entity, interchangeName)).toBeDefined();
    expect(getInterchange(namespace.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have interchange documentation', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).documentation).toBe(interchangeDocumentation);
  });

  it('should have extended documentation', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).extendedDocumentation).toBe(extendedDocumentation);
  });

  it('should have use case documentation', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).useCaseDocumentation).toBe(useCaseDocumentation);
  });

  it('should not be deprecated', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).isDeprecated).toBe(false);
  });

  it('should have one element', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).elements).toHaveLength(1);
    expect(getInterchange(namespace.entity, interchangeName).elements[0].metaEdName).toBe(interchangeElementName);
    expect(getInterchange(namespace.entity, interchangeName).elements[0].referencedType).toEqual([
      'domainEntity',
      'domainEntitySubclass',
    ]);
  });

  it('should have one identity template', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).identityTemplates).toHaveLength(1);
    expect(getInterchange(namespace.entity, interchangeName).identityTemplates[0].metaEdName).toBe(
      interchangeIdentityTemplateName,
    );
    expect(getInterchange(namespace.entity, interchangeName).identityTemplates[0].referencedType).toEqual([
      'association',
      'associationSubclass',
    ]);
  });
});

describe('when building deprecated interchange', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const interchangeName = 'InterchangeName';
  const interchangeElementName = 'InterchangeElementName';
  const interchangeIdentityTemplateName = 'InterchangeIdentityTemplateName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchange(interchangeName)
      .withDeprecated(deprecationReason)
      .withDocumentation('doc')
      .withExtendedDocumentation('doc')
      .withUseCaseDocumentation('doc')
      .withDomainEntityElement(interchangeElementName)
      .withAssociationIdentityTemplate(interchangeIdentityTemplateName)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one interchange', (): void => {
    expect(namespace.entity.interchange.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).isDeprecated).toBe(true);
    expect(getInterchange(namespace.entity, interchangeName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building interchange with additional element and identity types', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const interchangeName = 'InterchangeName';
  const interchangeElementName1 = 'InterchangeElementName1';
  const interchangeElementName2 = 'InterchangeElementName2';
  const interchangeIdentityTemplateName = 'InterchangeIdentityTemplateName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, 'ProjectExtension')
      .withStartInterchange(interchangeName)
      .withDocumentation('doc')
      .withExtendedDocumentation('doc')
      .withUseCaseDocumentation('doc')
      .withAssociationElement(interchangeElementName1)
      .withDescriptorElement(interchangeElementName2)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have two element', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).elements).toHaveLength(2);
    expect(getInterchange(namespace.entity, interchangeName).elements[0].metaEdName).toBe(interchangeElementName1);
    expect(getInterchange(namespace.entity, interchangeName).elements[0].referencedType).toEqual([
      'association',
      'associationSubclass',
    ]);
    expect(getInterchange(namespace.entity, interchangeName).elements[1].metaEdName).toBe(interchangeElementName2);
    expect(getInterchange(namespace.entity, interchangeName).elements[1].referencedType).toEqual(['descriptor']);
  });

  it('should have one identity template', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).identityTemplates).toHaveLength(1);
    expect(getInterchange(namespace.entity, interchangeName).identityTemplates[0].metaEdName).toBe(
      interchangeIdentityTemplateName,
    );
    expect(getInterchange(namespace.entity, interchangeName).identityTemplates[0].referencedType).toEqual([
      'domainEntity',
      'domainEntitySubclass',
    ]);
  });
});

describe('when building duplicate interchanges', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const extendedDocumentation = 'ExtendedDocumentation';
  const useCaseDocumentation = 'UseCaseDocumentation';
  const interchangeElementName = 'InterchangeElementName';
  const interchangeIdentityTemplateName = 'InterchangeIdentityTemplateName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchange(interchangeName)
      .withDocumentation(interchangeDocumentation)
      .withExtendedDocumentation(extendedDocumentation)
      .withUseCaseDocumentation(useCaseDocumentation)
      .withDomainEntityElement(interchangeElementName)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName)
      .withEndInterchange()

      .withStartInterchange(interchangeName)
      .withDocumentation(interchangeDocumentation)
      .withExtendedDocumentation(extendedDocumentation)
      .withUseCaseDocumentation(useCaseDocumentation)
      .withDomainEntityElement(interchangeElementName)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one interchange', (): void => {
    expect(namespace.entity.interchange.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getInterchange(namespace.entity, interchangeName)).toBeDefined();
    expect(getInterchange(namespace.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('InterchangeBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Interchange named InterchangeName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
                  Object {
                    "column": 14,
                    "line": 11,
                    "tokenText": "InterchangeName",
                  }
            `);

    expect(validationFailures[1].validatorName).toBe('InterchangeBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Interchange named InterchangeName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[1].sourceMap).toMatchInlineSnapshot(`
                  Object {
                    "column": 14,
                    "line": 2,
                    "tokenText": "InterchangeName",
                  }
            `);
  });
});

describe('when building single interchange extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'InterchangeName';
  const interchangeElementName = 'InterchangeElementName';
  const interchangeIdentityTemplateName = 'InterchangeIdentityTemplateName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchangeExtension(interchangeName)
      .withDomainEntityElement(interchangeElementName)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one interchange', (): void => {
    expect(namespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName)).toBeDefined();
    expect(getInterchangeExtension(namespace.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have namespace', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have base entity namespace', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).baseEntityNamespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have one element', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).elements).toHaveLength(1);
    expect(getInterchangeExtension(namespace.entity, interchangeName).elements[0].metaEdName).toBe(interchangeElementName);
  });

  it('should have one identity template', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).identityTemplates).toHaveLength(1);
    expect(getInterchangeExtension(namespace.entity, interchangeName).identityTemplates[0].metaEdName).toBe(
      interchangeIdentityTemplateName,
    );
  });
});

describe('when building single interchange extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'InterchangeName';
  const interchangeElementName = 'InterchangeElementName';
  const interchangeIdentityTemplateName = 'InterchangeIdentityTemplateName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchangeExtension(interchangeName)
      .withDomainEntityElement(interchangeElementName)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one interchange', (): void => {
    expect(namespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName)).toBeDefined();
    expect(getInterchangeExtension(namespace.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have namespace', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have base entity namespace', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).baseEntityNamespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should not be deprecated', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).isDeprecated).toBe(false);
  });

  it('should have one element', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).elements).toHaveLength(1);
    expect(getInterchangeExtension(namespace.entity, interchangeName).elements[0].metaEdName).toBe(interchangeElementName);
  });

  it('should have one identity template', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).identityTemplates).toHaveLength(1);
    expect(getInterchangeExtension(namespace.entity, interchangeName).identityTemplates[0].metaEdName).toBe(
      interchangeIdentityTemplateName,
    );
  });
});

describe('when building deprecated interchange extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const interchangeName = 'InterchangeName';
  const interchangeElementName = 'InterchangeElementName';
  const interchangeIdentityTemplateName = 'InterchangeIdentityTemplateName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchangeExtension(interchangeName)
      .withDeprecated(deprecationReason)
      .withDomainEntityElement(interchangeElementName)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one interchange', (): void => {
    expect(namespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).isDeprecated).toBe(true);
    expect(getInterchangeExtension(namespace.entity, interchangeName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building single interchange extension extending core interchange', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const coreNamespaceName = 'EdFi';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'InterchangeName';
  const interchangeElementName = 'InterchangeElementName';
  const interchangeIdentityTemplateName = 'InterchangeIdentityTemplateName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchangeExtension(`${coreNamespaceName}.${interchangeName}`)
      .withDomainEntityElement(interchangeElementName)
      .withDomainEntityIdentityTemplate(`${coreNamespaceName}.${interchangeIdentityTemplateName}`)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have extendee name', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have namespace', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have base entity namespace', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).baseEntityNamespaceName).toBe(coreNamespaceName);
  });

  it('should have one element in local namespace', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).elements).toHaveLength(1);
    expect(getInterchangeExtension(namespace.entity, interchangeName).elements[0].metaEdName).toBe(interchangeElementName);
    expect(getInterchangeExtension(namespace.entity, interchangeName).elements[0].referencedNamespaceName).toBe(
      namespaceName,
    );
  });

  it('should have one identity template in core namespace', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).identityTemplates).toHaveLength(1);
    expect(getInterchangeExtension(namespace.entity, interchangeName).identityTemplates[0].metaEdName).toBe(
      interchangeIdentityTemplateName,
    );
    expect(getInterchangeExtension(namespace.entity, interchangeName).identityTemplates[0].referencedNamespaceName).toBe(
      coreNamespaceName,
    );
  });
});

describe('when building duplicate interchange extensions', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'InterchangeName';
  const interchangeElementName = 'InterchangeElementName';
  const interchangeIdentityTemplateName = 'InterchangeIdentityTemplateName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchangeExtension(interchangeName)
      .withDomainEntityElement(interchangeElementName)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName)
      .withEndInterchangeExtension()

      .withStartInterchangeExtension(interchangeName)
      .withDomainEntityElement(interchangeElementName)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one interchange extension', (): void => {
    expect(namespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName)).toBeDefined();
    expect(getInterchangeExtension(namespace.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('InterchangeBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Interchange Extension named InterchangeName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
                  Object {
                    "column": 14,
                    "line": 5,
                    "tokenText": "InterchangeName",
                  }
            `);

    expect(validationFailures[1].validatorName).toBe('InterchangeBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Interchange Extension named InterchangeName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[1].sourceMap).toMatchInlineSnapshot(`
                  Object {
                    "column": 14,
                    "line": 2,
                    "tokenText": "InterchangeName",
                  }
            `);
  });
});

describe('when building interchange with no interchange name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = '';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const interchangeElementName = 'InterchangeElementName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchange(interchangeName)
      .withDocumentation(interchangeDocumentation)
      .withDomainEntityElement(interchangeElementName)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build interchange', (): void => {
    expect(namespace.entity.interchange.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "no viable alternative at input 'Interchangedocumentation', column: 4, line: 3, token: documentation",
        "no viable alternative at input 'Interchangedocumentation', column: 4, line: 3, token: documentation",
      ]
    `);
  });
});

describe('when building interchange with lowercase interchange name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'interchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const interchangeElementName = 'InterchangeElementName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchange(interchangeName)
      .withDocumentation(interchangeDocumentation)
      .withDomainEntityElement(interchangeElementName)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build interchange', (): void => {
    expect(namespace.entity.interchange.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
                  Array [
                    "no viable alternative at input 'Interchangei', column: 14, line: 2, token: i",
                    "no viable alternative at input 'Interchangei', column: 14, line: 2, token: i",
                  ]
            `);
  });
});

describe('when building interchange with no documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'InterchangeName';
  const interchangeElementName = 'InterchangeElementName';

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchange(interchangeName)
      .withDomainEntityElement(interchangeElementName)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "no viable alternative at input 'InterchangeInterchangeNamedomain entity', column: 4, line: 3, token: domain entity",
        "no viable alternative at input 'InterchangeInterchangeNamedomain entity', column: 4, line: 3, token: domain entity",
      ]
    `);
  });
});

describe('when building interchange with no interchange component property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchange(interchangeName)
      .withDocumentation(interchangeDocumentation)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });
  it('should build one interchange', (): void => {
    expect(namespace.entity.interchange.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getInterchange(namespace.entity, interchangeName)).toBeDefined();
    expect(getInterchange(namespace.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have namespace', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).documentation).toBe(interchangeDocumentation);
  });

  it('should have no element', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).elements).toHaveLength(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
                  Array [
                    "mismatched input 'End Namespace' expecting {'association', 'association identity', 'descriptor', 'domain entity', 'domain entity identity', 'extended documentation', 'use case documentation'}, column: 0, line: 5, token: End Namespace",
                    "mismatched input 'End Namespace' expecting {'association', 'association identity', 'descriptor', 'domain entity', 'domain entity identity', 'extended documentation', 'use case documentation'}, column: 0, line: 5, token: End Namespace",
                  ]
            `);
  });
});

describe('when building interchange with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const interchangeElementName = 'InterchangeElementName';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchange(interchangeName)
      .withDocumentation(interchangeDocumentation)
      .withDomainEntityElement(interchangeElementName)
      .withTrailingText(trailingText)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one interchange', (): void => {
    expect(namespace.entity.interchange.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getInterchange(namespace.entity, interchangeName)).toBeDefined();
    expect(getInterchange(namespace.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have namespace', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).documentation).toBe(interchangeDocumentation);
  });

  it('should have one element', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).elements).toHaveLength(1);
    expect(getInterchange(namespace.entity, interchangeName).elements[0].metaEdName).toBe(interchangeElementName);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'association identity', 'descriptor', 'domain entity', 'domain entity identity', METAED_ID}, column: 0, line: 6, token: TrailingText",
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'association identity', 'descriptor', 'domain entity', 'domain entity identity', METAED_ID}, column: 0, line: 6, token: TrailingText",
      ]
    `);
  });
});

describe('when building interchange extension with no interchange extension name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = '';
  const interchangeElementName = 'InterchangeElementName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchangeExtension(interchangeName)
      .withDomainEntityElement(interchangeElementName)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build interchange extension', (): void => {
    expect(namespace.entity.interchange.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
                  Array [
                    "no viable alternative at input 'Interchangeadditions', column: 15, line: 2, token: additions",
                    "no viable alternative at input 'Interchangeadditions', column: 15, line: 2, token: additions",
                  ]
            `);
  });
});

describe('when building interchange extension with lowercase interchange extension name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'interchangeName';
  const interchangeElementName = 'InterchangeElementName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchangeExtension(interchangeName)
      .withDomainEntityElement(interchangeElementName)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build interchange extension', (): void => {
    expect(namespace.entity.interchange.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
                  Array [
                    "no viable alternative at input 'Interchangei', column: 14, line: 2, token: i",
                    "no viable alternative at input 'Interchangei', column: 14, line: 2, token: i",
                  ]
            `);
  });
});

describe('when building interchange extension with no element property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'InterchangeName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchangeExtension(interchangeName)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one interchange', (): void => {
    expect(namespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName)).toBeDefined();
    expect(getInterchangeExtension(namespace.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have namespace', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have no element', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).elements).toHaveLength(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'End Namespace' expecting {'association', 'association identity', 'descriptor', 'domain entity', 'domain entity identity', 'deprecated', METAED_ID}, column: 0, line: 3, token: End Namespace",
        "mismatched input 'End Namespace' expecting {'association', 'association identity', 'descriptor', 'domain entity', 'domain entity identity', 'deprecated', METAED_ID}, column: 0, line: 3, token: End Namespace",
      ]
    `);
  });
});

describe('when building interchange extension with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'InterchangeName';
  const interchangeElementName = 'InterchangeElementName';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchangeExtension(interchangeName)
      .withDomainEntityElement(interchangeElementName)
      .withTrailingText(trailingText)
      .withEndInterchangeExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one interchange', (): void => {
    expect(namespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName)).toBeDefined();
    expect(getInterchangeExtension(namespace.entity, interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have namespace', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have one element', (): void => {
    expect(getInterchangeExtension(namespace.entity, interchangeName).elements).toHaveLength(1);
    expect(getInterchangeExtension(namespace.entity, interchangeName).elements[0].metaEdName).toBe(interchangeElementName);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'association identity', 'descriptor', 'domain entity', 'domain entity identity', METAED_ID}, column: 0, line: 4, token: TrailingText",
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'association identity', 'descriptor', 'domain entity', 'domain entity identity', METAED_ID}, column: 0, line: 4, token: TrailingText",
      ]
    `);
  });
});

describe('when building single interchange source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const extendedDocumentation = 'ExtendedDocumentation';
  const useCaseDocumentation = 'UseCaseDocumentation';
  const interchangeElementName = 'InterchangeElementName';
  const interchangeIdentityTemplateName = 'InterchangeIdentityTemplateName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new InterchangeBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartInterchange(interchangeName)
      .withDocumentation(interchangeDocumentation)
      .withExtendedDocumentation(extendedDocumentation)
      .withUseCaseDocumentation(useCaseDocumentation)
      .withDomainEntityElement(interchangeElementName)
      .withDomainEntityIdentityTemplate(interchangeIdentityTemplateName)
      .withEndInterchange()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  // ModelBaseSourceMap
  it('should have type', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).sourceMap.type).toBeDefined();
  });

  it('should have documentation', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).sourceMap.documentation).toBeDefined();
  });

  it('should have metaEdName', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).sourceMap.metaEdName).toBeDefined();
    expect(getInterchange(namespace.entity, interchangeName).sourceMap.metaEdName.tokenText).toBe(interchangeName);
  });

  // InterchangeSourceMap
  it('should have extendedDocumentation', (): void => {
    expect(
      (getInterchange(namespace.entity, interchangeName).sourceMap as InterchangeSourceMap).extendedDocumentation,
    ).toBeDefined();
  });

  it('should have useCaseDocumentation', (): void => {
    expect(
      (getInterchange(namespace.entity, interchangeName).sourceMap as InterchangeSourceMap).useCaseDocumentation,
    ).toBeDefined();
  });

  it('should have one element', (): void => {
    expect((getInterchange(namespace.entity, interchangeName).sourceMap as InterchangeSourceMap).elements).toHaveLength(1);
  });

  it('should have one identityTemplate', (): void => {
    expect(
      (getInterchange(namespace.entity, interchangeName).sourceMap as InterchangeSourceMap).identityTemplates,
    ).toHaveLength(1);
  });

  it('should have line, column, text for each property', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).sourceMap).toMatchInlineSnapshot(`
      Object {
        "baseEntity": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityNamespaceName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 4,
          "line": 3,
          "tokenText": "documentation",
        },
        "elements": Array [
          Object {
            "column": 4,
            "line": 9,
            "tokenText": "domain entity",
          },
        ],
        "extendedDocumentation": Object {
          "column": 4,
          "line": 5,
          "tokenText": "extended documentation",
        },
        "identityTemplates": Array [
          Object {
            "column": 4,
            "line": 10,
            "tokenText": "domain entity identity",
          },
        ],
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdName": Object {
          "column": 14,
          "line": 2,
          "tokenText": "InterchangeName",
        },
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Interchange",
        },
        "useCaseDocumentation": Object {
          "column": 4,
          "line": 7,
          "tokenText": "use case documentation",
        },
      }
    `);
  });

  // InterchangeItemSourceMap
  it('should have element type', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).elements[0].sourceMap.type).toBeDefined();
  });

  it('should have element metaEdName', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).elements[0].sourceMap.metaEdName).toBeDefined();
  });

  it('should have element line, column, text for each property', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).elements[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdName": Object {
          "column": 18,
          "line": 9,
          "tokenText": "InterchangeElementName",
        },
        "referencedEntity": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "referencedEntityDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "referencedNamespaceName": Object {
          "column": 18,
          "line": 9,
          "tokenText": "InterchangeElementName",
        },
        "referencedType": Object {
          "column": 18,
          "line": 9,
          "tokenText": "InterchangeElementName",
        },
        "type": Object {
          "column": 18,
          "line": 9,
          "tokenText": "InterchangeElementName",
        },
        "typeHumanizedName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
      }
    `);
  });

  it('should have identityTemplate type', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).identityTemplates[0].sourceMap.type).toBeDefined();
  });

  it('should have identityTemplate metaEdName', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).identityTemplates[0].sourceMap.metaEdName).toBeDefined();
  });

  it('should have identityTemplate line, column, text for each property', (): void => {
    expect(getInterchange(namespace.entity, interchangeName).identityTemplates[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdName": Object {
          "column": 27,
          "line": 10,
          "tokenText": "InterchangeIdentityTemplateName",
        },
        "referencedEntity": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "referencedEntityDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "referencedNamespaceName": Object {
          "column": 27,
          "line": 10,
          "tokenText": "InterchangeIdentityTemplateName",
        },
        "referencedType": Object {
          "column": 27,
          "line": 10,
          "tokenText": "InterchangeIdentityTemplateName",
        },
        "type": Object {
          "column": 27,
          "line": 10,
          "tokenText": "InterchangeIdentityTemplateName",
        },
        "typeHumanizedName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
      }
    `);
  });
});
