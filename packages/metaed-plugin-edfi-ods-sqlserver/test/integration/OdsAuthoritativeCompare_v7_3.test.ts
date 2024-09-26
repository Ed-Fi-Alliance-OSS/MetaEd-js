import { promises as fs } from 'node:fs';
import * as R from 'ramda';
import path from 'path';
import { exec } from 'child_process';
import {
  GeneratedOutput,
  State,
  Namespace,
  GeneratorResult,
  orderByPath,
  buildMetaEd,
  buildParseTree,
  fileMapForValidationFailure,
  loadFileIndex,
  loadFiles,
  setupPlugins,
  initializeNamespaces,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  runGenerators,
  walkBuilders,
} from '@edfi/metaed-core';
import { Table, tableEntities, rowEntities } from '@edfi/metaed-plugin-edfi-ods-relational';
import { orderRows } from '../../src/enhancer/AddSchemaContainerEnhancer';
import { metaEdPlugins } from './PluginHelper';

jest.setTimeout(40000);

describe('when generating ods and comparing it to data standard 5.1 authoritative artifacts for ODS/API 7.3', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v7_3/');
  const outputDirectory = `${artifactPath}`;
  let coreResult: GeneratedOutput;
  let coreFileBaseName: string;
  let authoritativeCoreOds: string;
  let generatedCoreOds: string;
  let tableOrder: string[];
  let fkOrder: string[];
  let rowOrder: string[];

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '7.3.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.1/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '5.1.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '5.1.0';

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

    fileMapForValidationFailure(state);

    const coreNamespace: Namespace | undefined = state.metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();

    const tables: Table[] = orderByPath(['data', 'edfiOdsSqlServer', 'tableName'])([
      ...tableEntities(state.metaEd, coreNamespace).values(),
    ]);
    tableOrder = tables.map((table) => table.data.edfiOdsSqlServer.tableName);
    fkOrder = tables.reduce(
      (acc: string[], table: Table) =>
        acc.concat([...table.foreignKeys.map((fk) => fk.data.edfiOdsSqlServer.foreignKeyName)]),
      [],
    );

    rowOrder = orderRows([...rowEntities(state.metaEd, coreNamespace).values()]).map(
      (x) => x.name + (x.type === 'enumerationRow' ? x.description : ''),
    );

    coreResult = R.head(
      R.head(state.generatorResults.filter((x) => x.generatorName === 'edfiOdsSqlServer.OdsGenerator')).generatedOutput,
    );
    coreFileBaseName = path.basename(coreResult.fileName, '.sql');
    generatedCoreOds = `${outputDirectory}/${coreFileBaseName}.sql`;
    authoritativeCoreOds = `${artifactPath}/${coreFileBaseName}-Authoritative.sql`;

    expect(coreResult).toBeDefined();
    await fs.writeFile(generatedCoreOds, coreResult.resultString);
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

  it('should have core with no differences', async () => {
    expect(coreResult).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeCoreOds} ${generatedCoreOds}`;

    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating EducationOrganizationAuthorizationIndexes and comparing it to data standard 5.1 authoritative artifacts for ODS/API 7.3', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v7_3/');
  const outputDirectory = `${artifactPath}`;
  let coreResult: GeneratedOutput;
  let coreFileBaseName: string;
  let authoritativeCoreOds: string;
  let generatedCoreOds: string;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '7.3.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.1/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '5.1.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '5.1.0';

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

    fileMapForValidationFailure(state);

    coreResult = R.head(
      R.head(
        state.generatorResults.filter(
          (x) => x.generatorName === 'edfiOdsSqlServer.EducationOrganizationAuthorizationIndexesGenerator',
        ),
      ).generatedOutput,
    );
    coreFileBaseName = path.basename(coreResult.fileName, '.sql');
    generatedCoreOds = `${outputDirectory}/${coreFileBaseName}.sql`;
    authoritativeCoreOds = `${artifactPath}/${coreFileBaseName}-Authoritative.sql`;

    expect(coreResult).toBeDefined();
    await fs.writeFile(generatedCoreOds, coreResult.resultString);
  });

  it('should have core with no differences', async () => {
    expect(coreResult).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeCoreOds} ${generatedCoreOds}`;

    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating AggregateIdColumns and comparing it to data standard 5.1 authoritative artifacts for ODS/API 7.3', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v7_3/');
  const outputDirectory = `${artifactPath}`;
  let coreResult: GeneratedOutput;
  let coreFileBaseName: string;
  let authoritativeCoreOds: string;
  let generatedCoreOds: string;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '7.3.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.1/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '5.1.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '5.1.0';

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

    fileMapForValidationFailure(state);

    coreResult = R.head(
      R.head(state.generatorResults.filter((x) => x.generatorName === 'edfiOdsSqlServer.AggregateIdColumnGenerator'))
        .generatedOutput,
    );
    coreFileBaseName = path.basename(coreResult.fileName, '.sql');
    generatedCoreOds = `${outputDirectory}/${coreFileBaseName}.sql`;
    authoritativeCoreOds = `${artifactPath}/${coreFileBaseName}-Authoritative.sql`;

    expect(coreResult).toBeDefined();
    await fs.writeFile(generatedCoreOds, coreResult.resultString);
  });

  it('should have core with no differences', async () => {
    expect(coreResult).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeCoreOds} ${generatedCoreOds}`;

    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating ods with simple extensions and comparing it to data standard 5.1 authoritative artifacts for ODS/API 7.3', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v7_3/');
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
      defaultPluginTechVersion: '7.3.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.1/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '5.1.0',
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
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '5.1.0';

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

    const generatorResult: GeneratorResult = R.head(
      state.generatorResults.filter((x) => x.generatorName === 'edfiOdsSqlServer.OdsGenerator'),
    );
    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    const coreFileBaseName: string = path.basename(generatedCoreOutput.fileName, '.sql');
    generatedCoreOdsFilename = `${artifactPath}/${coreFileBaseName}.sql`;
    authoritativeCoreOdsFilename = `${artifactPath}/${coreFileBaseName}-Authoritative.sql`;

    const extensionFileBaseName: string = path.basename(generatedExtensionOutput.fileName, '.sql');
    generatedExtensionOdsFilename = `${artifactPath}/Simple-${extensionFileBaseName}.sql`;
    authoritativeExtensionOdsFilename = `${artifactPath}/Simple-${extensionFileBaseName}-Authoritative.sql`;

    await fs.writeFile(generatedCoreOdsFilename, generatedCoreOutput.resultString);
    await fs.writeFile(generatedExtensionOdsFilename, generatedExtensionOutput.resultString);
  });

  it('should have core with no differences', async () => {
    expect(generatedCoreOutput).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeCoreOdsFilename} ${generatedCoreOdsFilename}`;

    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have extension with no differences', async () => {
    expect(generatedExtensionOutput).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeExtensionOdsFilename} ${generatedExtensionOdsFilename}`;

    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating ods with student transcript extensions and comparing it to data standard 5.1 authoritative artifacts for ODS/API 7.3', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v7_3/');
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
      defaultPluginTechVersion: '7.3.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.1/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '5.1.0',
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
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '5.1.0';

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

    const generatorResult: GeneratorResult = R.head(
      state.generatorResults.filter((x) => x.generatorName === 'edfiOdsSqlServer.OdsGenerator'),
    );
    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    const coreFileBaseName: string = path.basename(generatedCoreOutput.fileName, '.sql');
    generatedCoreOdsFilename = `${artifactPath}/${coreFileBaseName}.sql`;
    authoritativeCoreOdsFilename = `${artifactPath}/${coreFileBaseName}-Authoritative.sql`;

    const extensionFileBaseName: string = path.basename(generatedExtensionOutput.fileName, '.sql');
    generatedExtensionOdsFilename = `${artifactPath}/Transcript-${extensionFileBaseName}.sql`;
    authoritativeExtensionOdsFilename = `${artifactPath}/Transcript-${extensionFileBaseName}-Authoritative.sql`;

    await fs.writeFile(generatedCoreOdsFilename, generatedCoreOutput.resultString);
    await fs.writeFile(generatedExtensionOdsFilename, generatedExtensionOutput.resultString);
  });

  it('should have core with no differences', async () => {
    expect(generatedCoreOutput).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeCoreOdsFilename} ${generatedCoreOdsFilename}`;

    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have extension with no differences', async () => {
    expect(generatedExtensionOutput).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeExtensionOdsFilename} ${generatedExtensionOdsFilename}`;

    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});
