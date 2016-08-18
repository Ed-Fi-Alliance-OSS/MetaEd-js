"use strict";
const ValidationTestBase_1 = require('./ValidationTestBase');
const MetaEdTextBuilder_1 = require('../../grammar/MetaEdTextBuilder');
const chai = require('chai');
chai.should();
class BaseSymbolTableBuilderTest extends ValidationTestBase_1.ValidationTestBase {
}
BaseSymbolTableBuilderTest.entityName = "MyIdentifier";
BaseSymbolTableBuilderTest.propertyName = "Property1";
BaseSymbolTableBuilderTest.entityKey = "Domain Entity";
exports.BaseSymbolTableBuilderTest = BaseSymbolTableBuilderTest;
class When_loading_entities_with_boolean_property extends BaseSymbolTableBuilderTest {
    metaEdText() {
        let metaEdTextBuilder = new MetaEdTextBuilder_1.default();
        metaEdTextBuilder.withBeginNamespace("edfi")
            .withStartDomainEntity(BaseSymbolTableBuilderTest.entityName)
            .withDocumentation("here only because documentation is required")
            .withBooleanProperty(BaseSymbolTableBuilderTest.propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withEndNamespace();
        return metaEdTextBuilder.toString();
    }
    should_load_into_property_symbol_table() {
        //TODO: Do you go full Chai and lose strongly typed oo design with base classes and the general shape of the origin code or try out this code with tsUnit to see if it fits together well.
        //TODO: If we remove chai what do we lose?
        //TODO: What are the downsides of this current implementation which is a hybrid of original shape of code but with added chai boilerplate and the use of chai.
        describe('SymbolTableBuilderPropertyTests', () => {
            describe('When_loading_entities_with_boolean_property', () => {
                this.setup();
                it('should_load_into_property_symbol_table', () => {
                    let entitySymbolTable = this._symbolTable.get(BaseSymbolTableBuilderTest.entityKey, BaseSymbolTableBuilderTest.entityName);
                    entitySymbolTable.should.not.be.empty;
                    let result = entitySymbolTable.propertySymbolTable.get(BaseSymbolTableBuilderTest.propertyName);
                    result.should.not.be.empty;
                });
                this.setupPostBuilder();
            });
        });
    }
}
exports.When_loading_entities_with_boolean_property = When_loading_entities_with_boolean_property;
//(new When_loading_entities_with_boolean_property).should_load_into_property_symbol_table();
//    export module SymbolTableBuilderPropertyTests {
//        /*[TestFixture]*/
//        export class When_loading_entities_with_duplicated_boolean_property extends BaseSymbolTableBuilderTest {
//            protected metaEdText(): string {
//                let metaEdTextBuilder = new MetaEdTextBuilder();
//                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_loading_entities_with_duplicated_boolean_property.entityName).WithDocumentation("here only because documentation is required").WithBooleanProperty//(When_loading_entities_with_duplicated_boolean_property.propertyName, "doc", true, false).WithBooleanProperty(When_loading_entities_with_duplicated_boolean_property.propertyName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
//                return metaEdTextBuilder;
//            }
//            public should_report_duplicate_property_names(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_boolean_property.propertyName);
//                failure.Message.ShouldContain(When_loading_entities_with_duplicated_boolean_property.entityName);
//                failure.Message.ShouldContain("duplicate");
//            }
//            public should_report_position_of_error(): void {
//                errorMessageCollection.Count.ShouldEqual(1);
//                let failure = errorMessageCollection[0];
//                failure.ConcatenatedLineNumber.ShouldEqual(9);
//                failure.CharacterPosition.ShouldEqual(9);
//            }
//        }
//    }
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