import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/Enumeration/EnumerationItemsMustBeUnique';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('EnumerationItemsMustBeUnique', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_enumeration_items_have_different_short_descriptions', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartEnumeration('Enumeration1')
      .withDocumentation('doc')
      .withEnumerationItem('this is short description 1', 'doc1')
      .withEnumerationItem('this is short description 2', 'doc2')
      .withEndEnumeration()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection.length.should.equal(0);
    });
  });

  describe('When_enumeration_items_have_duplicate_short_descriptions', () => {
    const duplicateShortDescription: string = 'this is a duplicate short description';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartEnumeration('Enumeration1')
      .withDocumentation('doc')
      .withEnumerationItem(duplicateShortDescription, 'doc1')
      .withEnumerationItem(duplicateShortDescription, 'doc2')
      .withEndEnumeration()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.equal('Enumeration \'Enumeration1\' declares duplicate item \'this is a duplicate short description\'.');
    });
  });

  describe('When_enumeration_items_have_multiple_duplicate_short_descriptions', () => {
    const duplicateShortDescription1: string = 'this is duplicate short description 1';
    const duplicateShortDescription2: string = 'this is duplicate short description 2';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartEnumeration('Enumeration1')
      .withDocumentation('doc')
      .withEnumerationItem(duplicateShortDescription1, 'doc1')
      .withEnumerationItem(duplicateShortDescription1, 'doc1 again')
      .withEnumerationItem(duplicateShortDescription2, 'doc2')
      .withEnumerationItem(duplicateShortDescription2, 'doc2 again')
      .withEndEnumeration()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection.should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection[0].message.should.equal(
        'Enumeration \'Enumeration1\' declares duplicate items \'this is duplicate short description 1\', \'this is duplicate short description 2\'.');
    });
  });
});
