import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/DomainEntityExtension/DomainEntityExtensionExistsOnlyInExtensionNamespace';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('DomainEntityExtensionExistsOnlyInExtensionNamespaceTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_domain_entity_extension_exists_in_extension', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'projectExtension')
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

  describe('When_domain_entity_extension_exists_in_core', () => {
    const coreNamespace: string = 'edfi';
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespace)
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

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.include('Domain Entity additions');
      helper.errorMessageCollection()[0].message.should.include(entityName);
      helper.errorMessageCollection()[0].message.should.include('is not valid in core namespace');
      helper.errorMessageCollection()[0].message.should.include(coreNamespace);
    });
  });
});
