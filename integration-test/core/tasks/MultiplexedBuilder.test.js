// @noflow
import { multiplexedBuilder } from '../../../packages/metaed-core/src/task/WalkBuildersMultiplexed';
import { MetaEdTextBuilder } from '../../../packages/metaed-core/test/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../../packages/metaed-core/src/MetaEdEnvironment';
import type { MetaEdEnvironment } from '../../../packages/metaed-core/src/MetaEdEnvironment';
import type { ValidationFailure } from '../../../packages/metaed-core/src/validator/ValidationFailure';
import { DefaultExtensionEntitySuffix } from '../../../packages/metaed-core/src/model/NamespaceInfo';

describe('when building association in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';


  const entityName: string = 'EntityName';
  const entityMetaEdId: string = '1';
  const documentation1: string = 'documentation1';
  const firstDomainEntityName: string = 'FirstDomainEntityName';
  const firstDomainEntityMetaEdId: string = '2';
  const documentation2: string = 'documentation2';
  const secondDomainEntityName: string = 'SecondDomainEntityName';
  const secondDomainEntityMetaEdId: string = '3';
  const documentation3: string = 'documentation3';

  beforeAll(() => {
    const builder = multiplexedBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartAssociation(entityName, entityMetaEdId)
      .withDocumentation(documentation1)
      .withAssociationDomainEntityProperty(firstDomainEntityName, documentation2, null, firstDomainEntityMetaEdId)
      .withAssociationDomainEntityProperty(secondDomainEntityName, documentation3, null, secondDomainEntityMetaEdId)
      .withEndAssociation()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(metaEd.entity.association.get(entityName)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(metaEd.entity.association.get(entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(metaEd.entity.association.get(entityName).metaEdId).toBe(entityMetaEdId);
  });

  it('should have project extension', () => {
    expect(metaEd.entity.association.get(entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have association documentation', () => {
    expect(metaEd.entity.association.get(entityName).documentation).toBe(documentation1);
  });

  it('should have two properties', () => {
    expect(metaEd.entity.association.get(entityName).properties).toHaveLength(2);
  });

  it('should have first domain entity property', () => {
    const domainEntityProperty = metaEd.entity.association.get(entityName).properties[0];

    expect(domainEntityProperty.metaEdName).toBe(firstDomainEntityName);
    expect(domainEntityProperty.type).toBe('domainEntity');
    expect(domainEntityProperty.metaEdId).toBe(firstDomainEntityMetaEdId);
    expect(domainEntityProperty.isPartOfIdentity).toBe(true);
  });

  it('should have first domain entity property as identity property', () => {
    const domainEntityProperty = metaEd.entity.association.get(entityName).identityProperties[0];

    expect(domainEntityProperty.metaEdName).toBe(firstDomainEntityName);
    expect(domainEntityProperty.type).toBe('domainEntity');
    expect(domainEntityProperty.metaEdId).toBe(firstDomainEntityMetaEdId);
    expect(domainEntityProperty.isPartOfIdentity).toBe(true);
  });

  it('should have second domain entity property', () => {
    const domainEntityProperty = metaEd.entity.association.get(entityName).properties[1];

    expect(domainEntityProperty.metaEdName).toBe(secondDomainEntityName);
    expect(domainEntityProperty.type).toBe('domainEntity');
    expect(domainEntityProperty.metaEdId).toBe(secondDomainEntityMetaEdId);
    expect(domainEntityProperty.isPartOfIdentity).toBe(true);
  });

  it('should have second domain entity property as identity property', () => {
    const domainEntityProperty = metaEd.entity.association.get(entityName).identityProperties[1];

    expect(domainEntityProperty.metaEdName).toBe(secondDomainEntityName);
    expect(domainEntityProperty.type).toBe('domainEntity');
    expect(domainEntityProperty.metaEdId).toBe(secondDomainEntityMetaEdId);
    expect(domainEntityProperty.isPartOfIdentity).toBe(true);
  });
});

describe('when building simple domain entity in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const metaEdId: string = '1';
  const projectExtension: string = 'ProjectExtension';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';
  const documentation: string = 'Doc';

  beforeAll(() => {
    const builder = multiplexedBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(metaEd.entity.domainEntity.get(entityName)).toBeDefined();
    expect(metaEd.entity.domainEntity.get(entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have correct namespace', () => {
    expect(metaEd.entity.domainEntity.get(entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have correct metaEdId', () => {
    expect(metaEd.entity.domainEntity.get(entityName).metaEdId).toBe(metaEdId);
  });

  it('should have correct project extension', () => {
    expect(metaEd.entity.domainEntity.get(entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should not be abstract', () => {
    expect(metaEd.entity.domainEntity.get(entityName).isAbstract).toBe(false);
  });

  it('should not have updates set', () => {
    expect(metaEd.entity.domainEntity.get(entityName).allowPrimaryKeyUpdates).toBe(false);
  });

  it('should have correct documentation', () => {
    expect(metaEd.entity.domainEntity.get(entityName).documentation).toBe(documentation);
  });

  it('should have two properties', () => {
    expect(metaEd.entity.domainEntity.get(entityName).properties).toHaveLength(2);
  });

  it('should have integer property', () => {
    expect(metaEd.entity.domainEntity.get(entityName).properties[0].metaEdName).toBe(propertyName);
    expect(metaEd.entity.domainEntity.get(entityName).properties[0].type).toBe('integer');
  });

  it('should have string property', () => {
    expect(metaEd.entity.domainEntity.get(entityName).properties[1].metaEdName).toBe(stringPropertyName);
    expect(metaEd.entity.domainEntity.get(entityName).properties[1].type).toBe('string');
  });

  it('should not have queryable fields', () => {
    expect(metaEd.entity.domainEntity.get(entityName).queryableFields).toHaveLength(0);
  });
});

describe('when building shared decimal in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    const builder = multiplexedBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedDecimal(entityName, metaEdId)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one shared decimal', () => {
    expect(metaEd.entity.sharedDecimal.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(metaEd.entity.sharedDecimal.get(entityName)).toBeDefined();
    expect(metaEd.entity.sharedDecimal.get(entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(metaEd.entity.sharedDecimal.get(entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(metaEd.entity.sharedDecimal.get(entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', () => {
    expect(metaEd.entity.sharedDecimal.get(entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(metaEd.entity.sharedDecimal.get(entityName).documentation).toBe(documentation);
  });

  it('should have total digits', () => {
    expect(metaEd.entity.sharedDecimal.get(entityName).totalDigits).toBe(totalDigits);
  });

  it('should have decimal places', () => {
    expect(metaEd.entity.sharedDecimal.get(entityName).decimalPlaces).toBe(decimalPlaces);
  });

  it('should have minValue', () => {
    expect(metaEd.entity.sharedDecimal.get(entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(metaEd.entity.sharedDecimal.get(entityName).maxValue).toBe(maxValue);
  });
});

describe('when building extension namespace info', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  beforeAll(() => {
    const builder = multiplexedBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartCommon('Dummy')
      .withDocumentation('Dummy')
      .withIntegerProperty('Dummy', 'Dummy', true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one namespace info', () => {
    expect(metaEd.entity.namespaceInfo).toHaveLength(1);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have correct namespace', () => {
    expect(metaEd.entity.namespaceInfo[0]).toBeDefined();
    expect(metaEd.entity.namespaceInfo[0].namespace).toBe(namespace);
  });

  it('should have correct project extension', () => {
    expect(metaEd.entity.namespaceInfo[0].projectExtension).toBe(projectExtension);
  });

  it('should be an extension', () => {
    expect(metaEd.entity.namespaceInfo[0].isExtension).toBe(true);
  });

  it('should have correct extension suffix', () => {
    expect(metaEd.entity.namespaceInfo[0].extensionEntitySuffix).toBe(DefaultExtensionEntitySuffix);
  });
});

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
    const builder = multiplexedBuilder(metaEd, validationFailures);

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
    expect(metaEd.entity.interchange.get(interchangeName)).toBeDefined();
    expect(metaEd.entity.interchange.get(interchangeName).metaEdName).toBe(interchangeName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(metaEd.entity.interchange.get(interchangeName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(metaEd.entity.interchange.get(interchangeName).metaEdId).toBe(interchangeMetaEdId);
  });

  it('should have project extension', () => {
    expect(metaEd.entity.interchange.get(interchangeName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have interchange documentation', () => {
    expect(metaEd.entity.interchange.get(interchangeName).documentation).toBe(interchangeDocumentation);
  });

  it('should have extended documentation', () => {
    expect(metaEd.entity.interchange.get(interchangeName).extendedDocumentation).toBe(extendedDocumentation);
  });

  it('should have use case documentation', () => {
    expect(metaEd.entity.interchange.get(interchangeName).useCaseDocumentation).toBe(useCaseDocumentation);
  });

  it('should have one element', () => {
    expect(metaEd.entity.interchange.get(interchangeName).elements).toHaveLength(1);
    expect(metaEd.entity.interchange.get(interchangeName).elements[0].metaEdName).toBe(interchangeElementName);
    expect(metaEd.entity.interchange.get(interchangeName).elements[0].metaEdId).toBe(interchangeElementMetaEdId);
    expect(metaEd.entity.interchange.get(interchangeName).elements[0].referencedType).toEqual(['domainEntity', 'domainEntitySubclass']);
  });

  it('should have one identity template', () => {
    expect(metaEd.entity.interchange.get(interchangeName).identityTemplates).toHaveLength(1);
    expect(metaEd.entity.interchange.get(interchangeName).identityTemplates[0].metaEdName).toBe(interchangeIdentityTemplateName);
    expect(metaEd.entity.interchange.get(interchangeName).identityTemplates[0].metaEdId).toBe(interchangeIdentityTemplateMetaEdId);
    expect(metaEd.entity.interchange.get(interchangeName).identityTemplates[0].referencedType).toEqual(['association', 'associationSubclass']);
  });
});

describe('when building shared string in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';

  const minLength = '2';
  const maxLength = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedString(entityName, metaEdId)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(multiplexedBuilder(metaEd, validationFailures));
  });

  it('should build one string type', () => {
    expect(metaEd.entity.stringType.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have type', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).type).toBe('stringType');
  });

  it('should have type humanized name', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).typeHumanizedName).toBe('String Type');
  });

  it('should have metaed id', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have minLength', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).minLength).toBe(minLength);
  });

  it('should have maxLength', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).maxLength).toBe(maxLength);
  });

  it('should not be a generated type', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).generatedSimpleType).toBe(false);
  });
});

describe('when building domain entity with string property in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const domainEntityName: string = 'DomainEntityName';
  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(domainEntityName, '1')
      .withDocumentation(documentation)
      .withStringProperty(entityName, documentation, true, false, maxLength, minLength, null, metaEdId)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(multiplexedBuilder(metaEd, validationFailures));
  });

  it('should build one domain entity with one property', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
    const domainEntity = metaEd.entity.domainEntity.get(domainEntityName);
    expect(domainEntity).toBeDefined();
    expect(domainEntity.properties[0].metaEdName).toBe(entityName);
  });

  it('should build one string type', () => {
    expect(metaEd.entity.stringType.size).toBe(1);
    expect(metaEd.entity.stringType.get(expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have type', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).type).toBe('stringType');
  });

  it('should have type humanized name', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).typeHumanizedName).toBe('String Type');
  });

  it('should have metaed id', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have minLength', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).minLength).toBe(minLength);
  });

  it('should have maxLength', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).maxLength).toBe(maxLength);
  });

  it('should be a generated type', () => {
    expect(metaEd.entity.stringType.get(expectedRepositoryId).generatedSimpleType).toBe(true);
  });
});

