import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/Association/AssociationMustNotDuplicateDomainEntityNames';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('AssociationMustNotDuplicateDomainEntityNamesTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('entityNames no duplicates', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation('Association1')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc1')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc2')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });
    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('entity names with duplicates', () => {
    const associationName: string = 'Association1';
    const domainEntityName: string = 'DomainEntity1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(associationName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty(domainEntityName, 'doc1')
      .withAssociationDomainEntityProperty(domainEntityName, 'doc2')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Association');
      helper.errorMessages()[0].message.should.include(associationName);
      helper.errorMessages()[0].message.should.include(domainEntityName);
      helper.errorMessages()[0].message.should.include('duplicate declarations');
    });
  });

  describe('entityNames_and_same_contexts', () => {
    const associationName: string = 'Association1';
    const domainEntityName: string = 'DomainEntity1';
    const contextName: string = 'Context1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(associationName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty(domainEntityName, 'doc1', contextName)
      .withAssociationDomainEntityProperty(domainEntityName, 'doc2', contextName)
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Association');
      helper.errorMessages()[0].message.should.include(associationName);
      helper.errorMessages()[0].message.should.include(domainEntityName);
      helper.errorMessages()[0].message.should.include('duplicate declarations');
    });
  });

  describe('entityNames_and_different_contexts', () => {
    const domainEntityName: string = 'DomainEntity1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation('Association1')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty(domainEntityName, 'doc1', 'Context1')
      .withAssociationDomainEntityProperty(domainEntityName, 'doc2', 'Context2')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('entityNames_and_same_contexts', () => {
    const contextName: string = 'Context1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation('Association1')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc1', contextName)
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc2', contextName)
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When rule context has 1st DE exceptions', () => {
    const ruleContext = {};
    addRuleContextPath(['firstDomainEntity', 'propertyName', 'ID'], ruleContext, true);
    addRuleContextPath(['secondDomainEntity', 'propertyName', 'ID'], ruleContext, false);
    addRuleContextPath(['firstDomainEntity', 'withContext', 'withContextName', 'ID'], ruleContext, false);
    addRuleContextPath(['secondDomainEntity', 'withContext', 'withContextName', 'ID'], ruleContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has 2nd DE exceptions', () => {
    const ruleContext = {};
    addRuleContextPath(['firstDomainEntity', 'propertyName', 'ID'], ruleContext, false);
    addRuleContextPath(['secondDomainEntity', 'propertyName', 'ID'], ruleContext, true);
    addRuleContextPath(['firstDomainEntity', 'withContext', 'withContextName', 'ID'], ruleContext, false);
    addRuleContextPath(['secondDomainEntity', 'withContext', 'withContextName', 'ID'], ruleContext, false);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has 1st DE with-context exceptions', () => {
    const ruleContext = {};
    addRuleContextPath(['firstDomainEntity', 'propertyName', 'ID'], ruleContext, false);
    addRuleContextPath(['secondDomainEntity', 'propertyName', 'ID'], ruleContext, false);
    addRuleContextPath(['firstDomainEntity', 'withContext', 'withContextName', 'ID'], ruleContext, true);
    addRuleContextPath(['secondDomainEntity', 'withContext', 'withContextName', 'ID'], ruleContext, false);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has 2nd DE with-context exceptions', () => {
    const ruleContext = {};
    addRuleContextPath(['firstDomainEntity', 'propertyName', 'ID'], ruleContext, false);
    addRuleContextPath(['secondDomainEntity', 'propertyName', 'ID'], ruleContext, false);
    addRuleContextPath(['firstDomainEntity', 'withContext', 'withContextName', 'ID'], ruleContext, false);
    addRuleContextPath(['secondDomainEntity', 'withContext', 'withContextName', 'ID'], ruleContext, true);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
