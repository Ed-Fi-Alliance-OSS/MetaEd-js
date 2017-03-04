import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { includeRule, validatable } from '../../../../src/core/validators/Association/FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity';
import SymbolTable from '../../../../src/core/validators/SymbolTable';

chai.should();

describe('FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTests', () => {
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
      .withStartAbstractEntity('First')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndAbstractEntity()

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
      .withAssociationDomainEntityProperty('Third', 'doc1')
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

  describe('When_domain_entity_property_has_invalid_identifier', () => {
    const symbolTable = new SymbolTable();
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('Second')
      .withDocumentation('doc')
      .withStringIdentity('RequirePrimaryKey', 'doc', 100)
      .withEndDomainEntity()

      .withStartAssociation('Association1')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty(entityName, 'doc1')
      .withAssociationDomainEntityProperty('Second', 'doc2')
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

  describe('When rule context has exception', () => {
    const { ruleContext } = addRuleContextPath(['propertyName', 'ID'], {}, true);
    const { invalidPath, validatorName } = validatable('FirstDomainEntityPropertyMustMatchDomainOrAbstractEntityTest', ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
