var MetaEd;
(function (MetaEd) {
    var Tests;
    (function (Tests) {
        var Validator;
        (function (Validator) {
            var MergePartOfReference;
            (function (MergePartOfReference) {
                class PropertyPathLookupTests {
                }
                MergePartOfReference.PropertyPathLookupTests = PropertyPathLookupTests;
                (function (PropertyPathLookupTests) {
                    class PropertyPathLookupTestBase extends BaseValidationTest {
                        getPathToTest() { throw new Error('not implemented'); }
                        getEntityContextToTest() { throw new Error('not implemented'); }
                        getFilterToTest() { throw new Error('not implemented'); }
                        setupPostBuilder() {
                            var propertyPathLookup = new PropertyPathLookup(_symbolTable);
                            this._result = propertyPathLookup.FindReferencedProperty(GetEntityContextToTest(), GetPathToTest(), GetFilterToTest());
                        }
                    }
                    PropertyPathLookupTests.PropertyPathLookupTestBase = PropertyPathLookupTestBase;
                })(PropertyPathLookupTests = MergePartOfReference.PropertyPathLookupTests || (MergePartOfReference.PropertyPathLookupTests = {}));
                (function (PropertyPathLookupTests) {
                    /*[TestFixture]*/
                    class When_looking_for_property_on_current_entity extends PropertyPathLookupTests.PropertyPathLookupTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getPathToTest() {
                            return new Array("Prop1");
                        }
                        getEntityContextToTest() {
                            return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity1");
                        }
                        getFilterToTest() {
                            return PropertyPathLookup.MatchAllIdentityProperties();
                        }
                        should_return_expected_property() {
                            this._result.ShouldNotBeNull();
                            this._result.IdNode().GetText().ShouldEqual("Prop1");
                        }
                    }
                    PropertyPathLookupTests.When_looking_for_property_on_current_entity = When_looking_for_property_on_current_entity;
                })(PropertyPathLookupTests = MergePartOfReference.PropertyPathLookupTests || (MergePartOfReference.PropertyPathLookupTests = {}));
                (function (PropertyPathLookupTests) {
                    /*[TestFixture]*/
                    class When_looking_for_first_domain_entity_on_association extends PropertyPathLookupTests.PropertyPathLookupTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartAssociation("Entity3").WithDocumentation("doc").WithDomainEntityProperty("Entity1", "doc").WithDomainEntityProperty("Entity2", "doc").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getPathToTest() {
                            return new Array("Entity1");
                        }
                        getEntityContextToTest() {
                            return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), "Entity3");
                        }
                        getFilterToTest() {
                            return PropertyPathLookup.MatchAllIdentityProperties();
                        }
                        should_return_expected_property() {
                            this._result.ShouldNotBeNull();
                            this._result.IdNode().GetText().ShouldEqual("Entity1");
                        }
                    }
                    PropertyPathLookupTests.When_looking_for_first_domain_entity_on_association = When_looking_for_first_domain_entity_on_association;
                })(PropertyPathLookupTests = MergePartOfReference.PropertyPathLookupTests || (MergePartOfReference.PropertyPathLookupTests = {}));
                (function (PropertyPathLookupTests) {
                    /*[TestFixture]*/
                    class When_looking_for_second_domain_entity_on_association extends PropertyPathLookupTests.PropertyPathLookupTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithEndDomainEntity();
                            metaEdTextBuilder.WithStartAssociation("Entity3").WithDocumentation("doc").WithDomainEntityProperty("Entity1", "doc").WithDomainEntityProperty("Entity2", "doc").WithEndAssociation().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getPathToTest() {
                            return new Array("Entity2");
                        }
                        getEntityContextToTest() {
                            return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), "Entity3");
                        }
                        getFilterToTest() {
                            return PropertyPathLookup.MatchAllIdentityProperties();
                        }
                        should_return_expected_property() {
                            this._result.ShouldNotBeNull();
                            this._result.IdNode().GetText().ShouldEqual("Entity2");
                        }
                    }
                    PropertyPathLookupTests.When_looking_for_second_domain_entity_on_association = When_looking_for_second_domain_entity_on_association;
                })(PropertyPathLookupTests = MergePartOfReference.PropertyPathLookupTests || (MergePartOfReference.PropertyPathLookupTests = {}));
                (function (PropertyPathLookupTests) {
                    /*[TestFixture]*/
                    class When_looking_for_non_identity_property_on_current_entity extends PropertyPathLookupTests.PropertyPathLookupTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithIntegerProperty("Prop2", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getPathToTest() {
                            return new Array("Prop2");
                        }
                        getEntityContextToTest() {
                            return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity1");
                        }
                        getFilterToTest() {
                            return PropertyPathLookup.MatchAllIdentityProperties();
                        }
                        should_return_null() {
                            this._result.ShouldBeNull();
                        }
                    }
                    PropertyPathLookupTests.When_looking_for_non_identity_property_on_current_entity = When_looking_for_non_identity_property_on_current_entity;
                })(PropertyPathLookupTests = MergePartOfReference.PropertyPathLookupTests || (MergePartOfReference.PropertyPathLookupTests = {}));
                (function (PropertyPathLookupTests) {
                    /*[TestFixture]*/
                    class When_looking_for_property_that_does_not_exist extends PropertyPathLookupTests.PropertyPathLookupTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithIntegerProperty("Prop2", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getPathToTest() {
                            return new Array("Prop3");
                        }
                        getEntityContextToTest() {
                            return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity1");
                        }
                        getFilterToTest() {
                            return PropertyPathLookup.MatchAllIdentityProperties();
                        }
                        should_return_null() {
                            this._result.ShouldBeNull();
                        }
                    }
                    PropertyPathLookupTests.When_looking_for_property_that_does_not_exist = When_looking_for_property_that_does_not_exist;
                })(PropertyPathLookupTests = MergePartOfReference.PropertyPathLookupTests || (MergePartOfReference.PropertyPathLookupTests = {}));
                (function (PropertyPathLookupTests) {
                    /*[TestFixture]*/
                    class When_looking_for_duplicated_property extends PropertyPathLookupTests.PropertyPathLookupTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithIntegerProperty("Prop2", "doc", true, false).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithReferenceIdentity("Entity1", "doc", "Test").WithReferenceIdentity("Entity1", "doc", "Win").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getPathToTest() {
                            return new Array("Entity1");
                        }
                        getEntityContextToTest() {
                            return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity2");
                        }
                        getFilterToTest() {
                            return PropertyPathLookup.MatchAllIdentityProperties();
                        }
                        should_return_null() {
                            this._result.ShouldBeNull();
                        }
                    }
                    PropertyPathLookupTests.When_looking_for_duplicated_property = When_looking_for_duplicated_property;
                })(PropertyPathLookupTests = MergePartOfReference.PropertyPathLookupTests || (MergePartOfReference.PropertyPathLookupTests = {}));
                (function (PropertyPathLookupTests) {
                    /*[TestFixture]*/
                    class When_looking_for_deep_property extends PropertyPathLookupTests.PropertyPathLookupTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithIntegerProperty("Prop2", "doc", true, false).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithReferenceIdentity("Entity1", "doc", "Test").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getPathToTest() {
                            return new Array("Entity1", "Prop1");
                        }
                        getEntityContextToTest() {
                            return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity2");
                        }
                        getFilterToTest() {
                            return PropertyPathLookup.MatchAllIdentityProperties();
                        }
                        should_return_expected_property() {
                            this._result.ShouldNotBeNull();
                            this._result.IdNode().GetText().ShouldEqual("Prop1");
                        }
                    }
                    PropertyPathLookupTests.When_looking_for_deep_property = When_looking_for_deep_property;
                })(PropertyPathLookupTests = MergePartOfReference.PropertyPathLookupTests || (MergePartOfReference.PropertyPathLookupTests = {}));
                (function (PropertyPathLookupTests) {
                    /*[TestFixture]*/
                    class When_looking_for_non_pk_property extends PropertyPathLookupTests.PropertyPathLookupTestBase {
                        metaEdText() {
                            var metaEdTextBuilder = new MetaEdTextBuilder();
                            metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithIntegerProperty("Prop2", "doc", true, false).WithEndDomainEntity();
                            metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop3", "doc").WithReferenceProperty("Entity1", "doc", false, false, /*context:*/ "Test").WithEndDomainEntity().WithEndNamespace();
                            return metaEdTextBuilder;
                        }
                        getPathToTest() {
                            return new Array("Entity1", "Prop1");
                        }
                        getEntityContextToTest() {
                            return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity2");
                        }
                        getFilterToTest() {
                            return PropertyPathLookup.MatchAllButFirstAsIdentityProperties();
                        }
                        should_return_expected_property() {
                            this._result.ShouldNotBeNull();
                            this._result.IdNode().GetText().ShouldEqual("Prop1");
                        }
                    }
                    PropertyPathLookupTests.When_looking_for_non_pk_property = When_looking_for_non_pk_property;
                })(PropertyPathLookupTests = MergePartOfReference.PropertyPathLookupTests || (MergePartOfReference.PropertyPathLookupTests = {}));
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Tests.Validator || (Tests.Validator = {}));
    })(Tests = MetaEd.Tests || (MetaEd.Tests = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=PropertyPathLookupTests.js.map