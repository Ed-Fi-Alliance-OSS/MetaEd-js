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
                class FirstDomainEntityPropertyMustNotCollideWithOtherPropertyTests {
                    constructor() {
                        this.class = When_domain_entity_property_does_not_collide;
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
                            .WithIntegerProperty("Third", "doc3", false, false)
                            .WithEndAssociation()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.FirstDomainEntityContext >
                            {
                                SuppliedRule: SuppliedRule = new FirstDomainEntityPropertyMustNotCollideWithOtherProperty(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_domain_entity_property_does_collide {
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
                        metaEdTextBuilder.WithStartDomainEntity("Second")
                            .WithDocumentation("doc")
                            .WithStringIdentity("RequirePrimaryKey", "doc", 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartAssociation("Association1")
                            .WithDocumentation("doc")
                            .WithDomainEntityProperty("First", "doc1")
                            .WithDomainEntityProperty("Second", "doc2")
                            .WithIntegerProperty("First", "doc3", false, false)
                            .WithEndAssociation()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.FirstDomainEntityContext >
                            {
                                SuppliedRule: SuppliedRule = new FirstDomainEntityPropertyMustNotCollideWithOtherProperty(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(1);
                    }
                    [Test];
                    void Should_have_validation_failure_message();
                    {
                        _errorMessageCollection[0].Message.ShouldEqual("Entity Association1 has duplicate properties named First");
                    }
                }
            })(Association = Validator.Association || (Validator.Association = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=FirstDomainEntityPropertyMustNotCollideWithOtherPropertyTests.js.map