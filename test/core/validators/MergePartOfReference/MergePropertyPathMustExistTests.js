var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var MergePartOfReference;
            (function (MergePartOfReference) {
                class MergePropertyPathMustExistTests {
                }
                MergePartOfReference.MergePropertyPathMustExistTests = MergePropertyPathMustExistTests;
                (function (MergePropertyPathMustExistTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_has_merge_property_and_path_is_wrong extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Why", "Prop2").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            this._propertyPathLookup = MockRepository.GenerateStub();
                            this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity2"), Arg.Is(new Array("Entity1", "Why")), Arg(Is.NotNull)).Return(false)));
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePropertyPathMustExist(_symbolTable, this._propertyPathLookup) });
                        }
                        should_have_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(1);
                        }
                        should_have_meaningful_validation_message() {
                            _errorMessageCollection[0].Message.ShouldEqual("Path Entity1.Why is not valid.");
                        }
                    }
                    MergePropertyPathMustExistTests.When_domain_entity_has_merge_property_and_path_is_wrong = When_domain_entity_has_merge_property_and_path_is_wrong;
                })(MergePropertyPathMustExistTests = MergePartOfReference.MergePropertyPathMustExistTests || (MergePartOfReference.MergePropertyPathMustExistTests = {}));
                (function (MergePropertyPathMustExistTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_has_merge_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop2").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            this._propertyPathLookup = MockRepository.GenerateStub();
                            this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity2"), Arg.Is(new Array("Entity1", "Prop1")), Arg(Is.NotNull)).Return(true)));
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePropertyPathMustExist(_symbolTable, this._propertyPathLookup) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    MergePropertyPathMustExistTests.When_domain_entity_has_merge_property = When_domain_entity_has_merge_property;
                })(MergePropertyPathMustExistTests = MergePartOfReference.MergePropertyPathMustExistTests || (MergePartOfReference.MergePropertyPathMustExistTests = {}));
                (function (MergePropertyPathMustExistTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_extension_has_merge_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntityExtension("Entity2").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop2").WithEndDomainEntityExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            this._propertyPathLookup = MockRepository.GenerateStub();
                            this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity2"), Arg.Is(new Array("Entity1", "Prop1")), Arg(Is.NotNull)).Return(true)));
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePropertyPathMustExist(_symbolTable, this._propertyPathLookup) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    MergePropertyPathMustExistTests.When_domain_entity_extension_has_merge_property = When_domain_entity_extension_has_merge_property;
                })(MergePropertyPathMustExistTests = MergePartOfReference.MergePropertyPathMustExistTests || (MergePartOfReference.MergePropertyPathMustExistTests = {}));
                (function (MergePropertyPathMustExistTests) {
                    /*[TestFixture]*/
                    class When_domain_entity_subclass_has_merge_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntitySubclass("Entity3", "Entity2").WithDocumentation("doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop2").WithEndDomainEntityExtension().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            this._propertyPathLookup = MockRepository.GenerateStub();
                            this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity3"), Arg.Is(new Array("Entity1", "Prop1")), Arg(Is.NotNull)).Return(true)));
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePropertyPathMustExist(_symbolTable, this._propertyPathLookup) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    MergePropertyPathMustExistTests.When_domain_entity_subclass_has_merge_property = When_domain_entity_subclass_has_merge_property;
                })(MergePropertyPathMustExistTests = MergePartOfReference.MergePropertyPathMustExistTests || (MergePartOfReference.MergePropertyPathMustExistTests = {}));
                (function (MergePropertyPathMustExistTests) {
                    /*[TestFixture]*/
                    class When_association_has_merge_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity3").WithDocumentation("doc").WithIntegerIdentity("Prop3", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartAssociation("Entity4").WithDocumentation("doc").WithDomainEntityProperty("Entity2", "doc").WithDomainEntityProperty("Entity3", "doc").WithIntegerIdentity("Prop4", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop4").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            this._propertyPathLookup = MockRepository.GenerateStub();
                            this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity4"), Arg.Is(new Array("Entity1", "Prop1")), Arg(Is.NotNull)).Return(true)));
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePropertyPathMustExist(_symbolTable, this._propertyPathLookup) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    MergePropertyPathMustExistTests.When_association_has_merge_property = When_association_has_merge_property;
                })(MergePropertyPathMustExistTests = MergePartOfReference.MergePropertyPathMustExistTests || (MergePartOfReference.MergePropertyPathMustExistTests = {}));
                (function (MergePropertyPathMustExistTests) {
                    /*[TestFixture]*/
                    class When_association_extension_has_merge_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity3").WithDocumentation("doc").WithIntegerIdentity("Prop3", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartAssociation("Entity4").WithDocumentation("doc").WithDomainEntityProperty("Entity2", "doc").WithDomainEntityProperty("Entity3", "doc").WithIntegerIdentity("Prop4", "doc").WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationExtension("Entity4").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop4").WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            this._propertyPathLookup = MockRepository.GenerateStub();
                            this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity4"), Arg.Is(new Array("Entity1", "Prop1")), Arg(Is.NotNull)).Return(true)));
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePropertyPathMustExist(_symbolTable, this._propertyPathLookup) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    MergePropertyPathMustExistTests.When_association_extension_has_merge_property = When_association_extension_has_merge_property;
                })(MergePropertyPathMustExistTests = MergePartOfReference.MergePropertyPathMustExistTests || (MergePartOfReference.MergePropertyPathMustExistTests = {}));
                (function (MergePropertyPathMustExistTests) {
                    /*[TestFixture]*/
                    class When_association_subclass_has_merge_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity3").WithDocumentation("doc").WithIntegerIdentity("Prop3", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartAssociation("Entity4").WithDocumentation("doc").WithDomainEntityProperty("Entity2", "doc").WithDomainEntityProperty("Entity3", "doc").WithIntegerIdentity("Prop4", "doc").WithEndAssociation();
                            metaEdTextBuilder.WithStartAssociationSubclass("Entity5", "Entity4").WithDocumentation("doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop4").WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            this._propertyPathLookup = MockRepository.GenerateStub();
                            this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity5"), Arg.Is(new Array("Entity1", "Prop1")), Arg(Is.NotNull)).Return(true)));
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePropertyPathMustExist(_symbolTable, this._propertyPathLookup) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    MergePropertyPathMustExistTests.When_association_subclass_has_merge_property = When_association_subclass_has_merge_property;
                })(MergePropertyPathMustExistTests = MergePartOfReference.MergePropertyPathMustExistTests || (MergePartOfReference.MergePropertyPathMustExistTests = {}));
                (function (MergePropertyPathMustExistTests) {
                    /*[TestFixture]*/
                    class When_abstract_entity_has_merge_property extends Validator.ValidationRuleTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartAbstractEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithReferenceProperty("Entity1", "doc", false, false).WithMergePartOfReference("Entity1.Prop1", "Prop2").WithEndAbstractEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getRuleProvider() {
                            this._propertyPathLookup = MockRepository.GenerateStub();
                            this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity2"), Arg.Is(new Array("Entity1", "Prop1")), Arg(Is.NotNull)).Return(true)));
                            return __init(new TestRuleProvider(), { SuppliedRule: new MergePropertyPathMustExist(_symbolTable, this._propertyPathLookup) });
                        }
                        should_have_no_validation_failures() {
                            _errorMessageCollection.Count.ShouldEqual(0);
                        }
                    }
                    MergePropertyPathMustExistTests.When_abstract_entity_has_merge_property = When_abstract_entity_has_merge_property;
                })(MergePropertyPathMustExistTests = MergePartOfReference.MergePropertyPathMustExistTests || (MergePartOfReference.MergePropertyPathMustExistTests = {}));
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MergePropertyPathMustExistTests.js.map