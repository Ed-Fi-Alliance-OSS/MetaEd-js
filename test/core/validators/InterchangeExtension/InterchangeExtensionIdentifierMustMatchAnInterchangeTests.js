import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/InterchangeExtension/InterchangeExtensionIdentifierMustMatchAnInterchange';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import SymbolTable from '../../../../src/core/validators/SymbolTable';

chai.should();

describe('InterchangeExtensionIdentifierMustMatchAnInterchangeTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_interchange_extension_has_valid_extendee', () => {
    const symbolTable = new SymbolTable();
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange(entityName)
      .withDocumentation('doc')
      .withDomainEntityElement('Required')
      .withDomainEntityIdentityTemplate('Template1')
      .withDomainEntityIdentityTemplate('Template2')
      .withEndInterchange()

      .withStartInterchangeExtension(entityName)
      .withDomainEntityElement('Template3')
      .withEndInterchangeExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener, symbolTable);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_interchange_extension_has_invalid_extendee', () => {
    const symbolTable = new SymbolTable();
    const entityName: string = 'NotAnInterchangeIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchangeExtension(entityName)
      .withDomainEntityElement('Template3')
      .withEndInterchangeExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener, symbolTable);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().length.should.equal(1);
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Interchange additions');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('does not match');
    });
  });

  describe('When rule context has extendeeName exception', () => {
    const { ruleContext } = addRuleContextPath(['extendeeName', 'ID'], {}, true);
    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
