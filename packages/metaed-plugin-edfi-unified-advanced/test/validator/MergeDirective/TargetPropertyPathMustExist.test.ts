// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  CommonBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  AssociationBuilder,
  AssociationExtensionBuilder,
  AssociationSubclassBuilder,
  NamespaceBuilder,
  SharedStringBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/MergeDirective/TargetPropertyPathMustExist';

describe('when validating domain entity has target property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const propertyName = 'Property1';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName1, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName1}.${propertyName}`, `${propertyName}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity has merge property and entity is wrong', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'Entity1';
  const propertyName = 'Property1';
  const targetEntityName = 'DomainEntity2';
  const targetPropertyName = 'Property2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(targetEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(targetPropertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName}.${propertyName}`, `EntityNotValid.${targetPropertyName}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('TargetPropertyPathMustExist');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating domain entity has merge property and entity is wrong -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating domain entity has merge property and entity is wrong -> sourceMap',
    );
  });
});

describe('when validating domain entity has merge property and property is wrong', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'GoodEntity1';
  const propertyName = 'Property1';
  const targetEntityName = 'GoodEntity2';
  const targetPropertyName = 'Property2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(targetEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(targetPropertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName}.${propertyName}`, `${targetEntityName}.NotThere`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('TargetPropertyPathMustExist');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating domain entity has merge property and property is wrong -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating domain entity has merge property and property is wrong -> sourceMap',
    );
  });
});

describe('when validating domain entity has merge property on common type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'Entity1';
  const secondEntityName = 'SecondEntity2';
  const propertyName = 'Property1';
  const targetEntityName = 'TargetEntity3';
  const targetPropertyName = 'Property2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartCommon(secondEntityName)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName, 'Documentation')
      .withEndCommon()

      .withStartDomainEntity(targetEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(targetPropertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withCommonProperty(secondEntityName, 'Documentation', false, false)
      .withMergeDirective(`${secondEntityName}.${domainEntityName}`, domainEntityName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new CommonBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity subclass has merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'EntityWithSub1';
  const propertyName = 'Property1';
  const targetEntityName = 'EntityWithSub2';
  const targetPropertyName = 'Property2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityProperty', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(targetEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityProperty2', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass('Entity3', targetEntityName)
      .withDocumentation('Documentation')
      .withIntegerProperty(targetPropertyName, 'Documentation', true, false)
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName}.${propertyName}`, `${targetPropertyName}`)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating association has merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'EntityWithAssoc1';
  const propertyName = 'Property1';
  const targetAssociationName = 'Association';
  const targetPropertyName = 'Property4';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity3')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property3', 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(targetAssociationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty('Entity2', 'Documentation')
      .withAssociationDomainEntityProperty('Entity3', 'Documentation')
      .withIntegerIdentity(targetPropertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName}.${propertyName}`, `${targetAssociationName}.${targetPropertyName}`)
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new AssociationBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating association extension has merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'EntityWithAssocExt1';
  const propertyName = 'Property1';
  const targetAssociationName = 'Association';
  const targetPropertyName = 'Property4';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity3')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property3', 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(targetAssociationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty('Entity2', 'Documentation')
      .withAssociationDomainEntityProperty('Entity3', 'Documentation')
      .withIntegerIdentity(targetPropertyName, 'Documentation')

      .withStartAssociationExtension(targetAssociationName)
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName}.${propertyName}`, `${targetAssociationName}.${targetPropertyName}`)
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new AssociationBuilder(metaEd, failures))
      .sendToListener(new AssociationExtensionBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating association subclass has merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'EntityWithAssocSub1';
  const propertyName = 'Property1';
  const targetAssociationName = 'Association';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity3')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property3', 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(targetAssociationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty('Entity2', 'Documentation')
      .withAssociationDomainEntityProperty('Entity3', 'Documentation')
      .withIntegerIdentity('Property4', 'Documentation')

      .withStartAssociationSubclass('Entity5', targetAssociationName)
      .withDocumentation('Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergeDirective(`Entity2.${propertyName}`, `${domainEntityName}.${propertyName}`)
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new AssociationBuilder(metaEd, failures))
      .sendToListener(new AssociationSubclassBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating abstract entity has merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'AbstractEntity1';
  const propertyName = 'Property1';
  const targetEntityName = 'AbstractEntity2';
  const targetPropertyName = 'Property2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartAbstractEntity(targetEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(targetPropertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName}.${propertyName}`, `${targetPropertyName}`)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity has target property across namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const propertyName = 'Property1';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName1, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName1}.${propertyName}`, `${propertyName}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity has merge property across namespaces and entity is wrong', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'Entity1';
  const propertyName = 'Property1';
  const targetEntityName = 'DomainEntity2';
  const targetPropertyName = 'Property2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity(targetEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(targetPropertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName}.${propertyName}`, `EntityNotValid.${targetPropertyName}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('TargetPropertyPathMustExist');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when validating domain entity has simple property as merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const learningObjectiveName = 'LearningObjective';
  const objectiveAssessmentName = 'ObjectiveAssessment';
  const assessmentName = 'Assessment';
  const uriName = 'URI';
  const namespaceRename = 'Namespace';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withMinLength('5')
      .withMaxLength('255')
      .withEndSharedString()

      .withStartDomainEntity(learningObjectiveName)
      .withDocumentation('doc')
      .withSharedStringIdentity(uriName, namespaceRename, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(assessmentName)
      .withDocumentation('doc')
      .withSharedStringIdentity(uriName, namespaceRename, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(objectiveAssessmentName)
      .withDocumentation('doc')
      .withDomainEntityIdentity(assessmentName, 'doc')
      .withDomainEntityProperty(learningObjectiveName, 'doc', false, true)
      .withMergeDirective(`${learningObjectiveName}.${namespaceRename}`, `${assessmentName}.${namespaceRename}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failure', (): void => {
    expect(failures).toHaveLength(0);
  });
});
