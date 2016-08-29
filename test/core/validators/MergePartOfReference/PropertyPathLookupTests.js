//TODO: Part of property path unique pattern
"use strict";
//describe('When_looking_for_non_pk_property extends PropertyPathLookupTestBase {
//            let helper: ValidationTestHelper = new ValidationTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.buildIt
//
//        .withBeginNamespace("edfi")
//        .withStartDomainEntity("Entity1")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop1", "doc")
//        .withIntegerProperty("Prop2", "doc", true, false)
//        .withEndDomainEntity()
//
//        .withStartDomainEntity("Entity2")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop3", "doc")
//        .withReferenceProperty("Entity1", "doc", false, false,/*context:*/"Test")
//        .withEndDomainEntity()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getPathToTest(): string[] {
//    return new Array("Entity1", "Prop1");
//});
//            protected getEntityContextToTest(): EntityContext {
//    return _symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), "Entity2");
//});
//            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
//    return PropertyPathLookup.MatchAllButFirstAsIdentityProperties();
//});
//it('should_return_expected_property(): void {
//                this._result.ShouldNotBeNull();
//this._result.IdNode().GetText().should.equal("Prop1");
//            });
//});
//}); 
//# sourceMappingURL=PropertyPathLookupTests.js.map