import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/AssociationSubclass/AssociationSubclassMustNotDuplicateAssociationPropertyName';
import { validatable } from '../../../../src/core/validators/ValidatorShared/SubclassMustNotDuplicateEntityPropertyName';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('AssociationSubclassMustNotDuplicateAssociationPropertyName', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_association_subclass_has_different_property_name', () => {
    const entityName: string = 'SubclassIdentifier';
    const baseName: string = 'BaseAssociationIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(baseName)
      .withDocumentation('because documentation is required')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Property2', 'because a property is required', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_association_subclass_has_duplicate_property_name', () => {
    const entityName: string = 'MyIdentifier';
    const baseName: string = 'BaseIdentifier';
    const duplicatePropertyName: string = 'Property1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(baseName)
      .withDocumentation('because documentation is required')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty(duplicatePropertyName, 'because a property is required', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty(duplicatePropertyName, 'because a property is required', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Association');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('based on');
      helper.errorMessages()[0].message.should.include(baseName);
      helper.errorMessages()[0].message.should.include(duplicatePropertyName);
      helper.errorMessages()[0].message.should.include('already in property list');
    });
  });

  describe('When_association_subclass_has_multiple_duplicate_property_names', () => {
    const entityName: string = 'MyIdentifier';
    const baseName: string = 'BaseIdentifier';
    const notDuplicatePropertyName: string = 'NotADuplicate';
    const duplicatePropertyName1: string = 'Property1';
    const duplicatePropertyName2: string = 'Property2';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(baseName)
      .withDocumentation('because documentation is required')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withBooleanProperty(duplicatePropertyName1, 'because a property is required', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'because a property is required', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty(duplicatePropertyName1, 'because a property is required', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'because a property is required', true, false)
      .withBooleanProperty(notDuplicatePropertyName, 'because a property is required', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Association');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('based on');
      helper.errorMessages()[0].message.should.include(baseName);
      helper.errorMessages()[0].message.should.include(duplicatePropertyName1);
      helper.errorMessages()[0].message.should.include(duplicatePropertyName2);
      helper.errorMessages()[0].message.should.include('already in property list');
      helper.errorMessages()[0].message.should.not.include(notDuplicatePropertyName);
    });
  });

  describe('When rule context has baseName exception', () => {
    const { ruleContext } = addRuleContextPath(['baseName'], {}, true);
    const { invalidPath, validatorName } = validatable('AssociationSubclassMustNotDuplicateAssociationPropertyNameTests', ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
