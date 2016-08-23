module MetaEd.Tests.Validator.Association {
    export class AssociationMustNotDuplicateDomainEntityNamesTests {

    }
    export module AssociationMustNotDuplicateDomainEntityNamesTests {
        /*[TestFixture]*/
        export class When_validating_association_with_different_domain_entity_names extends ValidationRuleTestBase {
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc1").WithDomainEntityProperty("DomainEntity2", "doc2").WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationContext>(), { SuppliedRule: new AssociationMustNotDuplicateDomainEntityNames() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module AssociationMustNotDuplicateDomainEntityNamesTests {
        /*[TestFixture]*/
        export class When_validating_association_with_same_domain_entity_names extends ValidationRuleTestBase {
            private static _associationName: string = "Association1";
            private static _domainEntityName: string = "DomainEntity1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_validating_association_with_same_domain_entity_names._associationName).WithDocumentation("doc").WithDomainEntityProperty(When_validating_association_with_same_domain_entity_names._domainEntityName, "doc1").WithDomainEntityProperty(When_validating_association_with_same_domain_entity_names._domainEntityName, "doc2").WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationContext>(), { SuppliedRule: new AssociationMustNotDuplicateDomainEntityNames() });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Association");
                _errorMessageCollection[0].Message.ShouldContain(When_validating_association_with_same_domain_entity_names._associationName);
                _errorMessageCollection[0].Message.ShouldContain(When_validating_association_with_same_domain_entity_names._domainEntityName);
                _errorMessageCollection[0].Message.ShouldContain("duplicate declarations");
            }
        }
    }
    export module AssociationMustNotDuplicateDomainEntityNamesTests {
        /*[TestFixture]*/
        export class When_validating_association_with_same_domain_entity_names_and_same_contexts extends ValidationRuleTestBase {
            private static _associationName: string = "Association1";
            private static _domainEntityName: string = "DomainEntity1";
            private static _contextName: string = "Context1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_validating_association_with_same_domain_entity_names_and_same_contexts._associationName).WithDocumentation("doc").WithDomainEntityProperty(When_validating_association_with_same_domain_entity_names_and_same_contexts._domainEntityName, "doc1", When_validating_association_with_same_domain_entity_names_and_same_contexts._contextName).WithDomainEntityProperty(When_validating_association_with_same_domain_entity_names_and_same_contexts._domainEntityName, "doc2", When_validating_association_with_same_domain_entity_names_and_same_contexts._contextName).WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationContext>(), { SuppliedRule: new AssociationMustNotDuplicateDomainEntityNames() });
            }
            public should_have_validation_failures(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Association");
                _errorMessageCollection[0].Message.ShouldContain(When_validating_association_with_same_domain_entity_names_and_same_contexts._associationName);
                _errorMessageCollection[0].Message.ShouldContain(When_validating_association_with_same_domain_entity_names_and_same_contexts._domainEntityName);
                _errorMessageCollection[0].Message.ShouldContain("duplicate declarations");
            }
        }
    }
    export module AssociationMustNotDuplicateDomainEntityNamesTests {
        /*[TestFixture]*/
        export class When_validating_association_with_same_domain_entity_names_and_different_contexts extends ValidationRuleTestBase {
            private static _domainEntityName: string = "DomainEntity1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty(When_validating_association_with_same_domain_entity_names_and_different_contexts._domainEntityName, "doc1", "Context1").WithDomainEntityProperty(When_validating_association_with_same_domain_entity_names_and_different_contexts._domainEntityName, "doc2", "Context2").WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationContext>(), { SuppliedRule: new AssociationMustNotDuplicateDomainEntityNames() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module AssociationMustNotDuplicateDomainEntityNamesTests {
        /*[TestFixture]*/
        export class When_validating_association_with_different_domain_entity_names_and_same_contexts extends ValidationRuleTestBase {
            private static _contextName: string = "Context1";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation("Association1").WithDocumentation("doc").WithDomainEntityProperty("DomainEntity1", "doc1", When_validating_association_with_different_domain_entity_names_and_same_contexts._contextName).WithDomainEntityProperty("DomainEntity2", "doc2", When_validating_association_with_different_domain_entity_names_and_same_contexts._contextName).WithEndAssociation().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.AssociationContext>(), { SuppliedRule: new AssociationMustNotDuplicateDomainEntityNames() });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
}