import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/MetaEdId/MetaEdIdIsRequiredForProperties';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('MetaEdIdIsRequiredForPropertiesTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  const entityName: string = 'MyIdentifier';
  const propertyName: string = 'Identifier';

  describe('When_booleanProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_currencyProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCurrencyProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_dateProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDateProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_decimalProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDecimalProperty(propertyName, 'doc', true, false, 10, 2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_descriptorProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDescriptorProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_durationProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDurationProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_enumerationProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withEnumerationProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_firstDomainEntity_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty('First', 'doc1')
      .withDomainEntityProperty('Second', 'doc2')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_includeProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withIncludeProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_integerProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_percentProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withPercentProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_referenceProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withReferenceProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_secondDomainEntity_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty('First', 'doc1')
      .withDomainEntityProperty('Second', 'doc2')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_sharedDecimalProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedDecimalProperty(propertyName, 'SharedProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_sharedIntegerProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedIntegerProperty(propertyName, 'SharedProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_sharedShortProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedShortProperty(propertyName, 'SharedProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_sharedStringProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedStringProperty(propertyName, 'SharedProperty', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_shortProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withShortProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_stringProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, 100)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_timeProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withTimeProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });

  describe('When_yearProperty_is_missing_metaEdId', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withYearProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_warning', () => {
      helper.errorMessages().should.be.empty;
      helper.warningMessages()[0].message.should.include(entityName);
      helper.warningMessages()[0].message.should.include(propertyName);
      helper.warningMessages()[0].message.should.include('missing a MetaEdId');
    });
  });
});
