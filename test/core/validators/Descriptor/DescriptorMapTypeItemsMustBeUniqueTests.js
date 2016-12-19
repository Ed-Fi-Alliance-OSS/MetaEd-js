import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/Descriptor/DescriptorMapTypeItemsMustBeUnique';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('DescriptorMapTypeItemsMustBeUniqueTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_map_type_items_have_different_short_descriptions', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor('Descriptor1')
      .withDocumentation('doc')
      .withStartMapType()
      .withDocumentation('map type doc')
      .withEnumerationItem('this is short description 1', 'doc1')
      .withEnumerationItem('this is short description 2', 'doc2')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_map_type_items_have_duplicate_short_descriptions', () => {
    const entityName: string = 'Descriptor1';
    const duplicateShortDescription: string = 'this is a duplicate short description';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor(entityName)
      .withDocumentation('doc')
      .withStartMapType()
      .withDocumentation('map type doc')
      .withEnumerationItem(duplicateShortDescription, 'doc1')
      .withEnumerationItem(duplicateShortDescription, 'doc2')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.equal(
        'Descriptor \'Descriptor1\' declares duplicate item \'this is a duplicate short description\'.');
    });
  });

  describe('When_map_type_items_have_multiple_duplicate_short_descriptions', () => {
    const entityName: string = 'Descriptor1';
    const duplicateShortDescription1: string = 'this is duplicate short description 1';
    const duplicateShortDescription2: string = 'this is duplicate short description 2';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor(entityName)
      .withDocumentation('doc')
      .withStartMapType()
      .withDocumentation('map type doc')
      .withEnumerationItem(duplicateShortDescription1, 'doc1')
      .withEnumerationItem(duplicateShortDescription1, 'doc1 again')
      .withEnumerationItem(duplicateShortDescription2, 'doc2')
      .withEnumerationItem(duplicateShortDescription2, 'doc2 again')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.equal(
        'Descriptor \'Descriptor1\' declares duplicate items \'this is duplicate short description 1\', \'this is duplicate short description 2\'.');
    });
  });
});
