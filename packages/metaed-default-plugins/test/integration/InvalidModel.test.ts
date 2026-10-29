// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { executePipeline, getAllEntitiesOfType, Logger, newState, State, ModelBase, SemVer } from '@edfi/metaed-core';
import { edfiHandbookRepositoryForNamespace } from '@edfi/metaed-plugin-edfi-handbook/src/enhancer/EnhancerHelper';
import { defaultPlugins } from '../../src';

jest.setTimeout(60000);

const peer: string = `Domain Entity QaPeer
  documentation "Regression peer."
  integer QaPeerId
    documentation "Peer identifier."
    is part of identity
`;

/** Runs the default pipeline with fresh state; optionally enables generators to check output protection. */
async function lint(
  projectPath: string,
  runGenerators: boolean = false,
  dataStandardVersion: SemVer = '6.1.0',
  targetTechnologyVersion: SemVer = '7.3.0',
): Promise<{ state: State; failure: boolean }> {
  const state: State = newState();
  const modelPackage: string = dataStandardVersion === '4.0.0' ? 'ed-fi-model-4.0' : 'ed-fi-model-6.1';
  state.metaEdConfiguration.projectPaths = [path.resolve('node_modules/@edfi', modelPackage), projectPath];
  state.metaEdConfiguration.artifactDirectory = path.join(projectPath, 'MetaEdOutput');
  state.metaEdConfiguration.projects = [
    {
      description: 'Regression fixture',
      projectName: 'Ed-Fi',
      namespaceName: 'EdFi',
      projectVersion: dataStandardVersion,
      projectExtension: '',
    },
    {
      description: 'Regression fixture',
      projectName: 'Sample',
      namespaceName: 'Sample',
      projectVersion: '1.0.0',
      projectExtension: 'EXTENSION',
    },
  ];
  state.metaEdConfiguration.defaultPluginTechVersion = targetTechnologyVersion;
  state.metaEd.dataStandardVersion = dataStandardVersion;
  state.metaEdPlugins = defaultPlugins();
  state.pipelineOptions = {
    runValidators: true,
    runEnhancers: true,
    runGenerators,
    stopOnValidationFailure: false,
  };
  return executePipeline(state);
}

/** Checks that the schema and its dependent handbook actually resumed processing. */
function expectValid(result: { state: State; failure: boolean }): void {
  expect(result.state.validationFailure).toEqual([]);
  expect(result.state.pipelineFailure).toEqual([]);
  expect(result.failure).toBe(false);
  const records: ModelBase[] = getAllEntitiesOfType(result.state.metaEd, 'domainEntity').filter(
    (entity) => entity.namespace.namespaceName === 'Sample' && entity.metaEdName === 'QaRecord',
  );
  expect(records).toHaveLength(1);
  expect(records[0].data.edfiApiSchema.jsonSchemaForInsert.properties).toHaveProperty('qaRecordId');
  expect(edfiHandbookRepositoryForNamespace(result.state.metaEd, records[0].namespace)?.handbookEntries).toEqual(
    expect.arrayContaining([expect.objectContaining({ entityUuid: records[0].entityUuid, name: 'QaRecord (Sample)' })]),
  );
  expect(result.state.enhancerResults).toContainEqual({
    enhancerName: 'DomainEntityMetaEdHandbookEnhancer',
    success: true,
  });
}

const common: string = `Common QaDetail
  documentation "Regression detail."
  string Value
    documentation "Detail value."
    is part of identity
    max length 64
`;

/** Writes a record whose common reference can be deleted and restored independently. */
function writeCommonReference(projectPath: string, cardinality: string): void {
  fs.writeFileSync(path.join(projectPath, 'QaDetail.metaed'), common);
  fs.writeFileSync(
    path.join(projectPath, 'QaRecord.metaed'),
    `${peer.replace(/QaPeer/g, 'QaRecord')}  common QaDetail
    documentation "Record detail."
    ${cardinality}
`,
  );
}

