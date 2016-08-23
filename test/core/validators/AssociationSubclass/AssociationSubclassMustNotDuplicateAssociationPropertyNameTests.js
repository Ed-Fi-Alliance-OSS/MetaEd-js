using;
System.Linq;
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
                class AssociationSubclassMustNotDuplicateAssociationPropertyNameTests {
                    constructor() {
                        this.class = When_association_subclass_has_different_property_name;
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
                            .WithBooleanProperty("Property1", "because a property is required", true, false)
                            .WithEndAssociation();
                        metaEdTextBuilder.WithStartAssociationSubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithBooleanProperty("Property2", "because a property is required", true, false)
                            .WithEndAssociationSubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.AssociationSubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new AssociationSubclassMustNotDuplicateAssociationPropertyName(_symbolTable)
                            };
                    }
                    [Test];
                    void Should_have_no_validation_failures();
                    {
                        _errorMessageCollection.Count.ShouldEqual(0);
                    }
                }
                [TestFixture];
                class When_association_subclass_has_duplicate_property_name {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "MyIdentifier";
                    const string = _base_name = "BaseIdentifier";
                    const string = _duplicate_property_name = "Property1";
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
                            .WithBooleanProperty(_duplicate_property_name, "because a property is required", true, false)
                            .WithEndAssociation();
                        metaEdTextBuilder.WithStartAssociationSubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithBooleanProperty(_duplicate_property_name, "because a property is required", true, false)
                            .WithEndAssociationSubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.AssociationSubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new AssociationSubclassMustNotDuplicateAssociationPropertyName(_symbolTable)
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
                        _errorMessageCollection[0].Message.ShouldContain("Association");
                        _errorMessageCollection[0].Message.ShouldContain(_entity_name);
                        _errorMessageCollection[0].Message.ShouldContain("based on");
                        _errorMessageCollection[0].Message.ShouldContain(_base_name);
                        _errorMessageCollection[0].Message.ShouldContain(_duplicate_property_name);
                        _errorMessageCollection[0].Message.ShouldContain("already in property list");
                    }
                }
                [TestFixture];
                class When_association_subclass_has_multiple_duplicate_property_names {
                }
                Validator.ValidationRuleTestBase;
                {
                    const string = _entity_name = "MyIdentifier";
                    const string = _base_name = "BaseIdentifier";
                    const string = _not_duplicate_property_name = "NotADuplicate";
                    const string = _duplicate_property_name1 = "Property1";
                    const string = _duplicate_property_name2 = "Property2";
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
                            .WithBooleanProperty(_duplicate_property_name1, "because a property is required", true, false)
                            .WithBooleanProperty(_duplicate_property_name2, "because a property is required", true, false)
                            .WithEndAssociation();
                        metaEdTextBuilder.WithStartAssociationSubclass(_entity_name, _base_name)
                            .WithDocumentation("because documentation is required")
                            .WithBooleanProperty(_duplicate_property_name1, "because a property is required", true, false)
                            .WithBooleanProperty(_duplicate_property_name2, "because a property is required", true, false)
                            .WithBooleanProperty(_not_duplicate_property_name, "because a property is required", true, false)
                            .WithEndAssociationSubclass()
                            .WithEndNamespace();
                        return metaEdTextBuilder;
                    }
                    override;
                    MetaEd.Core.Validator.IRuleProvider;
                    GetRuleProvider();
                    {
                        return new TestRuleProvider < MetaEdGrammar.AssociationSubclassContext >
                            {
                                SuppliedRule: SuppliedRule = new AssociationSubclassMustNotDuplicateAssociationPropertyName(_symbolTable)
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
                        _errorMessageCollection[0].Message.ShouldContain("Association");
                        _errorMessageCollection[0].Message.ShouldContain(_entity_name);
                        _errorMessageCollection[0].Message.ShouldContain("based on");
                        _errorMessageCollection[0].Message.ShouldContain(_base_name);
                        _errorMessageCollection[0].Message.ShouldContain(_duplicate_property_name1);
                        _errorMessageCollection[0].Message.ShouldContain(_duplicate_property_name2);
                        _errorMessageCollection[0].Message.ShouldContain("already in property list");
                        _errorMessageCollection[0].Message.ShouldNotContain(_not_duplicate_property_name);
                    }
                }
            })(AssociationSubclass = Validator.AssociationSubclass || (Validator.AssociationSubclass = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationSubclassMustNotDuplicateAssociationPropertyNameTests.js.map