import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/StringProperty/StringPropertyMustNotMatchACommonSimpleType';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('StringPropertyMustNotMatchACommonSimpleTypeTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_string_property_has_identifier_matching_no_common_simple_types', () => {
    const entityName: string = 'EntityName';
    const propertyName: string = 'PropertyName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withStringProperty(propertyName, 'doc', false, false, 10, 2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_string_property_has_identifier_matching_common_decimal', () => {
    const commonEntityName: string = 'CommonEntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedDecimal(commonEntityName)
      .withDocumentation('doc')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withEndSharedDecimal()

      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withStringProperty(commonEntityName, 'doc', false, false, 10, 2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().length.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('String property');
      helper.errorMessages()[0].message.should.include(commonEntityName);
      helper.errorMessages()[0].message.should.include('has the same name');
    });
  });

  describe('When_string_property_has_identifier_matching_common_integer', () => {
    const commonEntityName: string = 'CommonEntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedInteger(commonEntityName)
      .withDocumentation('doc')
      .withMaxValue(100)
      .withEndSharedInteger()

      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withStringProperty(commonEntityName, 'doc', false, false, 10, 2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().length.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('String property');
      helper.errorMessages()[0].message.should.include(commonEntityName);
      helper.errorMessages()[0].message.should.include('has the same name');
    });
  });

  describe('When_string_property_has_identifier_matching_common_short', () => {
    const commonEntityName: string = 'CommonEntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedShort(commonEntityName)
      .withDocumentation('doc')
      .withMaxValue(100)
      .withEndSharedShort()

      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withStringProperty(commonEntityName, 'doc', false, false, 10, 2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().length.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('String property');
      helper.errorMessages()[0].message.should.include(commonEntityName);
      helper.errorMessages()[0].message.should.include('has the same name');
    });
  });

  describe('When_string_property_has_identifier_matching_common_string', () => {
    const commonEntityName: string = 'CommonEntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedString(commonEntityName)
      .withDocumentation('doc')
      .withMaxLength(100)
      .withEndSharedString()

      .withStartDomainEntity('EntityName')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withStringProperty(commonEntityName, 'doc', false, false, 10, 2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().length.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('String property');
      helper.errorMessages()[0].message.should.include(commonEntityName);
      helper.errorMessages()[0].message.should.include('has the same name');
    });
  });

  describe('When rule context has propertyName exception', () => {
    const { ruleContext } = addRuleContextPath(['propertyName', 'ID'], {}, true);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