/** Checks that relational processing and both database consumers actually ran. */
function expectRelationalProcessing(state: State): void {
  expect(state.enhancerResults).toEqual(
    expect.arrayContaining([
      { enhancerName: 'DomainEntityTableEnhancer', success: true },
      { enhancerName: 'SqlServerForeignKeyNamingEnhancer', success: true },
      { enhancerName: 'PostgresqlForeignKeyNamingEnhancer', success: true },
    ]),
  );
  const records: ModelBase[] = getAllEntitiesOfType(state.metaEd, 'domainEntity').filter(
    (entity) => entity.namespace.namespaceName === 'Sample' && entity.metaEdName === 'QaRecord',
  );
  expect(records).toHaveLength(1);
  expect(records[0].data.edfiOdsRelational.odsEntityTable.data).toMatchObject({
    edfiOdsSqlServer: { tableName: 'QaRecord' },
    edfiOdsPostgresql: { tableName: 'QaRecord' },
  });
}

describe('continuous linting with invalid models', (): void => {
  let projectPath: string;
  let errors: string[];

  beforeEach((): void => {
    projectPath = fs.mkdtempSync(path.join(os.tmpdir(), 'metaed-invalid-model-'));
    errors = [];
    jest.spyOn(Logger, 'error').mockImplementation((message: string): void => {
      errors.push(message);
    });
    jest.spyOn(Logger, 'info').mockImplementation((): void => {});
    fs.writeFileSync(path.join(projectPath, 'QaPeer.metaed'), peer);
  });

  afterEach((): void => {
    jest.restoreAllMocks();
    fs.rmSync(projectPath, { recursive: true, force: true });
  });

  it.each(['is optional', 'is optional collection'])(
    'recovers after deleting a %s reference',
    async (cardinality: string) => {
      fs.writeFileSync(
        path.join(projectPath, 'QaRecord.metaed'),
        `Domain Entity QaRecord
  documentation "Regression record."
  integer QaRecordId
    documentation "Record identifier."
    is part of identity
  domain entity QaPeer
    documentation "Related peer."
    ${cardinality}
`,
      );
      expectValid(await lint(projectPath));
      expect(errors).toEqual([]);
      fs.unlinkSync(path.join(projectPath, 'QaPeer.metaed'));
      const invalid: { state: State; failure: boolean } = await lint(projectPath);
      expect(invalid.failure).toBe(true);
      expect(invalid.state.pipelineFailure).toEqual([]);
      expect(invalid.state.validationFailure).toHaveLength(1);
      expect(invalid.state.validationFailure[0]).toMatchObject({
        category: 'error',
        validatorName: 'DomainEntityPropertyMustMatchADomainEntity',
        message:
          "Domain entity property 'QaPeer' does not match any declared Domain Entity or Domain Entity Subclass in namespace Sample.",
        fileMap: { fullPath: path.join(projectPath, 'QaRecord.metaed'), lineNumber: 6 },
      });
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain(invalid.state.validationFailure[0].message);
      errors.length = 0;
      fs.writeFileSync(path.join(projectPath, 'QaPeer.metaed'), peer);
      expectValid(await lint(projectPath));
      expect(errors).toEqual([]);
    },
  );

  it('recovers after deleting an association identity reference', async () => {
    fs.writeFileSync(path.join(projectPath, 'QaRecord.metaed'), peer.replace(/QaPeer/g, 'QaRecord'));
    const linkPath: string = path.join(projectPath, 'QaLink.metaed');
    fs.writeFileSync(
      linkPath,
      `Association QaLink
  documentation "Regression link."
  domain entity QaRecord
    documentation "Linked record."
  domain entity QaPeer
    documentation "Linked peer."
`,
    );
    expectValid(await lint(projectPath));
    expect(errors).toEqual([]);
    fs.unlinkSync(path.join(projectPath, 'QaPeer.metaed'));
    const invalid: { state: State; failure: boolean } = await lint(projectPath);
    expect(invalid.failure).toBe(true);
    expect(invalid.state.pipelineFailure).toEqual([]);
    expect(invalid.state.validationFailure).toHaveLength(1);
    expect(invalid.state.validationFailure[0]).toMatchObject({
      category: 'error',
      validatorName: 'DomainEntityPropertyMustMatchADomainEntity',
      message:
        "Domain entity property 'QaPeer' does not match any declared Domain Entity or Domain Entity Subclass in namespace Sample.",
      fileMap: { fullPath: linkPath, lineNumber: 5 },
    });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain(invalid.state.validationFailure[0].message);
    errors.length = 0;
    fs.writeFileSync(path.join(projectPath, 'QaPeer.metaed'), peer);
    expectValid(await lint(projectPath));
    expect(errors).toEqual([]);
  });

  it('does not generate schema-dependent artifacts or write output for an invalid model', async () => {
    const recordPath: string = path.join(projectPath, 'QaRecord.metaed');
    fs.writeFileSync(recordPath, peer.replace(/QaPeer/g, 'QaRecord'));
    expectValid(await lint(projectPath));
    fs.writeFileSync(recordPath, fs.readFileSync(recordPath, 'utf8').replace('is part of identity', 'is required'));
    const invalid: { state: State; failure: boolean } = await lint(projectPath, true);
    expect(invalid.failure).toBe(true);
    expect(invalid.state.pipelineFailure).toEqual([]);
    expect(invalid.state.validationFailure).toHaveLength(1);
    expect(invalid.state.validationFailure[0].validatorName).toBe('DomainEntityMustContainAnIdentity');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain(invalid.state.validationFailure[0].message);
    expect(fs.existsSync(path.join(projectPath, 'MetaEdOutput'))).toBe(false);
  });

  it('recovers after removing and restoring an identity', async () => {
    const record: string = peer.replace(/QaPeer/g, 'QaRecord');
    const recordPath: string = path.join(projectPath, 'QaRecord.metaed');
    fs.writeFileSync(recordPath, record);
    expectValid(await lint(projectPath));
    expect(errors).toEqual([]);
    fs.writeFileSync(recordPath, record.replace('is part of identity', 'is required'));
    const invalid: { state: State; failure: boolean } = await lint(projectPath);
    expect(invalid.failure).toBe(true);
    expect(invalid.state.pipelineFailure).toEqual([]);
    expect(invalid.state.validationFailure).toHaveLength(1);
    expect(invalid.state.validationFailure[0]).toMatchObject({
      category: 'error',
      validatorName: 'DomainEntityMustContainAnIdentity',
      message: 'Domain Entity QaRecord does not have an identity specified.',
      fileMap: { fullPath: recordPath, lineNumber: 1 },
    });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain(invalid.state.validationFailure[0].message);
    errors.length = 0;
    fs.writeFileSync(recordPath, record);
    expectValid(await lint(projectPath));
    expect(errors).toEqual([]);
  });

  describe.each([
    ['4.0.0', '6.1.0'],
    ['6.1.0', '7.3.0'],
  ])('common references with DS %s / ODS %s', (dataStandardVersion: SemVer, targetTechnologyVersion: SemVer) => {
    it.each<[string, boolean]>([
      ['is optional', false],
      ['is required', false],
      ['is optional collection', true],
      ['is required collection', true],
    ])('recovers after deleting a common referenced as %s', async (cardinality: string, isCollection: boolean) => {
      writeCommonReference(projectPath, cardinality);
      const valid: { state: State; failure: boolean } = await lint(
        projectPath,
        false,
        dataStandardVersion,
        targetTechnologyVersion,
      );
      expectValid(valid);
      expectRelationalProcessing(valid.state);
      expect(errors).toEqual([]);
      fs.unlinkSync(path.join(projectPath, 'QaDetail.metaed'));
      const invalid: { state: State; failure: boolean } = await lint(
        projectPath,
        false,
        dataStandardVersion,
        targetTechnologyVersion,
      );
      expect(invalid.failure).toBe(true);
      expect(invalid.state.pipelineFailure).toEqual([]);
      // The existing collection validator also reports the unresolved target's missing identity.
      expect(invalid.state.validationFailure.map((failure) => failure.validatorName)).toEqual(
        isCollection
          ? ['CommonPropertyMustMatchACommon', 'CommonPropertyCollectionTargetMustContainIdentity']
          : ['CommonPropertyMustMatchACommon'],
      );
      expect(invalid.state.validationFailure[0]).toMatchObject({
        category: 'error',
        validatorName: 'CommonPropertyMustMatchACommon',
        message: "Common property 'QaDetail' does not match any declared Common or Common Subclass in namespace Sample.",
        fileMap: { fullPath: path.join(projectPath, 'QaRecord.metaed'), lineNumber: 6 },
        sourceMap: { column: 9, tokenText: 'QaDetail' },
      });
      expect(invalid.state.enhancerResults).not.toContainEqual({
        enhancerName: 'DomainEntityTableEnhancer',
        success: true,
      });
      expect(errors).toHaveLength(invalid.state.validationFailure.length);
      invalid.state.validationFailure.forEach((failure, index) => expect(errors[index]).toContain(failure.message));
      errors.length = 0;
      fs.writeFileSync(path.join(projectPath, 'QaDetail.metaed'), common);
      const restored: { state: State; failure: boolean } = await lint(
        projectPath,
        false,
        dataStandardVersion,
        targetTechnologyVersion,
      );
      expectValid(restored);
      expectRelationalProcessing(restored.state);
      expect(errors).toEqual([]);
    });
  });

  it('reports downstream ODS/API validation errors when a common reference is missing', async () => {
    writeCommonReference(projectPath, 'is optional');
    fs.unlinkSync(path.join(projectPath, 'QaDetail.metaed'));
    fs.writeFileSync(
      path.join(projectPath, 'QaSubclass.metaed'),
      `Domain Entity QaSubclass based on QaPeer
  documentation "Unsupported ODS subclass."
  integer Extra
    documentation "Extra value."
    is optional
`,
    );
    const invalid: { state: State; failure: boolean } = await lint(projectPath);
    expect(invalid.failure).toBe(true);
    expect(invalid.state.pipelineFailure).toEqual([]);
    expect(invalid.state.validationFailure.map((failure) => failure.validatorName)).toEqual([
      'CommonPropertyMustMatchACommon',
      'SubclassingAnyDomainEntityExceptEducationOrganizationIsUnsupported',
    ]);
    expect(errors).toHaveLength(2);
    invalid.state.validationFailure.forEach((failure, index) => expect(errors[index]).toContain(failure.message));
  });

  it('preserves existing output and skips relational generators for a missing common', async () => {
    writeCommonReference(projectPath, 'is optional');
    fs.unlinkSync(path.join(projectPath, 'QaDetail.metaed'));
    const outputPath: string = path.join(projectPath, 'MetaEdOutput');
    fs.mkdirSync(outputPath);
    const markerPath: string = path.join(outputPath, 'previous-output.txt');
    fs.writeFileSync(markerPath, 'previous successful output');
    const before: fs.Stats = fs.statSync(markerPath);
    const invalid: { state: State; failure: boolean } = await lint(projectPath, true);
    expect(invalid.failure).toBe(true);
    expect(invalid.state.pipelineFailure).toEqual([]);
    expect(invalid.state.validationFailure).toHaveLength(1);
    expect(invalid.state.validationFailure[0].validatorName).toBe('CommonPropertyMustMatchACommon');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain(invalid.state.validationFailure[0].message);
    expect(invalid.state.generatorResults.map((result) => result.generatorName)).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/^(edfiOds|edfiSqlDataDictionary)/)]),
    );
    expect(fs.readdirSync(outputPath)).toEqual(['previous-output.txt']);
    expect(fs.readFileSync(markerPath, 'utf8')).toBe('previous successful output');
    expect(fs.statSync(markerPath).mtimeMs).toBe(before.mtimeMs);
  });

  it('still generates relational artifacts when validation reports only warnings', async () => {
    writeCommonReference(projectPath, 'is optional');
    fs.appendFileSync(
      path.join(projectPath, 'QaRecord.metaed'),
      `  string Discriminator
    documentation "Triggers an ODS warning."
    is optional
    max length 20
`,
    );
    const result: { state: State; failure: boolean } = await lint(projectPath, true);
    expect(result.failure).toBe(false);
    expect(result.state.pipelineFailure).toEqual([]);
    expect(result.state.validationFailure).toHaveLength(1);
    expect(result.state.validationFailure[0]).toMatchObject({
      category: 'warning',
      validatorName: 'BlockPropertiesNamedDiscriminator',
    });
    expect(errors).toEqual([]);
    expectRelationalProcessing(result.state);
    expect(result.state.generatorResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          generatorName: 'edfiOdsSqlServer.OdsGenerator',
          generatedOutput: expect.arrayContaining([
            expect.objectContaining({ resultString: expect.stringContaining('CREATE TABLE [sample].[QaRecord]') }),
          ]),
        }),
        expect.objectContaining({
          generatorName: 'edfiOdsPostgresql.OdsGenerator',
          generatedOutput: expect.arrayContaining([
            expect.objectContaining({ resultString: expect.stringContaining('CREATE TABLE sample.QaRecord') }),
          ]),
        }),
      ]),
    );
    expect(fs.readdirSync(path.join(projectPath, 'MetaEdOutput')).length).toBeGreaterThan(0);
  });
});
