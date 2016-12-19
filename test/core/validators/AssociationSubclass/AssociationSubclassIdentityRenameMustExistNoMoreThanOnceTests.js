import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/AssociationSubclass/AssociationSubclassIdentityRenameMustExistNoMoreThanOnce';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('AssociationSubclassIdentityRenameMustExistNoMoreThanOnceTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_association_subclass_renames_base_identity_more_than_once', () => {
    const entityName: string = 'SubclassIdentifier';
    const baseName: string = 'BaseAssociationIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(baseName)
      .withDocumentation('because documentation is required')
      .withDomainEntityProperty('DomainEntity1', 'doc')
      .withDomainEntityProperty('DomainEntity2', 'doc')
      .withStringIdentity('Property1', 'because a property is required', 100)
      .withStringIdentity('Property2', 'because a property is required', 100)
      .withEndAssociation()

      .withStartAssociationSubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withStringIdentityRename('Property3', 'Property1', 'because a property is required', 100)
      .withStringIdentityRename('Property4', 'Property2', 'because a property is required', 100)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Association');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('based on');
      helper.errorMessages()[0].message.should.include(baseName);
      helper.errorMessages()[0].message.should.include('tries to rename columns');
      helper.errorMessages()[0].message.should.include('Property1');
      helper.errorMessages()[0].message.should.include('Property2');
      helper.errorMessages()[0].message.should.not.include('Property3');
      helper.errorMessages()[0].message.should.not.include('Property4');
      helper.errorMessages()[0].message.should.include('one identity rename is allowed');
    });
  });
});
