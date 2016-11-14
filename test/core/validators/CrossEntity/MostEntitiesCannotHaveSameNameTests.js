import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/CrossEntity/MostEntitiesCannotHaveSameName';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

// WARNING: early implementation of MostEntitiesCannotHaveSameName maintains state between tests
describe('MostEntitiesCannotHaveSameNameTests', () => {
  const repository = includeRule(newRepository());
  const validatorListener = new ValidatorListener(repository);

  describe('When_entities_have_different_names', () => {

    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntity1')
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Prop1', 'because a property is required', true, false)
      .withEndDomainEntity()

      .withStartAbstractEntity('AbstractEntity1')
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Prop2', 'because a property is required', true, false)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_entities_have_same_name', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('SharedEntity1')
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Prop3', 'because a property is required', true, false)
      .withEndDomainEntity()

      .withStartAbstractEntity('SharedEntity1')
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Prop4', 'because a property is required', true, false)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection().length.should.equal(1);
      helper.errorMessageCollection()[0].message.should.include('SharedEntity1');
      helper.errorMessageCollection()[0].message.should.include('duplicate');
    });
  });

  describe('When_domain_entity_has_same_name_as_extension', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntity2')
      .withDocumentation('because documentation is required')
      .withBooleanProperty('Prop5', 'because a property is required', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension('DomainEntity2')
      .withBooleanProperty('Prop6', 'because a property is required', true, false)
      .withEndAbstractEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_association_has_same_name_as_extension', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation('Association1')
      .withDocumentation('because documentation is required')
      .withDomainEntityProperty('Prop7', 'because a property is required')
      .withDomainEntityProperty('Prop8', 'because a property is required')
      .withEndAssociation()

      .withStartAssociationExtension('Association1')
      .withDateProperty('BeginDate', 'doc', true, false)
      .withDateProperty('EndDate', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_domain_entity_has_same_name_as_common_simple_type', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('CommonEntityName')
      .withDocumentation('doc')
      .withBooleanProperty('Prop9', 'doc', true, false)
      .withEndDomainEntity()

      .withStartCommonInteger('CommonEntityName')
      .withDocumentation('doc')
      .withMinValue('0')
      .withEndCommonInteger()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_validation_failure()', () => {
      helper.errorMessageCollection().should.not.be.empty;
    });

    it('should_have_validation_failure_message()', () => {
      helper.errorMessageCollection().length.should.equal(1);
      helper.errorMessageCollection()[0].message.should.include('CommonEntityName');
      helper.errorMessageCollection()[0].message.should.include('duplicate');
    });
  });

  describe('When_domain_entity_has_same_name_as_descriptor', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('SharedEntity2')
      .withDocumentation('doc')
      .withBooleanProperty('Prop10', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDescriptor('SharedEntity2')
      .withDocumentation('doc')
      .withBooleanProperty('Prop11', 'doc', false, false)
      .withEndDescriptor()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_domain_entity_has_same_name_as_enumeration', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('SharedEntity3')
      .withDocumentation('doc')
      .withBooleanProperty('Prop12', 'doc', true, false)
      .withEndDomainEntity()

      .withStartEnumeration('SharedEntity3')
      .withDocumentation('doc')
      .withEnumerationItem('ShortDescription', 'doc')
      .withEndEnumeration()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });

  describe('When_domain_entity_has_same_name_as_interchange', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('SharedEntity4')
      .withDocumentation('doc')
      .withBooleanProperty('Prop13', 'doc', true, false)
      .withEndDomainEntity()

      .withStartInterchange('SharedEntity4')
      .withDocumentation('doc')
      .withElement('SharedEntity4')
      .withEndInterchange()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_have_no_validation_failures()', () => {
      helper.errorMessageCollection().length.should.equal(0);
    });
  });
});
