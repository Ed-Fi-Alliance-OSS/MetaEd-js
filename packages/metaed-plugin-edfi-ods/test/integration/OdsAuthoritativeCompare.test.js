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
  newMetaEdConfiguration,
  newState,
  orderByProp,
  runEnhancers,
  runGenerators,
  validateConfiguration,
  walkBuilders,
} from 'metaed-core';
import type { Table } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import { orderRows } from '../../src/enhancer/AddSchemaContainerEnhancer';

jest.unmock('final-fs');
jest.setTimeout(40000);

describe('when generating ods and comparing it to data standard 2.0 authoritative artifacts', () => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const projectRootPath: string = path.resolve(__dirname, '../../../../');
  const nodeModulesPath: string = `${projectRootPath}/node_modules`;
  const outputDirectory: string = `${artifactPath}`;
  let coreResult: GeneratedOutput;
  let coreFileBaseName: string;
  let authoritativeCoreOds: string;
  let generatedCoreOds: string;
  let tableOrder: Array<string>;
  let fkOrder: Array<string>;
  let rowOrder: Array<string>;

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

    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runEnhancers(pluginManifest, state);
      await runGenerators(pluginManifest, state);
    }

    fileMapForFailure(state);

    const tables: Array<Table> = orderByProp('name')([...pluginEnvironment(state.metaEd).entity.table.values()]);
    tableOrder = tables.map(table => table.name);
    fkOrder = tables.reduce((acc: Array<string>, table: Table) => acc.concat([...table.foreignKeys.map(fk => fk.name)]), []);

    rowOrder = orderRows([...pluginEnvironment(state.metaEd).entity.row.values()]).map(
      x => x.name + (x.type === 'enumerationRow' ? x.description : ''),
    );

    coreResult = R.head(
      R.head(state.generatorResults.filter(x => x.generatorName === 'edfiOds.OdsGenerator')).generatedOutput,
    );
    coreFileBaseName = path.basename(coreResult.fileName, '.sql');
    generatedCoreOds = `${outputDirectory}/${coreFileBaseName}.sql`;
    authoritativeCoreOds = `${artifactPath}/${coreFileBaseName}-Authoritative.sql`;

    expect(coreResult).toBeDefined();
    await ffs.writeFile(generatedCoreOds, coreResult.resultString, 'utf-8');
  });

  it('should have correct table order', () => {
    expect(tableOrder).toBeDefined();
    expect(tableOrder).toMatchSnapshot();
  });

  it('should have correct foreign key order', () => {
    expect(fkOrder).toBeDefined();
    expect(fkOrder).toMatchSnapshot();
  });

  it('should have correct row order', () => {
    expect(rowOrder).toBeDefined();
    expect(rowOrder).toMatchSnapshot();
  });

  it('should have core with no differences', async () => {
    expect(coreResult).toBeDefined();
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeCoreOds} ${generatedCoreOds}`;
    const result: string = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should create diff files', async () => {
    expect(coreResult).toBeDefined();
    const cssFile: string = `${nodeModulesPath}/diff2html/dist/diff2html.min.css`;
    const htmlFile: string = `${outputDirectory}/${coreFileBaseName}.html`;
    const diffFile: string = `${outputDirectory}/${coreFileBaseName}.diff`;
    const gitDiffToFile: string = `git diff --no-index -- ${authoritativeCoreOds} ${generatedCoreOds} > ${diffFile}`;

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
});
