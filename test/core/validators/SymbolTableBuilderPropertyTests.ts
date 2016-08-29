/// <reference path="../../../typings/index.d.ts" />
import chai = require('chai');
import MetaEdTextBuilder from "../../grammar/MetaEdTextBuilder";
import ValidationTestHelper from "./ValidationTestHelper";
import ValidationMessage from "../../../src/common/ValidationMessage"
import { EntityContext } from '../../../src/core/validators/SymbolTable'

let should = chai.should();

const entityName: string = "EntityName";
const propertyName: string = "PropertyName";
const entityKey: string = "Domain Entity";

describe('SymbolTableBuilderPropertyTests', () => {

    describe('When_loading_entities_with_boolean_property', () => {

        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.should.not.be.empty;
            let result = entitySymbolTable.propertySymbolTable.get(propertyName);
            result.should.not.be.empty;
        });
    });

    describe('When_loading_entities_with_duplicated_boolean_property', () => {

        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withBooleanProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            const failure = helper.errorMessageCollection[0];
            failure.message.should.include(propertyName);
            failure.message.should.include(entityName);
            failure.message.should.include("duplicate");
        });

        it('Should_report_position_of_error', () => {
            helper.errorMessageCollection.length.should.equal(1);
            const failure = helper.errorMessageCollection[0];
            failure.concatenatedLineNumber.should.equal(9);
            failure.characterPosition.should.equal(9);
        });
    });

    describe('When_loading_entities_with_currency_property', () => {

        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withCurrencyProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();

            helper.setup(metaEdText);
        });

        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_currency_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withCurrencyProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_date_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withDateProperty(propertyName, "doc", true, false)//.WithEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_date_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withDateProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_decimal_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withDecimalProperty(propertyName, "doc", true, false, "2", "1")
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_decimal_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withDecimalProperty(propertyName, "doc", true, false, "2", "2")
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_descriptor_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withDescriptorProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_descriptor_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withDescriptorProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_duration_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withDurationProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_duration_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withDurationProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_enumeration_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withEnumerationProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_enumeration_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withEnumerationProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_include_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withIncludeProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_include_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withIncludeProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_integer_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withIntegerProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_integer_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withIntegerProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_reference_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withReferenceProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_reference_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withReferenceProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_short_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withShortProperty(propertyName, "doc", true, false)//.WithEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_short_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withShortProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_shared_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withSharedDecimalProperty("Identifier", propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_shared_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withSharedDecimalProperty("Identifier", propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_string_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringProperty(propertyName, "doc", true, false, 10)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_string_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withStringProperty(propertyName, "doc", true, false, 10)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_time_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withTimeProperty(propertyName, "doc", true, false)//.WithEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_time_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withTimeProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_year_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withYearProperty(propertyName, "doc", true, false)//.WithEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(propertyName).should.not.be.null;
        });
    });

    describe('When_loading_entities_with_duplicated_year_property', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withYearProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
    });

    describe('When_loading_entities_with_same_identifier_but_different_with_contexts', () => {
        let withContext1: string = "WithContext1";
        let withContext2: string = "WithContext2";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withReferenceProperty(propertyName, "doc", true, false, false, withContext1)
                .withReferenceProperty(propertyName, "doc", true, false, false, withContext2)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_load_into_property_symbol_table', () => {
            let entitySymbolTable: EntityContext = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.propertySymbolTable.get(withContext1 + propertyName).should.not.be.null;
            entitySymbolTable.propertySymbolTable.get(withContext2 + propertyName).should.not.be.null;
            2
        });
    });

    describe('When_loading_entities_with_same_identifier_and_same_with_contexts', () => {
        let withContext: string = "WithContext";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withReferenceProperty(propertyName, "doc", true, false, false, withContext)
                .withReferenceProperty(propertyName, "doc", true, false, false, withContext)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText);
        });
        it('Should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.message.should.contain(propertyName);
            failure.message.should.contain(entityName);
            failure.message.should.contain("duplicate");
        });
        it('Should_report_position_of_error', () => {
            helper.errorMessageCollection.length.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection[0];
            failure.concatenatedLineNumber.should.equal(10);
            failure.characterPosition.should.equal(14);
        });
    });
});