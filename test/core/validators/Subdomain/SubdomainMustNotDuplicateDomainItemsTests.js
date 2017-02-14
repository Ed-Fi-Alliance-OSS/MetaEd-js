import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath, addArrayContext } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/Subdomain/SubdomainMustNotDuplicateDomainItems';
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
      .withDomainEntityDomainItem('Item1')
      .withDomainEntityDomainItem('Item2')
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
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
      .withDomainEntityDomainItem(duplicateTemplate)
      .withDomainEntityDomainItem(duplicateTemplate)
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Subdomain');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('duplicate domain item');
      helper.errorMessages()[0].message.should.include(duplicateTemplate);
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
      .withDomainEntityDomainItem(duplicateTemplate1)
      .withDomainEntityDomainItem(duplicateTemplate1)
      .withDomainEntityDomainItem(duplicateTemplate1)
      .withDomainEntityDomainItem(duplicateTemplate1)
      .withDomainEntityDomainItem(duplicateTemplate2)
      .withDomainEntityDomainItem(duplicateTemplate2)
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessages().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessages()[0].message.should.include('Subdomain');
      helper.errorMessages()[0].message.should.include(entityName);
      helper.errorMessages()[0].message.should.include('duplicate domain items');
      helper.errorMessages()[0].message.should.include(duplicateTemplate1);
      helper.errorMessages()[0].message.should.include(duplicateTemplate2);
    });
  });

  describe('When rule context has subdomainName exception', () => {
    const { ruleContext } = addRuleContextPath(['subdomainName', 'ID'], {}, true);
    const { leafContext: domainItemContext } = addArrayContext('domainItem', ruleContext);
    addRuleContextPath(['ID'], domainItemContext, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has ID exception', () => {
    const { ruleContext } = addRuleContextPath(['subdomainName', 'ID'], {}, false);
    const { leafContext: domainItemContext } = addArrayContext('domainItem', ruleContext);
    addRuleContextPath(['ID'], domainItemContext, true);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
