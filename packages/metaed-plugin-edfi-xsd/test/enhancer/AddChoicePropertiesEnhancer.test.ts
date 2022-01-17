import {
  newMetaEdEnvironment,
  newAssociation,
  newChoice,
  newCommon,
  newCommonProperty,
  newChoiceProperty,
  newDescriptor,
  newDomainEntity,
  newNamespace,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Association, Choice, Common, Descriptor, DomainEntity, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/AddChoicePropertiesEnhancer';

describe('when enhancing association with choice', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const choiceName = 'ChoiceName';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';

  beforeAll(() => {
    const association: Association = { ...newAssociation(), metaEdName: entityName, namespace, data: { edfiXsd: {} } };
    namespace.entity.association.set(association.metaEdName, association);

    association.properties.push({
      ...newChoiceProperty(),
      metaEdName: choiceName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      data: { edfiXsd: {} },
    });

    const choice: Choice = { ...newChoice(), metaEdName: choiceName, namespace, data: { edfiXsd: {} } };
    namespace.entity.choice.set(choice.metaEdName, choice);

    choice.properties.push({ ...newCommonProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} } });
    enhance(metaEd);
  });

  it('should add choice properties to association', (): void => {
    const association: any = namespace.entity.association.get(entityName);
    expect(association.properties.length).toBe(1);
    const choiceProperty: any = association.properties[0];
    expect(choiceProperty.type).toBe('choice');
    expect(choiceProperty.data.edfiXsd.xsdProperties.length).toBe(1);
    expect(choiceProperty.data.edfiXsd.xsdProperties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing association with choices nested', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const choiceName1 = 'ChoiceName1';
  const choiceName2 = 'ChoiceName2';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';

  beforeAll(() => {
    const association: Association = { ...newAssociation(), metaEdName: entityName, namespace, data: { edfiXsd: {} } };
    namespace.entity.association.set(association.metaEdName, association);

    association.properties.push({
      ...newChoiceProperty(),
      metaEdName: choiceName1,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      data: { edfiXsd: {} },
    });

    const choice1: Choice = { ...newChoice(), metaEdName: choiceName1, namespace, data: { edfiXsd: {} } };
    namespace.entity.choice.set(choice1.metaEdName, choice1);

    choice1.properties.push({
      ...newChoiceProperty(),
      metaEdName: choiceName2,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      data: { edfiXsd: {} },
    });

    const choice2: Choice = { ...newChoice(), metaEdName: choiceName2, namespace, data: { edfiXsd: {} } };
    namespace.entity.choice.set(choice2.metaEdName, choice2);

    choice2.properties.push({ ...newCommonProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} } });
    enhance(metaEd);
  });

  it('should add two levels of choice properties to association', (): void => {
    const association: any = namespace.entity.association.get(entityName);
    expect(association.properties.length).toBe(1);

    const choiceProperty1: any = association.properties[0];
    expect(choiceProperty1.type).toBe('choice');
    expect(choiceProperty1.data.edfiXsd.xsdProperties.length).toBe(1);

    const choiceProperty2: any = choiceProperty1.data.edfiXsd.xsdProperties[0];
    expect(choiceProperty2.type).toBe('choice');
    expect(choiceProperty2.metaEdName).toBe(choiceName2);
    expect(choiceProperty2.data.edfiXsd.xsdProperties.length).toBe(1);
    expect(choiceProperty2.data.edfiXsd.xsdProperties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing common with choice', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const choiceName = 'ChoiceName';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';

  beforeAll(() => {
    const common: Common = { ...newCommon(), metaEdName: entityName, namespace, data: { edfiXsd: {} } };
    namespace.entity.common.set(common.metaEdName, common);

    common.properties.push({
      ...newChoiceProperty(),
      metaEdName: choiceName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      data: { edfiXsd: {} },
    });

    const choice: Choice = { ...newChoice(), metaEdName: choiceName, namespace, data: { edfiXsd: {} } };
    namespace.entity.choice.set(choice.metaEdName, choice);

    choice.properties.push({ ...newCommonProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} } });
    enhance(metaEd);
  });

  it('should add choice properties to common', (): void => {
    const common: any = namespace.entity.common.get(entityName);
    expect(common.properties.length).toBe(1);
    const choiceProperty: any = common.properties[0];
    expect(choiceProperty.type).toBe('choice');
    expect(choiceProperty.data.edfiXsd.xsdProperties.length).toBe(1);
    expect(choiceProperty.data.edfiXsd.xsdProperties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing common with choices nested', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const choiceName1 = 'ChoiceName1';
  const choiceName2 = 'ChoiceName2';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';

  beforeAll(() => {
    const common: Common = { ...newCommon(), metaEdName: entityName, namespace, data: { edfiXsd: {} } };
    namespace.entity.common.set(common.metaEdName, common);

    common.properties.push({
      ...newChoiceProperty(),
      metaEdName: choiceName1,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      data: { edfiXsd: {} },
    });

    const choice1: Choice = { ...newChoice(), metaEdName: choiceName1, namespace, data: { edfiXsd: {} } };
    namespace.entity.choice.set(choice1.metaEdName, choice1);

    choice1.properties.push({
      ...newChoiceProperty(),
      metaEdName: choiceName2,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      data: { edfiXsd: {} },
    });

    const choice2: Choice = { ...newChoice(), metaEdName: choiceName2, namespace, data: { edfiXsd: {} } };
    namespace.entity.choice.set(choice2.metaEdName, choice2);

    choice2.properties.push({ ...newCommonProperty(), metaEdName: propertyName, data: { edfiXsd: {} } });
    enhance(metaEd);
  });

  it('should add two levels of choice properties to common', (): void => {
    const common: any = namespace.entity.common.get(entityName);
    expect(common.properties.length).toBe(1);

    const choiceProperty1: any = common.properties[0];
    expect(choiceProperty1.type).toBe('choice');
    expect(choiceProperty1.data.edfiXsd.xsdProperties.length).toBe(1);

    const choiceProperty2: any = choiceProperty1.data.edfiXsd.xsdProperties[0];
    expect(choiceProperty2.type).toBe('choice');
    expect(choiceProperty2.metaEdName).toBe(choiceName2);
    expect(choiceProperty2.data.edfiXsd.xsdProperties.length).toBe(1);
    expect(choiceProperty2.data.edfiXsd.xsdProperties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing descriptor with choice', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const choiceName = 'ChoiceName';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';

  beforeAll(() => {
    const descriptor: Descriptor = { ...newDescriptor(), metaEdName: entityName, namespace, data: { edfiXsd: {} } };
    namespace.entity.descriptor.set(descriptor.metaEdName, descriptor);

    descriptor.properties.push({
      ...newChoiceProperty(),
      metaEdName: choiceName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      data: { edfiXsd: {} },
    });

    const choice: Choice = { ...newChoice(), metaEdName: choiceName, namespace, data: { edfiXsd: {} } };
    namespace.entity.choice.set(choice.metaEdName, choice);

    choice.properties.push({ ...newCommonProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} } });
    enhance(metaEd);
  });

  it('should add choice properties to descriptor', (): void => {
    const descriptor: any = namespace.entity.descriptor.get(entityName);
    expect(descriptor.properties.length).toBe(1);
    const choiceProperty: any = descriptor.properties[0];
    expect(choiceProperty.type).toBe('choice');
    expect(choiceProperty.data.edfiXsd.xsdProperties.length).toBe(1);
    expect(choiceProperty.data.edfiXsd.xsdProperties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing descriptor with choices nested', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const choiceName1 = 'ChoiceName1';
  const choiceName2 = 'ChoiceName2';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';

  beforeAll(() => {
    const descriptor: Descriptor = { ...newDescriptor(), metaEdName: entityName, namespace, data: { edfiXsd: {} } };
    namespace.entity.descriptor.set(descriptor.metaEdName, descriptor);

    descriptor.properties.push({
      ...newChoiceProperty(),
      metaEdName: choiceName1,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      data: { edfiXsd: {} },
    });

    const choice1: Choice = { ...newChoice(), metaEdName: choiceName1, namespace, data: { edfiXsd: {} } };
    namespace.entity.choice.set(choice1.metaEdName, choice1);

    choice1.properties.push({
      ...newChoiceProperty(),
      metaEdName: choiceName2,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      data: { edfiXsd: {} },
    });

    const choice2: Choice = { ...newChoice(), metaEdName: choiceName2, namespace, data: { edfiXsd: {} } };
    namespace.entity.choice.set(choice2.metaEdName, choice2);

    choice2.properties.push({ ...newCommonProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} } });
    enhance(metaEd);
  });

  it('should add two levels of choice properties to descriptor', (): void => {
    const descriptor: any = namespace.entity.descriptor.get(entityName);
    expect(descriptor.properties.length).toBe(1);

    const choiceProperty1: any = descriptor.properties[0];
    expect(choiceProperty1.type).toBe('choice');
    expect(choiceProperty1.data.edfiXsd.xsdProperties.length).toBe(1);

    const choiceProperty2: any = choiceProperty1.data.edfiXsd.xsdProperties[0];
    expect(choiceProperty2.type).toBe('choice');
    expect(choiceProperty2.metaEdName).toBe(choiceName2);
    expect(choiceProperty2.data.edfiXsd.xsdProperties.length).toBe(1);
    expect(choiceProperty2.data.edfiXsd.xsdProperties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing domainEntity with choice', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const choiceName = 'ChoiceName';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';

  beforeAll(() => {
    const domainEntity: DomainEntity = { ...newDomainEntity(), metaEdName: entityName, namespace, data: { edfiXsd: {} } };
    namespace.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    domainEntity.properties.push({
      ...newChoiceProperty(),
      metaEdName: choiceName,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      data: { edfiXsd: {} },
    });

    const choice: Choice = { ...newChoice(), metaEdName: choiceName, namespace, data: { edfiXsd: {} } };
    namespace.entity.choice.set(choice.metaEdName, choice);

    choice.properties.push({ ...newCommonProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} } });
    enhance(metaEd);
  });

  it('should add choice properties to domainEntity', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(entityName);
    expect(domainEntity.properties.length).toBe(1);
    const choiceProperty: any = domainEntity.properties[0];
    expect(choiceProperty.type).toBe('choice');
    expect(choiceProperty.data.edfiXsd.xsdProperties.length).toBe(1);
    expect(choiceProperty.data.edfiXsd.xsdProperties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing domainEntity with choice across namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension' };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(namespace);
  const choiceName = 'ChoiceName';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';

  beforeAll(() => {
    const domainEntity: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: entityName,
      namespace: extensionNamespace,
      data: { edfiXsd: {} },
    };
    extensionNamespace.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    domainEntity.properties.push({
      ...newChoiceProperty(),
      metaEdName: choiceName,
      referencedNamespaceName: namespace.namespaceName,
      namespace: extensionNamespace,
      data: { edfiXsd: {} },
    });

    const choice: Choice = { ...newChoice(), metaEdName: choiceName, namespace, data: { edfiXsd: {} } };
    namespace.entity.choice.set(choice.metaEdName, choice);

    choice.properties.push({ ...newCommonProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} } });
    enhance(metaEd);
  });

  it('should add choice properties to domainEntity', (): void => {
    const domainEntity: any = extensionNamespace.entity.domainEntity.get(entityName);
    expect(domainEntity.properties.length).toBe(1);
    const choiceProperty: any = domainEntity.properties[0];
    expect(choiceProperty.type).toBe('choice');
    expect(choiceProperty.data.edfiXsd.xsdProperties.length).toBe(1);
    expect(choiceProperty.data.edfiXsd.xsdProperties[0].metaEdName).toBe(propertyName);
  });
});

describe('when enhancing domainEntity with choices nested', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const choiceName1 = 'ChoiceName1';
  const choiceName2 = 'ChoiceName2';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';

  beforeAll(() => {
    const domainEntity: DomainEntity = { ...newDomainEntity(), metaEdName: entityName, namespace, data: { edfiXsd: {} } };
    namespace.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    domainEntity.properties.push({
      ...newChoiceProperty(),
      metaEdName: choiceName1,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      data: { edfiXsd: {} },
    });

    const choice1: Choice = { ...newChoice(), metaEdName: choiceName1, namespace, data: { edfiXsd: {} } };
    namespace.entity.choice.set(choice1.metaEdName, choice1);

    choice1.properties.push({
      ...newChoiceProperty(),
      metaEdName: choiceName2,
      referencedNamespaceName: namespace.namespaceName,
      namespace,
      data: { edfiXsd: {} },
    });

    const choice2: Choice = {
      ...newChoice(),
      metaEdName: choiceName2,
      namespace,
      data: { edfiXsd: {} },
    };
    namespace.entity.choice.set(choice2.metaEdName, choice2);

    choice2.properties.push({ ...newCommonProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} } });
    enhance(metaEd);
  });

  it('should add two levels of choice properties to domainEntity', (): void => {
    const domainEntity: any = namespace.entity.domainEntity.get(entityName);
    expect(domainEntity.properties.length).toBe(1);

    const choiceProperty1: any = domainEntity.properties[0];
    expect(choiceProperty1.type).toBe('choice');
    expect(choiceProperty1.data.edfiXsd.xsdProperties.length).toBe(1);

    const choiceProperty2: any = choiceProperty1.data.edfiXsd.xsdProperties[0];
    expect(choiceProperty2.type).toBe('choice');
    expect(choiceProperty2.metaEdName).toBe(choiceName2);
    expect(choiceProperty2.data.edfiXsd.xsdProperties.length).toBe(1);
    expect(choiceProperty2.data.edfiXsd.xsdProperties[0].metaEdName).toBe(propertyName);
  });
});
