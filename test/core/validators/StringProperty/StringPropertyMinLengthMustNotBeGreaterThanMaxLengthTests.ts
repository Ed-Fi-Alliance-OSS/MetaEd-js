module MetaEd.Tests.Validator.StringProperty {
    export class StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests {

    }
    export module StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests {
        /*[TestFixture]*/
        export class When_validating_string_property_with_no_min_length extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithStringIdentity("StringProperty", "doc2", 100).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.StringPropertyContext>(), { SuppliedRule: new StringPropertyMinLengthMustNotBeGreaterThanMaxLength() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests {
        /*[TestFixture]*/
        export class When_validating_string_property_with_correct_min_max_length_order extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var maxLength: number = 100;
                var minLength: number = 50;
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithStringIdentity("StringProperty", "doc2", maxLength, minLength).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.StringPropertyContext>(), { SuppliedRule: new StringPropertyMinLengthMustNotBeGreaterThanMaxLength() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests {
        /*[TestFixture]*/
        export class When_validating_string_property_with_min_max_length_out_of_order extends ValidationRuleTestBase {
            protected static _entity_name: string = "EntityForTest";
            protected static _string_property_name: string = "StringProperty";
            protected metaEdText(): string {
                var maxLength: number = 50;
                var minLength: number = 100;
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_string_property_with_min_max_length_out_of_order._entity_name).WithDocumentation("doc").WithStringIdentity(When_validating_string_property_with_min_max_length_out_of_order._string_property_name, "doc2", maxLength, minLength).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.StringPropertyContext>(), { SuppliedRule: new StringPropertyMinLengthMustNotBeGreaterThanMaxLength() });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("String Property");
                _errorMessageCollection[0].Message.ShouldContain("Abstract Entity");
                _errorMessageCollection[0].Message.ShouldContain(When_validating_string_property_with_min_max_length_out_of_order._string_property_name);
                _errorMessageCollection[0].Message.ShouldContain(When_validating_string_property_with_min_max_length_out_of_order._entity_name);
                _errorMessageCollection[0].Message.ShouldContain("min length greater than max length");
            }
        }
    }
    export module StringPropertyMinLengthMustNotBeGreaterThanMaxLengthTests {
        /*[TestFixture]*/
        export class When_validating_string_property_with_same_min_max_length extends ValidationRuleTestBase {
            protected static _entity_name: string = "EntityForTest";
            protected static _string_property_name: string = "StringProperty";
            protected metaEdText(): string {
                var maxLength: number = 100;
                var minLength: number = 100;
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_string_property_with_same_min_max_length._entity_name).WithDocumentation("doc").WithStringIdentity(When_validating_string_property_with_same_min_max_length._string_property_name, "doc2", maxLength, minLength).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.StringPropertyContext>(), { SuppliedRule: new StringPropertyMinLengthMustNotBeGreaterThanMaxLength() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
}