import { promises as fs } from 'node:fs';
import path from 'path';
import { exec } from 'child_process';
import {
  State,
  buildMetaEd,
  buildParseTree,
  loadFileIndex,
  loadFiles,
  setupPlugins,
  initializeNamespaces,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  runGenerators,
  walkBuilders,
  GeneratorResult,
} from '@edfi/metaed-core';
import { metaEdPlugins } from './PluginHelper';

jest.setTimeout(40000);

describe('when generating OpenAPI spec for data standard 5.0 and ODS/API 7.1', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v7_1/');
  const authoritativeCoreFilename = 'ds-5.0-open-api-authoritative.json';
  const generatedCoreFilename = 'ds-5.0-open-api-generated.json';

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '7.1.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.0/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '5.0.0',
          description: 'The Ed-Fi Data Standard v5.0',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '5.0.0';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runEnhancers(metaEdPlugin, state);
      await runGenerators(metaEdPlugin, state);
    }

    const generatorResult: GeneratorResult = state.generatorResults.filter(
      (x) => x.generatorName === 'edfiApiSchema.OpenApiGenerator',
    )[0];
    const [generatedCoreOutput] = generatorResult.generatedOutput;

    await fs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString);
  });

  it('should have no core file differences', async () => {
    const authoritativeCore: string = path.resolve(artifactPath, authoritativeCoreFilename);
    const generatedCore: string = path.resolve(artifactPath, generatedCoreFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeCore} ${generatedCore}`;

    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});
