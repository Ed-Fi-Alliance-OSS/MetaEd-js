import {
  orderByProp,
  GeneratedOutput,
  GeneratorResult,
  MetaEdEnvironment,
  PluginEnvironment,
  versionSatisfies,
} from '@edfi/metaed-core';
import { shouldApplyLicenseHeader, tableEntities, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { fileNameFor, structurePath, template } from './OdsGeneratorBase';

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsPostgresql') as PluginEnvironment;
  const results: GeneratedOutput[] = [];

  if (versionSatisfies(targetTechnologyVersion, '>=7.1.0')) {
    const prefix: string = '1410';
    const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

    metaEd.namespace.forEach((namespace) => {
      const tables: Table[] = orderByProp('tableId')([...tableEntities(metaEd, namespace).values()]);

      if (tables.length > 0) {
        const generatedResult: string = template().createEducationOrganizationAuthorizationIndexesGenerator({
          tables,
          useLicenseHeader,
        });

        results.push({
          name: 'ODS PostgreSQL Create EducationOrganization Authorization Indexes Generator',
          namespace: namespace.namespaceName,
          folderName: structurePath,
          fileName: fileNameFor(prefix, namespace, 'CreateIndex-EdOrgIdsRelationship-AuthPerformance'),
          resultString: generatedResult,
          resultStream: null,
        });
      }
    });
  }
  return {
    generatorName: 'edfiOdsPostgresql.CreateEducationOrganizationAuthorizationIndexesGenerator',
    generatedOutput: results,
  };
}
