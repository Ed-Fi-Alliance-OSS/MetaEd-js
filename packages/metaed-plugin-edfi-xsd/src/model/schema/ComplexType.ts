// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { Annotation, newAnnotation } from './Annotation';
import { Attribute } from './Attribute';
import { ComplexTypeItem } from './ComplexTypeItem';

export interface ComplexType {
  name: string;
  baseType: string;
  annotation: Annotation;
  isAbstract: boolean;
  isRestriction: boolean;
  attributes: Attribute[];
  items: ComplexTypeItem[];

  hasItems: () => boolean;
}

export function newComplexType(): ComplexType {
  return {
    name: '',
    baseType: '',
    annotation: newAnnotation(),
    isAbstract: false,
    isRestriction: false,
    attributes: [],
    items: [],
    hasItems() {
      return this.items.length > 0;
    },
  };
}

export const NoComplexType: ComplexType = deepFreeze({ ...newComplexType(), name: 'NoComplexType' });
