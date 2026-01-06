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
  const dataStandardVersion: SemVer = '5.2.0';
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
      .withStringProperty('EdOrgString', 'EdOrgString doc', true, false, '0', '100', null, null, true)
      .withEndAbstractEntity()

      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDomainEntity('LocalBudget')
      .withDocumentation('LocalBudget')
      .withIntegerIdentity('LocalAccount', 'LocalAccount doc')
      .withStringProperty('LocalAccountName', 'LocalAccountName doc', true, false, '0', '100')
      .withDateProperty('ActualDate', 'The month, day, and year.', false, true)
      .withCurrencyProperty('Amount', 'The amount of money.', true, false)
      .withPercentProperty('Percent', 'percent of local.', true, false)
      .withDurationProperty('TimePeriod', 'TimePeriod doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('LocalEducationAgency')
      .withDocumentation('LocalEducationAgency')
      .withIntegerIdentity('LocalEducationAgencyId', 'LocalEducationAgencyId doc')
      .withStringProperty(
        'EducationServiceCenter',
        'EducationServiceCenter doc',
        true,
        false,
        '0',
        '100',
        'LocalEducationAgencyName',
        null,
        true,
      )
      .withDateProperty('AsOfDate', 'The date of the reported amount for the account.', false, true)
      .withCurrencyProperty('FederalProgramsFundingAllocation', 'FederalProgramsFundingAllocation.', true, false)
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
    expect(generatorResults.generatedOutput[0].resultString).toContain('EducationServiceCenter');
    expect(generatorResults.generatedOutput[0].resultString).not.toContain('EducationServiceCenterEducationServiceCenter');
  });

  it('should include isSensitiveData information for properties', (): void => {
    expect(generatorResults.generatedOutput[0].resultString).toContain('"isIdentity":true');
  });
  it('should include "Used By" entries showing which entities use Currency type', (): void => {
    const htmlOutput = generatorResults.generatedOutput[0].resultString;

    expect(htmlOutput).toContain('"entityName":"LocalBudget"');
    expect(htmlOutput).toContain('"propertyName":"Amount"');
    expect(htmlOutput).toContain('"cardinality":"required"');

    expect(htmlOutput).toMatch(/"entityName":"LocalBudget"[^}]*"propertyName":"Amount"[^}]*"cardinality":"required"/);

    expect(htmlOutput).toContain('"entityName":"LocalEducationAgency"');
    expect(htmlOutput).toContain('"propertyName":"FederalProgramsFundingAllocation"');

    expect(htmlOutput).toMatch(
      /"entityName":"LocalEducationAgency"[^}]*"propertyName":"FederalProgramsFundingAllocation"[^}]*"cardinality":"required"/,
    );
  });

  it('should include "Used By" entries showing which entities use Date type', (): void => {
    const htmlOutput = generatorResults.generatedOutput[0].resultString;

    expect(htmlOutput).toContain('"entityName":"LocalBudget"');
    expect(htmlOutput).toContain('"propertyName":"ActualDate"');
    expect(htmlOutput).toContain('"cardinality":"optional collection"');

    expect(htmlOutput).toMatch(
      /"entityName":"LocalBudget"[^}]*"propertyName":"ActualDate"[^}]*"cardinality":"optional collection"/,
    );
  });

  it('should include "Used By" entries showing which entities use Percent type', (): void => {
    const htmlOutput = generatorResults.generatedOutput[0].resultString;

    expect(htmlOutput).toContain('"entityName":"LocalBudget"');
    expect(htmlOutput).toContain('"propertyName":"Percent"');
    expect(htmlOutput).toContain('"cardinality":"required"');

    expect(htmlOutput).toMatch(/"entityName":"LocalBudget"[^}]*"propertyName":"Percent"[^}]*"cardinality":"required"/);
  });

  it('should include "Used By" entries showing which entities use TimeInterval type', (): void => {
    const htmlOutput = generatorResults.generatedOutput[0].resultString;

    expect(htmlOutput).toContain('"entityName":"LocalBudget"');
    expect(htmlOutput).toContain('"propertyName":"TimePeriod"');
    expect(htmlOutput).toContain('"cardinality":"required"');

    expect(htmlOutput).toMatch(/"entityName":"LocalBudget"[^}]*"propertyName":"TimePeriod"[^}]*"cardinality":"required"/);
  });

  describe('References table for Domain Entities', (): void => {
    let htmlOutput: string;

    beforeAll(() => {
      htmlOutput = generatorResults.generatedOutput[0].resultString;
    });

    it('should include modelReferencesContainsProperties for EducationOrganization', (): void => {
      expect(htmlOutput).toContain('"modelReferencesContainsProperties"');
      expect(htmlOutput).toContain('"name":"EducationOrganizationId"');
      expect(htmlOutput).toContain('"name":"EdOrgString"');
    });

    it('should include correct property metadata for EducationOrganizationId', (): void => {
      expect(htmlOutput).toMatch(/"name":"EducationOrganizationId"/);
      expect(htmlOutput).toMatch(/"metaEdDatatype":"IntegerProperty"/);
      expect(htmlOutput).toMatch(/"umlDatatype":"Number"/);
      expect(htmlOutput).toMatch(/"jsonDatatype":"number"/);
      expect(htmlOutput).toMatch(/"sqlDatatype":"INT"/);
      expect(htmlOutput).toMatch(/"isIdentity":true/);
      expect(htmlOutput).toMatch(/"isSensitiveData":false/);
      expect(htmlOutput).toMatch(/"cardinality":"required"/);
    });

    it('should include correct property metadata for EdOrgString with sensitive data', (): void => {
      expect(htmlOutput).toMatch(/"name":"EdOrgString"/);
      expect(htmlOutput).toMatch(/"metaEdDatatype":"StringProperty"/);
      expect(htmlOutput).toMatch(/"umlDatatype":"String"/);
      expect(htmlOutput).toMatch(/"jsonDatatype":"string"/);
      expect(htmlOutput).toMatch(/"sqlDatatype":"VARCHAR\(0\)"/);
      expect(htmlOutput).toMatch(/"isIdentity":false/);
      expect(htmlOutput).toMatch(/"isSensitiveData":true/);
      expect(htmlOutput).toMatch(/"cardinality":"required"/);
    });

    it('should include all properties for LocalBudget entity', (): void => {
      expect(htmlOutput).toContain('"name":"LocalAccount"');
      expect(htmlOutput).toContain('"name":"LocalAccountName"');
      expect(htmlOutput).toContain('"name":"ActualDate"');
      expect(htmlOutput).toContain('"name":"Amount"');
      expect(htmlOutput).toContain('"name":"Percent"');
      expect(htmlOutput).toContain('"name":"TimePeriod"');
    });

    it('should include correct metadata for LocalBudget DateProperty (ActualDate)', (): void => {
      expect(htmlOutput).toMatch(/"name":"ActualDate"/);
      expect(htmlOutput).toMatch(/"metaEdDatatype":"DateProperty"/);
      expect(htmlOutput).toMatch(/"umlDatatype":"Date"/);
      expect(htmlOutput).toMatch(/"sqlDatatype":"DATE"/);
      expect(htmlOutput).toMatch(/"cardinality":"optional collection"/);
    });

    it('should include correct metadata for LocalBudget CurrencyProperty (Amount)', (): void => {
      expect(htmlOutput).toMatch(/"name":"Amount"/);
      expect(htmlOutput).toMatch(/"metaEdDatatype":"CurrencyProperty"/);
      expect(htmlOutput).toMatch(/"sqlDatatype":"MONEY"/);
      expect(htmlOutput).toMatch(/"cardinality":"required"/);
    });

    it('should include correct metadata for LocalBudget PercentProperty (Percent)', (): void => {
      expect(htmlOutput).toMatch(/"name":"Percent"/);
      expect(htmlOutput).toMatch(/"metaEdDatatype":"PercentProperty"/);
      expect(htmlOutput).toMatch(/"sqlDatatype":"DECIMAL\(5, 4\)"/);
      expect(htmlOutput).toMatch(/"cardinality":"required"/);
    });

    it('should include correct metadata for LocalBudget DurationProperty (TimePeriod)', (): void => {
      expect(htmlOutput).toMatch(/"name":"TimePeriod"/);
      expect(htmlOutput).toMatch(/"metaEdDatatype":"DurationProperty"/);
      expect(htmlOutput).toMatch(/"sqlDatatype":"VARCHAR\(30\)"/);
      expect(htmlOutput).toMatch(/"cardinality":"required"/);
    });

    it('should include all properties for LocalEducationAgency entity', (): void => {
      expect(htmlOutput).toContain('"name":"LocalEducationAgencyId"');
      expect(htmlOutput).toContain('"name":"LocalEducationAgencyNameEducationServiceCenter"');
      expect(htmlOutput).toContain('"name":"AsOfDate"');
      expect(htmlOutput).toContain('"name":"FederalProgramsFundingAllocation"');
    });

    it('should include correct metadata for LocalEducationAgency with role name', (): void => {
      expect(htmlOutput).toMatch(/"name":"LocalEducationAgencyNameEducationServiceCenter"/);
      expect(htmlOutput).toMatch(/"metaEdDatatype":"StringProperty"/);
      expect(htmlOutput).toMatch(/"isSensitiveData":true/);
      expect(htmlOutput).toMatch(/"cardinality":"required"/);
    });

    it('should populate modelReferencesContains array for all domain entities', (): void => {
      expect(htmlOutput).toMatch(/"modelReferencesContains":\[/);
      expect(htmlOutput).toMatch(/"EducationOrganizationId \(identity\)"/);
      expect(htmlOutput).toMatch(/"EdOrgString \(required\)"/);
      expect(htmlOutput).toMatch(/"LocalAccount \(identity\)"/);
      expect(htmlOutput).toMatch(/"ActualDate \(optional collection\)"/);
      expect(htmlOutput).toMatch(/"Amount \(required\)"/);
    });

    it('should include referenceUniqueIdentifier for all properties', (): void => {
      expect(htmlOutput).toMatch(/"referenceUniqueIdentifier":"[^"]+"/);
      expect(htmlOutput).not.toContain('"referenceUniqueIdentifier": ""');
    });

    it('should include jsonElementName for all properties', (): void => {
      expect(htmlOutput).toMatch(/"jsonElementName":"EducationOrganizationId"/);
      expect(htmlOutput).toMatch(/"jsonElementName":"EdOrgString"/);
      expect(htmlOutput).toMatch(/"jsonElementName":"LocalAccount"/);
      expect(htmlOutput).toMatch(/"jsonElementName":"Amount"/);
    });

    it('should include correct cardinality values for all property types', (): void => {
      expect(htmlOutput).toMatch(/"cardinality":"required"/);
      expect(htmlOutput).toMatch(/"cardinality":"optional collection"/);
    });
  });
});
