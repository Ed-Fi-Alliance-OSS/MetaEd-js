var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var DomainEntitySubclass;
            (function (DomainEntitySubclass) {
                class DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests {
                }
                DomainEntitySubclass.DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests = DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests;
                (function (DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_subclass_has_different_property_name extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_has_different_property_name._base_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property1", "because a property is required", true, false).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntitySubclass(When_domain_entity_subclass_has_different_property_name._entity_name, When_domain_entity_subclass_has_different_property_name._base_name).WithDocumentation("because documentation is required").WithBooleanProperty("Property2", "because a property is required", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName(_symbolTable) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_domain_entity_subclass_has_different_property_name._entity_name = "SubclassIdentifier";
                    When_domain_entity_subclass_has_different_property_name._base_name = "BaseDomainEntityIdentifier";
                    DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests.When_domain_entity_subclass_has_different_property_name = When_domain_entity_subclass_has_different_property_name;
                })(DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests = DomainEntitySubclass.DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests || (DomainEntitySubclass.DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests = {}));
                (function (DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_subclass_has_duplicate_property_name extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_has_duplicate_property_name._base_name).WithDocumentation("because documentation is required").WithBooleanProperty(When_domain_entity_subclass_has_duplicate_property_name._duplicate_property_name, "because a property is required", true, false).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntitySubclass(When_domain_entity_subclass_has_duplicate_property_name._entity_name, When_domain_entity_subclass_has_duplicate_property_name._base_name).WithDocumentation("because documentation is required").WithBooleanProperty(When_domain_entity_subclass_has_duplicate_property_name._duplicate_property_name, "because a property is required", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("DomainEntity");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_duplicate_property_name._entity_name);
                            _errorMessageCollection[0].Message.ShouldContain("based on");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_duplicate_property_name._base_name);
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_duplicate_property_name._duplicate_property_name);
                            _errorMessageCollection[0].Message.ShouldContain("already in property list");
                        }
                    }
                    When_domain_entity_subclass_has_duplicate_property_name._entity_name = "MyIdentifier";
                    When_domain_entity_subclass_has_duplicate_property_name._base_name = "BaseIdentifier";
                    When_domain_entity_subclass_has_duplicate_property_name._duplicate_property_name = "Property1";
                    DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests.When_domain_entity_subclass_has_duplicate_property_name = When_domain_entity_subclass_has_duplicate_property_name;
                })(DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests = DomainEntitySubclass.DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests || (DomainEntitySubclass.DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests = {}));
                (function (DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_subclass_has_multiple_duplicate_property_names extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_subclass_has_multiple_duplicate_property_names._base_name).WithDocumentation("because documentation is required").WithBooleanProperty(When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name1, "because a property is required", true, false).WithBooleanProperty(When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name2, "because a property is required", true, false).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntitySubclass(When_domain_entity_subclass_has_multiple_duplicate_property_names._entity_name, When_domain_entity_subclass_has_multiple_duplicate_property_names._base_name).WithDocumentation("because documentation is required").WithBooleanProperty(When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name1, "because a property is required", true, false).WithBooleanProperty(When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name2, "because a property is required", true, false).WithBooleanProperty(When_domain_entity_subclass_has_multiple_duplicate_property_names._not_duplicate_property_name, "because a property is required", true, false).WithEndDomainEntitySubclass().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName(_symbolTable) });
                        }
                        should_have_validation_failure() {
                            _errorMessageCollection.Any().ShouldBeTrue();
                        }
                        should_have_validation_failure_message() {
                            _errorMessageCollection[0].Message.ShouldContain("DomainEntity");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_multiple_duplicate_property_names._entity_name);
                            _errorMessageCollection[0].Message.ShouldContain("based on");
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_multiple_duplicate_property_names._base_name);
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name1);
                            _errorMessageCollection[0].Message.ShouldContain(When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name2);
                            _errorMessageCollection[0].Message.ShouldContain("already in property list");
                            _errorMessageCollection[0].Message.ShouldNotContain(When_domain_entity_subclass_has_multiple_duplicate_property_names._not_duplicate_property_name);
                        }
                    }
                    When_domain_entity_subclass_has_multiple_duplicate_property_names._entity_name = "MyIdentifier";
                    When_domain_entity_subclass_has_multiple_duplicate_property_names._base_name = "BaseIdentifier";
                    When_domain_entity_subclass_has_multiple_duplicate_property_names._not_duplicate_property_name = "NotADuplicate";
                    When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name1 = "Property1";
                    When_domain_entity_subclass_has_multiple_duplicate_property_names._duplicate_property_name2 = "Property2";
                    DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests.When_domain_entity_subclass_has_multiple_duplicate_property_names = When_domain_entity_subclass_has_multiple_duplicate_property_names;
                })(DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests = DomainEntitySubclass.DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests || (DomainEntitySubclass.DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests = {}));
            })(DomainEntitySubclass = Validator.DomainEntitySubclass || (Validator.DomainEntitySubclass = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests.js.map