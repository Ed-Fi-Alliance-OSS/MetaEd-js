"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const IdentityExistsOnlyIfIdentityIsAllowed_1 = require("../../../../src/core/validators/Identity/IdentityExistsOnlyIfIdentityIsAllowed");
let should = chai.should();
describe('IdentityExistsOnlyIfIdentityIsAllowed', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new IdentityExistsOnlyIfIdentityIsAllowed_1.IdentityExistsOnlyIfIdentityIsAllowed()));
    describe('When_domain_entity_has_valid_identity_property', () => {
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity(propertyName, "doc", 100)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });
    describe('When_abstract_entity_has_valid_identity_property', () => {
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity(propertyName, "doc", 100)
                .withEndAbstractEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });
    describe('When_association_has_valid_identity_property', () => {
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withStringIdentity(propertyName, "doc", 100)
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });
    describe('When_common_type_has_valid_identity_property', () => {
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(entityName)
                .withDocumentation("doc")
                .withStringIdentity(propertyName, "doc", 100)
                .withEndCommonType()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });
    describe('When_inline_common_type_has_valid_identity_property', () => {
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartInlineCommonType(entityName)
                .withDocumentation("doc")
                .withStringIdentity(propertyName, "doc", 100)
                .withEndInlineCommonType()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });
    describe('When_association_extension_has_invalid_identity_property', () => {
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAssociation()
                .withStartAssociationExtension(entityName)
                .withStringIdentity(propertyName, "doc", 100)
                .withEndAssociationExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Association");
            helper.errorMessageCollection[0].Message.ShouldContain("additions");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
    describe('When_association_subclass_has_invalid_identity_property', () => {
        let entityName = "MyIdentifier";
        const subClassName = "NewSubclass";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withEndAssociation()
                .withStartAssociationSubclass(subClassName, entityName)
                .withDocumentation("doc")
                .withStringIdentity(propertyName, "doc", 100)
                .withEndAssociationSubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Association");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain(subClassName);
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
    describe('When_descriptor_has_invalid_identity_property', () => {
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDescriptor(entityName)
                .withDocumentation("doc")
                .withStringIdentity(propertyName, "doc", 100)
                .withStartMapType()
                .withDocumentation("map type doc")
                .withEnumerationItem("this is short description 1", "doc1")
                .withEnumerationItem("this is short description 2", "doc2")
                .withEndMapType()
                .withEndDescriptor()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Descriptor");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
    describe('When_domain_entity_extension_has_invalid_identity_property', () => {
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndDomainEntity()
                .withStartDomainEntityExtension(entityName)
                .withStringIdentity(propertyName, "doc", 100)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Domain Entity");
            helper.errorMessageCollection[0].Message.ShouldContain("additions");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
    describe('When_domain_entity_subclass_has_invalid_identity_property', () => {
        let entityName = "MyIdentifier";
        const subClassName = "NewSubclass";
        let propertyName = "Identifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("BaseIdentifier", "doc", 100)
                .withEndDomainEntity()
                .withStartDomainEntitySubclass(subClassName, entityName)
                .withDocumentation("doc")
                .withStringIdentity(propertyName, "doc", 100)
                .withEndDomainEntitySubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Domain Entity");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain(subClassName);
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
});
//# sourceMappingURL=IdentityOnlyIfIdentityIsAllowedTests.js.map