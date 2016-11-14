import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/Subdomain/SubdomainMustNotDuplicateDomainItems';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('SubdomainMustNotDuplicateDomainItems', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_domain_items_have_different_names', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSubdomain('Subdomain1', 'Domain1')
      .withDocumentation('doc')
      .withDomainItem('Item1')
      .withDomainItem('Item2')
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_domain_items_have_duplicate_names', () => {
    const parentDomainName: string = 'Domain1';
    const entityName: string = 'Subdomain1';
    const duplicateTemplate: string = 'Item1';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSubdomain(entityName, parentDomainName)
      .withDocumentation('doc')
      .withDomainItem(duplicateTemplate)
      .withDomainItem(duplicateTemplate)
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.include('Subdomain');
      helper.errorMessageCollection()[0].message.should.include(entityName);
      helper.errorMessageCollection()[0].message.should.include('duplicate domain item');
      helper.errorMessageCollection()[0].message.should.include(duplicateTemplate);
    });
  });

  describe('When_domain_items_have_multiple_duplicate_names', () => {
    const parentDomainName: string = 'Domain1';
    const entityName: string = 'Domain1';
    const duplicateTemplate1: string = 'Item1';
    const duplicateTemplate2: string = 'Item2';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSubdomain(entityName, parentDomainName)
      .withDocumentation('doc')
      .withDomainItem(duplicateTemplate1)
      .withDomainItem(duplicateTemplate1)
      .withDomainItem(duplicateTemplate1)
      .withDomainItem(duplicateTemplate1)
      .withDomainItem(duplicateTemplate2)
      .withDomainItem(duplicateTemplate2)
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection()[0].message.should.include('Subdomain');
      helper.errorMessageCollection()[0].message.should.include(entityName);
      helper.errorMessageCollection()[0].message.should.include('duplicate domain items');
      helper.errorMessageCollection()[0].message.should.include(duplicateTemplate1);
      helper.errorMessageCollection()[0].message.should.include(duplicateTemplate2);
    });
  });
});
