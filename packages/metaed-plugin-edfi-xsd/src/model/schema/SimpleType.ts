// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { Annotation } from './Annotation';
import { newAnnotation } from './Annotation';

export interface SimpleType {
  name: string;
  baseType: string;
  annotation: Annotation;
}

export function newSimpleType(): SimpleType {
  return {
    name: '',
    baseType: '',
    annotation: newAnnotation(),
  };
}

export const NoSimpleType: SimpleType = deepFreeze({ ...newSimpleType(), name: 'NoSimpleType' });
