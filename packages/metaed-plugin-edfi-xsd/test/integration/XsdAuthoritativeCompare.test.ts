import R from 'ramda';
import path from 'path';
import ffs from 'final-fs';
import { exec } from 'child_process';
import {
  GeneratedOutput,
  State,
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
} from 'metaed-core';

jest.unmock('final-fs');
jest.setTimeout(40000);

describe('when generating xsd and comparing it to data standard 2.0 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v2/');
  const outputDirectory = `${artifactPath}`;
  const complexTypeNames: string[] = [];
  const simpleTypeNames: string[] = [];
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
      defaultPluginTechVersion: '2.0.0',
      projectPaths: ['./node_modules/ed-fi-model-2.0/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '2.0.0',
          description: '',
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
    state.pluginManifest = state.pluginManifest.filter(
      manifest => manifest.shortName === 'edfiUnified' || manifest.shortName === 'edfiXsd',
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

    state.metaEd.namespace.forEach(namespace =>
      namespace.data.edfiXsd.xsdSchema.sections.forEach(section => {
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
    const gitCommand = `git diff --shortstat --no-index -- ${authoritativeCoreXsd} ${generatedCoreXsd}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    expect(result).toMatchSnapshot();
  });

  it('should have schema annotation with no differences', async () => {
    const gitCommand = `git diff --shortstat --no-index -- ${authoritativeSchemaXsd} ${generatedSchemaXsd}`;
    expect(generatedCoreXsd).toBeDefined();
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    expect(result).toMatchSnapshot();
  });

  it('should have complex types in the correct order', (): void => {
    expect(generatedCoreXsd).toBeDefined();
    expect(complexTypeNames).toMatchSnapshot();
  });

  it('should have simple types in the correct order', (): void => {
    expect(generatedCoreXsd).toBeDefined();
    expect(simpleTypeNames).toMatchSnapshot();
  });
});

describe('when generating xsd and comparing it to data standard 3.1 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v3/');
  const outputDirectory = `${artifactPath}`;
  const complexTypeNames: string[] = [];
  const simpleTypeNames: string[] = [];
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
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsApi: {
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
      projectPaths: ['./node_modules/ed-fi-model-3.1/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.1.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.1.0';
    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      manifest => manifest.shortName === 'edfiUnified' || manifest.shortName === 'edfiXsd',
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

    state.metaEd.namespace.forEach(namespace =>
      namespace.data.edfiXsd.xsdSchema.sections.forEach(section => {
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
    const gitCommand = `git diff --shortstat --no-index -- ${authoritativeCoreXsd} ${generatedCoreXsd}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    expect(result).toMatchSnapshot();
  });

  it('should have schema annotation with no differences', async () => {
    const gitCommand = `git diff --shortstat --no-index -- ${authoritativeSchemaXsd} ${generatedSchemaXsd}`;
    expect(generatedCoreXsd).toBeDefined();
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    expect(result).toMatchSnapshot();
  });

  it('should have complex types in the correct order', (): void => {
    expect(generatedCoreXsd).toBeDefined();
    expect(complexTypeNames).toMatchSnapshot();
  });

  it('should have simple types in the correct order', (): void => {
    expect(generatedCoreXsd).toBeDefined();
    expect(simpleTypeNames).toMatchSnapshot();
  });
});

describe('when generating xsd with extension and comparing it to data standard 3.1 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v3/');
  const outputDirectory = `${artifactPath}`;
  const complexTypeNames: string[] = [];
  const simpleTypeNames: string[] = [];
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
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsApi: {
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
      projectPaths: ['./node_modules/ed-fi-model-3.1/', path.resolve(__dirname, 'artifact', 'EdFiXFinance')],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.1.0',
          description: '',
        },
        {
          projectName: 'EdFiXFinance',
          namespaceName: 'EdFiXFinance',
          projectExtension: 'EdFiXFinance',
          projectVersion: '1.0.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.1.0';
    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      manifest => manifest.shortName === 'edfiUnified' || manifest.shortName === 'edfiXsd',
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

    state.metaEd.namespace.forEach(namespace =>
      namespace.data.edfiXsd.xsdSchema.sections.forEach(section => {
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
    const gitCommand = `git diff --shortstat --no-index -- ${authoritativeCoreXsd} ${generatedCoreXsd}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    expect(result).toMatchSnapshot();
  });

  it('should have schema annotation with no differences', async () => {
    const gitCommand = `git diff --shortstat --no-index -- ${authoritativeSchemaXsd} ${generatedSchemaXsd}`;
    expect(generatedCoreXsd).toBeDefined();
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    expect(result).toMatchSnapshot();
  });

  it('should have complex types in the correct order', (): void => {
    expect(generatedCoreXsd).toBeDefined();
    expect(complexTypeNames).toMatchSnapshot();
  });

  it('should have simple types in the correct order', (): void => {
    expect(generatedCoreXsd).toBeDefined();
    expect(simpleTypeNames).toMatchSnapshot();
  });
});
