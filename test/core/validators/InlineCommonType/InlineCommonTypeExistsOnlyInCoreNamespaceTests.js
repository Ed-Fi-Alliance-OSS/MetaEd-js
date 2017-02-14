import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/InlineCommon/InlineCommonExistsOnlyInCoreNamespace';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';

chai.should();

describe('InlineCommonTypeExistsOnlyInCoreNamespace', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_inline_common_type_exists_in_core', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInlineCommon(entityName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndInlineCommon()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_inline_common_type_exists_in_extension', () => {
    const extensionNamespace: string = 'edfi';
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(extensionNamespace, 'ProjectExtension')
      .withStartInlineCommon(entityName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Property2', 'because a property is required', true, false)
      .withEndInlineCommon()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Inline Common Type');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('is not valid in extension namespace');
      helper.errorMessages()[0].message.should.include(extensionNamespace);
    });
  });

  describe('When rule context has inlineCommonName exception', () => {
    const { ruleContext } = addRuleContextPath(['inlineCommonName', 'ID'], {}, true);

    const { ruleContext: parentContext } = addRuleContextPath(['NAMESPACE'], { ruleIndex: MetaEdGrammar.RULE_namespace }, false);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['namespaceType'], parentContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has namespaceType exception', () => {
    const { ruleContext } = addRuleContextPath(['inlineCommonName', 'ID'], {}, false);

    const { ruleContext: parentContext } = addRuleContextPath(['NAMESPACE'], { ruleIndex: MetaEdGrammar.RULE_namespace }, false);
    ruleContext.parentCtx = parentContext;
    addRuleContextPath(['namespaceType'], parentContext, true);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
