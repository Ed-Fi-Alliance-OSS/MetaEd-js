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
                class DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclassTests {
                    constructor() {
                        this.class = When_domain_entity_extension_has_valid_extendee;
                    }
                }
                {
                    const string = _entity_name = "MyIdentifier";
                    const string = _property_name = "Property1";
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
                                SuppliedRule: SuppliedRule = new DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_domain_entity_extension_has_invalid_extendee {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "NotADomainEntityIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntityExtension(_entity_name)
                            .WithBooleanProperty("Property2", "because a property is required", false, false)
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
                                SuppliedRule: SuppliedRule = new DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass(_symbolTable)
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
                        _errorMessageCollection[0].Message.ShouldContain("does not match");
                    }
                }
                [TestFixture];
                class When_domain_entity_extension_extends_domain_entity_subclass {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "MyIdentifier";
                    const string = _subclass_name = "MyIdentifierSubclass";
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
                        metaEdTextBuilder
                            .WithStartDomainEntitySubclass(_subclass_name, _entity_name)
                            .WithDocumentation("because documentation is required")
                            .WithBooleanProperty("Property2", "because a property is required", true, false)
                            .WithEndDomainEntitySubclass();
                        metaEdTextBuilder.WithStartDomainEntityExtension(_subclass_name)
                            .WithBooleanProperty("Property3", "because a property is required", true, false)
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
                                SuppliedRule: SuppliedRule = new DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_domain_entity_extension_extends_abstract_domain_entity {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "MyIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartAbstractEntity(_entity_name)
                            .WithDocumentation("because documentation is required")
                            .WithBooleanProperty("Property1", "because a property is required", true, false)
                            .WithEndAbstractEntity();
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
                                SuppliedRule: SuppliedRule = new DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass(_symbolTable)
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
                        _errorMessageCollection[0].Message.ShouldContain("does not match");
                    }
                }
            })(DomainEntityExtension = Validator.DomainEntityExtension || (Validator.DomainEntityExtension = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclassTests.js.map