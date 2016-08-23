using;
System.Linq;
using;
MetaEd.Core.Validator;
using;
MetaEd.Core.Validator.IncludeProperty;
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
            var IncludeProperty;
            (function (IncludeProperty) {
                class IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtensionTests {
                    constructor() {
                        this.class = When_include_property_has_extension_override_of_non_common_type_extension;
                    }
                }
                {
                    const string = _commonTypeName = "CommonType";
                    const string = _entityName = "MyIdentifier";
                    const string = _propertyName = "Identifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartCommonType(_commonTypeName)
                            .WithDocumentation("doc")
                            .WithBooleanProperty("DummyProperty1", "doc", true, false)
                            .WithEndCommonType();
                        metaEdTextBuilder.WithStartDomainEntity(_entityName)
                            .WithDocumentation("doc")
                            .WithBooleanProperty("DummyProperty2", "doc", true, false)
                            .WithEndDomainEntity()
                            .WithEndNamespace();
                        metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION")
                            .WithStartDomainEntityExtension(_entityName)
                            .WithIncludeExtensionOverrideProperty(_commonTypeName, "doc", true, true)
                            .WithEndDomainEntityExtension()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.IncludePropertyContext >
                            {
                                SuppliedRule: SuppliedRule = new IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_validation_failure();
                    {
                        _errorMessageCollection.Any().ShouldBeTrue();
                    }
                    [Test];
                    void Should_have_validation_failure_message();
                    {
                        _errorMessageCollection[0].Message.ShouldContain("include extension");
                        _errorMessageCollection[0].Message.ShouldContain(_propertyName);
                        _errorMessageCollection[0].Message.ShouldContain(_entityName);
                        _errorMessageCollection[0].Message.ShouldContain("invalid");
                    }
                }
                [TestFixture];
                class When_include_property_has_extension_override_of_common_type_extension {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _commonTypeName = "CommonType";
                    const string = _entityName = "MyIdentifier";
                    const string = _propertyName = "Identifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartCommonType(_commonTypeName)
                            .WithDocumentation("doc")
                            .WithBooleanProperty("DummyProperty1", "doc", true, false)
                            .WithEndCommonType();
                        metaEdTextBuilder.WithStartCommonTypeExtension(_commonTypeName)
                            .WithBooleanProperty("DummyProperty3", "doc", true, false)
                            .WithEndCommonType();
                        metaEdTextBuilder.WithStartDomainEntity(_entityName)
                            .WithDocumentation("doc")
                            .WithBooleanProperty("DummyProperty2", "doc", true, false)
                            .WithEndDomainEntity()
                            .WithEndNamespace();
                        metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION")
                            .WithStartDomainEntityExtension(_entityName)
                            .WithIncludeExtensionOverrideProperty(_commonTypeName, "doc", true, true)
                            .WithEndDomainEntityExtension()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.IncludePropertyContext >
                            {
                                SuppliedRule: SuppliedRule = new IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_not_have_validation_failure();
                    {
                        _errorMessageCollection.Any().ShouldBeFalse();
                    }
                }
            })(IncludeProperty = Validator.IncludeProperty || (Validator.IncludeProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtensionTests.js.map