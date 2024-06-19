import Ajv from 'ajv';
import addFormatsTo from 'ajv-formats';
import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as booleanNumericJsonPathsEnhancer } from '../../src/enhancer/BooleanNumericJsonPathsEnhancer';
import { enhance } from '../../src/enhancer/IdentityJsonPathsEnhancer';

const ajv = new Ajv({ allErrors: true });
addFormatsTo(ajv);

function runApiSchemaEnhancers(metaEd: MetaEdEnvironment) {
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  booleanNumericJsonPathsEnhancer(metaEd);
  enhance(metaEd);
}

describe('when building simple domain entity with all the simple non-collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('OptionalBooleanProperty', 'doc1', false, false)
      .withCurrencyProperty('RequiredCurrencyProperty', 'doc2', true, false)
      .withDecimalProperty('OptionalDecimalProperty', 'doc3', false, false, '2', '1')
      .withDurationProperty('RequiredDurationProperty', 'doc4', true, false)
      .withPercentProperty('OptionalPercentProperty', 'doc5', false, false)
      .withDateProperty('RequiredDateProperty', 'doc6', true, false)
      .withDatetimeProperty('RequiredDatetimeProperty', 'doc7', true, false)
      .withIntegerProperty('RequiredIntegerProperty', 'doc8', true, false, '10', '5')
      .withShortProperty('OptionalShortProperty', 'doc9', false, false)
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withTimeProperty('RequiredTimeProperty', 'doc11', true, false)
      .withEnumerationProperty('SchoolYear', 'doc12', false, false)
      .withYearProperty('OptionalYear', 'doc13', false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct booleanJsonPaths for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const booleanJsonPaths = entity?.data.edfiApiSchema.booleanJsonPaths;
    expect(booleanJsonPaths).toMatchInlineSnapshot(`
        Array [
          "$.optionalBooleanProperty",
        ]
      `);
  });

  it('should be correct numericJsonPaths for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const numericJsonPaths = entity?.data.edfiApiSchema.numericJsonPaths;
    expect(numericJsonPaths).toMatchInlineSnapshot(`
        Array [
          "$.optionalDecimalProperty",
          "$.optionalPercentProperty",
          "$.optionalShortProperty",
          "$.optionalYear",
          "$.requiredCurrencyProperty",
          "$.requiredDurationProperty",
          "$.requiredIntegerProperty",
          "$.schoolYearTypeReference.schoolYear",
        ]
      `);
  });
});
