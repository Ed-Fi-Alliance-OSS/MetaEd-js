// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  defaultPluginTechVersion,
  versionSatisfies,
  GeneratedOutput,
  GeneratorResult,
  MetaEdEnvironment,
  PluginEnvironment,
} from '@edfi/metaed-core';
import { shouldApplyLicenseHeader } from '@edfi/metaed-plugin-edfi-ods-relational';
import { dataPath, fileNameFor, registerPartials, structurePath, template } from './OdsGeneratorBase';
import { NamespaceEdfiOdsPostgresql } from '../model/Namespace';

export async function generateTables(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const { targetTechnologyVersion } = (metaEd.plugin.get('edfiOdsPostgresql') as PluginEnvironment) || {
    targetTechnologyVersion: defaultPluginTechVersion,
  };
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  metaEd.namespace.forEach((namespace) => {
    const generatedResult: string = template().table({
      tables: (namespace.data.edfiOdsPostgresql as NamespaceEdfiOdsPostgresql).odsSchema.tables,
      useDatetime2: versionSatisfies(targetTechnologyVersion, '>=3.1.1'),
      useLicenseHeader,
      useUtcOnDefaultTimestamp: versionSatisfies(targetTechnologyVersion, '>=7.2.0'),
    });

    results.push({
      name: 'ODS PostgreSQL Tables',
      namespace: namespace.namespaceName,
      folderName: structurePath,
      fileName: fileNameFor('0020', namespace, 'Tables'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOdsPostgresql.TablesGenerator',
    generatedOutput: results,
  };
}

export async function generateForeignKeys(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  metaEd.namespace.forEach((namespace) => {
    const generatedResult: string = template().foreignKey({
      foreignKeys: (namespace.data.edfiOdsPostgresql as NamespaceEdfiOdsPostgresql).odsSchema.foreignKeys,
      useLicenseHeader,
    });

    results.push({
      name: 'ODS PostgreSQL Foreign Keys',
      namespace: namespace.namespaceName,
      folderName: structurePath,
      fileName: fileNameFor('0030', namespace, 'ForeignKeys'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOdsPostgresql.ForeignKeyGenerator',
    generatedOutput: results,
  };
}

export async function generateExtendedProperties(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  metaEd.namespace.forEach((namespace) => {
    const generatedResult: string = template().extendedProperties({
      tables: (namespace.data.edfiOdsPostgresql as NamespaceEdfiOdsPostgresql).odsSchema.tables,
      useLicenseHeader,
    });

    results.push({
      name: 'ODS PostgreSQL Extended Properties',
      namespace: namespace.namespaceName,
      folderName: structurePath,
      fileName: fileNameFor('0050', namespace, 'ExtendedProperties'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOdsPostgresql.ExtendedPropertiesGenerator',
    generatedOutput: results,
  };
}

export async function generateEnumerations(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  metaEd.namespace.forEach((namespace) => {
    if ((namespace.data.edfiOdsPostgresql as NamespaceEdfiOdsPostgresql).odsSchema.enumerationRows.length === 0) return;
    const generatedResult: string = template().enumerationRow({
      enumerationRows: (namespace.data.edfiOdsPostgresql as NamespaceEdfiOdsPostgresql).odsSchema.enumerationRows,
      useLicenseHeader,
    });

    results.push({
      name: 'ODS PostgreSQL Enumerations',
      namespace: namespace.namespaceName,
      folderName: dataPath,
      fileName: fileNameFor('0010', namespace, 'Enumerations'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOdsPostgresql.EnumerationsGenerator',
    generatedOutput: results,
  };
}

export async function generateSchoolYears(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  metaEd.namespace.forEach((namespace) => {
    if ((namespace.data.edfiOdsPostgresql as NamespaceEdfiOdsPostgresql).odsSchema.schoolYearEnumerationRows.length === 0)
      return;
    const generatedResult: string = template().schoolYearEnumerationRow({
      schoolYearEnumerationRows: (namespace.data.edfiOdsPostgresql as NamespaceEdfiOdsPostgresql).odsSchema
        .schoolYearEnumerationRows,
      useLicenseHeader,
    });

    results.push({
      name: 'ODS PostgreSQL School Years',
      namespace: namespace.namespaceName,
      folderName: dataPath,
      fileName: fileNameFor('0020', namespace, 'SchoolYears'),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOdsPostgresql.SchoolYearsGenerator',
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
    generatorName: 'edfiOdsPostgresql.OdsGenerator',
    generatedOutput: results,
  };
}
