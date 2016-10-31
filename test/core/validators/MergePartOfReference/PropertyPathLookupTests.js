import chai from 'chai';
import MetaEdTextBuilder from '../../../grammar/MetaEdTextBuilder';
import ValidatorTestHelper from '../ValidatorTestHelper';
import ValidatorListener from '../../../../src/core/validators/ValidatorListener';
import { includeRule } from '../../../../src/core/validators/MergePartOfReference/MergePartOfReferenceExistsOnlyInCoreNamespace';
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';

chai.should();

describe('PropertyPathLookupTests', () => {
  describe('When_looking_for_property_on_current_entity', () => {
    const repository = includeRule(newRepository());
    const validatorListener = new ValidatorListener(repository);

    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withEndDomainEntity()
        .withEndNamespace().toString();
    helper.setup(metaEdText, validatorListener);
});
            protected getPathToTest(): string[] {
    return new Array("Prop1");
});
            protected getEntityContextToTest(): EntityContext {
    return _symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), "Entity1");
});
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
    return PropertyPathLookup.MatchAllIdentityProperties();
});
it('should_return_expected_property(): void {
                this._result.ShouldNotBeNull();
this._result.IdNode().getText().should.equal("Prop1");
            });
});


describe('When_looking_for_first_domain_entity_on_association', () => {
            const helper: ValidatorTestHelper = new ValidatorTestHelper();
before(() => {
    const metaEdText = MetaEdTextBuilder.build()

        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withEndDomainEntity()

        .withStartDomainEntity("Entity2")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop2", "doc")
        .withEndDomainEntity()

        .withStartAssociation("Entity3")
        .withDocumentation("doc")
        .withDomainEntityProperty("Entity1", "doc")
        .withDomainEntityProperty("Entity2", "doc")
        .withEndAssociation()
        .withEndNamespace().toString();
    helper.setup(metaEdText, validatorListener);
});
            protected getPathToTest(): string[] {
    return new Array("Entity1");
});
            protected getEntityContextToTest(): EntityContext {
    return _symbolTable.Get(this.symbolTableEntityType.associationEntityType(), "Entity3");
});
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
    return PropertyPathLookup.MatchAllIdentityProperties();
});
it('should_return_expected_property(): void {
                this._result.ShouldNotBeNull();
this._result.IdNode().getText().should.equal("Entity1");
            });
});


describe('When_looking_for_second_domain_entity_on_association', () => {
            const helper: ValidatorTestHelper = new ValidatorTestHelper();
before(() => {
    const metaEdText = MetaEdTextBuilder.build()

        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withEndDomainEntity()

        .withStartDomainEntity("Entity2")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop2", "doc")
        .withEndDomainEntity()

        .withStartAssociation("Entity3")
        .withDocumentation("doc")
        .withDomainEntityProperty("Entity1", "doc")
        .withDomainEntityProperty("Entity2", "doc")
        .withEndAssociation()
        .withEndNamespace().toString();
    helper.setup(metaEdText, validatorListener);
});
            protected getPathToTest(): string[] {
    return new Array("Entity2");
});
            protected getEntityContextToTest(): EntityContext {
    return _symbolTable.Get(this.symbolTableEntityType.associationEntityType(), "Entity3");
});
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
    return PropertyPathLookup.MatchAllIdentityProperties();
});
it('should_return_expected_property(): void {
                this._result.ShouldNotBeNull();
this._result.IdNode().getText().should.equal("Entity2");
            });
});


describe('When_looking_for_non_identity_property_on_current_entity', () => {
            const helper: ValidatorTestHelper = new ValidatorTestHelper();
before(() => {
    const metaEdText = MetaEdTextBuilder.build()

        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withIntegerProperty("Prop2", "doc", true, false)
        .withEndDomainEntity()
        .withEndNamespace().toString();
    helper.setup(metaEdText, validatorListener);
});
            protected getPathToTest(): string[] {
    return new Array("Prop2");
});
            protected getEntityContextToTest(): EntityContext {
    return _symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), "Entity1");
});
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
    return PropertyPathLookup.MatchAllIdentityProperties();
});
it('should_return_null(): void {
                this._result.ShouldBeNull();
            });
});


