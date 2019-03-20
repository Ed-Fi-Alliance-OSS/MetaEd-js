// @flow
import winston from 'winston';
import { versionSatisfies } from 'metaed-core';
import type { GeneratedOutput, GeneratorResult, MetaEdEnvironment, PluginEnvironment } from 'metaed-core';
import { dataPath, fileNameFor, registerPartials, structurePath, template } from './OdsGeneratorBase';

winston.configure({ transports: [new winston.transports.Console()], format: winston.format.cli() });

export async function generateTables(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const { targetTechnologyVersion } = ((metaEd.plugin.get('edfiOds'): any): PluginEnvironment);

  const results: Array<GeneratedOutput> = [];

  metaEd.namespace.forEach(namespace => {
    const generatedResult: string = template().table({
      tables: namespace.data.edfiOds.ods_Schema.tables,
      useDatetime2: versionSatisfies(targetTechnologyVersion, '>=3.1.1'),
    });

    results.push({
      name: 'ODS Tables',
      namespace: namespace.namespaceName,
      folderName: structurePath,
      fileName: fileNameFor('0020', namespace, 'Tables'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOds.TablesGenerator',
    generatedOutput: results,
  };
}

export async function generateForeignKeys(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: Array<GeneratedOutput> = [];

  metaEd.namespace.forEach(namespace => {
    const generatedResult: string = template().foreignKey({
      foreignKeys: namespace.data.edfiOds.ods_Schema.foreignKeys,
    });

    results.push({
      name: 'ODS Foreign Keys',
      namespace: namespace.namespaceName,
      folderName: structurePath,
      fileName: fileNameFor('0030', namespace, 'ForeignKeys'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOds.ForeignKeyGenerator',
    generatedOutput: results,
  };
}

export async function generateExtendedProperties(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: Array<GeneratedOutput> = [];

  metaEd.namespace.forEach(namespace => {
    const generatedResult: string = template().extendedProperties({ tables: namespace.data.edfiOds.ods_Schema.tables });

    results.push({
      name: 'ODS Extended Properties',
      namespace: namespace.namespaceName,
      folderName: structurePath,
      fileName: fileNameFor('0050', namespace, 'ExtendedProperties'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOds.ExtendedPropertiesGenerator',
    generatedOutput: results,
  };
}

export async function generateEnumerations(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: Array<GeneratedOutput> = [];

  metaEd.namespace.forEach(namespace => {
    const generatedResult: string = template().enumerationRow({
      enumerationRows: namespace.data.edfiOds.ods_Schema.enumerationRows,
    });

    results.push({
      name: 'ODS Enumerations',
      namespace: namespace.namespaceName,
      folderName: dataPath,
      fileName: fileNameFor('0010', namespace, 'Enumerations'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOds.EnumerationsGenerator',
    generatedOutput: results,
  };
}

export async function generateSchoolYears(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: Array<GeneratedOutput> = [];

  metaEd.namespace.forEach(namespace => {
    const generatedResult: string = template().schoolYearEnumerationRow({
      schoolYearEnumerationRows: namespace.data.edfiOds.ods_Schema.schoolYearEnumerationRows,
    });

    results.push({
      name: 'ODS School Years',
      namespace: namespace.namespaceName,
      folderName: dataPath,
      fileName: fileNameFor('0020', namespace, 'SchoolYears'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOds.SchoolYearsGenerator',
    generatedOutput: results,
  };
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  registerPartials();
  const results: Array<GeneratedOutput> = [];

  const tablesResult: GeneratorResult = await generateTables(metaEd);
  const foreignKeysResult: GeneratorResult = await generateForeignKeys(metaEd);
  const extendedPropertiesResult: GeneratorResult = await generateExtendedProperties(metaEd);
  const enumerationsResult: GeneratorResult = await generateEnumerations(metaEd);
  const schoolYearsResult: GeneratorResult = await generateSchoolYears(metaEd);

  const generatorResults: Array<GeneratorResult> = [
    tablesResult,
    foreignKeysResult,
    extendedPropertiesResult,
    enumerationsResult,
    schoolYearsResult,
  ];

  if (versionSatisfies(metaEd.dataStandardVersion, '2.x')) {
    metaEd.namespace.forEach(namespace => {
      let resultString: string = '';
      generatorResults.forEach((result: GeneratorResult) => {
        resultString += result.generatedOutput
          .filter((output: GeneratedOutput) => namespace.namespaceName === output.namespace)
          .reduce((string: string, output: GeneratedOutput) => string + output.resultString, '');
      });

      results.push({
        name: 'ODS Tables',
        namespace: namespace.namespaceName,
        folderName: structurePath,
        fileName: fileNameFor('0004', namespace, 'Tables'),
        resultString,
        resultStream: null,
      });
    });
  } else {
    generatorResults.forEach((result: GeneratorResult) => results.push(...result.generatedOutput));
  }

  return {
    generatorName: 'edfiOds.OdsGenerator',
    generatedOutput: results,
  };
}
