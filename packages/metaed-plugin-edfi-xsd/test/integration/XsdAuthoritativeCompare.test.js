// @flow
import R from 'ramda';
import path from 'path';
import ffs from 'final-fs';
import { exec } from 'child_process';
import diff2html from 'diff2html';
import type { GeneratedOutput, State } from 'metaed-core';
import {
  buildMetaEd,
  buildParseTree,
  fileMapForFailure,
  loadFileIndex,
  loadFiles,
  loadPlugins,
  addProjectNameToNamespaceInfo,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  runGenerators,
  validateConfiguration,
  walkBuilders,
} from 'metaed-core';

jest.unmock('final-fs');
jest.setTimeout(40000);

describe('when generating xsd and comparing it to data standard 2.0 authoritative artifacts', () => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const projectRootPath: string = path.resolve(__dirname, '../../../../');
  const nodeModulesPath: string = `${projectRootPath}/node_modules`;
  const outputDirectory: string = `${artifactPath}`;
  const complexTypeNames: Array<string> = [];
  const simpleTypeNames: Array<string> = [];
  let coreResult: GeneratedOutput;
  let schemaResult: GeneratedOutput;
  let coreFileBaseName: string;
  let schemaFileBaseName: string;
  let authoritativeCoreXsd: string;
  let authoritativeSchemaXsd: string;
  let generatedCoreXsd: string;
  let generatedSchemaXsd: string;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginConfig: {
        edfiUnified: {
          targetTechnologyVersion: '2.0.0',
        },
        edfiOds: {
          targetTechnologyVersion: '2.0.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '2.0.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '2.0.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '2.0.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '2.0.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '2.0.0',
        },
      },
      projectPaths: ['./node_modules/ed-fi-model-2.0/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespace: 'edfi',
          projectExtension: '',
          projectVersion: '2.0.0',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '2.0.0';

    validateConfiguration(state);
    loadPlugins(state);
    // NOTE: filtering interchange brief because of TeamCity issues with phatonmjs(?)
    state.pluginManifest = state.pluginManifest.filter(manifest => manifest.shortName !== 'edfiInterchangeBrief');
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    addProjectNameToNamespaceInfo(state);

    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runEnhancers(pluginManifest, state);
      await runGenerators(pluginManifest, state);
    }

    fileMapForFailure(state);

    state.metaEd.entity.namespaceInfo.forEach(namespace =>
      namespace.data.edfiXsd.xsd_Schema.sections.forEach(section => {
        complexTypeNames.push(section.sectionAnnotation.documentation, ...section.complexTypes.map(y => y.name));
        simpleTypeNames.push(section.sectionAnnotation.documentation, ...section.simpleTypes.map(y => y.name));
      }),
    );

    coreResult = R.head(
      R.head(state.generatorResults.filter(x => x.generatorName === 'edfiXsd.XsdGenerator')).generatedOutput,
    );
    coreFileBaseName = path.basename(coreResult.fileName, '.xsd');
    generatedCoreXsd = `${outputDirectory}/${coreFileBaseName}.xsd`;
    authoritativeCoreXsd = `${artifactPath}/${coreFileBaseName}-Authoritative.xsd`;

    await ffs.writeFile(generatedCoreXsd, coreResult.resultString, 'utf-8');

    schemaResult = R.head(
      R.head(state.generatorResults.filter(x => x.generatorName === 'edfiXsd.SchemaAnnotationGenerator')).generatedOutput,
    );
    schemaFileBaseName = path.basename(schemaResult.fileName, '.xsd');
    generatedSchemaXsd = `${outputDirectory}/${schemaFileBaseName}.xsd`;
    authoritativeSchemaXsd = `${artifactPath}/${schemaFileBaseName}-Authoritative.xsd`;

    await ffs.writeFile(generatedSchemaXsd, schemaResult.resultString, 'utf-8');
  });

  it('should have core with no differences', async () => {
    expect(generatedCoreXsd).toBeDefined();
    const gitCommand: string = `git diff --shortstat --no-index -- ${authoritativeCoreXsd} ${generatedCoreXsd}`;
    const result: string = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    expect(result).toMatchSnapshot();
  });

  it('should have schema annotation with no differences', async () => {
    const gitCommand: string = `git diff --shortstat --no-index -- ${authoritativeSchemaXsd} ${generatedSchemaXsd}`;
    expect(generatedCoreXsd).toBeDefined();
    const result: string = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    expect(result).toMatchSnapshot();
  });

  it('should create diff files', async () => {
    expect(generatedCoreXsd).toBeDefined();
    const cssFile: string = `${nodeModulesPath}/diff2html/dist/diff2html.min.css`;
    const htmlFile: string = `${outputDirectory}/${coreFileBaseName}.html`;
    const diffFile: string = `${outputDirectory}/${coreFileBaseName}.diff`;
    const gitDiffToFile: string = `git diff --no-index -- ${authoritativeCoreXsd} ${generatedCoreXsd} > ${diffFile}`;

    await new Promise(resolve => exec(gitDiffToFile, () => resolve()))
      .then(() => ffs.readFile(diffFile))
      .then(result => diff2html.Diff2Html.getPrettyHtml(result.toString()))
      .then(result =>
        ffs.readFile(cssFile).then(css => {
          const html: string = `<html>\n<style>\n${css}\n</style>\n${result}\n</html>`;
          return ffs.writeFile(htmlFile, html, 'utf-8');
        }),
      );
  });

  it('should have complex types in the correct order', () => {
    expect(generatedCoreXsd).toBeDefined();
    expect(complexTypeNames).toMatchSnapshot();
  });

  it('should have simple types in the correct order', () => {
    expect(generatedCoreXsd).toBeDefined();
    expect(simpleTypeNames).toMatchSnapshot();
  });
});
