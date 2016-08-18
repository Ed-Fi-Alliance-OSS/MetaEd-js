"use strict";
/// <reference path="../../../typings/index.d.ts" />
const chai = require('chai');
const MetaEdTextBuilder_1 = require("../../grammar/MetaEdTextBuilder");
const ValidationTestHelper_1 = require("./ValidationTestHelper");
let should = chai.should();
describe('SymbolTableBuilderPropertyTests', () => {
    describe('When_loading_entities_with_boolean_property', () => {
        const entityName = "EntityName";
        const propertyName = "PropertyName";
        const entityKey = "Domain Entity";
        let helper;
        before(() => {
            const metaEdTextBuilder = new MetaEdTextBuilder_1.default();
            const metaEdText = metaEdTextBuilder
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .toString();
            helper = new ValidationTestHelper_1.ValidationTestHelper();
            helper.setup(metaEdText);
        });
        it('should_load_into_property_symbol_table', () => {
            let entitySymbolTable = helper.symbolTable.get(entityKey, entityName);
            entitySymbolTable.should.not.be.empty;
            let result = entitySymbolTable.propertySymbolTable.get(propertyName);
            result.should.not.be.empty;
        });
    });
    describe('When_loading_entities_with_duplicated_boolean_property', () => {
        const entityName = "EntityName";
        const propertyName = "PropertyName";
        const entityKey = "Domain Entity";
        let helper;
        before(() => {
            const metaEdTextBuilder = new MetaEdTextBuilder_1.default();
            const metaEdText = metaEdTextBuilder
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withBooleanProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .toString();
            helper = new ValidationTestHelper_1.ValidationTestHelper();
            helper.setup(metaEdText);
        });
        it('should_report_duplicate_property_names', () => {
            helper.errorMessageCollection.count.should.equal(1);
            const failure = helper.errorMessageCollection.toArray()[0];
            failure.message.should.include(propertyName);
            failure.message.should.include(entityName);
            failure.message.should.include("duplicate");
        });
        it('should_report_position_of_error', () => {
            helper.errorMessageCollection.count.should.equal(1);
            const failure = helper.errorMessageCollection.toArray()[0];
            failure.concatenatedLineNumber.should.equal(9);
            failure.characterPosition.should.equal(9);
        });
    });
});
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_currency_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_currency_property.entityName).WithDocumentation("here only because documentation is required").WithCurrencyProperty(When_loading_entities_with_currency_property.propertyName, "doc", true, //false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_currency_property.entityKey, When_loading_entities_with_currency_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_currency_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_currency_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_currency_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty//(When_loading_entities_with_duplicated_currency_property.propertyName, "doc", true, false).WithCurrencyProperty(When_loading_entities_with_duplicated_currency_property.propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_currency_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_currency_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_date_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_date_property.entityName).WithDocumentation("here only because documentation is required").WithDateProperty(When_loading_entities_with_date_property.propertyName, "doc", true, false)//.WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_date_property.entityKey, When_loading_entities_with_date_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_date_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_date_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_date_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty(When_loading_entities_with_duplicated_date_property.propertyName, //"doc", true, false).WithDateProperty(When_loading_entities_with_duplicated_date_property.propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_date_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_date_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_decimal_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_decimal_property.entityName).WithDocumentation("here only because documentation is required").WithDecimalProperty(When_loading_entities_with_decimal_property.propertyName, "doc", true, //false, 2, 2).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_decimal_property.entityKey, When_loading_entities_with_decimal_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_decimal_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_decimal_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_decimal_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty//(When_loading_entities_with_duplicated_decimal_property.propertyName, "doc", true, false).WithDecimalProperty(When_loading_entities_with_duplicated_decimal_property.propertyName, "doc", true, false, 2, 2).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_decimal_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_decimal_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_descriptor_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_descriptor_property.entityName).WithDocumentation("here only because documentation is required").WithDescriptorProperty(When_loading_entities_with_descriptor_property.propertyName, "doc", //true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_descriptor_property.entityKey, When_loading_entities_with_descriptor_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_descriptor_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_descriptor_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_descriptor_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty//(When_loading_entities_with_duplicated_descriptor_property.propertyName, "doc", true, false).WithDescriptorProperty(When_loading_entities_with_duplicated_descriptor_property.propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_descriptor_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_descriptor_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duration_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duration_property.entityName).WithDocumentation("here only because documentation is required").WithDurationProperty(When_loading_entities_with_duration_property.propertyName, "doc", true, //false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_duration_property.entityKey, When_loading_entities_with_duration_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_duration_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_duration_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_duration_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty//(When_loading_entities_with_duplicated_duration_property.propertyName, "doc", true, false).WithDurationProperty(When_loading_entities_with_duplicated_duration_property.propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_duration_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_duration_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_enumeration_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_enumeration_property.entityName).WithDocumentation("here only because documentation is required").WithEnumerationProperty(When_loading_entities_with_enumeration_property.propertyName, "doc",// true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_enumeration_property.entityKey, When_loading_entities_with_enumeration_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_enumeration_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_enumeration_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_enumeration_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty//(When_loading_entities_with_duplicated_enumeration_property.propertyName, "doc", true, false).WithEnumerationProperty(When_loading_entities_with_duplicated_enumeration_property.propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_enumeration_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_enumeration_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_include_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_include_property.entityName).WithDocumentation("here only because documentation is required").WithIncludeProperty(When_loading_entities_with_include_property.propertyName, "doc", true, //false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_include_property.entityKey, When_loading_entities_with_include_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_include_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_include_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_include_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty//(When_loading_entities_with_duplicated_include_property.propertyName, "doc", true, false).WithIncludeProperty(When_loading_entities_with_duplicated_include_property.propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_include_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_include_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_integer_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_integer_property.entityName).WithDocumentation("here only because documentation is required").WithIntegerProperty(When_loading_entities_with_integer_property.propertyName, "doc", true, //false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_integer_property.entityKey, When_loading_entities_with_integer_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_integer_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_integer_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_integer_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty//(When_loading_entities_with_duplicated_integer_property.propertyName, "doc", true, false).WithIntegerProperty(When_loading_entities_with_duplicated_integer_property.propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_integer_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_integer_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_reference_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_reference_property.entityName).WithDocumentation("here only because documentation is required").WithReferenceProperty(When_loading_entities_with_reference_property.propertyName, "doc", true,// false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_reference_property.entityKey, When_loading_entities_with_reference_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_reference_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_reference_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_reference_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty//(When_loading_entities_with_duplicated_reference_property.propertyName, "doc", true, false).WithReferenceProperty(When_loading_entities_with_duplicated_reference_property.propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_reference_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_reference_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_short_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_short_property.entityName).WithDocumentation("here only because documentation is required").WithShortProperty(When_loading_entities_with_short_property.propertyName, "doc", true, false)//.WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_short_property.entityKey, When_loading_entities_with_short_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_short_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_short_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_short_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty(When_loading_entities_with_duplicated_short_property.propertyName, //"doc", true, false).WithShortProperty(When_loading_entities_with_duplicated_short_property.propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_short_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_short_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_shared_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_shared_property.entityName).WithDocumentation("here only because documentation is required").WithSharedDecimalProperty("Identifier", When_loading_entities_with_shared_property.propertyName, //"doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_shared_property.entityKey, When_loading_entities_with_shared_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_shared_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_shared_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_shared_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty//(When_loading_entities_with_duplicated_shared_property.propertyName, "doc", true, false).WithSharedDecimalProperty("Identifier", When_loading_entities_with_duplicated_shared_property.propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_shared_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_shared_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_string_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_string_property.entityName).WithDocumentation("here only because documentation is required").WithStringProperty(When_loading_entities_with_string_property.propertyName, "doc", true, false, //10).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_string_property.entityKey, When_loading_entities_with_string_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_string_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_string_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_string_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty//(When_loading_entities_with_duplicated_string_property.propertyName, "doc", true, false).WithStringProperty(When_loading_entities_with_duplicated_string_property.propertyName, "doc", true, false, 10).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_string_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_string_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_time_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_time_property.entityName).WithDocumentation("here only because documentation is required").WithTimeProperty(When_loading_entities_with_time_property.propertyName, "doc", true, false)//.WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_time_property.entityKey, When_loading_entities_with_time_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_time_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_time_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_time_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty(When_loading_entities_with_duplicated_time_property.propertyName, //"doc", true, false).WithTimeProperty(When_loading_entities_with_duplicated_time_property.propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_time_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_time_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_year_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_year_property.entityName).WithDocumentation("here only because documentation is required").WithYearProperty(When_loading_entities_with_year_property.propertyName, "doc", true, false)//.WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_year_property.entityKey, When_loading_entities_with_year_property.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_year_property.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_year_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_year_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty(When_loading_entities_with_duplicated_year_property.propertyName, //"doc", true, false).WithYearProperty(When_loading_entities_with_duplicated_year_property.propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_year_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_year_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_same_identifier_but_different_with_contexts extends BaseSymbolTableBuilderTest {
//            protected static withContext1: string = "WithContext1";
//            protected static withContext2: string = "WithContext2";
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("MyIdentifier").WithDocumentation("doc").WithReferenceProperty(When_loading_entities_with_same_identifier_but_different_with_contexts.propertyName, "doc", true, false,///*context:*/When_loading_entities_with_same_identifier_but_different_with_contexts.withContext1).WithReferenceProperty(When_loading_entities_with_same_identifier_but_different_with_contexts.propertyName, "doc", true, false,///*context:*/When_loading_entities_with_same_identifier_but_different_with_contexts.withContext2).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_load_into_property_symbol_table(): void {
//                let entitySymbolTable = symbolTable.Get(When_loading_entities_with_same_identifier_but_different_with_contexts.entityKey, When_loading_entities_with_same_identifier_but_different_with_contexts.entityName);
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_same_identifier_but_different_with_contexts.withContext1 + When_loading_entities_with_same_identifier_but_different_with_contexts.propertyName).ShouldNotBeNull();
//                entitySymbolTable.PropertySymbolTable.Get(When_loading_entities_with_same_identifier_but_different_with_contexts.withContext2 + When_loading_entities_with_same_identifier_but_different_with_contexts.propertyName).ShouldNotBeNull();
//            }
//        }
//    }
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_same_identifier_and_same_with_contexts extends BaseSymbolTableBuilderTest {
//            protected static withContext: string = "WithContext";
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("MyIdentifier").WithDocumentation("doc").WithReferenceProperty(When_loading_entities_with_same_identifier_and_same_with_contexts.propertyName, "doc", true, false,///*context:*/When_loading_entities_with_same_identifier_and_same_with_contexts.withContext).WithReferenceProperty(When_loading_entities_with_same_identifier_and_same_with_contexts.propertyName, "doc", true, false,///*context:*/When_loading_entities_with_same_identifier_and_same_with_contexts.withContext).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_same_identifier_and_same_with_contexts.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_same_identifier_and_same_with_contexts.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//            public should_report_position_of_error(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.ConcatenatedLineNumber.ShouldEqual(10);
//                failure.CharacterPosition.ShouldEqual(14);
//            }
//        }
//    } 
//# sourceMappingURL=SymbolTableBuilderPropertyTests.js.map