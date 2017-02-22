import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/MergePartOfReference/MergePropertyAndTargetPropertyMustMatch';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('MergePropertyAndTargetPropertyMustMatch', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_merged_property_names_and_types_match', () => {
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
      helper.errorMessages().should.be.empty;
    });
  });

  // TODO: disabled
  xdescribe('When_merged_property_types_are_different', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('Entity1')
      .withDocumentation('doc')
      .withDecimalIdentity('Prop1', 'doc', 5, 3)
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

    it('should_have_validation_failures()', () => {
      helper.errorMessages().length.should.equal(1);
    });

    it('should_have_meaningful_validation_message()', () => {
      helper.errorMessages()[0].message.should.equal('The merge paths \'Entity1.Prop1\' and \'Prop1\' do not correspond to the same entity type.');
    });
  });

  // TODO: disabled
  xdescribe('When_merged_property_names_are_different', () => {
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
      .withIntegerIdentity('Prop2', 'doc')
      .withDomainEntityProperty('Entity1', 'doc', false, false)
      .withMergePartOfReference('Entity1.Prop1', 'Prop2')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failures()', () => {
      helper.errorMessages().length.should.equal(1);
    });
  });

  describe('When_merging_properties_of_a_base_and_sub_domain_entity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('Entity1')
      .withDocumentation('doc')
      .withIntegerIdentity('Prop1', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass('Entity2', 'Entity1')
      .withDocumentation('doc')
      .withIntegerProperty('Prop2', 'doc', false, false)
      .withEndDomainEntity()

      .withStartDomainEntity('Entity3')
      .withDocumentation('doc')
      .withDomainEntityProperty('Entity1', 'doc', false, false)
      .withMergePartOfReference('Entity1', 'Entity2')
      .withDomainEntityProperty('Entity2', 'doc', false, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_validate_successfully()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_merging_domain_entity_property_of_an_association', () => {
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
      .withDomainEntityProperty('Entity1', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity3')
      .withDocumentation('doc')
      .withIntegerIdentity('Prop3', 'doc')
      .withEndDomainEntity()

      .withStartAssociation('Entity4')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Entity2', 'doc')
      .withAssociationDomainEntityProperty('Entity3', 'doc')
      .withIntegerIdentity('Prop4', 'doc')
      .withDomainEntityProperty('Entity1', 'doc', false, false)
      .withMergePartOfReference('Entity1', 'Entity2.Entity1')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_validate_successfully()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });
});
