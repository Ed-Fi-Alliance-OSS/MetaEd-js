// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  GeneratorResult,
  SemVer,
  PluginEnvironment,
  newPluginEnvironment,
  SharedStringBuilder,
} from '@edfi/metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  EnumerationBuilder,
} from '@edfi/metaed-core';
import { initialize as initializeUnifiedPlugin } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as initializeOdsRelationalPlugin } from '@edfi/metaed-plugin-edfi-ods-relational';
import { initialize as initializeOdsSqlServerPlugin } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import { initialize as initializeApiSchemaPlugin } from '@edfi/metaed-plugin-edfi-api-schema';
import { defaultPluginTechVersion } from '@edfi/metaed-core';
import { initialize as initializeHandbookPlugin } from '../../src/index';
import { generate } from '../../src/generator/EdFiDataHandbookAsHtmlIndexGenerator';

describe('when generating HTML version of handbook', (): void => {
  const dataStandardVersion: SemVer = '3.2.0-c';
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion };

  let generatorResults: GeneratorResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const enumerationBuilder = new EnumerationBuilder(metaEd, []);
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndAbstractEntity()

      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDomainEntity('Entity1')
      .withDocumentation('Entity1 doc')
      .withIntegerIdentity('Entity1Integer', 'Entity1Integer doc')
      .withStringProperty('Entity1String', 'Entity1String doc', true, false, '0', '100')
      .withDateProperty('Entity1DateCollection', 'Entity1DateCollection doc', false, true)
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Entity2 doc')
      .withIntegerIdentity('Entity2Integer', 'Entity2Integer doc')
      .withStringProperty('Entity2String', 'Entity2String doc', true, false, '0', '100', 'Entity2String')
      .withDateProperty('Entity2DateCollection', 'Entity2DateCollection doc', false, true)
      .withEndDomainEntity()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(enumerationBuilder)
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(domainEntityBuilder);

    initializeUnifiedPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    initializeOdsRelationalPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    const edfiOdsRelationalPluginEnvironment: PluginEnvironment | undefined = metaEd.plugin.get('edfiOdsRelational');
    if (edfiOdsRelationalPluginEnvironment != null)
      edfiOdsRelationalPluginEnvironment.targetTechnologyVersion = defaultPluginTechVersion;
    initializeOdsSqlServerPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    initializeApiSchemaPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    initializeHandbookPlugin().enhancer.forEach((enhance) => enhance(metaEd));

    generatorResults = await generate(metaEd);
  });

  it('should generate a non empty string', (): void => {
    expect(generatorResults.generatedOutput[0].resultString).toBeDefined();
  });

  it('should generate HTML', (): void => {
    expect(generatorResults.generatedOutput[0].resultString).toContain('<html>');
    expect(generatorResults.generatedOutput[0].resultString).toContain('</html>');
  });

  it('should not duplicate entity names when role name is the same as metaEdName', (): void => {
    expect(generatorResults.generatedOutput[0].resultString).toContain('Entity2String');
    expect(generatorResults.generatedOutput[0].resultString).not.toContain('Entity2StringEntity2String');
  });
});
