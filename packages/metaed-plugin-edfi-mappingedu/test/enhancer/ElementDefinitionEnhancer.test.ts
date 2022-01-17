import { Namespace, MetaEdEnvironment } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import {
  baseTypeDescriptor,
  baseTypeDescriptorReference,
  descriptorReferenceTypeSuffix,
  identityTypeSuffix,
  mapTypeSuffix,
  newAnnotation,
  newComplexType,
  newElement,
  referenceTypeSuffix,
  typeGroupSimple,
} from '@edfi/metaed-plugin-edfi-xsd';
import { enhance } from '../../src/enhancer/ElementDefinitionEnhancer';
import {
  dataStandardElementGroupName,
  dataStandardNamespaceName,
  pluginBasesForNamespace,
  pluginDescriptorExtendedReferencesForNamespace,
  pluginDescriptorsForNamespace,
  pluginDomainEntitiesForNamespace,
  pluginEnvironmentRepositoryForNamespace,
  pluginExtendedReferencesForNamespace,
  pluginIdentitiesForNamespace,
} from '../../src/enhancer/EnhancerHelper';
import { addEdFiMappingEduRepositoryTo } from '../../src/model/EdFiMappingEduRepository';
import { ElementDefinition } from '../../src/model/ElementDefinition';
import { EdFiMappingEduRepository } from '../../src/model/EdFiMappingEduRepository';

describe('when enhancing domain entity with identity reference elements', (): void => {
  let pluginNamespace: EdFiMappingEduRepository;
  const domainEntityName = 'DomainEntityName';
  const domainEntityDocumentation = 'DomainEntityDocumentation';
  const identityDocumentation = 'IdentityDocumentation';
  const identityName = 'IdentityName';
  const identityType: string = identityTypeSuffix;
  const referenceDocumentation = 'ReferenceDocumentation';
  const referenceName = 'ReferenceNameReference';
  const referenceType: string = referenceTypeSuffix;
  const idName = 'IdName';
  const idType = 'IdType';
  const idDocumentation = 'IdDocumentation';
  const namespaceName = 'Namespace';
  const namespaceType = 'NamespaceType';
  const namespaceDocumentation = 'NamespaceDocumentation';

  // Core | DomainEntityName.ReferenceNameReference.IdentityName | Namespace | NamespaceDocumentation
  // Core | DomainEntityName.ReferenceNameReference.IdentityName | IdName    | IdNameDocumentation
  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: dataStandardNamespaceName,
    };
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiMappingEduRepositoryTo(metaEd);
    pluginDomainEntitiesForNamespace(metaEd, namespace).set(domainEntityName, {
      ...newComplexType(),
      annotation: { ...newAnnotation(), documentation: domainEntityDocumentation },
      name: domainEntityName,
      items: [
        {
          ...newElement(),
          name: referenceName,
          type: referenceType,
          annotation: { documentation: referenceDocumentation },
        } as any,
      ],
    });
    pluginExtendedReferencesForNamespace(metaEd, namespace).set(referenceType, {
      ...newComplexType(),
      name: referenceType,
      items: [
        {
          ...newElement(),
          name: identityName,
          type: identityType,
          annotation: { documentation: identityDocumentation },
        } as any,
      ],
    });
    pluginIdentitiesForNamespace(metaEd, namespace).set(identityType, {
      ...newComplexType(),
      name: identityType,
      items: [
        {
          ...newElement(),
          name: idName,
          type: idType,
          annotation: { documentation: idDocumentation, typeGroup: typeGroupSimple },
        } as any,
        {
          ...newElement(),
          name: namespaceName,
          type: namespaceType,
          annotation: { documentation: namespaceDocumentation, typeGroup: typeGroupSimple },
        } as any,
      ],
    });

    enhance(metaEd);

    pluginNamespace = pluginEnvironmentRepositoryForNamespace(metaEd, namespace) as any;
  });

  it('should create two element definitions', (): void => {
    expect(pluginNamespace.elementDefinitions).toHaveLength(2);
  });

  it.each([
    [[domainEntityName, referenceName, identityName], namespaceName, namespaceDocumentation, 0],
    [[domainEntityName, referenceName, identityName], idName, idDocumentation, 1],
  ])(
    `should create core element definition with entity path: %j, element: '%s', and definition: '%s'`,
    (entityPath: string[], element: string, definition: string, index: number) => {
      const elementDefinition: ElementDefinition = pluginNamespace.elementDefinitions[index];
      expect(elementDefinition).toBeDefined();
      expect(elementDefinition.elementGroup).toBe(dataStandardElementGroupName);
      expect(elementDefinition.entityPath).toEqual(entityPath);
      expect(elementDefinition.element).toBe(element);
      expect(elementDefinition.definition).toBe(definition);
    },
  );
});

