// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EntityProperty } from '@edfi/metaed-core';
import { ComplexTypeItem } from '../../model/schema/ComplexTypeItem';
import { DescriptorPropertyEdfiXsd } from '../../model/property/DescriptorProperty';
import { ElementGroup, newElementGroup } from '../../model/schema/ElementGroup';
import { Element, newElement } from '../../model/schema/Element';
import { newAnnotation } from '../../model/schema/Annotation';

function calculateMinOccurs(entityProperty: EntityProperty, minOccursOverride: string | null | undefined): string {
  if (minOccursOverride != null) return minOccursOverride;
  return entityProperty.isOptional || entityProperty.isOptionalCollection ? '0' : '';
}

function calculateMaxOccursIsUnbounded(
  entityProperty: EntityProperty,
  maxOccursIsUnboundedOverride: boolean | null | undefined,
): boolean {
  if (maxOccursIsUnboundedOverride != null) return maxOccursIsUnboundedOverride;
  return entityProperty.isOptionalCollection || entityProperty.isRequiredCollection;
}

// Finds primary key columns for entity by traversing properties
export function createXsdElementFromProperty(
  property: EntityProperty,
  minOccursOverride: string | undefined,
  maxOccursIsUnboundedOverride: boolean | null | undefined,
): Element {
  return {
    ...newElement(),
    name: property.data.edfiXsd.xsdName,
    type: property.data.edfiXsd.xsdType,
    annotation: {
      ...newAnnotation(),
      documentation: property.documentation,
      descriptorName:
        property.type === 'descriptor'
          ? (property.data.edfiXsd as DescriptorPropertyEdfiXsd).xsdDescriptorNameWithExtension()
          : '',
    },
    minOccurs: calculateMinOccurs(property, minOccursOverride),
    maxOccursIsUnbounded: calculateMaxOccursIsUnbounded(property, maxOccursIsUnboundedOverride),
  };
}

export function createSchemaComplexTypeItems(
  complexTypeItemProperties: EntityProperty[],
  minOccursOverride?: string,
  maxOccursIsUnboundedOverride?: boolean,
): ComplexTypeItem[] {
  const complexTypeItems: ComplexTypeItem[] = [];
  complexTypeItemProperties.forEach((complexTypeItemProperty) => {
    if (complexTypeItemProperty.type === 'choice') {
      const choiceElement: ElementGroup = {
        ...newElementGroup(),
        minOccurs: calculateMinOccurs(complexTypeItemProperty, minOccursOverride),
        maxOccursIsUnbounded: calculateMaxOccursIsUnbounded(complexTypeItemProperty, maxOccursIsUnboundedOverride),
        isChoice: true,
      };
      choiceElement.items.push(
        ...createSchemaComplexTypeItems(
          complexTypeItemProperty.data.edfiXsd.xsdProperties,
          minOccursOverride,
          maxOccursIsUnboundedOverride,
        ),
      );
      complexTypeItems.push(choiceElement);
    } else {
      complexTypeItems.push(
        createXsdElementFromProperty(complexTypeItemProperty, minOccursOverride, maxOccursIsUnboundedOverride),
      );
    }
  });
  return complexTypeItems;
}
