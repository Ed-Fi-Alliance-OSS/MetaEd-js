// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Annotation } from './Annotation';
import { SchemaSection } from './SchemaSection';
import { newAnnotation } from './Annotation';

export interface SchemaContainer {
  isExtension: boolean;
  schemaAnnotation: Annotation;
  sections: SchemaSection[];
  schemaVersion: string;
}

export function newSchemaContainer(): SchemaContainer {
  return {
    isExtension: false,
    schemaAnnotation: newAnnotation(),
    sections: [],
    schemaVersion: '',
  };
}
