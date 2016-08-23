using;
MetaEd.Core.Validator;
using;
MetaEd.Core.Validator.AssociationSubclass;
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
            var AssociationSubclass;
            (function (AssociationSubclass) {
                class AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests {
                    constructor() {
                        this.class = When_association_subclass_renames_base_identity;
                    }
                }
                {
                    const string = _entity_name = "SubclassIdentifier";
                    const string = _base_name = "BaseAssociationIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartAssociation(_base_name)
                            .WithDocumentation("because documentation is required")
                            .WithDomainEntityProperty("DomainEntity1", "doc")
                            .WithDomainEntityProperty("DomainEntity2", "doc")
                            .WithStringIdentity("Property1", "because a property is required", 100)
                            .WithEndAssociation();
                        metaEdTextBuilder.WithStartAssociationSubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentityRename("Property2", "Property1", "because a property is required", 100)
                            .WithEndAssociationSubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.AssociationSubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.ShouldBeEmpty();
                    }
                }
                [TestFixture];
                class When_association_subclass_does_not_rename_identity {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "SubclassIdentifier";
                    const string = _base_name = "BaseAssociationIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartAssociation(_base_name)
                            .WithDocumentation("because documentation is required")
                            .WithDomainEntityProperty("DomainEntity1", "doc")
                            .WithDomainEntityProperty("DomainEntity2", "doc")
                            .WithStringIdentity("Property1", "because a property is required", 100)
                            .WithEndAssociation();
                        metaEdTextBuilder.WithStartAssociationSubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringProperty("Property2", "because a property is required", true, false, 100)
                            .WithEndAssociationSubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.AssociationSubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.ShouldBeEmpty();
                    }
                }
                [TestFixture];
                class When_association_subclass_renames_base_identity_more_than_once {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "SubclassIdentifier";
                    const string = _base_name = "BaseAssociationIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartAssociation(_base_name)
                            .WithDocumentation("because documentation is required")
                            .WithDomainEntityProperty("DomainEntity1", "doc")
                            .WithDomainEntityProperty("DomainEntity2", "doc")
                            .WithStringIdentity("Property1", "because a property is required", 100)
                            .WithStringIdentity("Property2", "because a property is required", 100)
                            .WithEndAssociation();
                        metaEdTextBuilder.WithStartAssociationSubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentityRename("Property3", "Property1", "because a property is required", 100)
                            .WithStringIdentityRename("Property4", "Property2", "because a property is required", 100)
                            .WithEndAssociationSubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.AssociationSubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new AssociationSubclassIdentityRenameMustExistNoMoreThanOnce()
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
                        _errorMessageCollection[0].Message.ShouldEqual("Association 'SubclassIdentifier' based on 'BaseAssociationIdentifier' tries to rename columns Property1, Property2.  Only one identity rename is allowed for a given Association.");
                    }
                }
                [TestFixture];
                class When_association_subclass_renames_base_identity_that_does_not_exist {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "SubclassIdentifier";
                    const string = _base_name = "BaseAssociationIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartAssociation(_base_name)
                            .WithDocumentation("because documentation is required")
                            .WithDomainEntityProperty("DomainEntity1", "doc")
                            .WithDomainEntityProperty("DomainEntity2", "doc")
                            .WithStringIdentity("Property1", "because a property is required", 100)
                            .WithEndAssociation();
                        metaEdTextBuilder.WithStartAssociationSubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentityRename("Property2", "Property3", "because a property is required", 100)
                            .WithEndAssociationSubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.AssociationSubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable)
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
                        _errorMessageCollection[0].Message.ShouldEqual("Association 'SubclassIdentifier' based on 'BaseAssociationIdentifier' tries to rename Property3 which is not part of the identity.");
                    }
                }
                [TestFixture];
                class When_association_subclass_renames_base_property_that_is_not_identity {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "SubclassIdentifier";
                    const string = _base_name = "BaseAssociationIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartAssociation(_base_name)
                            .WithDocumentation("because documentation is required")
                            .WithDomainEntityProperty("DomainEntity1", "doc")
                            .WithDomainEntityProperty("DomainEntity2", "doc")
                            .WithStringProperty("Property1", "because a property is required", true, false, 100)
                            .WithEndAssociation();
                        metaEdTextBuilder.WithStartAssociationSubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentityRename("Property2", "Property1", "because a property is required", 100)
                            .WithEndAssociationSubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.AssociationSubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable)
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
                        _errorMessageCollection[0].Message.ShouldEqual("Association 'SubclassIdentifier' based on 'BaseAssociationIdentifier' tries to rename Property1 which is not part of the identity.");
                    }
                }
                [TestFixture];
                class When_association_subclass_extends_non_existent_entity {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "SubclassIdentifier";
                    const string = _base_name = "BaseAssociationIdentifier";
                    override;
                    string;
                    MetaEdText();
                    {
                        var metaEdTextBuilder = new MetaEdTextBuilder();
                        metaEdTextBuilder.WithBeginNamespace("edfi")
                            .WithStartAssociationSubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithStringIdentityRename("Property2", "Property1", "because a property is required", 100)
                            .WithEndAssociationSubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.AssociationSubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        // we let this pass validation b/c there are other rules to ensure the subclass setup is correct
                        _errorMessageCollection.ShouldBeEmpty();
                    }
                }
            })(AssociationSubclass = Validator.AssociationSubclass || (Validator.AssociationSubclass = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationSubclassPrimaryKeyRenameMustMatchPrimaryKeyPropertyInBaseClassTests.js.map