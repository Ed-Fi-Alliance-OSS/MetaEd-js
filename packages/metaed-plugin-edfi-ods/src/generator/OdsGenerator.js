// @flow
import { versionSatisfies } from 'metaed-core';
import type { GeneratedOutput, GeneratorResult, MetaEdEnvironment } from 'metaed-core';
import { dataPath, fileNameFor, registerPartials, structurePath, template } from './OdsGeneratorBase';

export async function generateTables(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: Array<GeneratedOutput> = [];

  metaEd.entity.namespaceInfo.forEach(namespaceInfo => {
    const generatedResult: string = template().table({ tables: namespaceInfo.data.edfiOds.ods_Schema.tables });

    results.push({
      name: 'ODS Tables',
      namespace: namespaceInfo.namespace,
      folderName: structurePath,
      fileName: fileNameFor('0020', namespaceInfo, 'Tables'),
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

  metaEd.entity.namespaceInfo.forEach(namespaceInfo => {
    const generatedResult: string = template().foreignKey({
      foreignKeys: namespaceInfo.data.edfiOds.ods_Schema.foreignKeys,
    });

    results.push({
      name: 'ODS Foreign Keys',
      namespace: namespaceInfo.namespace,
      folderName: structurePath,
      fileName: fileNameFor('0030', namespaceInfo, 'ForeignKeys'),
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

  metaEd.entity.namespaceInfo.forEach(namespaceInfo => {
    const generatedResult: string = template().extendedProperties({ tables: namespaceInfo.data.edfiOds.ods_Schema.tables });

    results.push({
      name: 'ODS Extended Properties',
      namespace: namespaceInfo.namespace,
      folderName: structurePath,
      fileName: fileNameFor('0050', namespaceInfo, 'ExtendedProperties'),
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

  metaEd.entity.namespaceInfo.forEach(namespaceInfo => {
    const generatedResult: string = template().enumerationRow({
      enumerationRows: namespaceInfo.data.edfiOds.ods_Schema.enumerationRows,
    });

    results.push({
      name: 'ODS Enumerations',
      namespace: namespaceInfo.namespace,
      folderName: dataPath,
      fileName: fileNameFor('0010', namespaceInfo, 'Enumerations'),
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

  metaEd.entity.namespaceInfo.forEach(namespaceInfo => {
    const generatedResult: string = template().schoolYearEnumerationRow({
      schoolYearEnumerationRows: namespaceInfo.data.edfiOds.ods_Schema.schoolYearEnumerationRows,
    });

    results.push({
      name: 'ODS School Years',
      namespace: namespaceInfo.namespace,
      folderName: dataPath,
      fileName: fileNameFor('0020', namespaceInfo, 'SchoolYears'),
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
    metaEd.entity.namespaceInfo.forEach(namespaceInfo => {
      let resultString: string = '';
      generatorResults.forEach((result: GeneratorResult) => {
        resultString += result.generatedOutput
          .filter((output: GeneratedOutput) => namespaceInfo.namespace === output.namespace)
          .reduce((string: string, output: GeneratedOutput) => string + output.resultString, '');
      });

      results.push({
        name: 'ODS Tables',
        namespace: namespaceInfo.namespace,
        folderName: structurePath,
        fileName: fileNameFor('0004', namespaceInfo, 'Tables'),
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
