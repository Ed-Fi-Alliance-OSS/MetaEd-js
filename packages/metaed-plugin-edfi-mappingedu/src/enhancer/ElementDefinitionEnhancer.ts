import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { ComplexType, ComplexTypeItem, SimpleType, Element, ElementGroup } from '@edfi/metaed-plugin-edfi-xsd';
import { baseTypeDescriptorReference, baseTypeReference, baseTypeTopLevelEntity } from '@edfi/metaed-plugin-edfi-xsd';
import { ElementDefinition } from '../model/ElementDefinition';
import { newElementDefinition } from '../model/ElementDefinition';
import {
  elementGroupNameFor,
  pluginAssociationsForNamespace,
  pluginDescriptorExtendedReferencesForNamespace,
  pluginDescriptorsForNamespace,
  pluginDomainEntitiesForNamespace,
  pluginElementDefinitionsForNamespace,
} from './EnhancerHelper';
import {
  baseTypeFor,
  hasItems,
  isDescriptorReferenceType,
  isElementGroup,
  isEnumeration,
  isLookupReferenceType,
  isMapReferenceType,
  isSimpleType,
  referenceFor,
} from './ReferenceDefinitionHelper';

const enhancerName = 'ElementDefinitionEnhancer';

const isRequired = (element: Element): boolean =>
  element.minOccurs != null && (element.minOccurs === '' || element.minOccurs === '1');

const fieldLengthFor = (stringSimpleType: any): string =>
  stringSimpleType.maxLength != null ? stringSimpleType.maxLength : '';

const collectElementsFor = (
  element: ComplexType | ElementGroup,
  entityPath: string[],
  elements: { value: Element | ElementGroup; entityPath: string[] }[],
): void => {
  element.items.forEach((value: ComplexTypeItem) =>
    elements.push({
      value: value as any,
      entityPath,
    }),
  );
};

const createElementDefinitionForDescriptorReferenceType = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
  element: { value: Element; entityPath: string[] },
  elements: { value: Element | ElementGroup; entityPath: string[] }[],
) => {
  const descriptorReference: ComplexType | undefined = pluginDescriptorExtendedReferencesForNamespace(metaEd, namespace).get(
    element.value.type,
  );
  if (descriptorReference != null) {
    const descriptorBaseType: ComplexType | undefined = baseTypeFor(metaEd, namespace, descriptorReference);
    if (descriptorBaseType != null && hasItems(descriptorBaseType))
      collectElementsFor(descriptorBaseType, [...element.entityPath, element.value.name], elements);
  }
};

const createElementDefinitionsFor = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
  complexType: ComplexType,
  entityPath: string[] = [complexType.name],
) => {
  /* eslint-disable no-continue */
  const repository: ElementDefinition[] = pluginElementDefinitionsForNamespace(metaEd, namespace);
  const elements: { value: Element | ElementGroup; entityPath: string[] }[] = [];
  collectElementsFor(complexType, entityPath, elements);

  while (elements.length > 0) {
    const elementOrElementGroup: { value: Element | ElementGroup; entityPath: string[] } = elements.pop() as {
      value: Element | ElementGroup;
      entityPath: string[];
    };
    if (isElementGroup(elementOrElementGroup.value)) {
      const elementGroup: { value: ElementGroup; entityPath: string[] } = {
        value: elementOrElementGroup.value as ElementGroup,
        entityPath: elementOrElementGroup.entityPath,
      };

      collectElementsFor(elementGroup.value, [...elementOrElementGroup.entityPath], elements);
      continue;
    }

    const element: { value: Element; entityPath: string[] } = {
      value: elementOrElementGroup.value as Element,
      entityPath: elementOrElementGroup.entityPath,
    };

    if (isLookupReferenceType(element.value)) continue;
    if (isDescriptorReferenceType(element.value)) {
      createElementDefinitionForDescriptorReferenceType(metaEd, namespace, element, elements);
      continue;
    }

    const reference: ComplexType | SimpleType | undefined = referenceFor(metaEd, namespace, element.value);

    if (
      reference == null ||
      isSimpleType(element.value) ||
      isEnumeration(element.value) ||
      isMapReferenceType(element.value)
    ) {
      repository.push({
        ...newElementDefinition(),
        elementGroup: elementGroupNameFor(namespace),
        entityPath: [...element.entityPath],
        element: element.value.name,
        definition: element.value.annotation.documentation,
        dataType: element.value.type,
        fieldLength: reference != null ? fieldLengthFor(reference) : fieldLengthFor(element.value),
        url: '',
        technicalName: '',
        isRequired: isRequired(element.value),
      });
      continue;
    }

    if (reference != null) {
      if (isSimpleType(reference) || isEnumeration(reference) || isMapReferenceType(reference)) {
        repository.push({
          ...newElementDefinition(),
          elementGroup: elementGroupNameFor(namespace),
          entityPath: [...element.entityPath],
          element: element.value.name,
          definition: element.value.annotation.documentation,
          dataType: reference.baseType != null ? reference.baseType : element.value.type,
          fieldLength: fieldLengthFor(reference),
          url: '',
          technicalName: '',
          isRequired: isRequired(element.value),
        });
      }

      if (hasItems(reference))
        collectElementsFor(reference as ComplexType, [...element.entityPath, element.value.name], elements);
    }
  }
  /* eslint-enable no-continue */
};

const createElementDefinitionForBaseType = (
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
  complexType: ComplexType,
  entityPath: string[] = [complexType.name],
) => {
  if (
    complexType.baseType == null ||
    complexType.baseType === baseTypeDescriptorReference ||
    complexType.baseType === baseTypeReference ||
    complexType.baseType === baseTypeTopLevelEntity
  )
    return;

  const baseType: ComplexType | undefined = baseTypeFor(metaEd, namespace, complexType);
  if (baseType == null) return;
  createElementDefinitionsFor(metaEd, namespace, baseType, [...entityPath]);
};

export const enhance = (metaEd: MetaEdEnvironment): EnhancerResult => {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const xsdElements: ComplexType[] = [
      ...pluginDescriptorsForNamespace(metaEd, namespace).values(),
      ...pluginDomainEntitiesForNamespace(metaEd, namespace).values(),
      ...pluginAssociationsForNamespace(metaEd, namespace).values(),
    ];

    xsdElements.forEach((xsdElement: ComplexType) => {
      createElementDefinitionsFor(metaEd, namespace, xsdElement);
      createElementDefinitionForBaseType(metaEd, namespace, xsdElement);
    });
  });

  return {
    enhancerName,
    success: true,
  };
};
