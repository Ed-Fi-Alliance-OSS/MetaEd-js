module MetaEd.Tests.Validator.EnumerationProperty {
    export class EnumerationPropertyMustMatchAnEnumerationTests {

    }
    export module EnumerationPropertyMustMatchAnEnumerationTests {
        /*[TestFixture]*/
        export class When_enumeration_property_has_valid_identifier extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartEnumeration(When_enumeration_property_has_valid_identifier._entityName).WithDocumentation("doc").WithEnumerationItem("required", "doc").WithEndEnumeration();
                metaEdTextBuilder.WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEnumerationProperty(When_enumeration_property_has_valid_identifier._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.EnumerationPropertyContext>(), { SuppliedRule: new EnumerationPropertyMustMatchAnEnumeration(_symbolTable) });
            }
            public should_have_no_validation_failures(): void {
                _errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module EnumerationPropertyMustMatchAnEnumerationTests {
        /*[TestFixture]*/
        export class When_enumeration_property_has_invalid_identifier extends ValidationRuleTestBase {
            protected static _entityName: string = "MyIdentifier";
            protected metaEdText(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity("DomainEntity").WithDocumentation("doc").WithStringIdentity("RequirePrimaryKey", "doc", 100).WithEnumerationProperty(When_enumeration_property_has_invalid_identifier._entityName, "doc", true, false).WithEndDomainEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            protected getRuleProvider(): MetaEd.Core.Validator.IRuleProvider {
                return __init(new TestRuleProvider<MetaEdGrammar.EnumerationPropertyContext>(), { SuppliedRule: new EnumerationPropertyMustMatchAnEnumeration(_symbolTable) });
            }
            public should_have_validation_failure(): void {
                _errorMessageCollection.Any().ShouldBeTrue();
            }
            public should_have_validation_failure_message(): void {
                _errorMessageCollection[0].Message.ShouldContain("Enumeration");
                _errorMessageCollection[0].Message.ShouldContain(When_enumeration_property_has_invalid_identifier._entityName);
                _errorMessageCollection[0].Message.ShouldContain("does not match");
            }
        }
    }
}