using;
System.Linq;
using;
MetaEd.Core.Validator.CommonSimpleType;
using;
MetaEd.Grammar.Antlr;
using;
MetaEd.Tests.AntlrGrammar;
using;
NUnit.Framework;
using;
Should;
var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var CommonSimpleType;
            (function (CommonSimpleType) {
                class CommonIntegerMinValueMustNotBeGreaterThanMaxValueTests {
                    constructor() {
                        this.class = When_validating_common_integer_with_no_min_or_max_value;
                    }
                }
                {
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartCommonInteger("EntityForTest")
                            .WithDocumentation("doc")
                            .WithEndCommonInteger()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.CommonIntegerContext >
                            {
                                SuppliedRule: SuppliedRule = new CommonIntegerMinValueMustNotBeGreaterThanMaxValue()
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_validating_common_integer_with_no_min_value {
                }
                Validator.ValidationRuleTestBase;
                {
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartCommonInteger("EntityForTest")
                            .WithDocumentation("doc")
                            .WithMaxValue(100)
                            .WithEndCommonInteger()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.CommonIntegerContext >
                            {
                                SuppliedRule: SuppliedRule = new CommonIntegerMinValueMustNotBeGreaterThanMaxValue()
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_validating_common_integer_with_no_max_value {
                }
                Validator.ValidationRuleTestBase;
                {
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartCommonInteger("EntityForTest")
                            .WithDocumentation("doc")
                            .WithMinValue(0)
                            .WithEndCommonInteger()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.CommonIntegerContext >
                            {
                                SuppliedRule: SuppliedRule = new CommonIntegerMinValueMustNotBeGreaterThanMaxValue()
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_validating_common_integer_with_correct_min_max_value_order {
                }
                Validator.ValidationRuleTestBase;
                {
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartCommonInteger("EntityForTest")
                            .WithDocumentation("doc")
                            .WithMinValue(0)
                            .WithMaxValue(100)
                            .WithEndCommonInteger()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.CommonIntegerContext >
                            {
                                SuppliedRule: SuppliedRule = new CommonIntegerMinValueMustNotBeGreaterThanMaxValue()
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_validating_common_integer_with_min_max_values_out_of_order {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entityName = "EntityForTest";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartCommonInteger(_entityName)
                            .WithDocumentation("doc")
                            .WithMinValue(100)
                            .WithMaxValue(0)
                            .WithEndCommonInteger()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.CommonIntegerContext >
                            {
                                SuppliedRule: SuppliedRule = new CommonIntegerMinValueMustNotBeGreaterThanMaxValue()
                            };
                    }
                    [Test];
                    void Should_have_validation_failures();
                    {
                        _errorMessageCollection.Any().ShouldBeTrue();
                    }
                    [Test];
                    void Should_have_validation_failure_message();
                    {
                        _errorMessageCollection[0].Message.ShouldContain("Common Integer");
                        _errorMessageCollection[0].Message.ShouldContain(_entityName);
                        _errorMessageCollection[0].Message.ShouldContain("min value greater than max value");
                    }
                }
                [TestFixture];
                class When_validating_common_integer_with_same_min_max_values {
                }
                Validator.ValidationRuleTestBase;
                {
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartCommonInteger("EntityForTest")
                            .WithDocumentation("doc")
                            .WithMinValue(100)
                            .WithMaxValue(100)
                            .WithEndCommonInteger()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.CommonIntegerContext >
                            {
                                SuppliedRule: SuppliedRule = new CommonIntegerMinValueMustNotBeGreaterThanMaxValue()
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
            })(CommonSimpleType = Validator.CommonSimpleType || (Validator.CommonSimpleType = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonIntegerMinValueMustNotBeGreaterThanMaxValueTests.js.map