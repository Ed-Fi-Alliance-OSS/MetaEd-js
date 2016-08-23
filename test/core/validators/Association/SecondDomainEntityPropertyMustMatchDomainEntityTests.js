using;
System.Linq;
using;
MetaEd.Core.Validator.Association;
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
            var Association;
            (function (Association) {
                class SecondDomainEntityPropertyMustMatchDomainOrAbstractEntityTests {
                    constructor() {
                        this.class = When_domain_entity_property_has_domain_entity_identifier;
                    }
                }
                {
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity("First")
                            .WithDocumentation("doc")
                            .WithStringIdentity("RequirePrimaryKey", "doc", 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartDomainEntity("Second")
                            .WithDocumentation("doc")
                            .WithStringIdentity("RequirePrimaryKey", "doc", 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartAssociation("Association1")
                            .WithDocumentation("doc")
                            .WithDomainEntityProperty("First", "doc1")
                            .WithDomainEntityProperty("Second", "doc2")
                            .WithEndAssociation()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.SecondDomainEntityContext >
                            {
                                SuppliedRule: SuppliedRule = new SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_domain_entity_property_has_abstract_entity_identifier {
                }
                Validator.ValidationRuleTestBase;
                {
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity("First")
                            .WithDocumentation("doc")
                            .WithStringIdentity("RequirePrimaryKey", "doc", 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartAbstractEntity("Second")
                            .WithDocumentation("doc")
                            .WithStringIdentity("RequirePrimaryKey", "doc", 100)
                            .WithEndAbstractEntity();
                        metaEdTextBuilder.WithStartAssociation("Association1")
                            .WithDocumentation("doc")
                            .WithDomainEntityProperty("First", "doc1")
                            .WithDomainEntityProperty("Second", "doc2")
                            .WithEndAssociation()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.SecondDomainEntityContext >
                            {
                                SuppliedRule: SuppliedRule = new SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_domain_entity_property_has_subclass_entity_identifier {
                }
                Validator.ValidationRuleTestBase;
                {
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartAbstractEntity("First")
                            .WithDocumentation("doc")
                            .WithStringIdentity("RequirePrimaryKey", "doc", 100)
                            .WithEndAbstractEntity();
                        metaEdTextBuilder.WithStartDomainEntity("Second")
                            .WithDocumentation("doc")
                            .WithStringIdentity("RequirePrimaryKey", "doc", 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartDomainEntitySubclass("Third", "First")
                            .WithDocumentation("doc")
                            .WithStringProperty("RequirePrimaryKey", "doc", true, false, 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartAssociation("Association1")
                            .WithDocumentation("doc")
                            .WithDomainEntityProperty("Second", "doc1")
                            .WithDomainEntityProperty("Third", "doc2")
                            .WithEndAssociation()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.SecondDomainEntityContext >
                            {
                                SuppliedRule: SuppliedRule = new SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_domain_entity_property_has_invalid_identifier {
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
                            .WithStartDomainEntity("First")
                            .WithDocumentation("doc")
                            .WithStringIdentity("RequirePrimaryKey", "doc", 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartAssociation("Association1")
                            .WithDocumentation("doc")
                            .WithDomainEntityProperty("First", "doc1")
                            .WithDomainEntityProperty(_entityName, "doc2")
                            .WithEndAssociation()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.SecondDomainEntityContext >
                            {
                                SuppliedRule: SuppliedRule = new SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity(_symbolTable)
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
                        _errorMessageCollection[0].Message.ShouldContain("Domain Entity");
                        _errorMessageCollection[0].Message.ShouldContain(_entityName);
                        _errorMessageCollection[0].Message.ShouldContain("does not match");
                    }
                }
            })(Association = Validator.Association || (Validator.Association = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SecondDomainEntityPropertyMustMatchDomainEntityTests.js.map