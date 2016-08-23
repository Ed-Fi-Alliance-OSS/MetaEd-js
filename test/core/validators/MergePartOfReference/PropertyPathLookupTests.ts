module MetaEd.Tests.Validator.MergePartOfReference {
    export class PropertyPathLookupTests {

    }
    export module PropertyPathLookupTests {
        export class PropertyPathLookupTestBase extends BaseValidationTest {
            protected _result: IContextWithIdentifier;
            protected getPathToTest(): string[] { throw new Error('not implemented'); }
            protected getEntityContextToTest(): EntityContext { throw new Error('not implemented'); }
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean { throw new Error('not implemented'); }
            protected setupPostBuilder(): void {
                var propertyPathLookup = new PropertyPathLookup(_symbolTable);
                this._result = propertyPathLookup.FindReferencedProperty(GetEntityContextToTest(), GetPathToTest(), GetFilterToTest());
            }
        }
    }
    export module PropertyPathLookupTests {
        /*[TestFixture]*/
        export class When_looking_for_property_on_current_entity extends PropertyPathLookupTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getPathToTest(): string[] {
                return new Array("Prop1");
            }
            protected getEntityContextToTest(): EntityContext {
                return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity1");
            }
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
                return PropertyPathLookup.MatchAllIdentityProperties();
            }
            public should_return_expected_property(): void {
                this._result.ShouldNotBeNull();
                this._result.IdNode().GetText().ShouldEqual("Prop1");
            }
        }
    }
    export module PropertyPathLookupTests {
        /*[TestFixture]*/
        export class When_looking_for_first_domain_entity_on_association extends PropertyPathLookupTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithEndDomainEntity();
                metaEdTextBuilder.WithStartAssociation("Entity3").WithDocumentation("doc").WithDomainEntityProperty("Entity1", "doc").WithDomainEntityProperty("Entity2", "doc").WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getPathToTest(): string[] {
                return new Array("Entity1");
            }
            protected getEntityContextToTest(): EntityContext {
                return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), "Entity3");
            }
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
                return PropertyPathLookup.MatchAllIdentityProperties();
            }
            public should_return_expected_property(): void {
                this._result.ShouldNotBeNull();
                this._result.IdNode().GetText().ShouldEqual("Entity1");
            }
        }
    }
    export module PropertyPathLookupTests {
        /*[TestFixture]*/
        export class When_looking_for_second_domain_entity_on_association extends PropertyPathLookupTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop2", "doc").WithEndDomainEntity();
                metaEdTextBuilder.WithStartAssociation("Entity3").WithDocumentation("doc").WithDomainEntityProperty("Entity1", "doc").WithDomainEntityProperty("Entity2", "doc").WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getPathToTest(): string[] {
                return new Array("Entity2");
            }
            protected getEntityContextToTest(): EntityContext {
                return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), "Entity3");
            }
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
                return PropertyPathLookup.MatchAllIdentityProperties();
            }
            public should_return_expected_property(): void {
                this._result.ShouldNotBeNull();
                this._result.IdNode().GetText().ShouldEqual("Entity2");
            }
        }
    }
    export module PropertyPathLookupTests {
        /*[TestFixture]*/
        export class When_looking_for_non_identity_property_on_current_entity extends PropertyPathLookupTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithIntegerProperty("Prop2", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getPathToTest(): string[] {
                return new Array("Prop2");
            }
            protected getEntityContextToTest(): EntityContext {
                return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity1");
            }
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
                return PropertyPathLookup.MatchAllIdentityProperties();
            }
            public should_return_null(): void {
                this._result.ShouldBeNull();
            }
        }
    }
    export module PropertyPathLookupTests {
        /*[TestFixture]*/
        export class When_looking_for_property_that_does_not_exist extends PropertyPathLookupTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithIntegerProperty("Prop2", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getPathToTest(): string[] {
                return new Array("Prop3");
            }
            protected getEntityContextToTest(): EntityContext {
                return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity1");
            }
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
                return PropertyPathLookup.MatchAllIdentityProperties();
            }
            public should_return_null(): void {
                this._result.ShouldBeNull();
            }
        }
    }
    export module PropertyPathLookupTests {
        /*[TestFixture]*/
        export class When_looking_for_duplicated_property extends PropertyPathLookupTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithIntegerProperty("Prop2", "doc", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithReferenceIdentity("Entity1", "doc", "Test").WithReferenceIdentity("Entity1", "doc", "Win").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getPathToTest(): string[] {
                return new Array("Entity1");
            }
            protected getEntityContextToTest(): EntityContext {
                return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity2");
            }
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
                return PropertyPathLookup.MatchAllIdentityProperties();
            }
            public should_return_null(): void {
                this._result.ShouldBeNull();
            }
        }
    }
    export module PropertyPathLookupTests {
        /*[TestFixture]*/
        export class When_looking_for_deep_property extends PropertyPathLookupTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithIntegerProperty("Prop2", "doc", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithReferenceIdentity("Entity1", "doc", "Test").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getPathToTest(): string[] {
                return new Array("Entity1", "Prop1");
            }
            protected getEntityContextToTest(): EntityContext {
                return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity2");
            }
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
                return PropertyPathLookup.MatchAllIdentityProperties();
            }
            public should_return_expected_property(): void {
                this._result.ShouldNotBeNull();
                this._result.IdNode().GetText().ShouldEqual("Prop1");
            }
        }
    }
    export module PropertyPathLookupTests {
        /*[TestFixture]*/
        export class When_looking_for_non_pk_property extends PropertyPathLookupTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("Entity1").WithDocumentation("doc").WithIntegerIdentity("Prop1", "doc").WithIntegerProperty("Prop2", "doc", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntity("Entity2").WithDocumentation("doc").WithIntegerIdentity("Prop3", "doc").WithReferenceProperty("Entity1", "doc", false, false,/*context:*/"Test").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getPathToTest(): string[] {
                return new Array("Entity1", "Prop1");
            }
            protected getEntityContextToTest(): EntityContext {
                return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity2");
            }
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
                return PropertyPathLookup.MatchAllButFirstAsIdentityProperties();
            }
            public should_return_expected_property(): void {
                this._result.ShouldNotBeNull();
                this._result.IdNode().GetText().ShouldEqual("Prop1");
            }
        }
    }
}