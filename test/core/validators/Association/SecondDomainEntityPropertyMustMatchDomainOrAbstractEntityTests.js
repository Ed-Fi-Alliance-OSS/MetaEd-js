import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { includeRule } from '../../../../src/core/validators/Association/SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity';
import SymbolTable from '../../../../src/core/validators/SymbolTable';

chai.should();

describe('SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_domain_entity_property_has_domain_entity_identifier', () => {
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
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener, symbolTable);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_domain_entity_property_has_abstract_entity_identifier', () => {
    const symbolTable = new SymbolTable();
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('First')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndDomainEntity()

      .withStartAbstractEntity('Second')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndAbstractEntity()

      .withStartAssociation('Association1')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('First', 'doc1')
      .withAssociationDomainEntityProperty('Second', 'doc2')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener, symbolTable);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_domain_entity_property_has_subclass_entity_identifier', () => {
    const symbolTable = new SymbolTable();
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity('First')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndAbstractEntity()
      .withStartDomainEntity('Second')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass('Third', 'First')
      .withDocumentation('doc')
      .withStringProperty('RequirePrimaryKey', 'doc', true, false, 100)
      .withEndDomainEntity()

      .withStartAssociation('Association1')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Second', 'doc1')
      .withAssociationDomainEntityProperty('Third', 'doc2')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener, symbolTable);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_domain_entity_property_has_invalid_identifier', () => {
    const symbolTable = new SymbolTable();
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('First')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndDomainEntity()

      .withStartAssociation('Association1')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('First', 'doc1')
      .withAssociationDomainEntityProperty(entityName, 'doc2')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener, symbolTable);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().length.should.not.equal(0);
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Domain Entity');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('does not match');
    });
  });
});
