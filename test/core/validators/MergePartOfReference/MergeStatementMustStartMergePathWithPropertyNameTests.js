var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var MergePartOfReference;
            (function (MergePartOfReference) {
                class MergeStatementMustStartMergePathWithPropertyNameTests {
                }
                MergePartOfReference.MergeStatementMustStartMergePathWithPropertyNameTests = MergeStatementMustStartMergePathWithPropertyNameTests;
                (function (MergeStatementMustStartMergePathWithPropertyNameTests) {
                    /*[TestFixture]*/
                    class When_reference_property_has_merge_statement_with_correct_path extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity2").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_merge_statement_with_correct_path._entityName, "doc", true, false).WithMergePartOfReference(When_reference_property_has_merge_statement_with_correct_path._entityName + ".Property", "AnotherProperty").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergeStatementMustStartMergePathWithPropertyName() });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    When_reference_property_has_merge_statement_with_correct_path._entityName = "MyIdentifier";
                    MergeStatementMustStartMergePathWithPropertyNameTests.When_reference_property_has_merge_statement_with_correct_path = When_reference_property_has_merge_statement_with_correct_path;
                })(MergeStatementMustStartMergePathWithPropertyNameTests = MergePartOfReference.MergeStatementMustStartMergePathWithPropertyNameTests || (MergePartOfReference.MergeStatementMustStartMergePathWithPropertyNameTests = {}));
                (function (MergeStatementMustStartMergePathWithPropertyNameTests) {
                    /*[TestFixture]*/
                    class When_reference_property_has_merge_statement_with_incorrect_path extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity2").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithReferenceProperty(When_reference_property_has_merge_statement_with_incorrect_path._entityName, "doc", true, false).WithMergePartOfReference("DifferentEntity.Property", "AnotherProperty").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergeStatementMustStartMergePathWithPropertyName() });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(1);
                            _errorMessageCollection[0].Message.ShouldEqual("Merge statement must start first property path with the referenced entity name of the current property.");
                        }
                    }
                    When_reference_property_has_merge_statement_with_incorrect_path._entityName = "MyIdentifier";
                    MergeStatementMustStartMergePathWithPropertyNameTests.When_reference_property_has_merge_statement_with_incorrect_path = When_reference_property_has_merge_statement_with_incorrect_path;
                })(MergeStatementMustStartMergePathWithPropertyNameTests = MergePartOfReference.MergeStatementMustStartMergePathWithPropertyNameTests || (MergePartOfReference.MergeStatementMustStartMergePathWithPropertyNameTests = {}));
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MergeStatementMustStartMergePathWithPropertyNameTests.js.map