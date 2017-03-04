import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import SymbolTableEntityType from '../../../../src/core/validators/SymbolTableEntityType';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import {
  findReferencedProperty,
  matchAllIdentityProperties,
  matchAllButFirstAsIdentityProperties,
} from '../../../../src/core/validators/MergePartOfReference/PropertyPathLookup';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { propertyName } from '../../../../src/core/validators/ValidationHelper';

const should = chai.should();

describe('PropertyPathLookupTests', () => {
  const validatorListener = new ValidatorListener(newRepository());

  describe('When_looking_for_property_on_current_entity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('Entity1')
      .withDocumentation('doc')
      .withIntegerIdentity('Prop1', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_return_expected_property()', () => {
      helper.errorMessages().should.be.empty;
      const result = findReferencedProperty(
        helper.state.symbolTable,
        helper.state.symbolTable.get(SymbolTableEntityType.domainEntity(), 'Entity1'),
        ['Prop1'],
        matchAllIdentityProperties,
      );

      result.should.not.be.null;
      propertyName(result).should.equal('Prop1');
    });
  });

  describe('When_looking_for_first_domain_entity_on_association', () => {
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
      .withEndDomainEntity()

      .withStartAssociation('Entity3')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Entity1', 'doc')
      .withAssociationDomainEntityProperty('Entity2', 'doc')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_return_expected_property()', () => {
      helper.errorMessages().should.be.empty;
      const result = findReferencedProperty(
        helper.state.symbolTable,
        helper.state.symbolTable.get(SymbolTableEntityType.association(), 'Entity3'),
        ['Entity1'],
        matchAllIdentityProperties,
      );

      result.should.not.be.null;
      propertyName(result).should.equal('Entity1');
    });
  });

  describe('When_looking_for_second_domain_entity_on_association', () => {
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
      .withEndDomainEntity()

      .withStartAssociation('Entity3')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Entity1', 'doc')
      .withAssociationDomainEntityProperty('Entity2', 'doc')
      .withEndAssociation()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_return_expected_property()', () => {
      helper.errorMessages().should.be.empty;
      const result = findReferencedProperty(
        helper.state.symbolTable,
        helper.state.symbolTable.get(SymbolTableEntityType.association(), 'Entity3'),
        ['Entity2'],
        matchAllIdentityProperties,
      );

      result.should.not.be.null;
      propertyName(result).should.equal('Entity2');
    });
  });

  describe('When_looking_for_non_identity_property_on_current_entity', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('Entity1')
      .withDocumentation('doc')
      .withIntegerIdentity('Prop1', 'doc')
      .withIntegerProperty('Prop2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_return_null()', () => {
      helper.errorMessages().should.be.empty;
      const result = findReferencedProperty(
        helper.state.symbolTable,
        helper.state.symbolTable.get(SymbolTableEntityType.domainEntity(), 'Entity1'),
        ['Prop2'],
        matchAllIdentityProperties,
      );

      should.not.exist(result);
    });
  });

  describe('When_looking_for_property_that_does_not_exist', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('Entity1')
      .withDocumentation('doc')
      .withIntegerIdentity('Prop1', 'doc')
      .withIntegerProperty('Prop2', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_return_null()', () => {
      helper.errorMessages().should.be.empty;
      const result = findReferencedProperty(
        helper.state.symbolTable,
        helper.state.symbolTable.get(SymbolTableEntityType.domainEntity(), 'Entity1'),
        ['Prop3'],
        matchAllIdentityProperties,
      );

      should.not.exist(result);
    });
  });

  describe('When_looking_for_duplicated_property', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('Entity1')
      .withDocumentation('doc')
      .withIntegerIdentity('Prop1', 'doc')
      .withIntegerProperty('Prop2', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Entity1', 'doc', 'Test')
      .withDomainEntityIdentity('Entity1', 'doc', 'Win')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_return_null()', () => {
      helper.errorMessages().should.be.empty;
      const result = findReferencedProperty(
        helper.state.symbolTable,
        helper.state.symbolTable.get(SymbolTableEntityType.domainEntity(), 'Entity2'),
        ['Entity1'],
        matchAllIdentityProperties,
      );

      should.not.exist(result);
    });
  });

  describe('When_looking_for_deep_property', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('Entity1')
      .withDocumentation('doc')
      .withIntegerIdentity('Prop1', 'doc')
      .withIntegerProperty('Prop2', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Entity1', 'doc', 'Test')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_return_expected_property()', () => {
      helper.errorMessages().should.be.empty;
      const result = findReferencedProperty(
        helper.state.symbolTable,
        helper.state.symbolTable.get(SymbolTableEntityType.domainEntity(), 'Entity2'),
        ['Entity1', 'Prop1'],
        matchAllIdentityProperties,
      );

      result.should.not.be.null;
      propertyName(result).should.equal('Prop1');
    });
  });

  describe('When_looking_for_non_pk_property', () => {
    const helper: ValidatorTestHelper = new ValidatorTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('Entity1')
      .withDocumentation('doc')
      .withIntegerIdentity('Prop1', 'doc')
      .withIntegerProperty('Prop2', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('doc')
      .withIntegerIdentity('Prop3', 'doc')
      .withDomainEntityProperty('Entity1', 'doc', false, false, 'Test')
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText, validatorListener);
    });

    it('should_return_expected_property()', () => {
      helper.errorMessages().should.be.empty;
      const result = findReferencedProperty(
        helper.state.symbolTable,
        helper.state.symbolTable.get(SymbolTableEntityType.domainEntity(), 'Entity2'),
        ['Entity1', 'Prop1'],
        matchAllButFirstAsIdentityProperties,
      );

      result.should.not.be.null;
      propertyName(result).should.equal('Prop1');
    });
  });
});
