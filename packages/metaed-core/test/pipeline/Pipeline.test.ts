// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { executePipeline } from '../../src/pipeline/Pipeline';
import { newState, State } from '../../src/State';
import { MetaEdPlugin, newMetaEdPlugin } from '../../src/plugin/MetaEdPlugin';
import { ValidationFailure } from '../../src/validator/ValidationFailure';
import { Logger } from '../../src/Logger';

/** Creates a diagnostic independent of model semantics for testing pipeline control flow. */
function diagnostic(category: 'error' | 'warning'): ValidationFailure {
  return { validatorName: 'test', category, message: 'Test diagnostic', sourceMap: null, fileMap: null };
}

/** Records actual validator, enhancer and generator invocations without mocking the pipeline. */
function plugin(shortName: string, calls: string[], diagnostics: ValidationFailure[] = []): MetaEdPlugin {
  return {
    validator: [
      () => {
        calls.push(`${shortName}.validate`);
        return diagnostics;
      },
    ],
    enhancer: [
      () => {
        calls.push(`${shortName}.enhance`);
        return { enhancerName: shortName, success: true };
      },
    ],
    generator: [
      async () => {
        calls.push(`${shortName}.generate`);
        return {
          generatorName: shortName,
          generatedOutput: [
            {
              name: shortName,
              namespace: '',
              folderName: '',
              fileName: `${shortName}.txt`,
              resultString: 'generated',
              resultStream: null,
            },
          ],
        };
      },
    ],
    shortName,
  };
}

describe('plugin valid-model requirements', (): void => {
  let root: string;
  let state: State;
  let calls: string[];

  beforeEach((): void => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'metaed-pipeline-'));
    fs.writeFileSync(
      path.join(root, 'Record.metaed'),
      'Domain Entity Record\n documentation "Record."\n integer Id\n documentation "Identifier."\n is part of identity\n',
    );
    state = newState();
    state.metaEdConfiguration.projectPaths = [root];
    state.metaEdConfiguration.projects = [
      {
        description: 'Regression fixture',
        projectName: 'Ed-Fi',
        namespaceName: 'EdFi',
        projectExtension: '',
        projectVersion: '6.1.0',
      },
    ];
    state.metaEdConfiguration.artifactDirectory = path.join(root, 'MetaEdOutput');
    state.pipelineOptions = { runValidators: true, runEnhancers: true, runGenerators: true, stopOnValidationFailure: false };
    calls = [];
    jest.spyOn(Logger, 'error').mockImplementation((): void => {});
    jest.spyOn(Logger, 'info').mockImplementation((): void => {});
    jest.spyOn(Logger, 'warn').mockImplementation((): void => {});
  });

  afterEach((): void => {
    jest.restoreAllMocks();
    fs.rmSync(root, { recursive: true, force: true });
  });

  it.each(['earlier', 'own'])(
    'skips artifact processing for an %s error while continuing validation',
    async (source: string) => {
      state.metaEdPlugins = [
        plugin('earlier', calls, source === 'earlier' ? [diagnostic('error')] : []),
        { ...plugin('guarded', calls, source === 'own' ? [diagnostic('error')] : []), requiresValidModel: true },
        plugin('later', calls, [diagnostic('warning')]),
      ];
      const result: { state: State; failure: boolean } = await executePipeline(state);
      expect(result.failure).toBe(true);
      expect(state.pipelineFailure).toEqual([]);
      expect(state.validationFailure).toEqual([diagnostic('error'), diagnostic('warning')]);
      expect(calls).toMatchInlineSnapshot(`
      Array [
        "earlier.validate",
        "earlier.enhance",
        "earlier.generate",
        "guarded.validate",
        "later.validate",
        "later.enhance",
        "later.generate",
      ]
    `);
      expect(fs.existsSync(state.metaEdConfiguration.artifactDirectory)).toBe(false);
    },
  );

  it.each([false, true])(
    'preserves existing output when present=%s even after other generators ran',
    async (existing: boolean) => {
      const output: string = state.metaEdConfiguration.artifactDirectory;
      const marker: string = path.join(output, 'marker.txt');
      if (existing) {
        fs.mkdirSync(output);
        fs.writeFileSync(marker, 'previous output');
      }
      state.metaEdPlugins = [
        plugin('earlier', calls, [diagnostic('error')]),
        { ...plugin('guarded', calls), requiresValidModel: true },
      ];
      expect((await executePipeline(state)).failure).toBe(true);
      expect(state.generatorResults).toHaveLength(1);
      if (existing) {
        expect(fs.readdirSync(output)).toEqual(['marker.txt']);
        expect(fs.readFileSync(marker, 'utf8')).toBe('previous output');
      } else {
        expect(fs.existsSync(output)).toBe(false);
      }
    },
  );

  it.each(['valid', 'warning'])('processes a %s model normally', async (input: string) => {
    state.metaEdPlugins = [
      { ...plugin('guarded', calls, input === 'warning' ? [diagnostic('warning')] : []), requiresValidModel: true },
    ];
    expect((await executePipeline(state)).failure).toBe(false);
    expect(calls).toEqual(['guarded.validate', 'guarded.enhance', 'guarded.generate']);
    expect(fs.readFileSync(path.join(state.metaEdConfiguration.artifactDirectory, 'guarded.txt'), 'utf8')).toBe('generated');
    expect(state.validationFailure).toEqual(input === 'warning' ? [diagnostic('warning')] : []);
  });

  it.each(['omitted', 'false'])(
    'preserves continue-on-error behavior when requirement is %s',
    async (requirement: string) => {
      const unguarded: MetaEdPlugin = plugin('unguarded', calls, [diagnostic('error')]);
      if (requirement === 'false') unguarded.requiresValidModel = false;
      state.metaEdPlugins = [unguarded];
      expect((await executePipeline(state)).failure).toBe(false);
      expect(calls).toEqual(['unguarded.validate', 'unguarded.enhance', 'unguarded.generate']);
    },
  );

  it('retains the existing stop-on-validation-failure behavior', async () => {
    state.pipelineOptions.stopOnValidationFailure = true;
    state.metaEdPlugins = [
      { ...plugin('guarded', calls, [diagnostic('error')]), requiresValidModel: true },
      plugin('later', calls),
    ];
    expect((await executePipeline(state)).failure).toBe(true);
    expect(calls).toEqual(['guarded.validate']);
  });

  it.each([
    [false, false],
    [false, true],
    [true, false],
  ])('respects enhancer=%s and generator=%s options', async (runEnhancers: boolean, runGenerators: boolean) => {
    state.pipelineOptions.runEnhancers = runEnhancers;
    state.pipelineOptions.runGenerators = runGenerators;
    state.metaEdPlugins = [{ ...plugin('guarded', calls), requiresValidModel: true }];
    expect((await executePipeline(state)).failure).toBe(false);
    expect(calls).toEqual([
      'guarded.validate',
      ...(runEnhancers ? ['guarded.enhance'] : []),
      ...(runGenerators ? ['guarded.generate'] : []),
    ]);
  });

  it('honors accumulated errors even when validators are disabled', async () => {
    state.validationFailure.push(diagnostic('error'));
    state.pipelineOptions.runValidators = false;
    state.metaEdPlugins = [{ ...plugin('guarded', calls), requiresValidModel: true }];
    expect((await executePipeline(state)).failure).toBe(true);
    expect(calls).toEqual([]);
  });

  it('defaults the factory requirement to false', (): void => {
    expect(newMetaEdPlugin().requiresValidModel).toBe(false);
  });
});
