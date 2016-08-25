/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass}from "../../../../src/core/validators/AssociationExtension/AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass"

let should = chai.should();

describe('AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.AssociationExtensionContext>(
            new AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(symbolTable)));


    describe('When_association_extension_has_valid_extendee', () => {
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
        let entityName: string = "NotAnAssociationIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAssociationExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", false, false)
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
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });


    describe('When_association_extension_extends_association_subclass', () => {
        let entityName: string = "MyIdentifier";
        const subclassName: string = "MyIdentifierSubclass";
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

                .withStartAssociationSubclass(subclassName, entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAssociationSubclass()

                .withStartAssociationExtension(subclassName)
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndAssociationExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });
});