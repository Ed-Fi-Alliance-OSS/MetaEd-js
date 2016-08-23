var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var MergePartOfReference;
            (function (MergePartOfReference) {
                class MergePartOfReferenceExistsOnlyInCoreNamespaceTests {
                }
                MergePartOfReference.MergePartOfReferenceExistsOnlyInCoreNamespaceTests = MergePartOfReferenceExistsOnlyInCoreNamespaceTests;
                (function (MergePartOfReferenceExistsOnlyInCoreNamespaceTests) {
                    /*[TestFixture]*/
                    class When_merge_exists_in_core extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop1").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePartOfReferenceExistsOnlyInCoreNamespace() });
                        }
                        should_validate_successfully() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    MergePartOfReferenceExistsOnlyInCoreNamespaceTests.When_merge_exists_in_core = When_merge_exists_in_core;
                })(MergePartOfReferenceExistsOnlyInCoreNamespaceTests = MergePartOfReference.MergePartOfReferenceExistsOnlyInCoreNamespaceTests || (MergePartOfReference.MergePartOfReferenceExistsOnlyInCoreNamespaceTests = {}));
                (function (MergePartOfReferenceExistsOnlyInCoreNamespaceTests) {
                    /*[TestFixture]*/
                    class When_merged_exists_in_extension extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace(When_merged_exists_in_extension._extensionNamespace, "EXTENSION").WithStartDomainEntity(When_merged_exists_in_extension._entityName1).WithDocumentation("doc").WithDecimalIdentity("Prop1", "doc", 5, 3).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity(When_merged_exists_in_extension._entityName2).WithDocumentation("doc").WithIntegerIdentity(When_merged_exists_in_extension._propertyName, "doc").WithReferenceProperty(When_merged_exists_in_extension._entityName1, "doc", false, false).WithMergePartOfReference(When_merged_exists_in_extension._entityName1 + "." + When_merged_exists_in_extension._propertyName, When_merged_exists_in_extension._propertyName).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePartOfReferenceExistsOnlyInCoreNamespace() });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(1);
                        }
                        should_have_meaningful_validation_message() {
                            _errorMessageCollection[0].Message.ShouldContain("'merge' is invalid for property");
                            _errorMessageCollection[0].Message.ShouldContain(When_merged_exists_in_extension._entityName1);
                            _errorMessageCollection[0].Message.ShouldContain(When_merged_exists_in_extension._entityName2);
                            _errorMessageCollection[0].Message.ShouldContain(When_merged_exists_in_extension._extensionNamespace);
                            _errorMessageCollection[0].Message.ShouldContain("'merge' is only valid for properties on types in a core namespace.");
                        }
                    }
                    When_merged_exists_in_extension._entityName1 = "Entity1";
                    When_merged_exists_in_extension._entityName2 = "Entity2";
                    When_merged_exists_in_extension._propertyName = "Prop1";
                    When_merged_exists_in_extension._extensionNamespace = "extension";
                    MergePartOfReferenceExistsOnlyInCoreNamespaceTests.When_merged_exists_in_extension = When_merged_exists_in_extension;
                })(MergePartOfReferenceExistsOnlyInCoreNamespaceTests = MergePartOfReference.MergePartOfReferenceExistsOnlyInCoreNamespaceTests || (MergePartOfReference.MergePartOfReferenceExistsOnlyInCoreNamespaceTests = {}));
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MergePartOfReferenceExistsOnlyInCoreNamespaceTests.js.map