import { GeneratedOutput, GeneratorResult, MetaEdEnvironment, versionSatisfies } from 'metaed-core';
import { shouldApplyLicenseHeader } from 'metaed-plugin-edfi-ods-relational';
import { fileNameFor, structurePath, template } from './OdsGeneratorBase';

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const prefix: string = versionSatisfies(metaEd.dataStandardVersion, '2.x') ? '0001' : '0010';
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  metaEd.namespace.forEach(namespace => {
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
