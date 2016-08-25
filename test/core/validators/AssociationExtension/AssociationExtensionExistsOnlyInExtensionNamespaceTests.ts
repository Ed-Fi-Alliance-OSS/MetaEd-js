/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {AssociationExtensionExistsOnlyInExtensionNamespace}from "../../../../src/core/validators/AssociationExtension/AssociationExtensionExistsOnlyInExtensionNamespace"

let should = chai.should();

describe('AssociationExtensionExistsOnlyInExtensionNamespaceTests', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.AssociationExtensionContext>(
            new AssociationExtensionExistsOnlyInExtensionNamespace()));


    describe('When_association_extension_exists_in_extension', () => {
        let entityName: string = "MyIdentifier";
        const _property_name: string = "Property1";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAssociation()
                .withEndNamespace()
                .withBeginNamespace("extension", "projectExtension")
                .withStartAssociationExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndAssociationExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });


    describe('When_association_extension_has_invalid_extendee', () => {
        const coreNamespace: string = "edfi";
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAssociation()

                .withStartAssociationExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndAssociationExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Association additions");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("is not valid in core namespace");
            helper.errorMessageCollection[0].Message.ShouldContain(coreNamespace);
        });
    });
});