// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPropertyFullName, ReferentialProperty } from '@edfi/metaed-core';
import type { DocumentReferencePaths, DescriptorReferencePath } from '../../../../src/model/api-schema/DocumentPaths';
import type { DocumentPathsMapping } from '../../../../src/model/api-schema/DocumentPathsMapping';
import {
  getReferenceDetails,
  isDescriptorReference,
  isEntityReference,
} from '../../../../src/enhancer/flattening/helpers/ReferenceMapper';

describe('ReferenceMapper helpers', () => {
  it('returns entity reference details when mapping describes a document reference', () => {
    const documentPaths: DocumentReferencePaths = {
      isReference: true,
      isDescriptor: false,
      projectName: 'EdFi',
      resourceName: 'Student',
      referenceJsonPaths: [
        {
          identityJsonPath: '$.studentUniqueId' as any,
          referenceJsonPath: '$.studentReference.studentUniqueId' as any,
          type: 'string' as any,
        },
      ],
      isRequired: true,
      isPartOfIdentity: false,
    };

    const mapping: DocumentPathsMapping = {} as DocumentPathsMapping;
    mapping['EdFi.Sample.Entity.StudentReference' as MetaEdPropertyFullName] = documentPaths;

    const property = {
      fullPropertyName: 'EdFi.Sample.Entity.StudentReference',
      metaEdName: 'StudentReference',
      referencedEntity: { metaEdName: 'Student' },
    } as ReferentialProperty;

    const details = getReferenceDetails(mapping, property);

    expect(details).toBeDefined();
    expect(details && isEntityReference(details)).toBe(true);
    if (details && isEntityReference(details)) {
      expect(details.documentPaths.projectName).toBe('EdFi');
      expect(details.documentPaths.referenceJsonPaths).toHaveLength(1);
    }
  });

  it('identifies descriptor references', () => {
    const descriptorPaths: DescriptorReferencePath = {
      isReference: true,
      isDescriptor: true,
      projectName: 'EdFi',
      resourceName: 'AddressTypeDescriptor',
      path: '$.addresses[*].addressTypeDescriptor' as any,
      type: 'string' as any,
      isRequired: true,
      isPartOfIdentity: false,
    };

    const mapping: DocumentPathsMapping = {} as DocumentPathsMapping;
    mapping['EdFi.School.AddressTypeDescriptor' as MetaEdPropertyFullName] = descriptorPaths;

    const property = {
      fullPropertyName: 'EdFi.School.AddressTypeDescriptor',
      metaEdName: 'AddressTypeDescriptor',
      referencedEntity: { metaEdName: 'AddressTypeDescriptor' },
    } as ReferentialProperty;

    const details = getReferenceDetails(mapping, property);

    expect(details).toBeDefined();
    expect(details && isDescriptorReference(details)).toBe(true);
  });
});
