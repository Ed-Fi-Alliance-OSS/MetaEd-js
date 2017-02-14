import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { includeRule } from '../../../../src/core/validators/Association/SecondDomainEntityPropertyMustNotCollideWithOtherProperty';
import SymbolTable from '../../../../src/core/validators/SymbolTable';

chai.should();

describe('SecondDomainEntityPropertyMustNotCollideWithOtherProperty', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_domain_entity_property_does_not_collide', () => {
    const symbolTable = new SymbolTable();
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('First')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndDomainEntity()

      .withStartDomainEntity('Second')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndDomainEntity()

      .withStartAssociation('Association1')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('First', 'doc1')
      .withAssociationDomainEntityProperty('Second', 'doc2')
      .withIntegerProperty('Third', 'doc3', false, false)
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener, symbolTable);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_domain_entity_property_does_collide', () => {
    const symbolTable = new SymbolTable();
    const associationName = 'Association1';
    const secondName = 'Second';

    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()

      .withBeginNamespace('edfi')
      .withStartDomainEntity('First')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndDomainEntity()

      .withStartDomainEntity('Second')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('First', 'doc')
      .withAssociationDomainEntityProperty(secondName, 'doc')
      .withIntegerProperty(secondName, 'doc', false, false)
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener, symbolTable);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().length.should.equal(1);
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Entity');
      helper.errorMessages()[0].message.should.include(associationName);
      helper.errorMessages()[0].message.should.include('has duplicate');
      helper.errorMessages()[0].message.should.include(secondName);
    });
  });
});
