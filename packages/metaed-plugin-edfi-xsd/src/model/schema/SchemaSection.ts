// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Annotation } from './Annotation';
import { ComplexType } from './ComplexType';
import { SimpleType } from './SimpleType';
import { newAnnotation } from './Annotation';

export interface SchemaSection {
  sectionAnnotation: Annotation;
  complexTypes: ComplexType[];
  simpleTypes: SimpleType[];
}

export function newSchemaSection(): SchemaSection {
  return {
    sectionAnnotation: newAnnotation(),
    complexTypes: [],
    simpleTypes: [],
  };
}
