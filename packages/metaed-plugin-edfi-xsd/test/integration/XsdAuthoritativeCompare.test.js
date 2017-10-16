// @flow
import R from 'ramda';
import path from 'path';
import ffs from 'final-fs';
import { exec } from 'child_process';
import diff2html from 'diff2html';
import { newState } from '../../../metaed-core/src/State';
import { loadPlugins } from '../../../metaed-core/src/task/LoadPlugins';
import { loadFiles } from '../../../metaed-core/src/task/FileSystemFilenameLoader';
import loadFileIndex from '../../../metaed-core/src/task/LoadFileIndex';
import { buildParseTree } from '../../../metaed-core/src/task/BuildParseTree';
import { buildMetaEd } from '../../../metaed-core/src/grammar/ParseTreeBuilder';
import { execute as walkBuilders } from '../../../metaed-core/src/task/WalkBuilders';
import { execute as runValidators } from '../../../metaed-core/src/task/RunValidators';
import { execute as runEnhancers } from '../../../metaed-core/src/task/RunEnhancers';
import { execute as runGenerators } from '../../../metaed-core/src/task/RunGenerators';
import { fileMapForFailure } from '../../../metaed-core/src/task/FileMapForFailure';
import type { GeneratedOutput } from '../../../metaed-core/src/generator/GeneratedOutput';
import type { State } from '../../../metaed-core/src/State';

jest.unmock('final-fs');

describe('when generating xsd and comparing it to data standard 2.0 authoritative artifacts', () => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const projectRootPath: string = path.resolve(__dirname, '../../../../');
  const nodeModulesPath: string = `${projectRootPath}/node_modules`;
  const outputDirectory: string = `${artifactPath}`;
  const complexTypeNames: Array<string> = [];
  const simpleTypeNames: Array<string> = [];
  let coreResult: GeneratedOutput;
  let fileBaseName: string;
  let authoritativeXsd: string;
  let generatedXsd: string;

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

    state.metaEd.dataStandardVersion = '2.0.0';
    const endState: State = R.pipe(
      loadPlugins,
      loadFiles,
      loadFileIndex,
      buildParseTree(buildMetaEd),
      walkBuilders,
      runValidators,
      runEnhancers,
      runGenerators,
      fileMapForFailure,
    )(state);

    endState.metaEd.entity.namespaceInfo.forEach(namespace =>
      namespace.data.edfiXsd.xsd_Schema.sections.forEach(section => {
        complexTypeNames.push(section.sectionAnnotation.documentation, ...section.complexTypes.map(y => y.name));
        simpleTypeNames.push(section.sectionAnnotation.documentation, ...section.simpleTypes.map(y => y.name));
      }));

    coreResult = R.head(R.head(endState.generatorResults).generatedOutput);
    fileBaseName = path.basename(coreResult.fileName, '.xsd');
    generatedXsd = `${outputDirectory}/${fileBaseName}.xsd`;
    authoritativeXsd = `${artifactPath}/${fileBaseName}-Authoritative.xsd`;

    await ffs.writeFile(generatedXsd, coreResult.resultString, 'utf-8');
  });

  it('should have no differences', async () => {
    const gitCommand: string = `git diff --shortstat --no-index -- ${authoritativeXsd} ${generatedXsd}`;
    const result: string = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    expect(result).toMatchSnapshot();
  });

  it('should create diff files', async () => {
    const cssFile: string = `${nodeModulesPath}/diff2html/dist/diff2html.min.css`;
    const htmlFile: string = `${outputDirectory}/${fileBaseName}.html`;
    const diffFile: string = `${outputDirectory}/${fileBaseName}.diff`;
    const gitDiffToFile: string = `git diff --no-index -- ${authoritativeXsd} ${generatedXsd} > ${diffFile}`;

    await new Promise(resolve => exec(gitDiffToFile, () => resolve()))
      .then(() => ffs.readFile(diffFile))
      .then(result => diff2html.Diff2Html.getPrettyHtml(result.toString()))
      .then(result => ffs.readFile(cssFile).then(css => {
        const html: string = `<html>\n<style>\n${css}\n</style>\n${result}\n</html>`;
        return ffs.writeFile(htmlFile, html, 'utf-8');
      }));
  });

  it('should have complex types in the correct order', () => {
    expect(complexTypeNames).toMatchSnapshot();
  });

  it('should have simple types in the correct order', () => {
    expect(simpleTypeNames).toMatchSnapshot();
  });
});
