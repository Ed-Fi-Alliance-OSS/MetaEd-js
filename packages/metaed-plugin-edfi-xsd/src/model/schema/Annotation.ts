// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

export interface Annotation {
  documentation: string;
  typeGroup: string;
  descriptorName: string;

  hasTypeGroup: () => boolean;
  hasDescriptorName: () => boolean;
  hasAppInfo: () => boolean;
}

export function newAnnotation(): Annotation {
  return {
    documentation: '',
    typeGroup: '',
    descriptorName: '',
    hasTypeGroup() {
      return !!this.typeGroup;
    },
    hasDescriptorName() {
      return !!this.descriptorName;
    },
    hasAppInfo() {
      return this.hasTypeGroup() || this.hasDescriptorName();
    },
  };
}
