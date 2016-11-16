import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnceTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_domain_entity_subclass_renames_base_identity_more_than_once', () => {
    const entityName: string = 'SubclassIdentifier';
    const baseName: string = 'BaseDomainEntityIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(baseName)
      .withDocumentation('because documentation is required')
      .withStringIdentity('Property1', 'because a property is required', 100)
      .withStringIdentity('Property2', 'because a property is required', 100)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withStringIdentityRename('Property3', 'Property1', 'because a property is required', 100)
      .withStringIdentityRename('Property4', 'Property2', 'because a property is required', 100)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.equal('Domain Entity \'SubclassIdentifier\' based on \'BaseDomainEntityIdentifier\' tries to rename columns Property1, Property2.  Only one identity rename is allowed for a given Domain Entity.');
    });
  });
});
