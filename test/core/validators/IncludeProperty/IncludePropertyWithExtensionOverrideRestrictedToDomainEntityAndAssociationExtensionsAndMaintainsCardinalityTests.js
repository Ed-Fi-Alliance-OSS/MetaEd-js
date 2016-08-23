using;
System.Linq;
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
                class IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests {
                    constructor() {
                        this.class = When_include_property_does_not_have_extension_override;
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
                            .WithStringProperty("StringProperty", "doc", true, false, 100)
                            .WithEndCommonType();
                        metaEdTextBuilder.WithStartDomainEntity(_entityName)
                            .WithDocumentation("doc")
                            .WithIdentityProperty("include", _propertyName, "doc")
                            .WithEndDomainEntity()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.IncludePropertyContext >
                            {
                                SuppliedRule: SuppliedRule = new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_not_have_validation_failure();
                    {
                        _errorMessageCollection.Any().ShouldBeFalse();
                    }
                }
                [TestFixture];
                class When_include_property_has_extension_override_on_non_domain_entity_or_association_extensions {
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
                            .WithStringProperty("StringProperty", "doc", true, false, 100)
                            .WithEndCommonType();
                        metaEdTextBuilder.WithStartDomainEntity(_entityName)
                            .WithDocumentation("doc")
                            .WithIncludeExtensionOverrideProperty(_commonTypeName, "doc", true, true)
                            .WithEndDomainEntity()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.IncludePropertyContext >
                            {
                                SuppliedRule: SuppliedRule = new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable)
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
                class When_include_property_has_extension_override_on_domain_entity_extension_without_include_on_extendee {
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
                                SuppliedRule: SuppliedRule = new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable)
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
                class When_include_property_has_extension_override_on_association_extension_without_include_on_extendee {
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
                        metaEdTextBuilder.WithStartAssociation(_entityName)
                            .WithDocumentation("doc")
                            .WithDomainEntityProperty("DummyEntity1", "doc")
                            .WithDomainEntityProperty("DummyEntity2", "doc")
                            .WithBooleanProperty("DummyProperty2", "doc", true, false)
                            .WithEndDomainEntity()
                            .WithEndNamespace();
                        metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION")
                            .WithStartAssociationExtension(_entityName)
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
                                SuppliedRule: SuppliedRule = new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable)
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
                class When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_matching_cardinality {
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
                        metaEdTextBuilder.WithStartDomainEntity(_entityName)
                            .WithDocumentation("doc")
                            .WithBooleanProperty("DummyProperty2", "doc", true, false)
                            .WithIncludeProperty(_commonTypeName, "doc", true, true)
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
                                SuppliedRule: SuppliedRule = new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_not_have_validation_failure();
                    {
                        _errorMessageCollection.Any().ShouldBeFalse();
                    }
                }
                [TestFixture];
                class When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_with_matching_cardinality {
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
                        metaEdTextBuilder.WithStartAssociation(_entityName)
                            .WithDocumentation("doc")
                            .WithDomainEntityProperty("DummyEntity1", "doc")
                            .WithDomainEntityProperty("DummyEntity2", "doc")
                            .WithIncludeProperty(_commonTypeName, "doc", true, true)
                            .WithBooleanProperty("DummyProperty2", "doc", true, false)
                            .WithEndDomainEntity()
                            .WithEndNamespace();
                        metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION")
                            .WithStartAssociationExtension(_entityName)
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
                                SuppliedRule: SuppliedRule = new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_not_have_validation_failure();
                    {
                        _errorMessageCollection.Any().ShouldBeFalse();
                    }
                }
                [TestFixture];
                class When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_collection_cardinality {
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
                        metaEdTextBuilder.WithStartDomainEntity(_entityName)
                            .WithDocumentation("doc")
                            .WithBooleanProperty("DummyProperty2", "doc", true, false)
                            .WithIncludeProperty(_commonTypeName, "doc", true, false)
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
                                SuppliedRule: SuppliedRule = new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable)
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
                class When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_nullability {
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
                        metaEdTextBuilder.WithStartDomainEntity(_entityName)
                            .WithDocumentation("doc")
                            .WithBooleanProperty("DummyProperty2", "doc", true, false)
                            .WithIncludeProperty(_commonTypeName, "doc", false, true)
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
                                SuppliedRule: SuppliedRule = new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable)
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
                class When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_collection_cardinality {
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
                        metaEdTextBuilder.WithStartAssociation(_entityName)
                            .WithDocumentation("doc")
                            .WithDomainEntityProperty("DummyEntity1", "doc")
                            .WithDomainEntityProperty("DummyEntity2", "doc")
                            .WithIncludeProperty(_commonTypeName, "doc", true, false)
                            .WithBooleanProperty("DummyProperty2", "doc", true, false)
                            .WithEndDomainEntity()
                            .WithEndNamespace();
                        metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION")
                            .WithStartAssociationExtension(_entityName)
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
                                SuppliedRule: SuppliedRule = new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable)
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
                class When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_nullability {
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
                        metaEdTextBuilder.WithStartAssociation(_entityName)
                            .WithDocumentation("doc")
                            .WithDomainEntityProperty("DummyEntity1", "doc")
                            .WithDomainEntityProperty("DummyEntity2", "doc")
                            .WithIncludeProperty(_commonTypeName, "doc", false, true)
                            .WithBooleanProperty("DummyProperty2", "doc", true, false)
                            .WithEndDomainEntity()
                            .WithEndNamespace();
                        metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION")
                            .WithStartAssociationExtension(_entityName)
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
                                SuppliedRule: SuppliedRule = new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable)
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
            })(IncludeProperty = Validator.IncludeProperty || (Validator.IncludeProperty = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests.js.map