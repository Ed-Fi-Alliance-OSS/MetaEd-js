import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/MetaEdId/MetaEdIdIsRequiredForItems';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('MetaEdIdIsRequiredForItemsTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  const entityName: string = 'MyIdentifier';
  const propertyName: string = 'Identifier';

  describe('When_domainItem_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomain(entityName)
      .withDocumentation('doc')
      .withDomainItem(propertyName)
      .withEndDomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessageCollection.should.be.empty;
      helper.warningMessageCollection[0].message.should.include('Item');
      helper.warningMessageCollection[0].message.should.include(entityName);
      helper.warningMessageCollection[0].message.should.include(propertyName);
      helper.warningMessageCollection[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_enumerationItem_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartEnumeration(entityName)
      .withDocumentation('doc')
      .withEnumerationItem(propertyName, 'doc1')
      .withEndEnumeration()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessageCollection.should.be.empty;
      helper.warningMessageCollection[0].message.should.include('Item');
      helper.warningMessageCollection[0].message.should.include(entityName);
      helper.warningMessageCollection[0].message.should.include(propertyName);
      helper.warningMessageCollection[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_interchangeElement_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange(entityName)
      .withDocumentation('doc')
      .withElement(propertyName)
      .withEndInterchange()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessageCollection.should.be.empty;
      helper.warningMessageCollection[0].message.should.include('Item');
      helper.warningMessageCollection[0].message.should.include(entityName);
      helper.warningMessageCollection[0].message.should.include(propertyName);
      helper.warningMessageCollection[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_interchangeIdentityTemplate_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange(entityName)
      .withDocumentation('doc')
      .withElement('DomainEntity')
      .withIdentityTemplate(propertyName)
      .withEndInterchange()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessageCollection.should.be.empty;
      helper.warningMessageCollection[0].message.should.include('Item');
      helper.warningMessageCollection[0].message.should.include(entityName);
      helper.warningMessageCollection[0].message.should.include(propertyName);
      helper.warningMessageCollection[0].message.should.include('missing a MetaEdId');
    });
  });
});
