import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper, { addRuleContextPath } from './../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule, validatable } from '../../../../src/core/validators/Subdomain/SubdomainParentDomainNameMustMatchADomain';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('SubdomainParentDomainNameMustMatchADomain', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_subdomain_has_valid_parent_domain_name', () => {
    const entityName: string = 'MyIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomain(entityName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem('DomainEntity')
      .withEndDomain()

      .withStartSubdomain('NewSubclassName', entityName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem('DomainEntity')
      .withEndSubdomain()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessages().length.should.equal(0);
    });
  });

  describe('When_subdomain_has_invalid_parent_domain_name', () => {
    const entityName: string = 'MyIdentifier';
    const baseName: string = 'NotAnDomainEntityIdentifier';
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSubdomain(entityName, baseName)
      .withDocumentation('doc')
      .withDomainEntityDomainItem('DomainEntity')
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
      helper.errorMessages()[0].message.should.include('is part of');
      helper.errorMessages()[0].message.should.include(baseName);
      helper.errorMessages()[0].message.should.include('does not match');
    });
  });

  describe('When rule context has parentDomainName exception', () => {
    const { ruleContext } = addRuleContextPath(['parentDomainName', 'ID'], {}, true);
    addRuleContextPath(['subdomainName', 'ID'], {}, false);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });

  describe('When rule context has subdomainName exception', () => {
    const { ruleContext } = addRuleContextPath(['parentDomainName', 'ID'], {}, false);
    addRuleContextPath(['subdomainName', 'ID'], {}, true);

    const { invalidPath, validatorName } = validatable(ruleContext);

    it('Should_have_validatable_failure', () => {
      invalidPath.should.exist;
      validatorName.should.exist;
    });
  });
});