describe('when enhancing descriptor', (): void => {
  let pluginNamespace: EdFiMappingEduRepository;
  const descriptorName = 'DescriptorName';
  const codeValue = 'CodeValue';
  const codeValueDocumentation = 'CodeValueDocumentation';
  const shortDescription = 'ShortDescription';
  const shortDescriptionDocumentation = 'ShortDescriptionDocumentation';
  const namespaceName = 'Namespace';
  const namespaceDocumentation = 'NamespaceDocumentation';

  // Core | DescriptorName | Namespace        | NamespaceDocumentation
  // Core | DescriptorName | CodeValue        | CodeValueDocumentation
  // Core | DescriptorName | ShortDescription | ShortDescriptionDocumentation
  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: dataStandardNamespaceName,
    };
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiMappingEduRepositoryTo(metaEd);
    pluginDescriptorsForNamespace(metaEd, namespace).set(descriptorName, {
      ...newComplexType(),
      baseType: baseTypeDescriptor,
      annotation: { ...newAnnotation() },
      name: descriptorName,
    });
    pluginBasesForNamespace(metaEd, namespace).set(baseTypeDescriptor, {
      ...newComplexType(),
      name: baseTypeDescriptor,
      items: [
        {
          ...newElement(),
          name: codeValue,
          annotation: { ...newAnnotation(), documentation: codeValueDocumentation },
        } as any,
        {
          ...newElement(),
          name: shortDescription,
          annotation: { ...newAnnotation(), documentation: shortDescriptionDocumentation },
        },
        { ...newElement(), name: namespaceName, annotation: { ...newAnnotation(), documentation: namespaceDocumentation } },
      ],
    });

    enhance(metaEd);

    pluginNamespace = pluginEnvironmentRepositoryForNamespace(metaEd, namespace) as any;
  });

  it('should create three element definitions', (): void => {
    expect(pluginNamespace.elementDefinitions).toHaveLength(3);
  });

  it.each([
    [[descriptorName], namespaceName, namespaceDocumentation, 0],
    [[descriptorName], shortDescription, shortDescriptionDocumentation, 1],
    [[descriptorName], codeValue, codeValueDocumentation, 2],
  ])(
    `should create core element definition with entity path: %j, element: '%s', and definition: '%s'`,
    (entityPath: string[], element: string, definition: string, index: number) => {
      const elementDefinition: ElementDefinition = pluginNamespace.elementDefinitions[index];
      expect(elementDefinition).toBeDefined();
      expect(elementDefinition.elementGroup).toBe(dataStandardElementGroupName);
      expect(elementDefinition.entityPath).toEqual(entityPath);
      expect(elementDefinition.element).toBe(element);
      expect(elementDefinition.definition).toBe(definition);
    },
  );
});

describe('when enhancing descriptor with map type', (): void => {
  let pluginNamespace: EdFiMappingEduRepository;
  const descriptorName = 'DescriptorName';
  const codeValue = 'CodeValue';
  const codeValueDocumentation = 'CodeValueDocumentation';
  const shortDescription = 'ShortDescription';
  const shortDescriptionDocumentation = 'ShortDescriptionDocumentation';
  const namespaceName = 'Namespace';
  const namespaceDocumentation = 'NamespaceDocumentation';
  const descriptorNameMap = `${descriptorName}Map`;
  const descriptorNameMapType: string = descriptorName + mapTypeSuffix;
  const descriptorNameMapTypeDocumentation = `${descriptorNameMapType}Documentation`;

  // Core | DescriptorName | Namespace        | NamespaceDocumentation
  // Core | DescriptorName | CodeValue        | CodeValueDocumentation
  // Core | DescriptorName | ShortDescription | ShortDescriptionDocumentation
  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: dataStandardNamespaceName,
    };
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiMappingEduRepositoryTo(metaEd);
    pluginDescriptorsForNamespace(metaEd, namespace).set(descriptorName, {
      ...newComplexType(),
      baseType: baseTypeDescriptor,
      annotation: { ...newAnnotation() },
      name: descriptorName,
      items: [{ ...newElement(), name: descriptorNameMap, type: descriptorNameMapType } as any],
    });
    pluginDescriptorsForNamespace(metaEd, namespace).set(descriptorName, {
      ...newComplexType(),
      baseType: baseTypeDescriptor,
      annotation: { ...newAnnotation() },
      name: descriptorName,
      items: [
        {
          ...newElement(),
          name: descriptorNameMap,
          type: descriptorNameMapType,
          annotation: { ...newAnnotation(), documentation: descriptorNameMapTypeDocumentation },
        } as any,
      ],
    });
    pluginBasesForNamespace(metaEd, namespace).set(baseTypeDescriptor, {
      ...newComplexType(),
      name: baseTypeDescriptor,
      items: [
        {
          ...newElement(),
          name: codeValue,
          annotation: { ...newAnnotation(), documentation: codeValueDocumentation },
        } as any,
        {
          ...newElement(),
          name: shortDescription,
          annotation: { ...newAnnotation(), documentation: shortDescriptionDocumentation },
        },
        { ...newElement(), name: namespaceName, annotation: { ...newAnnotation(), documentation: namespaceDocumentation } },
      ],
    });

    enhance(metaEd);

    pluginNamespace = pluginEnvironmentRepositoryForNamespace(metaEd, namespace) as any;
  });

  it('should create four element definitions', (): void => {
    expect(pluginNamespace.elementDefinitions).toHaveLength(4);
  });

  it.each([
    [[descriptorName], descriptorNameMap, descriptorNameMapTypeDocumentation, 0],
    [[descriptorName], namespaceName, namespaceDocumentation, 1],
    [[descriptorName], shortDescription, shortDescriptionDocumentation, 2],
    [[descriptorName], codeValue, codeValueDocumentation, 3],
  ])(
    `should create core element definition with entity path: %j, element: '%s', and definition: '%s'`,
    (entityPath: string[], element: string, definition: string, index: number) => {
      const elementDefinition: ElementDefinition = pluginNamespace.elementDefinitions[index];
      expect(elementDefinition).toBeDefined();
      expect(elementDefinition.elementGroup).toBe(dataStandardElementGroupName);
      expect(elementDefinition.entityPath).toEqual(entityPath);
      expect(elementDefinition.element).toBe(element);
      expect(elementDefinition.definition).toBe(definition);
    },
  );
});

