import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/MergePartOfReference/MergePartOfReferenceExistsOnlyInCoreNamespace';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('MergePartOfReferenceExistsOnlyInCoreNamespace', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_merge_exists_in_core', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('Entity1')
      .withDocumentation('doc')
      .withIntegerIdentity('Prop1', 'doc')
      .withEndDomainEntity()
      .withStartDomainEntity('Entity2')
      .withDocumentation('doc')
      .withIntegerIdentity('Prop1', 'doc')
      .withDomainEntityProperty('Entity1', 'doc', false, false)
      .withMergePartOfReference('Entity1.Prop1', 'Prop1')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_validate_successfully()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_merged_exists_in_extension', () => {
    const entityName1: string = 'Entity1';
    const entityName2: string = 'Entity2';
    const propertyName: string = 'Prop1';
    const extensionNamespace: string = 'extension';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace(extensionNamespace, 'EXTENSION')
      .withStartDomainEntity(entityName1)
      .withDocumentation('doc')
      .withDecimalIdentity('Prop1', 'doc', '5', '3')
      .withEndDomainEntity()

      .withStartDomainEntity(entityName2)
      .withDocumentation('doc')
      .withIntegerIdentity(propertyName, 'doc')
      .withDomainEntityProperty(entityName1, 'doc', false, false)
      .withMergePartOfReference(`${entityName1}.${propertyName}`, propertyName)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_meaningful_validation_message()', () => {
      helper.errorMessages()[0].message.should.include('\'merge\' is invalid for property');
      helper.errorMessages()[0].message.should.include(entityName1);
      helper.errorMessages()[0].message.should.include(entityName2);
      helper.errorMessages()[0].message.should.include(extensionNamespace);
      helper.errorMessages()[0].message.should.include('\'merge\' is only valid for properties on types in a core namespace.');
    });
  });
});
