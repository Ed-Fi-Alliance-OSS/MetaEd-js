// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import {
  MetaEdEnvironment,
  Namespace,
  GeneratorResult,
  GeneratedOutput,
  versionSatisfies,
  PluginEnvironment,
} from '@edfi/metaed-core';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { Aggregate } from '../../model/domainMetadata/Aggregate';
import { registerPartials, template } from './DomainMetadataGeneratorBase';
import { deriveLogicalNameFromProjectName } from '../../model/apiModel/SchemaDefinition';
import { SchemaDefinition, newSchemaDefinition } from '../../model/apiModel/SchemaDefinition';

function fileName(projectPrefix: string): string {
  const prefix: string = !projectPrefix ? '' : `-${projectPrefix}`;
  return `DomainMetadata${prefix}.xml`;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const generatorName = 'edfiOdsApi.DomainMetadataGenerator';
  const results: GeneratedOutput[] = [];

  if (!versionSatisfies((metaEd.plugin.get('edfiOdsApi') as PluginEnvironment).targetTechnologyVersion, '<6.0.0')) {
    return { generatorName, generatedOutput: results };
  }

  registerPartials();

  metaEd.namespace.forEach((namespace: Namespace) => {
    const schema: SchemaDefinition = {
      ...newSchemaDefinition(),
      logicalName: deriveLogicalNameFromProjectName(namespace.projectName),
      physicalName: namespace.namespaceName.toLowerCase(),
    };
    const aggregates = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).aggregates.filter(
      (a: Aggregate) => !a.isExtension,
    );
    let formattedGeneratedResult = '';

    if (namespace.isExtension) {
      const aggregateExtensions = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).aggregates.filter(
        (a: Aggregate) => a.isExtension,
      );
      if (aggregates.length === 0 && aggregateExtensions.length === 0) return;

      const extensionInput = {
        schema,
        aggregates: R.sortBy(R.prop('root'), aggregates),
        aggregateExtensions: R.sortBy(R.prop('root'), aggregateExtensions),
      };
      formattedGeneratedResult = template().domainMetadataExtension(extensionInput);
    } else {
      const coreInput = {
        schema,
        aggregates: R.sortBy(R.prop('root'), aggregates),
      };
      formattedGeneratedResult = template().domainMetadata(coreInput);
    }

    results.push({
      name: 'Domain Metadata',
      namespace: namespace.namespaceName,
      folderName: 'ApiMetadata',
      fileName: fileName(namespace.projectExtension),
      resultString: formattedGeneratedResult,
      resultStream: null,
    });
  });

  return {
    generatorName,
    generatedOutput: results,
  };
}
