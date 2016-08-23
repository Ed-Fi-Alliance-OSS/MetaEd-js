module MetaEd.Tests.Validator.IncludeProperty {
    export class IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests {

    }
    export module IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests {
        /*[TestFixture]*/
        export class When_include_property_does_not_have_extension_override extends ValidationRuleTestBase {
            protected static _commonTypeName: string = "CommonType";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_does_not_have_extension_override._commonTypeName).WithDocumentation("doc").WithStringProperty("StringProperty", "doc", true, false, 100).WithEndCommonType();
                metaEdTextBuilder.WithStartDomainEntity(When_include_property_does_not_have_extension_override._entityName).WithDocumentation("doc").WithIdentityProperty("include", When_include_property_does_not_have_extension_override._propertyName, "doc").WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable) });
            }
            public should_not_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeFalse();
            }
        }
    }
    export module IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests {
        /*[TestFixture]*/
        export class When_include_property_has_extension_override_on_non_domain_entity_or_association_extensions extends ValidationRuleTestBase {
            protected static _commonTypeName: string = "CommonType";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_extension_override_on_non_domain_entity_or_association_extensions._commonTypeName).WithDocumentation("doc").WithStringProperty("StringProperty", "doc", true, false, 100).WithEndCommonType();
                metaEdTextBuilder.WithStartDomainEntity(When_include_property_has_extension_override_on_non_domain_entity_or_association_extensions._entityName).WithDocumentation("doc").WithIncludeExtensionOverrideProperty(When_include_property_has_extension_override_on_non_domain_entity_or_association_extensions._commonTypeName, "doc", true, true).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("include extension");
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_non_domain_entity_or_association_extensions._propertyName);
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_non_domain_entity_or_association_extensions._entityName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
    export module IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests {
        /*[TestFixture]*/
        export class When_include_property_has_extension_override_on_domain_entity_extension_without_include_on_extendee extends ValidationRuleTestBase {
            protected static _commonTypeName: string = "CommonType";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_extension_override_on_domain_entity_extension_without_include_on_extendee._commonTypeName).WithDocumentation("doc").WithBooleanProperty("DummyProperty1", "doc", true, false).WithEndCommonType();
                metaEdTextBuilder.WithStartDomainEntity(When_include_property_has_extension_override_on_domain_entity_extension_without_include_on_extendee._entityName).WithDocumentation("doc").WithBooleanProperty("DummyProperty2", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION").WithStartDomainEntityExtension(When_include_property_has_extension_override_on_domain_entity_extension_without_include_on_extendee._entityName).WithIncludeExtensionOverrideProperty(When_include_property_has_extension_override_on_domain_entity_extension_without_include_on_extendee._commonTypeName, "doc", true, true).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("include extension");
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_domain_entity_extension_without_include_on_extendee._propertyName);
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_domain_entity_extension_without_include_on_extendee._entityName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
    export module IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests {
        /*[TestFixture]*/
        export class When_include_property_has_extension_override_on_association_extension_without_include_on_extendee extends ValidationRuleTestBase {
            protected static _commonTypeName: string = "CommonType";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_extension_override_on_association_extension_without_include_on_extendee._commonTypeName).WithDocumentation("doc").WithBooleanProperty("DummyProperty1", "doc", true, false).WithEndCommonType();
                metaEdTextBuilder.WithStartAssociation(When_include_property_has_extension_override_on_association_extension_without_include_on_extendee._entityName).WithDocumentation("doc").WithDomainEntityProperty("DummyEntity1", "doc").WithDomainEntityProperty("DummyEntity2", "doc").WithBooleanProperty("DummyProperty2", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION").WithStartAssociationExtension(When_include_property_has_extension_override_on_association_extension_without_include_on_extendee._entityName).WithIncludeExtensionOverrideProperty(When_include_property_has_extension_override_on_association_extension_without_include_on_extendee._commonTypeName, "doc", true, true).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("include extension");
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_association_extension_without_include_on_extendee._propertyName);
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_association_extension_without_include_on_extendee._entityName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
    export module IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests {
        /*[TestFixture]*/
        export class When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_matching_cardinality extends ValidationRuleTestBase {
            protected static _commonTypeName: string = "CommonType";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_matching_cardinality._commonTypeName).WithDocumentation("doc").WithBooleanProperty("DummyProperty1", "doc", true, false).WithEndCommonType();
                metaEdTextBuilder.WithStartDomainEntity(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_matching_cardinality._entityName).WithDocumentation("doc").WithBooleanProperty("DummyProperty2", "doc", true, false).WithIncludeProperty(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_matching_cardinality._commonTypeName, "doc", true, true).WithEndDomainEntity().WithEndNamespace();
                metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION").WithStartDomainEntityExtension(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_matching_cardinality._entityName).WithIncludeExtensionOverrideProperty(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_matching_cardinality._commonTypeName, "doc", true, true).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable) });
            }
            public should_not_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeFalse();
            }
        }
    }
    export module IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests {
        /*[TestFixture]*/
        export class When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_with_matching_cardinality extends ValidationRuleTestBase {
            protected static _commonTypeName: string = "CommonType";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_with_matching_cardinality._commonTypeName).WithDocumentation("doc").WithBooleanProperty("DummyProperty1", "doc", true, false).WithEndCommonType();
                metaEdTextBuilder.WithStartAssociation(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_with_matching_cardinality._entityName).WithDocumentation("doc").WithDomainEntityProperty("DummyEntity1", "doc").WithDomainEntityProperty("DummyEntity2", "doc").WithIncludeProperty(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_with_matching_cardinality._commonTypeName, "doc", true, true).WithBooleanProperty("DummyProperty2", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION").WithStartAssociationExtension(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_with_matching_cardinality._entityName).WithIncludeExtensionOverrideProperty(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_with_matching_cardinality._commonTypeName, "doc", true, true).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable) });
            }
            public should_not_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeFalse();
            }
        }
    }
    export module IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests {
        /*[TestFixture]*/
        export class When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_collection_cardinality extends ValidationRuleTestBase {
            protected static _commonTypeName: string = "CommonType";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_collection_cardinality._commonTypeName).WithDocumentation("doc").WithBooleanProperty("DummyProperty1", "doc", true, false).WithEndCommonType();
                metaEdTextBuilder.WithStartDomainEntity(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_collection_cardinality._entityName).WithDocumentation("doc").WithBooleanProperty("DummyProperty2", "doc", true, false).WithIncludeProperty(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_collection_cardinality._commonTypeName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION").WithStartDomainEntityExtension(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_collection_cardinality._entityName).WithIncludeExtensionOverrideProperty(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_collection_cardinality._commonTypeName, "doc", true, true).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("include extension");
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_collection_cardinality._propertyName);
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_collection_cardinality._entityName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
    export module IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests {
        /*[TestFixture]*/
        export class When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_nullability extends ValidationRuleTestBase {
            protected static _commonTypeName: string = "CommonType";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_nullability._commonTypeName).WithDocumentation("doc").WithBooleanProperty("DummyProperty1", "doc", true, false).WithEndCommonType();
                metaEdTextBuilder.WithStartDomainEntity(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_nullability._entityName).WithDocumentation("doc").WithBooleanProperty("DummyProperty2", "doc", true, false).WithIncludeProperty(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_nullability._commonTypeName, "doc", false, true).WithEndDomainEntity().WithEndNamespace();
                metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION").WithStartDomainEntityExtension(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_nullability._entityName).WithIncludeExtensionOverrideProperty(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_nullability._commonTypeName, "doc", true, true).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("include extension");
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_nullability._propertyName);
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_nullability._entityName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
    export module IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests {
        /*[TestFixture]*/
        export class When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_collection_cardinality extends ValidationRuleTestBase {
            protected static _commonTypeName: string = "CommonType";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_collection_cardinality._commonTypeName).WithDocumentation("doc").WithBooleanProperty("DummyProperty1", "doc", true, false).WithEndCommonType();
                metaEdTextBuilder.WithStartAssociation(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_collection_cardinality._entityName).WithDocumentation("doc").WithDomainEntityProperty("DummyEntity1", "doc").WithDomainEntityProperty("DummyEntity2", "doc").WithIncludeProperty(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_collection_cardinality._commonTypeName, "doc", true, false).WithBooleanProperty("DummyProperty2", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION").WithStartAssociationExtension(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_collection_cardinality._entityName).WithIncludeExtensionOverrideProperty(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_collection_cardinality._commonTypeName, "doc", true, true).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("include extension");
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_collection_cardinality._propertyName);
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_collection_cardinality._entityName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
    export module IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests {
        /*[TestFixture]*/
        export class When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_nullability extends ValidationRuleTestBase {
            protected static _commonTypeName: string = "CommonType";
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Identifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartCommonType(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_nullability._commonTypeName).WithDocumentation("doc").WithBooleanProperty("DummyProperty1", "doc", true, false).WithEndCommonType();
                metaEdTextBuilder.WithStartAssociation(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_nullability._entityName).WithDocumentation("doc").WithDomainEntityProperty("DummyEntity1", "doc").WithDomainEntityProperty("DummyEntity2", "doc").WithIncludeProperty(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_nullability._commonTypeName, "doc", false, true).WithBooleanProperty("DummyProperty2", "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                metaEdTextBuilder.WithBeginNamespace("extension", "EXTENSION").WithStartAssociationExtension(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_nullability._entityName).WithIncludeExtensionOverrideProperty(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_nullability._commonTypeName, "doc", true, true).WithEndDomainEntityExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(), { SuppliedRule: new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("include extension");
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_nullability._propertyName);
                _errorMessageCollection[0].Message.ShouldContain(When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_nullability._entityName);
                _errorMessageCollection[0].Message.ShouldContain("invalid");
            }
        }
    }
}