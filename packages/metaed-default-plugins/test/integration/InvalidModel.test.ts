// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { executePipeline, getAllEntitiesOfType, Logger, newState, State, ModelBase } from '@edfi/metaed-core';
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
async function lint(projectPath: string, runGenerators: boolean = false): Promise<{ state: State; failure: boolean }> {
  const state: State = newState();
  state.metaEdConfiguration.projectPaths = [path.resolve('node_modules/@edfi/ed-fi-model-6.1'), projectPath];
  state.metaEdConfiguration.projects = [
    {
      description: 'Regression fixture',
      projectName: 'Ed-Fi',
      namespaceName: 'EdFi',
      projectVersion: '6.1.0',
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
  state.metaEdConfiguration.defaultPluginTechVersion = '7.3.0';
  state.metaEd.dataStandardVersion = '6.1.0';
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
  expect(result.failure).toBe(false);
  expect(result.state.validationFailure).toEqual([]);
  expect(result.state.pipelineFailure).toEqual([]);
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
});
