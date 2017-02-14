import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/AssociationExtension/AssociationExtensionExistsOnlyInExtensionNamespace';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import SymbolTable from '../../../../src/core/validators/SymbolTable';

chai.should();

describe('AssociationExtensionExistsOnlyInExtensionNamespaceTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_association_extension_exists_in_extension', () => {
    const symbolTable = new SymbolTable();
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('because documentation is required')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndAssociation()
      .withEndNamespace()
      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartAssociationExtension(entityName)
      .withBooleanProperty('Property2', 'because a property is required', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener, symbolTable);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_association_extension_has_invalid_extendee', () => {
    const symbolTable = new SymbolTable();
    const coreNamespace: string = 'edfi';
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('because documentation is required')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndAssociation()

      .withStartAssociationExtension(entityName)
      .withBooleanProperty('Property2', 'because a property is required', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener, symbolTable);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().length.should.equal(1);
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Association additions');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('is not valid in core namespace');
      helper.errorMessages()[0].message.should.include(coreNamespace);
    });
  });

  describe('When rule context has exception', () => {
    const { ruleContext } = addRuleContextPath(['extendeeName'], {}, true);
    const { invalidPath, validatorName } = validatable('AssociationExtensionExistsOnlyInExtensionNamespaceTests', ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
