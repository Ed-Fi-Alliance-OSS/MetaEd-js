import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/DomainEntityExtension/DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_domain_entity_extension_has_different_property_name', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('Property2', 'because a property is required', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_domain_entity_extension_has_duplicate_property_name', () => {
    const entityName: string = 'MyIdentifier';
    const duplicatePropertyName: string = 'Property1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty(duplicatePropertyName, 'because a property is required', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty(duplicatePropertyName, 'because a property is required', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.include('Domain Entity additions');
      helper.errorMessageCollection()[0].message.should.include(entityName);
      helper.errorMessageCollection()[0].message.should.include(duplicatePropertyName);
      helper.errorMessageCollection()[0].message.should.include('already in property list');
    });
  });

  describe('When_domain_entity_extension_has_multiple_duplicate_property_names', () => {
    const entityName: string = 'MyIdentifier';
    const notDuplicatePropertyName: string = 'NotADuplicate';
    const duplicatePropertyName1: string = 'Property1';
    const duplicatePropertyName2: string = 'Property2';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty(duplicatePropertyName1, 'because a property is required', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'because a property is required', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty(duplicatePropertyName1, 'because a property is required', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'because a property is required', true, false)
      .withBooleanProperty(notDuplicatePropertyName, 'because a property is required', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.include('Domain Entity additions');
      helper.errorMessageCollection()[0].message.should.include(entityName);
      helper.errorMessageCollection()[0].message.should.include(duplicatePropertyName1);
      helper.errorMessageCollection()[0].message.should.include(duplicatePropertyName2);
      helper.errorMessageCollection()[0].message.should.include('already in property list');
      helper.errorMessageCollection()[0].message.should.not.include(notDuplicatePropertyName);
    });
  });

  describe('When_domain_entity_extension_has_duplicate_include_property', () => {
    const entityName: string = 'MyIdentifier';
    const duplicatePropertyName: string = 'Property1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withIncludeProperty(duplicatePropertyName, 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withIncludeProperty(duplicatePropertyName, 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });
  });

  describe('When_domain_entity_extension_has_duplicate_include_extension_override_property', () => {
    const entityName: string = 'MyIdentifier';
    const duplicatePropertyName: string = 'Property1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withIncludeProperty(duplicatePropertyName, 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withIncludeExtensionOverrideProperty(duplicatePropertyName, 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_not_have_validation_failure()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });
});
