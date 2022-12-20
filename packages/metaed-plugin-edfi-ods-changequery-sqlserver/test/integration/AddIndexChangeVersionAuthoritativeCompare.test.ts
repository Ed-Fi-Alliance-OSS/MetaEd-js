import { promises as fs } from 'node:fs';
import * as R from 'ramda';
import path from 'path';
import { exec } from 'child_process';
import { GeneratedOutput, State } from '@edfi/metaed-core';
import {
  buildMetaEd,
  buildParseTree,
  loadFileIndex,
  loadFiles,
  loadPlugins,
  initializeNamespaces,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  runGenerators,
  validateConfiguration,
  walkBuilders,
} from '@edfi/metaed-core';
import { PLUGIN_NAME } from '../../src/PluginHelper';

jest.setTimeout(40000);

describe('when generating add index changeversion and comparing to ODS/API 5.0 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/add-index-changeversion');
  const authoritativeCoreFilename = 'AddIndexChangeVersion-v5.0-Authoritative.sql';
  const generatedCoreFilename = 'AddIndexChangeVersion-v5.0.sql';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsSqlServer: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsChangeQuery: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '5.0.0',
        },
      },
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2a/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.2.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
        manifest.shortName === 'edfiOdsChangeQuery' ||
        manifest.shortName === PLUGIN_NAME,
    );
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runEnhancers(pluginManifest, state);
      await runGenerators(pluginManifest, state);
    }

    generatedOutput = R.head(
      R.head(
        state.generatorResults.filter((x) => x.generatorName === `${PLUGIN_NAME}.AddIndexChangeVersionForTableGenerator`),
      ).generatedOutput,
    );

    await fs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedOutput.resultString);
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeCoreFilename);
    const generated: string = path.resolve(artifactPath, generatedCoreFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritative} ${generated}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating add index changeversion and comparing to ODS/API 6.0.0 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/add-index-changeversion');
  const authoritativeCoreFilename = 'AddIndexChangeVersion-v6.0-Authoritative.sql';
  const generatedCoreFilename = 'AddIndexChangeVersion-v6.0.sql';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiOdsSqlServer: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiOdsChangeQuery: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '6.0.0',
        },
      },
      projectPaths: ['./node_modules/@edfi/ed-fi-model-4.0a/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '4.0.0-a',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '4.0.0-a';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
        manifest.shortName === 'edfiOdsChangeQuery' ||
        manifest.shortName === PLUGIN_NAME,
    );
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runEnhancers(pluginManifest, state);
      await runGenerators(pluginManifest, state);
    }

    generatedOutput = R.head(
      R.head(
        state.generatorResults.filter((x) => x.generatorName === `${PLUGIN_NAME}.AddIndexChangeVersionForTableGenerator`),
      ).generatedOutput,
    );

    await fs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedOutput.resultString);
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeCoreFilename);
    const generated: string = path.resolve(artifactPath, generatedCoreFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritative} ${generated}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});
