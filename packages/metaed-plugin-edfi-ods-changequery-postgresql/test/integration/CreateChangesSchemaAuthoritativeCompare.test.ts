import R from 'ramda';
import path from 'path';
import ffs from 'final-fs';
import { exec } from 'child_process';
import { GeneratedOutput, State } from 'metaed-core';
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
} from 'metaed-core';
import { PLUGIN_NAME } from '../../src/PluginHelper';

jest.unmock('final-fs');
jest.setTimeout(40000);

describe('when generating change event schema and comparing to ODS/API 3.1 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/schema/v3.1');
  const authoritativeFilename = '0010-CreateChangesSchema-Authoritative.sql';
  const generatedFilename = '0010-CreateChangesSchema.sql';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsPostgresql: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsChangeQuery: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '3.1.0',
        },
      },
      projectPaths: ['./node_modules/ed-fi-model-3.0/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.0.0',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.0.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      manifest =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsPostgresql' ||
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
      R.head(state.generatorResults.filter(x => x.generatorName === `${PLUGIN_NAME}.CreateChangesSchemaGenerator`))
        .generatedOutput,
    );

    await ffs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString, 'utf-8');
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeFilename);
    const generated: string = path.resolve(artifactPath, generatedFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritative} ${generated}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating change event schema and comparing to ODS/API 5.0 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/schema/v5.0');
  const authoritativeFilename = '0010-CreateChangesSchema-Authoritative.sql';
  const generatedFilename = '0010-CreateChangesSchema.sql';

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
        edfiOdsPostgresql: {
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
      projectPaths: ['./node_modules/ed-fi-model-3.2a/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0',
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
      manifest =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsPostgresql' ||
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
      R.head(state.generatorResults.filter(x => x.generatorName === `${PLUGIN_NAME}.CreateChangesSchemaGenerator`))
        .generatedOutput,
    );

    await ffs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString, 'utf-8');
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeFilename);
    const generated: string = path.resolve(artifactPath, generatedFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritative} ${generated}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating change event schema and comparing to ODS/API 5.0 authoritative artifacts in Alliance Mode', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/schema/v5.0_AllianceMode');
  const authoritativeFilename = '0010-CreateChangesSchema-Authoritative.sql';
  const generatedFilename = '0010-CreateChangesSchema.sql';

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
        edfiOdsPostgresql: {
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
      projectPaths: ['./node_modules/ed-fi-model-3.2a/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.allianceMode = true;
    state.metaEd.dataStandardVersion = '3.2.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      manifest =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsPostgresql' ||
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
      R.head(state.generatorResults.filter(x => x.generatorName === `${PLUGIN_NAME}.CreateChangesSchemaGenerator`))
        .generatedOutput,
    );

    await ffs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString, 'utf-8');
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeFilename);
    const generated: string = path.resolve(artifactPath, generatedFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritative} ${generated}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});
