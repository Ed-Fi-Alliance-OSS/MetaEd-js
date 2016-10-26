import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/DomainEntitySubclass/DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_domain_entity_subclass_has_different_property_name', () => {
    const entityName: string = 'SubclassIdentifier';
    const baseName: string = 'BaseDomainEntityIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(baseName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Property1', 'because a property is required', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Property2', 'because a property is required', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection.length.should.equal(0);
    });
  });

  describe('When_domain_entity_subclass_has_duplicate_property_name', () => {
    const entityName: string = 'MyIdentifier';
    const baseName: string = 'BaseIdentifier';
    const duplicatePropertyName: string = 'Property1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(baseName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty(duplicatePropertyName, 'because a property is required', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty(duplicatePropertyName, 'because a property is required', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.include('Domain Entity');
      helper.errorMessageCollection[0].message.should.include(entityName);
      helper.errorMessageCollection[0].message.should.include('based on');
      helper.errorMessageCollection[0].message.should.include(baseName);
      helper.errorMessageCollection[0].message.should.include(duplicatePropertyName);
      helper.errorMessageCollection[0].message.should.include('already in property list');
    });
  });

  describe('When_domain_entity_subclass_has_multiple_duplicate_property_names', () => {
    const entityName: string = 'MyIdentifier';
    const baseName: string = 'BaseIdentifier';
    const notDuplicatePropertyName: string = 'NotADuplicate';
    const duplicatePropertyName1: string = 'Property1';
    const duplicatePropertyName2: string = 'Property2';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(baseName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty(duplicatePropertyName1, 'because a property is required', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'because a property is required', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(entityName, baseName)
      .withDocumentation('because documentation is required')
      .withBooleanProperty(duplicatePropertyName1, 'because a property is required', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'because a property is required', true, false)
      .withBooleanProperty(notDuplicatePropertyName, 'because a property is required', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.include('Domain Entity');
      helper.errorMessageCollection[0].message.should.include(entityName);
      helper.errorMessageCollection[0].message.should.include('based on');
      helper.errorMessageCollection[0].message.should.include(baseName);
      helper.errorMessageCollection[0].message.should.include(duplicatePropertyName1);
      helper.errorMessageCollection[0].message.should.include(duplicatePropertyName2);
      helper.errorMessageCollection[0].message.should.include('already in property list');
      helper.errorMessageCollection[0].message.should.not.include(notDuplicatePropertyName);
    });
  });
});
