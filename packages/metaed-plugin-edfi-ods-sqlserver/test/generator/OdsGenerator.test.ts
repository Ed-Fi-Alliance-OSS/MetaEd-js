import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { GeneratorResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newSchemaContainer } from '../../src/model/SchemaContainer';
import { generate } from '../../src/generator/OdsGenerator';

describe('when generating output for namespace', (): void => {
  const namespaceName = 'namespaceName';
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsSqlServer', {
      targetTechnologyVersion: '3.0.0',
      shortName: '',
      namespace: new Map(),
      config: {},
    });
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName,
      isExtension: false,
      data: {
        edfiOdsSqlServer: {
          odsSchema: newSchemaContainer(),
        },
      },
    };
    metaEd.namespace.set(namespaceName, namespace);

    result = await generate(metaEd);
  });

  it('should generate empty table output', (): void => {
    expect(result.generatorName).toEqual('edfiOdsSqlServer.OdsGenerator');
    expect(result.generatedOutput[0].fileName).toBe(`0020-${namespaceName}-Tables.sql`);
    expect(result.generatedOutput[0].namespace).toBe(namespaceName);
    expect(result.generatedOutput[0].folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(result.generatedOutput[0].name).toBe('ODS SQL Server Tables');
    expect(result.generatedOutput[0].resultStream).toBeNull();
    expect(result.generatedOutput[0].resultString).toBe('');
  });

  it('should generate empty foreign key output', (): void => {
    expect(result.generatedOutput[1].fileName).toBe(`0030-${namespaceName}-ForeignKeys.sql`);
    expect(result.generatedOutput[1].namespace).toBe(namespaceName);
    expect(result.generatedOutput[1].folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(result.generatedOutput[1].name).toBe('ODS SQL Server Foreign Keys');
    expect(result.generatedOutput[1].resultStream).toBeNull();
    expect(result.generatedOutput[1].resultString).toBe('');
  });

  it('should generate empty extended properties output', (): void => {
    expect(result.generatedOutput[2].fileName).toBe(`0050-${namespaceName}-ExtendedProperties.sql`);
    expect(result.generatedOutput[2].namespace).toBe(namespaceName);
    expect(result.generatedOutput[2].folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(result.generatedOutput[2].name).toBe('ODS SQL Server Extended Properties');
    expect(result.generatedOutput[2].resultStream).toBeNull();
    expect(result.generatedOutput[2].resultString).toBe('');
  });

  it('should generate empty enumerations output', (): void => {
    expect(result.generatedOutput[3].fileName).toBe(`0010-${namespaceName}-Enumerations.sql`);
    expect(result.generatedOutput[3].namespace).toBe(namespaceName);
    expect(result.generatedOutput[3].folderName).toBe('/Database/SQLServer/ODS/Data/');
    expect(result.generatedOutput[3].name).toBe('ODS SQL Server Enumerations');
    expect(result.generatedOutput[3].resultStream).toBeNull();
    expect(result.generatedOutput[3].resultString).toBe('');
  });

  it('should generate empty school years output', (): void => {
    expect(result.generatedOutput[4].fileName).toBe(`0020-${namespaceName}-SchoolYears.sql`);
    expect(result.generatedOutput[4].namespace).toBe(namespaceName);
    expect(result.generatedOutput[4].folderName).toBe('/Database/SQLServer/ODS/Data/');
    expect(result.generatedOutput[4].name).toBe('ODS SQL Server School Years');
    expect(result.generatedOutput[4].resultStream).toBeNull();
    expect(result.generatedOutput[4].resultString).toBe('');
  });
});

describe('when generating output for core namespace', (): void => {
  let result: GeneratorResult;
  const namespaceName = 'EdFi';

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsSqlServer', {
      targetTechnologyVersion: '3.0.0',
      shortName: '',
      namespace: new Map(),
      config: {},
    });

    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName,
      isExtension: false,
      data: {
        edfiOdsSqlServer: {
          odsSchema: newSchemaContainer(),
        },
      },
    };
    metaEd.namespace.set(namespaceName, namespace);

    result = await generate(metaEd);
  });

  it('should generate empty table output', (): void => {
    expect(result.generatorName).toEqual('edfiOdsSqlServer.OdsGenerator');
    expect(result.generatedOutput[0].fileName).toBe(`0020-Tables.sql`);
    expect(result.generatedOutput[0].namespace).toBe(namespaceName);
    expect(result.generatedOutput[0].folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(result.generatedOutput[0].name).toBe('ODS SQL Server Tables');
    expect(result.generatedOutput[0].resultStream).toBeNull();
    expect(result.generatedOutput[0].resultString).toBe('');
  });

  it('should generate empty foreign key output', (): void => {
    expect(result.generatedOutput[1].fileName).toBe(`0030-ForeignKeys.sql`);
    expect(result.generatedOutput[1].namespace).toBe(namespaceName);
    expect(result.generatedOutput[1].folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(result.generatedOutput[1].name).toBe('ODS SQL Server Foreign Keys');
    expect(result.generatedOutput[1].resultStream).toBeNull();
    expect(result.generatedOutput[1].resultString).toBe('');
  });

  it('should generate empty extended properties output', (): void => {
    expect(result.generatedOutput[2].fileName).toBe(`0050-ExtendedProperties.sql`);
    expect(result.generatedOutput[2].namespace).toBe(namespaceName);
    expect(result.generatedOutput[2].folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(result.generatedOutput[2].name).toBe('ODS SQL Server Extended Properties');
    expect(result.generatedOutput[2].resultStream).toBeNull();
    expect(result.generatedOutput[2].resultString).toBe('');
  });

  it('should generate empty enumerations output', (): void => {
    expect(result.generatedOutput[3].fileName).toBe(`0010-Enumerations.sql`);
    expect(result.generatedOutput[3].namespace).toBe(namespaceName);
    expect(result.generatedOutput[3].folderName).toBe('/Database/SQLServer/ODS/Data/');
    expect(result.generatedOutput[3].name).toBe('ODS SQL Server Enumerations');
    expect(result.generatedOutput[3].resultStream).toBeNull();
    expect(result.generatedOutput[3].resultString).toBe('');
  });

  it('should generate empty school years output', (): void => {
    expect(result.generatedOutput[4].fileName).toBe(`0020-SchoolYears.sql`);
    expect(result.generatedOutput[4].namespace).toBe(namespaceName);
    expect(result.generatedOutput[4].folderName).toBe('/Database/SQLServer/ODS/Data/');
    expect(result.generatedOutput[4].name).toBe('ODS SQL Server School Years');
    expect(result.generatedOutput[4].resultStream).toBeNull();
    expect(result.generatedOutput[4].resultString).toBe('');
  });
});

describe('when generating output for namespace targeting 2.x', (): void => {
  const namespaceName = 'namespaceName';
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = {
      ...newMetaEdEnvironment(),
      dataStandardVersion: '2.0.1',
    };
    metaEd.plugin.set('edfiOdsSqlServer', {
      targetTechnologyVersion: '2.2.0',
      shortName: '',
      namespace: new Map(),
      config: {},
    });
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName,
      isExtension: false,
      data: {
        edfiOdsSqlServer: {
          odsSchema: newSchemaContainer(),
        },
      },
    };
    metaEd.namespace.set(namespaceName, namespace);

    result = await generate(metaEd);
  });

  it('should generate empty output', (): void => {
    expect(result.generatorName).toEqual('edfiOdsSqlServer.OdsGenerator');
    expect(result.generatedOutput[0].fileName).toBe(`0004-${namespaceName}-Tables.sql`);
    expect(result.generatedOutput[0].namespace).toBe(namespaceName);
    expect(result.generatedOutput[0].folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(result.generatedOutput[0].name).toBe('ODS SQL Server Tables');
    expect(result.generatedOutput[0].resultStream).toBeNull();
    expect(result.generatedOutput[0].resultString).toBe('');
  });
});
