import { versionSatisfies, GeneratedOutput, GeneratorResult, MetaEdEnvironment, PluginEnvironment } from '@edfi/metaed-core';
import { shouldApplyLicenseHeader } from '@edfi/metaed-plugin-edfi-ods-relational';
import { dataPath, fileNameFor, registerPartials, structurePath, template } from './OdsGeneratorBase';

export async function generateTables(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const { targetTechnologyVersion } = (metaEd.plugin.get('edfiOdsSqlServer') as PluginEnvironment) || {
    targetTechnologyVersion: '3.0.0',
  };
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  const results: GeneratedOutput[] = [];

  metaEd.namespace.forEach((namespace) => {
    const generatedResult: string = template().table({
      tables: namespace.data.edfiOdsSqlServer.odsSchema.tables,
      useDatetime2: versionSatisfies(targetTechnologyVersion, '>=3.1.1'),
      useLicenseHeader,
    });

    results.push({
      name: 'ODS SQL Server Tables',
      namespace: namespace.namespaceName,
      folderName: structurePath,
      fileName: fileNameFor('0020', namespace, 'Tables'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOdsSqlServer.TablesGenerator',
    generatedOutput: results,
  };
}

export async function generateForeignKeys(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  metaEd.namespace.forEach((namespace) => {
    const generatedResult: string = template().foreignKey({
      foreignKeys: namespace.data.edfiOdsSqlServer.odsSchema.foreignKeys,
      useLicenseHeader,
    });

    results.push({
      name: 'ODS SQL Server Foreign Keys',
      namespace: namespace.namespaceName,
      folderName: structurePath,
      fileName: fileNameFor('0030', namespace, 'ForeignKeys'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOdsSqlServer.ForeignKeyGenerator',
    generatedOutput: results,
  };
}

export async function generateExtendedProperties(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  metaEd.namespace.forEach((namespace) => {
    const generatedResult: string = template().extendedProperties({
      tables: namespace.data.edfiOdsSqlServer.odsSchema.tables,
      useLicenseHeader,
    });

    results.push({
      name: 'ODS SQL Server Extended Properties',
      namespace: namespace.namespaceName,
      folderName: structurePath,
      fileName: fileNameFor('0050', namespace, 'ExtendedProperties'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOdsSqlServer.ExtendedPropertiesGenerator',
    generatedOutput: results,
  };
}

export async function generateEnumerations(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  metaEd.namespace.forEach((namespace) => {
    const generatedResult: string = template().enumerationRow({
      enumerationRows: namespace.data.edfiOdsSqlServer.odsSchema.enumerationRows,
      useLicenseHeader,
    });

    results.push({
      name: 'ODS SQL Server Enumerations',
      namespace: namespace.namespaceName,
      folderName: dataPath,
      fileName: fileNameFor('0010', namespace, 'Enumerations'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOdsSqlServer.EnumerationsGenerator',
    generatedOutput: results,
  };
}

export async function generateSchoolYears(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  metaEd.namespace.forEach((namespace) => {
    const generatedResult: string = template().schoolYearEnumerationRow({
      schoolYearEnumerationRows: namespace.data.edfiOdsSqlServer.odsSchema.schoolYearEnumerationRows,
      useLicenseHeader,
    });

    results.push({
      name: 'ODS SQL Server School Years',
      namespace: namespace.namespaceName,
      folderName: dataPath,
      fileName: fileNameFor('0020', namespace, 'SchoolYears'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOdsSqlServer.SchoolYearsGenerator',
    generatedOutput: results,
  };
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  registerPartials();
  const results: GeneratedOutput[] = [];

  const tablesResult: GeneratorResult = await generateTables(metaEd);
  const foreignKeysResult: GeneratorResult = await generateForeignKeys(metaEd);
  const extendedPropertiesResult: GeneratorResult = await generateExtendedProperties(metaEd);
  const enumerationsResult: GeneratorResult = await generateEnumerations(metaEd);
  const schoolYearsResult: GeneratorResult = await generateSchoolYears(metaEd);

  const generatorResults: GeneratorResult[] = [
    tablesResult,
    foreignKeysResult,
    extendedPropertiesResult,
    enumerationsResult,
    schoolYearsResult,
  ];

  generatorResults.forEach((result: GeneratorResult) => results.push(...result.generatedOutput));

  return {
    generatorName: 'edfiOdsSqlServer.OdsGenerator',
    generatedOutput: results,
  };
}
