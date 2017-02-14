import chai from 'chai';
import MetaEdTextBuilder from '../../grammar/MetaEdTextBuilder';
import SymbolTableTestHelper from './SymbolTableTestHelper';
import { EntityContext } from '../../../src/core/validators/SymbolTable';

chai.should();

const entityName: string = 'EntityName';
const propertyName: string = 'PropertyName';
const entityKey: string = 'Domain Entity';

describe('SymbolTableBuilderPropertyTests', () => {
  describe('When_loading_entities_with_boolean_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText: string = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.should.not.be.empty;
      const result = entitySymbolTable.propertySymbolTable.get(propertyName);
      result.should.not.be.empty;
    });
  });

  describe('When_loading_entities_with_boolean_property_fragment_without_name', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText: string = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.should.not.be.empty;
      const result = entitySymbolTable.propertySymbolTable.get(propertyName);
      result.should.not.be.empty;
    });
  });

  describe('When_loading_entities_with_duplicated_boolean_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText: string = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.message.should.include(propertyName);
      failure.message.should.include(entityName);
      failure.message.should.include('duplicate');
    });

    it('Should_report_position_of_error', () => {
      helper.errorMessages().length.should.equal(1);
      const failure = helper.errorMessages()[0];
      failure.concatenatedLineNumber.should.equal(9);
      failure.characterPosition.should.equal(9);
      failure.tokenText.should.equal(propertyName);
    });
  });

  describe('When_loading_entities_with_currency_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCurrencyProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_currency_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withCurrencyProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_date_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDateProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_date_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withDateProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_decimal_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDecimalProperty(propertyName, 'doc', true, false, 2, 1)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_decimal_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withDecimalProperty(propertyName, 'doc', true, false, 2, 2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_descriptor_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDescriptorProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_descriptor_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withDescriptorProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_duration_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDurationProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_duration_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withDurationProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_enumeration_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withEnumerationProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_enumeration_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withEnumerationProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_common_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCommonProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_common_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withCommonProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_integer_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_integer_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_domain_entity_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_reference_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withDomainEntityProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_short_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withShortProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_short_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withShortProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_shared_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedDecimalProperty('Identifier', propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_shared_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withSharedDecimalProperty('Identifier', propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_string_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, 10)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_string_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withStringProperty(propertyName, 'doc', true, false, 10)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_time_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withTimeProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_time_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withTimeProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_year_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withYearProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_duplicated_year_property', () => {
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(propertyName, 'doc', true, false)
      .withYearProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });
  });

  describe('When_loading_entities_with_same_identifier_but_different_with_contexts', () => {
    const withContext1: string = 'WithContext1';
    const withContext2: string = 'WithContext2';
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty(propertyName, 'doc', true, false, false, withContext1)
      .withDomainEntityProperty(propertyName, 'doc', true, false, false, withContext2)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_load_into_property_symbol_table', () => {
      const entitySymbolTable: EntityContext = helper.symbolTable.get(entityKey, entityName);
      entitySymbolTable.propertySymbolTable.get(withContext1 + propertyName).should.not.be.null;
      entitySymbolTable.propertySymbolTable.get(withContext2 + propertyName).should.not.be.null;
    });
  });

  describe('When_loading_entities_with_same_identifier_and_same_with_contexts', () => {
    const withContext: string = 'WithContext';
    const helper: SymbolTableTestHelper = new SymbolTableTestHelper();
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty(propertyName, 'doc', true, false, false, withContext)
      .withDomainEntityProperty(propertyName, 'doc', true, false, false, withContext)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
      helper.setup(metaEdText);
    });

    it('Should_report_duplicate_property_names', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.message.should.contain(propertyName);
      failure.message.should.contain(entityName);
      failure.message.should.contain('duplicate');
    });

    it('Should_report_position_of_error', () => {
      helper.errorMessages().length.should.equal(1);
      const failure: ValidationMessage = helper.errorMessages()[0];
      failure.concatenatedLineNumber.should.equal(10);
      failure.characterPosition.should.equal(18);
    });
  });
});
