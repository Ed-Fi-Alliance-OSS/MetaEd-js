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

jest.unmock('final-fs');
jest.setTimeout(40000);

describe('when generating CreatedByOwnership columns and comparing to ODS/API 3.3 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const authoritativeFilename = 'CreatedByOwnership-v3.3-Authoritative.sql';
  const generatedFilename = 'CreatedByOwnership-v3.3.sql';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '3.3.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '3.3.0',
        },
        edfiOdsSqlServer: {
          targetTechnologyVersion: '3.3.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '3.3.0',
        },
        edfiOdsRecordOwnership: {
          targetTechnologyVersion: '3.3.0',
        },
        edfiOdsRecordOwnershipSqlServer: {
          targetTechnologyVersion: '3.3.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '3.3.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '3.3.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '3.3.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '3.3.0',
        },
      },
      projectPaths: ['./node_modules/ed-fi-model-3.2a/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0-a',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.2.0-a';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      manifest =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
        manifest.shortName === 'edfiOdsRecordOwnershipSqlServer' ||
        manifest.shortName === 'edfiOdsRecordOwnership',
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

    [generatedOutput] = state.generatorResults.filter(
      x => x.generatorName === 'edfiOdsRecordOwnershipSqlServer.AddCreatedByOwnershipColumnForTableGenerator',
    )[0].generatedOutput;

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
