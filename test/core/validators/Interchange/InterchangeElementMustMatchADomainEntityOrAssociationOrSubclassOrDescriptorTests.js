using;
System.Linq;
using;
MetaEd.Core.Validator.Interchange;
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
            var Interchange;
            (function (Interchange) {
                class InterchangeElementMustMatchADomainEntityOrAssociationOrSubclassOrDescriptorTests {
                    constructor() {
                        this.class = When_element_is_domain_entity;
                    }
                }
                {
                    const string = _entityName = "EntityName";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity(_entityName)
                            .WithDocumentation("doc")
                            .WithStringIdentity("RequirePrimaryKey", "doc", 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartInterchange("InterchangeName")
                            .WithDocumentation("doc")
                            .WithElement(_entityName)
                            .WithEndInterchange()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.InterchangeElementContext >
                            {
                                SuppliedRule: SuppliedRule = new InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_element_is_domain_entity_subclass {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entityName = "EntityName";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity("DomainEntityBase")
                            .WithDocumentation("doc")
                            .WithStringIdentity("RequirePrimaryKey", "doc", 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartDomainEntitySubclass(_entityName, "DomainEntityBase")
                            .WithDocumentation("doc")
                            .WithDateProperty("BeginDate", "doc", true, false)
                            .WithEndDomainEntitySubclass();
                        metaEdTextBuilder.WithStartInterchange("InterchangeName")
                            .WithDocumentation("doc")
                            .WithElement(_entityName)
                            .WithEndInterchange()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.InterchangeElementContext >
                            {
                                SuppliedRule: SuppliedRule = new InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_element_is_association {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entityName = "MyIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartAssociation(_entityName)
                            .WithDocumentation("doc")
                            .WithDomainEntityProperty("DomainEntity1", "doc")
                            .WithDomainEntityProperty("DomainEntity2", "doc")
                            .WithBooleanProperty("Property1", "because a property is required", true, false)
                            .WithEndAssociation();
                        metaEdTextBuilder.WithStartInterchange("InterchangeName")
                            .WithDocumentation("doc")
                            .WithElement(_entityName)
                            .WithEndInterchange()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.InterchangeElementContext >
                            {
                                SuppliedRule: SuppliedRule = new InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_element_is_association_subclass {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entityName = "MyIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartAssociation("BaseName")
                            .WithDocumentation("doc")
                            .WithDomainEntityProperty("DomainEntity1", "doc")
                            .WithDomainEntityProperty("DomainEntity2", "doc")
                            .WithBooleanProperty("Property1", "doc", true, false)
                            .WithEndAssociation();
                        metaEdTextBuilder.WithStartAssociationSubclass(_entityName, "BaseName")
                            .WithDocumentation("doc")
                            .WithBooleanProperty("Property2", "doc", true, false)
                            .WithEndAssociationSubclass();
                        metaEdTextBuilder.WithStartInterchange("InterchangeName")
                            .WithDocumentation("doc")
                            .WithElement(_entityName)
                            .WithEndInterchange()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.InterchangeElementContext >
                            {
                                SuppliedRule: SuppliedRule = new InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_element_is_descriptor {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entityName = "MyIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDescriptor(_entityName)
                            .WithDocumentation("doc")
                            .WithStartMapType()
                            .WithDocumentation("map type doc")
                            .WithEnumerationItem("this is short description 1", "doc1")
                            .WithEndMapType()
                            .WithEndDescriptor();
                        metaEdTextBuilder.WithStartInterchange("InterchangeName")
                            .WithDocumentation("doc")
                            .WithElement(_entityName)
                            .WithEndInterchange()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.InterchangeElementContext >
                            {
                                SuppliedRule: SuppliedRule = new InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_not_validate();
                    {
                        _errorMessageCollection.Any().ShouldBeTrue();
                    }
                }
                [TestFixture];
                class When_element_has_invalid_identifier {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entityName = "MyIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartInterchange("InterchangeName")
                            .WithDocumentation("doc")
                            .WithElement(_entityName)
                            .WithEndInterchange()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.InterchangeElementContext >
                            {
                                SuppliedRule: SuppliedRule = new InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(_symbolTable)
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
                        _errorMessageCollection[0].Message.ShouldContain("element");
                        _errorMessageCollection[0].Message.ShouldContain(_entityName);
                        _errorMessageCollection[0].Message.ShouldContain("does not match");
                    }
                }
            })(Interchange = Validator.Interchange || (Validator.Interchange = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeElementMustMatchADomainEntityOrAssociationOrSubclassOrDescriptorTests.js.map