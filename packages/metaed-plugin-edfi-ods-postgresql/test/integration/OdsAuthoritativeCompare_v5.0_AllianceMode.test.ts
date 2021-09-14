import path from 'path';
import ffs from 'final-fs';
import { exec } from 'child_process';
import {
  State,
  Namespace,
  // GeneratorResult,
  orderByPath,
  buildMetaEd,
  buildParseTree,
  fileMapForValidationFailure,
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
  GeneratedOutput,
  GeneratorResult,
} from 'metaed-core';
import { Table, tableEntities, rowEntities } from 'metaed-plugin-edfi-ods-relational';
import { orderRows } from '../../src/enhancer/AddSchemaContainerEnhancer';

jest.unmock('final-fs');
jest.setTimeout(40000);

describe('when generating ods and comparing it to data standard 3.2 authoritative artifacts for ODS/API 5.0.0 in Alliance mode', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v5_AllianceMode/');
  const outputDirectory = `${artifactPath}`;
  let tablesResult: GeneratedOutput;
  let foreignKeysResult: GeneratedOutput;
  let extendedPropertiesResult: GeneratedOutput;
  let schoolYearsResult: GeneratedOutput;
  let idIndexResult: GeneratedOutput;
  let authoritativeTablesFile: string;
  let generatedTablesFile: string;
  let authoritativeForeignKeysFile: string;
  let generatedForeignKeysFile: string;
  let authoritativeExtendedPropertiesFile: string;
  let generatedExtendedPropertiesFile: string;
  let authoritativeSchoolYearsFile: string;
  let generatedSchoolYearsFile: string;
  let authoritativeIdIndexFile: string;
  let generatedIdIndexFile: string;
  let tableOrder: string[];
  let fkOrder: string[];
  let rowOrder: string[];

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
          description: '',
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
        manifest.shortName === 'edfiOdsPostgresql',
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

    const coreNamespace: Namespace | undefined = state.metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();

    const tables: Table[] = orderByPath(['data', 'edfiOdsPostgresql', 'tableName'])([
      ...tableEntities(state.metaEd, coreNamespace).values(),
    ]);
    tableOrder = tables.map(table => table.data.edfiOdsPostgresql.tableName);
    fkOrder = tables.reduce(
      (acc: string[], table: Table) =>
        acc.concat([...table.foreignKeys.map(fk => fk.data.edfiOdsPostgresql.foreignKeyName)]),
      [],
    );

    rowOrder = orderRows([...rowEntities(state.metaEd, coreNamespace).values()]).map(
      x => x.name + (x.type === 'enumerationRow' ? x.description : ''),
    );

    [tablesResult, foreignKeysResult, extendedPropertiesResult, schoolYearsResult] = state.generatorResults.filter(
      x => x.generatorName === 'edfiOdsPostgresql.OdsGenerator',
    )[0].generatedOutput;

    [idIndexResult] = state.generatorResults.filter(
      x => x.generatorName === 'edfiOdsPostgresql.IdIndexesGenerator',
    )[0].generatedOutput;

    const tableFileBaseName = path.basename(tablesResult.fileName, '.sql');
    generatedTablesFile = `${outputDirectory}/${tableFileBaseName}.sql`;
    authoritativeTablesFile = `${artifactPath}/${tableFileBaseName}-Authoritative.sql`;
    await ffs.writeFile(generatedTablesFile, tablesResult.resultString, 'utf-8');

    const foreignKeysFileBaseName = path.basename(foreignKeysResult.fileName, '.sql');
    generatedForeignKeysFile = `${outputDirectory}/${foreignKeysFileBaseName}.sql`;
    authoritativeForeignKeysFile = `${artifactPath}/${foreignKeysFileBaseName}-Authoritative.sql`;
    await ffs.writeFile(generatedForeignKeysFile, foreignKeysResult.resultString, 'utf-8');

    const extendedPropertiesFileBaseName = path.basename(extendedPropertiesResult.fileName, '.sql');
    generatedExtendedPropertiesFile = `${outputDirectory}/${extendedPropertiesFileBaseName}.sql`;
    authoritativeExtendedPropertiesFile = `${artifactPath}/${extendedPropertiesFileBaseName}-Authoritative.sql`;
    await ffs.writeFile(generatedExtendedPropertiesFile, extendedPropertiesResult.resultString, 'utf-8');

    const schoolYearsFileBaseName = path.basename(schoolYearsResult.fileName, '.sql');
    generatedSchoolYearsFile = `${outputDirectory}/${schoolYearsFileBaseName}.sql`;
    authoritativeSchoolYearsFile = `${artifactPath}/${schoolYearsFileBaseName}-Authoritative.sql`;
    await ffs.writeFile(generatedSchoolYearsFile, schoolYearsResult.resultString, 'utf-8');

    const idIndexFileBaseName = path.basename(idIndexResult.fileName, '.sql');
    generatedIdIndexFile = `${outputDirectory}/${idIndexFileBaseName}.sql`;
    authoritativeIdIndexFile = `${artifactPath}/${idIndexFileBaseName}-Authoritative.sql`;
    await ffs.writeFile(generatedIdIndexFile, idIndexResult.resultString, 'utf-8');
  });

  it('should have correct table order', (): void => {
    expect(tableOrder).toBeDefined();
    expect(tableOrder).toMatchSnapshot();
  });

  it('should have correct foreign key order', (): void => {
    expect(fkOrder).toBeDefined();
    expect(fkOrder).toMatchSnapshot();
  });

  it('should have correct row order', (): void => {
    expect(rowOrder).toBeDefined();
    expect(rowOrder).toMatchSnapshot();
  });

  it('should have tables file with no differences', async () => {
    expect(tablesResult).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeTablesFile} ${generatedTablesFile}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have foreign keys file with no differences', async () => {
    expect(foreignKeysResult).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeForeignKeysFile} ${generatedForeignKeysFile}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have extended properties file with no differences', async () => {
    expect(extendedPropertiesResult).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeExtendedPropertiesFile} ${generatedExtendedPropertiesFile}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have school years file with no differences', async () => {
    expect(schoolYearsResult).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeSchoolYearsFile} ${generatedSchoolYearsFile}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have id index file with no differences', async () => {
    expect(idIndexResult).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeIdIndexFile} ${generatedIdIndexFile}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating ods with simple extensions and comparing it to data standard 3.2 authoritative artifacts for ODS/API 5.0.0 in Alliance Mode', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v5_AllianceMode/');
  const sampleExtensionPath: string = path.resolve(__dirname, './simple-extension-project');

  let generatedCoreOdsFilename: string;
  let authoritativeCoreOdsFilename: string;
  let generatedExtensionOdsFilename: string;
  let authoritativeExtensionOdsFilename: string;

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '5.0.0',
      projectPaths: ['./node_modules/ed-fi-model-3.2a/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0',
          description: '',
        },
        {
          projectName: 'Extension',
          namespaceName: 'Extension',
          projectExtension: 'Extension',
          projectVersion: '3.2.0',
          description: '',
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
        manifest.shortName === 'edfiOdsPostgresql',
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

    const generatorResult: GeneratorResult = state.generatorResults.filter(
      x => x.generatorName === 'edfiOdsPostgresql.OdsGenerator',
    )[0];
    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    const coreFileBaseName: string = path.basename(generatedCoreOutput.fileName, '.sql');
    generatedCoreOdsFilename = `${artifactPath}/${coreFileBaseName}.sql`;
    authoritativeCoreOdsFilename = `${artifactPath}/${coreFileBaseName}-Authoritative.sql`;

    const extensionFileBaseName: string = path.basename(generatedExtensionOutput.fileName, '.sql');
    generatedExtensionOdsFilename = `${artifactPath}/Simple-${extensionFileBaseName}.sql`;
    authoritativeExtensionOdsFilename = `${artifactPath}/Simple-${extensionFileBaseName}-Authoritative.sql`;

    await ffs.writeFile(generatedCoreOdsFilename, generatedCoreOutput.resultString, 'utf-8');
    await ffs.writeFile(generatedExtensionOdsFilename, generatedExtensionOutput.resultString, 'utf-8');
  });

  it('should have core with no differences', async () => {
    expect(generatedCoreOutput).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeCoreOdsFilename} ${generatedCoreOdsFilename}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have extension with no differences', async () => {
    expect(generatedExtensionOutput).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeExtensionOdsFilename} ${generatedExtensionOdsFilename}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating ods with student transcript extensions and comparing it to data standard 3.2 authoritative artifacts for ODS/API 5.0.0 in Alliance mode', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v5_AllianceMode/');
  const sampleExtensionPath: string = path.resolve(__dirname, './student-transcript-extension-project');

  let generatedCoreOdsFilename: string;
  let authoritativeCoreOdsFilename: string;
  let generatedExtensionOdsFilename: string;
  let authoritativeExtensionOdsFilename: string;

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '5.0.0',
      projectPaths: ['./node_modules/ed-fi-model-3.2a/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0',
          description: '',
        },
        {
          projectName: 'Extension',
          namespaceName: 'Extension',
          projectExtension: 'Extension',
          projectVersion: '3.2.0',
          description: '',
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
        manifest.shortName === 'edfiOdsPostgresql',
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

    const generatorResult: GeneratorResult = state.generatorResults.filter(
      x => x.generatorName === 'edfiOdsPostgresql.OdsGenerator',
    )[0];
    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    const coreFileBaseName: string = path.basename(generatedCoreOutput.fileName, '.sql');
    generatedCoreOdsFilename = `${artifactPath}/${coreFileBaseName}.sql`;
    authoritativeCoreOdsFilename = `${artifactPath}/${coreFileBaseName}-Authoritative.sql`;

    const extensionFileBaseName: string = path.basename(generatedExtensionOutput.fileName, '.sql');
    generatedExtensionOdsFilename = `${artifactPath}/Transcript-${extensionFileBaseName}.sql`;
    authoritativeExtensionOdsFilename = `${artifactPath}/Transcript-${extensionFileBaseName}-Authoritative.sql`;

    await ffs.writeFile(generatedCoreOdsFilename, generatedCoreOutput.resultString, 'utf-8');
    await ffs.writeFile(generatedExtensionOdsFilename, generatedExtensionOutput.resultString, 'utf-8');
  });

  it('should have core with no differences', async () => {
    expect(generatedCoreOutput).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeCoreOdsFilename} ${generatedCoreOdsFilename}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have extension with no differences', async () => {
    expect(generatedExtensionOutput).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeExtensionOdsFilename} ${generatedExtensionOdsFilename}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});
