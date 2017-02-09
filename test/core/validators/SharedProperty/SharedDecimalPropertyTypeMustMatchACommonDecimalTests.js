import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/SharedProperty/SharedDecimalPropertyTypeMustMatchACommonDecimal';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('SharedDecimalPropertyTypeMustMatchACommonDecimalTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_shared_property_has_identifier_of_common_simple_decimal', () => {
    const entityName: string = 'EntityName';
    const propertyName: string = 'PropertyName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonDecimal(entityName)
      .withDocumentation('doc')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withEndCommonDecimal()

      .withStartDomainEntity('DomainEntity')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withSharedDecimalProperty(entityName, propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_shared_property_has_no_identifier', () => {
    const entityName: string = 'EntityName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
        .withBeginNamespace('edfi')
        .withStartCommonDecimal(entityName)
        .withDocumentation('doc')
        .withTotalDigits('10')
        .withDecimalPlaces('2')
        .withEndCommonDecimal()

        .withStartDomainEntity('DomainEntity')
        .withDocumentation('doc')
        .withStringIdentity('RequirePrimaryKey', 'doc', 100)
        .withSharedDecimalProperty(entityName, null, 'doc', true, false)
        .withEndDomainEntity()
        .withEndNamespace()
        .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_shared_decimal_property_has_invalid_identifier', () => {
    const entityName: string = 'DoesNotExist';
    const propertyName: string = 'PropertyName';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntity')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withSharedDecimalProperty(entityName, propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Shared property');
      helper.errorMessages()[0].message.should.include(propertyName);
      helper.errorMessages()[0].message.should.include('does not match');
    });
  });

  describe('When_shared_decimal_property_has_invalid_type_and_no_identifier', () => {
    const entityName: string = 'DoesNotExist';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
        .withBeginNamespace('edfi')
        .withStartDomainEntity('DomainEntity')
        .withDocumentation('doc')
        .withStringIdentity('RequirePrimaryKey', 'doc', 100)
        .withSharedDecimalProperty(entityName, null, 'doc', true, false)
        .withEndDomainEntity()
        .withEndNamespace()
        .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Shared property');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('does not match');
    });
  });

  describe('When rule context has sharedPropertyType exception', () => {
    const { ruleContext } = addRuleContextPath(['sharedPropertyType', 'ID'], {}, true);
    addRuleContextPath(['propertyName', 'ID'], {}, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
