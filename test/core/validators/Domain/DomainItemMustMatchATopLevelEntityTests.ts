/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {DomainItemMustMatchTopLevelEntity}from "../../../../src/core/validators/Domain/DomainItemMustMatchTopLevelEntity"

let should = chai.should();

describe('DomainItemMustMatchTopLevelEntityTests', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.DomainItemContext>(
            new DomainItemMustMatchTopLevelEntity(asdf)));


    describe('When_domain_item_is_domain_entity', () => {
        let entityName: string = "EntityName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartDomain("DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndDomain()
                .withStartSubdomain("SubdomainName", "DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndSubdomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_item_is_domain_entity_subclass', () => {
        let entityName: string = "EntityName";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntityBase")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartDomainEntitySubclass(entityName, "DomainEntityBase")
                .withDocumentation("doc")
                .withDateProperty("BeginDate", "doc", true, false)
                .withEndDomainEntitySubclass()

                .withStartDomain("DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndDomain()
                .withStartSubdomain("SubdomainName", "DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndSubdomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_item_is_association', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAssociation()

                .withStartDomain("DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndDomain()
                .withStartSubdomain("SubdomainName", "DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndSubdomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_item_is_association_subclass', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAssociation("BaseName")
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "doc", true, false)
                .withEndAssociation()

                .withStartAssociationSubclass(entityName, "BaseName")
                .withDocumentation("doc")
                .withBooleanProperty("Property2", "doc", true, false)
                .withEndAssociationSubclass()

                .withStartDomain("DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndDomain()
                .withStartSubdomain("SubdomainName", "DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndSubdomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_item_is_common_type', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartCommonType(entityName)
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDescriptor()

                .withStartDomain("DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndDomain()
                .withStartSubdomain("SubdomainName", "DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndSubdomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_item_under_domain_is_descriptor', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDescriptor(entityName)
                .withDocumentation("doc")
                .withStartMapType()
                .withDocumentation("map type doc")
                .withEnumerationItem("this is short description 1", "doc1")
                .withEndMapType()
                .withEndDescriptor()

                .withStartDomain("DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndDomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_not_validate()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
    });


    describe('When_domain_item_under_subdomain_is_descriptor', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDescriptor(entityName)
                .withDocumentation("doc")
                .withStartMapType()
                .withDocumentation("map type doc")
                .withEnumerationItem("this is short description 1", "doc1")
                .withEndMapType()
                .withEndDescriptor()

                .withStartSubdomain("SubdomainName", "DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndSubdomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_not_validate()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
    });


    describe('When_domain_item_under_domain_has_invalid_identifier', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomain("DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndDomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Domain item");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("Domain");
            helper.errorMessageCollection[0].Message.ShouldContain("DomainName");
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });


    describe('When_domain_item_under_subdomain_has_invalid_identifier', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartSubdomain("SubdomainName", "DomainName")
                .withDocumentation("doc")
                .withDomainItem(entityName)
                .withEndSubdomain()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Domain item");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("Subdomain");
            helper.errorMessageCollection[0].Message.ShouldContain("SubdomainName");
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
});