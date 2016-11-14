import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/IncludeProperty/IncludePropertyMustNotContainIdentity';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('IncludePropertyMustNotContainIdentity', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_include_property_has_primary_key', () => {
    const commonTypeName: string = 'CommonType';
    const entityName: string = 'MyIdentifier';
    const propertyName: string = 'Identifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommonType(commonTypeName)
      .withDocumentation('doc')
      .withStringProperty('StringProperty', 'doc', true, false, 100)
      .withEndCommonType()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withIncludeIdentity(propertyName, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.include('Include');
      helper.errorMessageCollection()[0].message.should.include(propertyName);
      helper.errorMessageCollection()[0].message.should.include('invalid');
    });
  });
});