describe('when enhancing domain entity with descriptor reference', (): void => {
  let pluginNamespace: EdFiMappingEduRepository;
  const domainEntityName = 'DomainEntityName';
  const domainEntityDocumentation = 'DomainEntityDocumentation';
  const descriptorReferenceName = 'DescriptorReferenceName';
  const descriptorReferenceType: string = descriptorReferenceName + descriptorReferenceTypeSuffix;
  const descriptorReferenceDocumentation = 'DescriptorReferenceDocumentation';
  const codeValue = 'CodeValue';
  const codeValueDocumentation = 'CodeValueDocumentation';
  const namespaceName = 'Namespace';
  const namespaceDocumentation = 'NamespaceDocumentation';

  // Core | DomainEntityName.descriptorName | CodeValue | CodeValueDocumentation
  // Core | DomainEntityName.descriptorName | Namespace | NamespaceDocumentation
  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: dataStandardNamespaceName,
    };
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiMappingEduRepositoryTo(metaEd);
    pluginDomainEntitiesForNamespace(metaEd, namespace).set(domainEntityName, {
      ...newComplexType(),
      annotation: { ...newAnnotation(), documentation: domainEntityDocumentation },
      name: domainEntityName,
      items: [
        {
          ...newElement(),
          name: descriptorReferenceName,
          type: descriptorReferenceType,
          annotation: { documentation: descriptorReferenceDocumentation },
        } as any,
      ],
    });
    pluginDescriptorExtendedReferencesForNamespace(metaEd, namespace).set(descriptorReferenceType, {
      ...newComplexType(),
      name: descriptorReferenceType,
      baseType: baseTypeDescriptorReference,
    });
    pluginBasesForNamespace(metaEd, namespace).set(baseTypeDescriptorReference, {
      ...newComplexType(),
      name: baseTypeDescriptorReference,
      items: [
        {
          ...newElement(),
          name: codeValue,
          annotation: { ...newAnnotation(), documentation: codeValueDocumentation },
        } as any,
        {
          ...newElement(),
          name: namespaceName,
          annotation: { ...newAnnotation(), documentation: namespaceDocumentation },
        } as any,
      ],
    });

    enhance(metaEd);

    pluginNamespace = pluginEnvironmentRepositoryForNamespace(metaEd, namespace) as any;
  });

  it('should create two element definitions', (): void => {
    expect(pluginNamespace.elementDefinitions).toHaveLength(2);
  });

  it.each([
    [[domainEntityName, descriptorReferenceName], namespaceName, namespaceDocumentation, 0],
    [[domainEntityName, descriptorReferenceName], codeValue, codeValueDocumentation, 1],
  ])(
    `should create core element definition with entity path: %j, element: '%s', and definition: '%s'`,
    (entityPath: string[], element: string, definition: string, index: number) => {
      const elementDefinition: ElementDefinition = pluginNamespace.elementDefinitions[index];
      expect(elementDefinition).toBeDefined();
      expect(elementDefinition.elementGroup).toBe(dataStandardElementGroupName);
      expect(elementDefinition.entityPath).toEqual(entityPath);
      expect(elementDefinition.element).toBe(element);
      expect(elementDefinition.definition).toBe(definition);
    },
  );
});
