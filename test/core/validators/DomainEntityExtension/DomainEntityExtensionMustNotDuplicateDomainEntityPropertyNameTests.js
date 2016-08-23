using;
System.Linq;
using;
MetaEd.Core.Validator.DomainEntityExtension;
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
            var DomainEntityExtension;
            (function (DomainEntityExtension) {
                class DomainEntityExtensionMustNotDuplicateDomainEntityPropertyNameTests {
                    constructor() {
                        this.class = When_domain_entity_extension_has_different_property_name;
                    }
                }
                {
                    const string = _entity_name = "MyIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity(_entity_name)
                            .WithDocumentation("because documentation is required")
                            .WithBooleanProperty("Property1", "because a property is required", true, false)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartDomainEntityExtension(_entity_name)
                            .WithBooleanProperty("Property2", "because a property is required", true, false)
                            .WithEndDomainEntityExtension()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.DomainEntityExtensionContext >
                            {
                                SuppliedRule: SuppliedRule = new DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_domain_entity_extension_has_duplicate_property_name {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "MyIdentifier";
                    const string = _duplicate_property_name = "Property1";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity(_entity_name)
                            .WithDocumentation("because documentation is required")
                            .WithBooleanProperty(_duplicate_property_name, "because a property is required", true, false)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartDomainEntityExtension(_entity_name)
                            .WithBooleanProperty(_duplicate_property_name, "because a property is required", true, false)
                            .WithEndDomainEntityExtension()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.DomainEntityExtensionContext >
                            {
                                SuppliedRule: SuppliedRule = new DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName(_symbolTable)
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
                        _errorMessageCollection[0].Message.ShouldContain("Domain Entity additions");
                        _errorMessageCollection[0].Message.ShouldContain(_entity_name);
                        _errorMessageCollection[0].Message.ShouldContain(_duplicate_property_name);
                        _errorMessageCollection[0].Message.ShouldContain("already in property list");
                    }
                }
                [TestFixture];
                class When_domain_entity_extension_has_multiple_duplicate_property_names {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "MyIdentifier";
                    const string = _not_duplicate_property_name = "NotADuplicate";
                    const string = _duplicate_property_name1 = "Property1";
                    const string = _duplicate_property_name2 = "Property2";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity(_entity_name)
                            .WithDocumentation("because documentation is required")
                            .WithBooleanProperty(_duplicate_property_name1, "because a property is required", true, false)
                            .WithBooleanProperty(_duplicate_property_name2, "because a property is required", true, false)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartDomainEntityExtension(_entity_name)
                            .WithBooleanProperty(_duplicate_property_name1, "because a property is required", true, false)
                            .WithBooleanProperty(_duplicate_property_name2, "because a property is required", true, false)
                            .WithBooleanProperty(_not_duplicate_property_name, "because a property is required", true, false)
                            .WithEndDomainEntityExtension()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.DomainEntityExtensionContext >
                            {
                                SuppliedRule: SuppliedRule = new DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName(_symbolTable)
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
                        _errorMessageCollection[0].Message.ShouldContain("Domain Entity additions");
                        _errorMessageCollection[0].Message.ShouldContain(_entity_name);
                        _errorMessageCollection[0].Message.ShouldContain(_duplicate_property_name1);
                        _errorMessageCollection[0].Message.ShouldContain(_duplicate_property_name2);
                        _errorMessageCollection[0].Message.ShouldContain("already in property list");
                        _errorMessageCollection[0].Message.ShouldNotContain(_not_duplicate_property_name);
                    }
                }
                [TestFixture];
                class When_domain_entity_extension_has_duplicate_include_property {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "MyIdentifier";
                    const string = _duplicate_property_name = "Property1";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity(_entity_name)
                            .WithDocumentation("doc")
                            .WithIncludeProperty(_duplicate_property_name, "doc", true, false)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartDomainEntityExtension(_entity_name)
                            .WithIncludeProperty(_duplicate_property_name, "doc", true, false)
                            .WithEndDomainEntityExtension()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.DomainEntityExtensionContext >
                            {
                                SuppliedRule: SuppliedRule = new DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_validation_failure();
                    {
                        _errorMessageCollection.Any().ShouldBeTrue();
                    }
                }
                [TestFixture];
                class When_domain_entity_extension_has_duplicate_include_extension_override_property {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "MyIdentifier";
                    const string = _duplicate_property_name = "Property1";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity(_entity_name)
                            .WithDocumentation("doc")
                            .WithIncludeProperty(_duplicate_property_name, "doc", true, false)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartDomainEntityExtension(_entity_name)
                            .WithIncludeExtensionOverrideProperty(_duplicate_property_name, "doc", true, false)
                            .WithEndDomainEntityExtension()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.DomainEntityExtensionContext >
                            {
                                SuppliedRule: SuppliedRule = new DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_not_have_validation_failure();
                    {
                        _errorMessageCollection.Any().ShouldBeFalse();
                    }
                }
            })(DomainEntityExtension = Validator.DomainEntityExtension || (Validator.DomainEntityExtension = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityExtensionMustNotDuplicateDomainEntityPropertyNameTests.js.map