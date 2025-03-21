// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { GeneratedOutput, GeneratorResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { shouldApplyLicenseHeader } from '@edfi/metaed-plugin-edfi-ods-relational';
import { fileNameFor, structurePath, template } from './OdsGeneratorBase';

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const prefix: string = '0010';
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  metaEd.namespace.forEach((namespace) => {
    const schemaName: string = namespace.namespaceName.toLowerCase();
    const generatedResult: string = namespace.isExtension
      ? template().extensionSchema({ schemaName, useLicenseHeader })
      : template().coreSchema({ schemaName, useLicenseHeader });

    results.push({
      name: 'ODS PostgreSQL Schema',
      namespace: namespace.namespaceName,
      folderName: structurePath,
      fileName: fileNameFor(prefix, namespace, 'Schemas'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOdsPostgresql.SchemaGenerator',
    generatedOutput: results,
  };
}
