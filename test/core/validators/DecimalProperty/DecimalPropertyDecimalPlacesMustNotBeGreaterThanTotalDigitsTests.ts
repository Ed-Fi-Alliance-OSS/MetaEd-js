module MetaEd.Tests.Validator.DecimalProperty {
    export class DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests {

    }
    export module DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests {
        /*[TestFixture]*/
        export class When_validating_decimal_property_with_correct_total_digit_and_decimal_places_order extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var totalDigits: number = 10;
                var decimalPlaces: number = 2;
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity("EntityForTest").WithDocumentation("doc").WithDecimalIdentity("DecimalProperty", "doc2", totalDigits, decimalPlaces).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DecimalPropertyContext>(), { SuppliedRule: new DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests {
        /*[TestFixture]*/
        export class When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order extends ValidationRuleTestBase {
            private static _entityName: string = "EntityForTest";
            private static _decimalPropertyName: string = "DecimalProperty";
            protected metaEdText(): string {
                var totalDigits: number = 2;
                var decimalPlaces: number = 10;
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order._entityName).WithDocumentation("doc").WithDecimalIdentity(When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order._decimalPropertyName, "doc2", totalDigits, decimalPlaces).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DecimalPropertyContext>(), { SuppliedRule: new DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits() });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Decimal Property");
                _errorMessageCollection[0].Message.ShouldContain("Abstract Entity");
                _errorMessageCollection[0].Message.ShouldContain(When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order._decimalPropertyName);
                _errorMessageCollection[0].Message.ShouldContain(When_validating_decimal_property_with_total_digit_and_decimal_places_out_of_order._entityName);
                _errorMessageCollection[0].Message.ShouldContain("decimal places greater than total digits");
            }
        }
    }
    export module DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigitsTests {
        /*[TestFixture]*/
        export class When_validating_decimal_property_with_same_total_digit_and_decimal_places extends ValidationRuleTestBase {
            private static _entityName: string = "EntityForTest";
            private static _decimalPropertyName: string = "DecimalProperty";
            protected metaEdText(): string {
                var totalDigits: number = 10;
                var decimalPlaces: number = 2;
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAbstractEntity(When_validating_decimal_property_with_same_total_digit_and_decimal_places._entityName).WithDocumentation("doc").WithDecimalIdentity(When_validating_decimal_property_with_same_total_digit_and_decimal_places._decimalPropertyName, "doc2", totalDigits, decimalPlaces).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.DecimalPropertyContext>(), { SuppliedRule: new DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
}