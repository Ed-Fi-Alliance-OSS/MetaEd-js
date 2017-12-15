// @flow
import R from 'ramda';
import path from 'path';
import ffs from 'final-fs';
import { exec } from 'child_process';
import diff2html from 'diff2html';
import type { GeneratedOutput, State } from 'metaed-core';
import { newState, loadPlugins, loadFiles, loadFileIndex, buildParseTree, buildMetaEd, walkBuilders, runEnhancers, runGenerators, fileMapForFailure } from 'metaed-core';

import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';

import { orderByProp } from '../../../metaed-core/src/Utility';
import { orderRows } from '../../src/generator/OdsGenerator';

jest.unmock('final-fs');
jest.setTimeout(20000);


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
  let triggerOrder: Array<string>;
  let rowOrder: Array<string>;

  beforeAll(async () => {
    const state: State = Object.assign(newState(), {
      pluginScanDirectory: `${projectRootPath}/packages`,
      inputDirectories: [
        {
          path: `${nodeModulesPath}/ed-fi-model-2.0`,
          namespace: 'edfi',
          projectExtension: '',
          isExtension: false,
        },
      ],
    });

    state.metaEd.dataStandardVersion = '2.0.x';

    loadPlugins(state);
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

    const tables = orderByProp('name')([...pluginEnvironment(state.metaEd).entity.table.values()]);
    tableOrder = tables.map(table => table.name);
    fkOrder = tables.reduce((acc, table) => acc.concat([...table.foreignKeys.map(fk => fk.name)]), []);

    triggerOrder = (orderByProp('name')([...pluginEnvironment(state.metaEd).entity.trigger.values()])).map(table => table.name);

    rowOrder = orderRows([...pluginEnvironment(state.metaEd).entity.row.values()].filter(
      row => row.type === 'enumerationRow',
    )).map(x => x.name);

    coreResult = R.head(R.head(state.generatorResults.filter(x => x.generatorName === 'OdsGenerator')).generatedOutput);
    coreFileBaseName = path.basename(coreResult.fileName, '.sql');
    generatedCoreOds = `${outputDirectory}/${coreFileBaseName}.sql`;
    authoritativeCoreOds = `${artifactPath}/${coreFileBaseName}-Authoritative.sql`;

    await ffs.writeFile(generatedCoreOds, coreResult.resultString, 'utf-8');
  });


  it('should have correct table order', () => {
    expect(tableOrder).toMatchSnapshot();
  });

  it('should have correct foreign key order', () => {
    expect(fkOrder).toMatchSnapshot();
  });

  it('should have correct trigger order', () => {
    expect(triggerOrder).toMatchSnapshot();
  });

  it('should have correct row order', () => {
    expect(rowOrder).toMatchSnapshot();
  });

  it('should have core with no differences', async () => {
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeCoreOds} ${generatedCoreOds}`;
    const result: string = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    expect(result).toMatchSnapshot();
  });

  it('should create diff files', async () => {
    const cssFile: string = `${nodeModulesPath}/diff2html/dist/diff2html.min.css`;
    const htmlFile: string = `${outputDirectory}/${coreFileBaseName}.html`;
    const diffFile: string = `${outputDirectory}/${coreFileBaseName}.diff`;
    const gitDiffToFile: string = `git diff --no-index -- ${authoritativeCoreOds} ${generatedCoreOds} > ${diffFile}`;

    await new Promise(resolve => exec(gitDiffToFile, () => resolve()))
    .then(() => ffs.readFile(diffFile))
    .then(result => diff2html.Diff2Html.getPrettyHtml(result.toString()))
    .then(result => ffs.readFile(cssFile)
    .then(css => {
      const html: string = `<html>\n<style>\n${css}\n</style>\n${result}\n</html>`;
      return ffs.writeFile(htmlFile, html, 'utf-8');
    }),
    );
  });
});
