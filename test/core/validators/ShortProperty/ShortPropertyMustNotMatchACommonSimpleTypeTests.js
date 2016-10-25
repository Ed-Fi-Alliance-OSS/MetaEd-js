import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/ShortProperty/ShortPropertyMustNotMatchACommonSimpleType';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('ShortPropertyMustNotMatchACommonSimpleTypeTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_short_property_has_identifier_matching_no_common_simple_types', () => {
    const entityName: string = 'EntityName';
    const propertyName: string = 'PropertyName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withShortProperty(propertyName, 'doc', false, false, 10, 2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection.length.should.equal(0);
    });
  });

  describe('When_short_property_has_identifier_matching_common_decimal', () => {
    const commonEntityName: string = 'CommonEntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonDecimal(commonEntityName)
      .withDocumentation('doc')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withEndCommonDecimal()

      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withShortProperty(commonEntityName, 'doc', false, false, 10, 2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.include('Short property');
      helper.errorMessageCollection[0].message.should.include(commonEntityName);
      helper.errorMessageCollection[0].message.should.include('has the same name');
    });
  });

  describe('When_short_property_has_identifier_matching_common_integer', () => {
    const commonEntityName: string = 'CommonEntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonInteger(commonEntityName)
      .withDocumentation('doc')
      .withMaxValue(100)
      .withEndCommonInteger()

      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withShortProperty(commonEntityName, 'doc', false, false, 10, 2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.include('Short property');
      helper.errorMessageCollection[0].message.should.include(commonEntityName);
      helper.errorMessageCollection[0].message.should.include('has the same name');
    });
  });

  describe('When_short_property_has_identifier_matching_common_short', () => {
    const commonEntityName: string = 'CommonEntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonShort(commonEntityName)
      .withDocumentation('doc')
      .withMaxValue(100)
      .withEndCommonShort()

      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withShortProperty(commonEntityName, 'doc', false, false, 10, 2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.include('Short property');
      helper.errorMessageCollection[0].message.should.include(commonEntityName);
      helper.errorMessageCollection[0].message.should.include('has the same name');
    });
  });

  describe('When_short_property_has_identifier_matching_common_string', () => {
    const commonEntityName: string = 'CommonEntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonString(commonEntityName)
      .withDocumentation('doc')
      .withMaxLength(100)
      .withEndCommonString()

      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withShortProperty(commonEntityName, 'doc', false, false, 10, 2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.include('Short property');
      helper.errorMessageCollection[0].message.should.include(commonEntityName);
      helper.errorMessageCollection[0].message.should.include('has the same name');
    });
  });
});
