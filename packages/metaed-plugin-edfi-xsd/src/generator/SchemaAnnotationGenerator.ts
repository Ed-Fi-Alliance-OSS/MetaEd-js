// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  GeneratorResult,
  GeneratedOutput,
  Namespace,
  getAllEntitiesOfType,
  orderByProp,
} from '@edfi/metaed-core';
import { formatAndPrependHeader, template } from './XsdGeneratorBase';

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const generatorName = 'edfiXsd.SchemaAnnotationGenerator';
  const generatedOutput: GeneratedOutput[] = [];

  const descriptors: { name: string }[] = orderByProp('name')(
    getAllEntitiesOfType(metaEd, 'descriptor').map((x) => ({ name: x.data.edfiXsd.xsdDescriptorName })),
  );
  const formattedGeneratedResult = formatAndPrependHeader(template().schemaAnnotation({ descriptors }));

  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  generatedOutput.push({
    name: 'Core XSD Schema Annotation',
    namespace: coreNamespace ? coreNamespace.namespaceName : '',
    folderName: 'XSD',
    fileName: 'SchemaAnnotation.xsd',
    resultString: formattedGeneratedResult,
    resultStream: null,
  });

  return {
    generatorName,
    generatedOutput,
  };
}