describe('When_looking_for_property_that_does_not_exist', () => {
            const helper: ValidatorTestHelper = new ValidatorTestHelper();
before(() => {
    const metaEdText = MetaEdTextBuilder.build()

        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withIntegerProperty("Prop2", "doc", true, false)
        .withEndDomainEntity()
        .withEndNamespace().toString();
    helper.setup(metaEdText, validatorListener);
});
            protected getPathToTest(): string[] {
    return new Array("Prop3");
});
            protected getEntityContextToTest(): EntityContext {
    return _symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), "Entity1");
});
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
    return PropertyPathLookup.MatchAllIdentityProperties();
});
it('should_return_null(): void {
                this._result.ShouldBeNull();
            });
});


describe('When_looking_for_duplicated_property', () => {
            const helper: ValidatorTestHelper = new ValidatorTestHelper();
before(() => {
    const metaEdText = MetaEdTextBuilder.build()

        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withIntegerProperty("Prop2", "doc", true, false)
        .withEndDomainEntity()

        .withStartDomainEntity("Entity2")
        .withDocumentation("doc")
        .withReferenceIdentity("Entity1", "doc", "Test")
        .withReferenceIdentity("Entity1", "doc", "Win")
        .withEndDomainEntity()
        .withEndNamespace().toString();
    helper.setup(metaEdText, validatorListener);
});
            protected getPathToTest(): string[] {
    return new Array("Entity1");
});
            protected getEntityContextToTest(): EntityContext {
    return _symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), "Entity2");
});
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
    return PropertyPathLookup.MatchAllIdentityProperties();
});
it('should_return_null(): void {
                this._result.ShouldBeNull();
            });
});


describe('When_looking_for_deep_property', () => {
            const helper: ValidatorTestHelper = new ValidatorTestHelper();
before(() => {
    const metaEdText = MetaEdTextBuilder.build()

        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withIntegerProperty("Prop2", "doc", true, false)
        .withEndDomainEntity()

        .withStartDomainEntity("Entity2")
        .withDocumentation("doc")
        .withReferenceIdentity("Entity1", "doc", "Test")
        .withEndDomainEntity()
        .withEndNamespace().toString();
    helper.setup(metaEdText, validatorListener);
});
            protected getPathToTest(): string[] {
    return new Array("Entity1", "Prop1");
});
            protected getEntityContextToTest(): EntityContext {
    return _symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), "Entity2");
});
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
    return PropertyPathLookup.MatchAllIdentityProperties();
});
it('should_return_expected_property(): void {
                this._result.ShouldNotBeNull();
this._result.IdNode().getText().should.equal("Prop1");
            });
});


import SymbolTableEntityType from '../SymbolTableEntityType'

describe('When_looking_for_non_pk_property', () => {
            const helper: ValidatorTestHelper = new ValidatorTestHelper();
before(() => {
    const metaEdText = MetaEdTextBuilder.build()

        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withIntegerProperty("Prop2", "doc", true, false)
        .withEndDomainEntity()

        .withStartDomainEntity("Entity2")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop3", "doc")
        .withReferenceProperty("Entity1", "doc", false, false,/*context:*/"Test")
        .withEndDomainEntity()
        .withEndNamespace().toString();
    helper.setup(metaEdText, validatorListener);
});
            protected getPathToTest(): string[] {
    return new Array("Entity1", "Prop1");
});
            protected getEntityContextToTest(): EntityContext {
    return _symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), "Entity2");
});
            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
    return PropertyPathLookup.MatchAllButFirstAsIdentityProperties();
});
it('should_return_expected_property(): void {
                this._result.ShouldNotBeNull();
this._result.IdNode().getText().should.equal("Prop1");
            });
});
});