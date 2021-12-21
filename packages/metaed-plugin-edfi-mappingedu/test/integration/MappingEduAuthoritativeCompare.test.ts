import { exec } from 'child_process';
import ffs from 'final-fs';
import {
  buildMetaEd,
  buildParseTree,
  fileMapForValidationFailure,
  initializeNamespaces,
  loadFileIndex,
  loadFiles,
  loadPlugins,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  runGenerators,
  validateConfiguration,
  walkBuilders,
} from 'metaed-core';
import path from 'path';
import xlsx from 'xlsx';
import { State, SemVer } from 'metaed-core';

jest.unmock('final-fs');
jest.setTimeout(40000);

// quick-and-dirty polyfill of Object.values for Typescript conversion
function objectValues(obj: any): any[] {
  const vals = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
      // @ts-ignore
      vals.push(obj[key]);
    }
  }
  return vals;
}

describe.each([
  ['2.0.0', 'ed-fi-model-2.0'],
  ['2.2.0', 'ed-fi-model-2.2'],
  ['3.0.0', 'ed-fi-model-3.0'],
])(
  'when generating mapping edu and comparing it to data standard %s authoritative artifacts',
  (dataStandardVersion: SemVer, npmPackageName: string) => {
    const artifactPath: string = path.resolve(__dirname, './artifact');
    const baseName = `edfi-data-standard-${dataStandardVersion}`;
    const authoritativeSuffix = 'authoritative';
    const generatedSuffix = 'generated';
    const xlsxSuffix = 'xlsx';
    const csvSuffix = 'csv';
    let authoritativeCoreMappingEdu: string;
    let generatedMappingEdu: string;

    beforeAll(async () => {
      const metaEdConfiguration = {
        ...newMetaEdConfiguration(),
        artifactDirectory: './MetaEdOutput/',
        defaultPluginTechVersion: dataStandardVersion,
        projectPaths: [`./node_modules/${npmPackageName}/`],
        projects: [
          {
            projectName: 'Ed-Fi',
            namespaceName: 'EdFi',
            projectExtension: '',
            projectVersion: dataStandardVersion,
            description: '',
          },
        ],
      };
      const state: State = {
        ...newState(),
        metaEdConfiguration,
      };
      state.metaEd.dataStandardVersion = dataStandardVersion;
      validateConfiguration(state);
      loadPlugins(state);
      state.pluginManifest = state.pluginManifest.filter(
        (manifest) => ['edfiUnified', 'edfiXsd', 'edfiMappingedu'].includes(manifest.shortName),
        7,
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

      fileMapForValidationFailure(state);

      const coreResult = state.generatorResults.filter((x) => x.generatorName === 'edfiMappingedu.MappingEduGenerator')[0]
        .generatedOutput[0];

      authoritativeCoreMappingEdu = `${artifactPath}/${baseName}-${authoritativeSuffix}.${xlsxSuffix}`;
      generatedMappingEdu = `${artifactPath}/${baseName}-${generatedSuffix}.${xlsxSuffix}`;

      ffs.writeFileSync(generatedMappingEdu, coreResult.resultStream, 'utf-8');
    });

    it('should have authoritative spreadsheet', (): void => {
      expect(ffs.existsSync(authoritativeCoreMappingEdu)).toBe(true);
    });

    it('should have generated spreadsheet', (): void => {
      expect(ffs.existsSync(generatedMappingEdu)).toBe(true);
    });

    it('should have authoritative csv', (): void => {
      const authoritativeWorkbook = xlsx.readFile(authoritativeCoreMappingEdu);
      objectValues(authoritativeWorkbook.Sheets).forEach((sheet, i) => {
        const fileName = `${artifactPath}/${baseName}-${authoritativeWorkbook.SheetNames[i]}-${authoritativeSuffix}.${csvSuffix}`;

        ffs.writeFileSync(fileName, xlsx.utils.sheet_to_csv(sheet), 'utf-8');
        expect(ffs.existsSync(fileName)).toBe(true);
      });
    });

    it('should have generated csv', (): void => {
      const generatedWorkbook = xlsx.readFile(generatedMappingEdu);
      objectValues(generatedWorkbook.Sheets).forEach((sheet, i) => {
        const fileName = `${artifactPath}/${baseName}-${generatedWorkbook.SheetNames[i]}-${generatedSuffix}.${csvSuffix}`;

        ffs.writeFileSync(fileName, xlsx.utils.sheet_to_csv(sheet), 'utf-8');
        expect(ffs.existsSync(fileName)).toBe(true);
      });
    });

    // NOTE: Can't dynamically populate table argument with sheet names from workbook 😥
    it.each([
      'ElementGroupDefinitions',
      'EntityDefinitions',
      'ElementDefinitions',
      'EnumerationDefinitions',
      'EnumerationItems',
    ])(`generated %s should have no differences with authoritative`, async (sheetName: string) => {
      const authoritativeCSV = `${artifactPath}/${baseName}-${sheetName}-${authoritativeSuffix}.${csvSuffix}`;
      const generatedCSV = `${artifactPath}/${baseName}-${sheetName}-${generatedSuffix}.${csvSuffix}`;
      expect(ffs.existsSync(authoritativeCSV)).toBe(true);
      expect(ffs.existsSync(generatedCSV)).toBe(true);

      const gitCommand = `git diff --shortstat --no-index -- ${authoritativeCSV} ${generatedCSV}`;
      // @ts-ignore - error is unused
      const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
      expect(result).toMatchSnapshot();
    });
  },
);
