var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var MergePartOfReference;
            (function (MergePartOfReference) {
                class MergePropertyAndTargetPropertyMustMatchTests {
                }
                MergePartOfReference.MergePropertyAndTargetPropertyMustMatchTests = MergePropertyAndTargetPropertyMustMatchTests;
                (function (MergePropertyAndTargetPropertyMustMatchTests) {
                    /*[TestFixture]*/
                    class When_merged_property_names_and_types_match extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop1").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            var propertyPathLookup = new PropertyPathLookup(_symbolTable);
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(_symbolTable, propertyPathLookup) });
                        }
                        should_validate_successfully() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    MergePropertyAndTargetPropertyMustMatchTests.When_merged_property_names_and_types_match = When_merged_property_names_and_types_match;
                })(MergePropertyAndTargetPropertyMustMatchTests = MergePartOfReference.MergePropertyAndTargetPropertyMustMatchTests || (MergePartOfReference.MergePropertyAndTargetPropertyMustMatchTests = {}));
                (function (MergePropertyAndTargetPropertyMustMatchTests) {
                    /*[TestFixture]*/
                    class When_merged_property_types_are_different extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithDecimalIdentity("Prop1", "doc", 5, 3).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop1").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            var propertyPathLookup = new PropertyPathLookup(_symbolTable);
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(_symbolTable, propertyPathLookup) });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(1);
                        }
                        should_have_meaningful_validation_message() {
                            _errorMessageCollection[0].Message.ShouldEqual("The merge paths 'Entity1.Prop1' and 'Prop1' do not correspond to the same entity type.");
                        }
                    }
                    MergePropertyAndTargetPropertyMustMatchTests.When_merged_property_types_are_different = When_merged_property_types_are_different;
                })(MergePropertyAndTargetPropertyMustMatchTests = MergePartOfReference.MergePropertyAndTargetPropertyMustMatchTests || (MergePartOfReference.MergePropertyAndTargetPropertyMustMatchTests = {}));
                (function (MergePropertyAndTargetPropertyMustMatchTests) {
                    /*[TestFixture]*/
                    class When_merged_property_names_are_different extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop2").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            var propertyPathLookup = new PropertyPathLookup(_symbolTable);
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(_symbolTable, propertyPathLookup) });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(1);
                        }
                    }
                    MergePropertyAndTargetPropertyMustMatchTests.When_merged_property_names_are_different = When_merged_property_names_are_different;
                })(MergePropertyAndTargetPropertyMustMatchTests = MergePartOfReference.MergePropertyAndTargetPropertyMustMatchTests || (MergePartOfReference.MergePropertyAndTargetPropertyMustMatchTests = {}));
                (function (MergePropertyAndTargetPropertyMustMatchTests) {
                    /*[TestFixture]*/
                    class When_merging_properties_of_a_base_and_sub_domain_entity extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntitySubclass("Entity2", "Entity1").WithDocumentation("doc").WithIntegerProperty("Prop2", "doc", false, false).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity3").WithDocumentation("doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1", "Entity2").WithReferenceProperty("Entity2", "doc", false, false).WithEndDomainEntityExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            var propertyPathLookup = new PropertyPathLookup(_symbolTable);
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(_symbolTable, propertyPathLookup) });
                        }
                        should_validate_successfully() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    MergePropertyAndTargetPropertyMustMatchTests.When_merging_properties_of_a_base_and_sub_domain_entity = When_merging_properties_of_a_base_and_sub_domain_entity;
                })(MergePropertyAndTargetPropertyMustMatchTests = MergePartOfReference.MergePropertyAndTargetPropertyMustMatchTests || (MergePartOfReference.MergePropertyAndTargetPropertyMustMatchTests = {}));
                (function (MergePropertyAndTargetPropertyMustMatchTests) {
                    /*[TestFixture]*/
                    class When_merging_domain_entity_property_of_an_association extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithReferenceIdentity("Entity1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity3").WithDocumentation("doc").WithIntegerIdentity("Prop3", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartAssociation("Entity4").WithDocumentation("doc").WithDomainEntityProperty("Entity2", "doc").WithDomainEntityProperty("Entity3", "doc").WithIntegerIdentity("Prop4", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1", "Entity2.Entity1").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            var propertyPathLookup = new PropertyPathLookup(_symbolTable);
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(_symbolTable, propertyPathLookup) });
                        }
                        should_validate_successfully() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    MergePropertyAndTargetPropertyMustMatchTests.When_merging_domain_entity_property_of_an_association = When_merging_domain_entity_property_of_an_association;
                })(MergePropertyAndTargetPropertyMustMatchTests = MergePartOfReference.MergePropertyAndTargetPropertyMustMatchTests || (MergePartOfReference.MergePropertyAndTargetPropertyMustMatchTests = {}));
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MergePropertyAndTargetPropertyMustMatchTests.js.map