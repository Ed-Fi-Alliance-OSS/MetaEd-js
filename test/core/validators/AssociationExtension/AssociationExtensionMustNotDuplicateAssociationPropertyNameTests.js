import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import SymbolTable from '../../../../src/core/validators/SymbolTable';
import { includeRule } from '../../../../src/core/validators/AssociationExtension/AssociationExtensionMustNotDuplicateAssociationPropertyName';
import { validatable } from '../../../../src/core/validators/ValidatorShared/ExtensionMustNotDuplicatePropertyName';

chai.should();

describe('AssociationExtensionMustNotDuplicateAssociationPropertyName', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_association_extension_has_different_property_name', () => {
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

  describe('When_association_extension_has_duplicate_property_name', () => {
    const symbolTable = new SymbolTable();
    const entityName: string = 'MyIdentifier';
    const duplicatePropertyName: string = 'Property1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('because documentation is required')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty(duplicatePropertyName, 'because a property is required', true, false)
      .withEndAssociation()

      .withStartAssociationExtension(entityName)
      .withBooleanProperty(duplicatePropertyName, 'because a property is required', true, false)
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
      helper.errorMessages()[0].message.should.include(duplicatePropertyName);
      helper.errorMessages()[0].message.should.include('already in property list');
    });
  });

  describe('When_association_extension_has_multiple_association_names', () => {
    const symbolTable = new SymbolTable();
    const entityName: string = 'MyIdentifier';
    const notDuplicatePropertyName: string = 'NotADuplicate';
    const duplicatePropertyName1: string = 'Property1';
    const duplicatePropertyName2: string = 'Property2';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('because documentation is required')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty(duplicatePropertyName1, 'because a property is required', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'because a property is required', true, false)
      .withEndAssociation()

      .withStartAssociationExtension(entityName)
      .withBooleanProperty(duplicatePropertyName1, 'because a property is required', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'because a property is required', true, false)
      .withBooleanProperty(notDuplicatePropertyName, 'because a property is required', true, false)
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
      helper.errorMessages()[0].message.should.include(duplicatePropertyName1);
      helper.errorMessages()[0].message.should.include(duplicatePropertyName2);
      helper.errorMessages()[0].message.should.include('already in property list');
      helper.errorMessages()[0].message.should.not.include(notDuplicatePropertyName);
    });
  });

  describe('When_association_extension_has_duplicate_common_property', () => {
    const symbolTable = new SymbolTable();
    const entityName: string = 'MyIdentifier';
    const duplicatePropertyName: string = 'Property1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withCommonProperty(duplicatePropertyName, 'doc', true, false)
      .withEndAssociation()

      .withStartAssociationExtension(entityName)
      .withCommonProperty(duplicatePropertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener, symbolTable);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().length.should.equal(1);
    });
  });

  describe('When_association_extension_has_duplicate_include_extension_override_property', () => {
    const symbolTable = new SymbolTable();
    const entityName: string = 'MyIdentifier';
    const duplicatePropertyName: string = 'Property1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withCommonProperty(duplicatePropertyName, 'doc', true, false)
      .withEndAssociation()

      .withStartAssociationExtension(entityName)
      .withCommonExtensionOverrideProperty(duplicatePropertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener, symbolTable);
    });

    it('should_not_have_validation_failure()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When rule context has exception', () => {
    const { ruleContext } = addRuleContextPath(['extendeeName'], {}, true);
    const { invalidPath, validatorName } = validatable('AssociationExtensionMustNotDuplicateAssociationPropertyNameTests', ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
