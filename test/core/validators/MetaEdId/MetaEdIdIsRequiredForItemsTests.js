import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/MetaEdId/MetaEdIdIsRequiredForItems';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

chai.should();

describe('MetaEdIdIsRequiredForItemsTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  const entityName: string = 'MyIdentifier';
  const propertyName: string = 'Identifier';

  describe('When_domainItem_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomain(entityName)
      .withDocumentation('doc')
      .withDomainEntityElement(propertyName)
      .withEndDomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include('Item');
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_enumerationItem_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartEnumeration(entityName)
      .withDocumentation('doc')
      .withEnumerationItem(propertyName, 'doc1')
      .withEndEnumeration()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include('Item');
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_interchangeElement_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange(entityName)
      .withDocumentation('doc')
      .withDomainEntityElement(propertyName)
      .withEndInterchange()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include('Item');
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_interchangeIdentityTemplate_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange(entityName)
      .withDocumentation('doc')
      .withDomainEntityElement('DomainEntity')
      .withDomainEntityIdentityTemplate(propertyName)
      .withEndInterchange()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include('Item');
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });


  describe('When rule context has ID exception', () => {
    const { ruleContext } = addRuleContextPath(['ID'], { ruleIndex: MetaEdGrammar.RULE_domainItem }, true);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN'], { ruleIndex: MetaEdGrammar.RULE_domain }, false);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['entityName', 'ID'], parentContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has DOMAIN_ENTITY exception', () => {
    const { ruleContext } = addRuleContextPath(['ID'], { ruleIndex: MetaEdGrammar.RULE_domainItem }, false);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN'], { ruleIndex: MetaEdGrammar.RULE_domain }, true);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['entityName', 'ID'], parentContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has entityName exception', () => {
    const { ruleContext } = addRuleContextPath(['ID'], { ruleIndex: MetaEdGrammar.RULE_domainItem }, false);

    const { ruleContext: parentContext } = addRuleContextPath(['DOMAIN'], { ruleIndex: MetaEdGrammar.RULE_domain }, false);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['entityName', 'ID'], parentContext, true);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
