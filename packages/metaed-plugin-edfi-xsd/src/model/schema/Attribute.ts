// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Annotation } from './Annotation';
import { newAnnotation } from './Annotation';

export interface Attribute {
  name: string;
  type: string;
  annotation: Annotation;
  isRequired: boolean;
}

export function newAttribute(): Attribute {
  return {
    name: '',
    type: '',
    annotation: newAnnotation(),
    isRequired: false,
  };
}
