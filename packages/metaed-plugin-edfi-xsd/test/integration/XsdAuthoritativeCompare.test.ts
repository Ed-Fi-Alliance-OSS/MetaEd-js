import { promises as fs } from 'node:fs';
import * as R from 'ramda';
import path from 'path';
import { exec } from 'child_process';
import {
  GeneratedOutput,
  State,
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
import { metaEdPlugins } from '../PluginHelper';

jest.setTimeout(40000);

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
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2c/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0-c',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '3.2.0-c';

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

    state.metaEd.namespace.forEach((namespace) =>
      namespace.data.edfiXsd.xsdSchema.sections.forEach((section) => {
        complexTypeNames.push(section.sectionAnnotation.documentation, ...section.complexTypes.map((y) => y.name));
        simpleTypeNames.push(section.sectionAnnotation.documentation, ...section.simpleTypes.map((y) => y.name));
      }),
    );

    coreResult = R.head(
      R.head(state.generatorResults.filter((x) => x.generatorName === 'edfiXsd.XsdGenerator')).generatedOutput,
    );
    coreFileBaseName = path.basename(coreResult.fileName, '.xsd');
    generatedCoreXsd = `${outputDirectory}/${coreFileBaseName}.xsd`;
    authoritativeCoreXsd = `${artifactPath}/${coreFileBaseName}-Authoritative.xsd`;

    await fs.writeFile(generatedCoreXsd, coreResult.resultString, { encoding: 'utf-8' });

    schemaResult = R.head(
      R.head(state.generatorResults.filter((x) => x.generatorName === 'edfiXsd.SchemaAnnotationGenerator')).generatedOutput,
    );
    schemaFileBaseName = path.basename(schemaResult.fileName, '.xsd');
    generatedSchemaXsd = `${outputDirectory}/${schemaFileBaseName}.xsd`;
    authoritativeSchemaXsd = `${artifactPath}/${schemaFileBaseName}-Authoritative.xsd`;

    await fs.writeFile(generatedSchemaXsd, schemaResult.resultString, { encoding: 'utf-8' });
  });

  it('should have core with no differences', async () => {
    expect(generatedCoreXsd).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index -- ${authoritativeCoreXsd} ${generatedCoreXsd}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    expect(result).toMatchSnapshot();
  });

  it('should have schema annotation with no differences', async () => {
    const gitCommand = `git diff --shortstat --no-index -- ${authoritativeSchemaXsd} ${generatedSchemaXsd}`;
    expect(generatedCoreXsd).toBeDefined();
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
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
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2c/', path.resolve(__dirname, 'artifact', 'EdFiXFinance')],
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
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '3.2.0-c';

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

    state.metaEd.namespace.forEach((namespace) =>
      namespace.data.edfiXsd.xsdSchema.sections.forEach((section) => {
        complexTypeNames.push(section.sectionAnnotation.documentation, ...section.complexTypes.map((y) => y.name));
        simpleTypeNames.push(section.sectionAnnotation.documentation, ...section.simpleTypes.map((y) => y.name));
      }),
    );

    coreResult = R.head(
      R.head(state.generatorResults.filter((x) => x.generatorName === 'edfiXsd.XsdGenerator')).generatedOutput,
    );
    coreFileBaseName = path.basename(coreResult.fileName, '.xsd');
    generatedCoreXsd = `${outputDirectory}/${coreFileBaseName}.xsd`;
    authoritativeCoreXsd = `${artifactPath}/${coreFileBaseName}-Authoritative.xsd`;

    await fs.writeFile(generatedCoreXsd, coreResult.resultString, { encoding: 'utf-8' });

    schemaResult = R.head(
      R.head(state.generatorResults.filter((x) => x.generatorName === 'edfiXsd.SchemaAnnotationGenerator')).generatedOutput,
    );
    schemaFileBaseName = path.basename(schemaResult.fileName, '.xsd');
    generatedSchemaXsd = `${outputDirectory}/${schemaFileBaseName}.xsd`;
    authoritativeSchemaXsd = `${artifactPath}/${schemaFileBaseName}-Authoritative.xsd`;

    await fs.writeFile(generatedSchemaXsd, schemaResult.resultString, { encoding: 'utf-8' });
  });

  it('should have core with no differences', async () => {
    expect(generatedCoreXsd).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index -- ${authoritativeCoreXsd} ${generatedCoreXsd}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    expect(result).toMatchSnapshot();
  });

  it('should have schema annotation with no differences', async () => {
    const gitCommand = `git diff --shortstat --no-index -- ${authoritativeSchemaXsd} ${generatedSchemaXsd}`;
    expect(generatedCoreXsd).toBeDefined();
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
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
