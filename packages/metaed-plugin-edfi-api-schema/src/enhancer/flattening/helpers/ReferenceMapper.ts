// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type {
  DocumentReferencePaths,
  DescriptorReferencePath,
} from '../../../model/api-schema/DocumentPaths';
import type { DocumentPathsMapping } from '../../../model/api-schema/DocumentPathsMapping';
import type { ReferentialProperty } from '@edfi/metaed-core';

/**
 * Metadata describing a non-descriptor resource reference.
 */
export type EntityReferenceDetails = {
  property: ReferentialProperty;
  documentPaths: DocumentReferencePaths;
};

/**
 * Metadata describing a descriptor reference property.
 */
export type DescriptorReferenceDetails = {
  property: ReferentialProperty;
  documentPaths: DescriptorReferencePath;
};

export type ReferenceDetails = EntityReferenceDetails | DescriptorReferenceDetails;

/**
 * Retrieve reference metadata for the supplied property when available.
 */
export function getReferenceDetails(
  documentPathsMapping: DocumentPathsMapping,
  property: ReferentialProperty,
): ReferenceDetails | undefined {
  const documentPaths = documentPathsMapping[property.fullPropertyName];
  if (documentPaths == null || !documentPaths.isReference) {
    return undefined;
  }

  if (documentPaths.isDescriptor) {
    return {
      property,
      documentPaths,
    };
  }

  return {
    property,
    documentPaths,
  };
}

/**
 * Type guard for descriptor reference metadata.
 */
export function isDescriptorReference(details: ReferenceDetails): details is DescriptorReferenceDetails {
  return details.documentPaths.isDescriptor;
}

/**
 * Type guard for entity reference metadata.
 */
export function isEntityReference(details: ReferenceDetails): details is EntityReferenceDetails {
  return !details.documentPaths.isDescriptor;
}
