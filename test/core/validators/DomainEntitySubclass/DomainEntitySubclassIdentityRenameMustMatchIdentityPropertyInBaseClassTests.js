using;
MetaEd.Core.Validator;
using;
MetaEd.Core.Validator.DomainEntitySubclass;
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
            var DomainEntitySubclass;
            (function (DomainEntitySubclass) {
                class DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests {
                    constructor() {
                        this.class = When_domain_entity_subclass_renames_base_identity;
                    }
                }
                {
                    const string = _entity_name = "SubclassIdentifier";
                    const string = _base_name = "BaseDomainEntityIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity(_base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentity("Property1", "because a property is required", 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartDomainEntitySubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentityRename("Property2", "Property1", "because a property is required", 100)
                            .WithEndDomainEntitySubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.DomainEntitySubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.ShouldBeEmpty();
                    }
                }
                [TestFixture];
                class When_domain_entity_subclass_does_not_rename_identity {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "SubclassIdentifier";
                    const string = _base_name = "BaseDomainEntityIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity(_base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentity("Property1", "because a property is required", 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartDomainEntitySubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringProperty("Property2", "because a property is required", true, false, 100)
                            .WithEndDomainEntitySubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.DomainEntitySubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.ShouldBeEmpty();
                    }
                }
                [TestFixture];
                class When_domain_entity_subclass_renames_base_identity_more_than_once {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "SubclassIdentifier";
                    const string = _base_name = "BaseDomainEntityIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity(_base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentity("Property1", "because a property is required", 100)
                            .WithStringIdentity("Property2", "because a property is required", 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartDomainEntitySubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentityRename("Property3", "Property1", "because a property is required", 100)
                            .WithStringIdentityRename("Property4", "Property2", "because a property is required", 100)
                            .WithEndDomainEntitySubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.DomainEntitySubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce()
                            };
                    }
                    [Test];
                    void Should_have_validation_failures();
                    {
                        _errorMessageCollection.ShouldNotBeEmpty();
                    }
                    [Test];
                    void Should_have_validation_failure_message();
                    {
                        _errorMessageCollection[0].Message.ShouldEqual("Domain Entity 'SubclassIdentifier' based on 'BaseDomainEntityIdentifier' tries to rename columns Property1, Property2.  Only one identity rename is allowed for a given Domain Entity.");
                    }
                }
                [TestFixture];
                class When_domain_entity_subclass_renames_base_identity_that_does_not_exist {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "SubclassIdentifier";
                    const string = _base_name = "BaseDomainEntityIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity(_base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentity("Property1", "because a property is required", 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartDomainEntitySubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentityRename("Property2", "Property3", "because a property is required", 100)
                            .WithEndDomainEntitySubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.DomainEntitySubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_validation_failures();
                    {
                        _errorMessageCollection.ShouldNotBeEmpty();
                    }
                    [Test];
                    void Should_have_validation_failure_message();
                    {
                        _errorMessageCollection[0].Message.ShouldEqual("DomainEntity 'SubclassIdentifier' based on 'BaseDomainEntityIdentifier' tries to rename Property3 which is not part of the identity.");
                    }
                }
                [TestFixture];
                class When_domain_entity_subclass_renames_base_property_that_is_not_identity {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "SubclassIdentifier";
                    const string = _base_name = "BaseDomainEntityIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntity(_base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentity("Property1", "because a property is required", 100)
                            .WithStringProperty("Property3", "foo", true, false, 100)
                            .WithEndDomainEntity();
                        metaEdTextBuilder.WithStartDomainEntitySubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentityRename("Property2", "Property3", "because a property is required", 100)
                            .WithEndDomainEntitySubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.DomainEntitySubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_validation_failures();
                    {
                        _errorMessageCollection.ShouldNotBeEmpty();
                    }
                    [Test];
                    void Should_have_validation_failure_message();
                    {
                        _errorMessageCollection[0].Message.ShouldEqual("DomainEntity 'SubclassIdentifier' based on 'BaseDomainEntityIdentifier' tries to rename Property3 which is not part of the identity.");
                    }
                }
                [TestFixture];
                class When_domain_entity_subclass_extends_non_existant_entity {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "SubclassIdentifier";
                    const string = _base_name = "BaseDomainEntityIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartDomainEntitySubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentityRename("Property2", "Property3", "because a property is required", 100)
                            .WithEndDomainEntitySubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.DomainEntitySubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        // we let this pass validation b/c there are other rules to ensure the subclass setup is correct
                        _errorMessageCollection.ShouldBeEmpty();
                    }
                }
            })(DomainEntitySubclass = Validator.DomainEntitySubclass || (Validator.DomainEntitySubclass = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests.js.map