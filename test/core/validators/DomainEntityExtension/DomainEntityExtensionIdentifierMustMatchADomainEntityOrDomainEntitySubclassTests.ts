import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import {DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass}from "../../../../src/core/validators/DomainEntityExtension/DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass"

chai.should();

describe('DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.DomainEntityExtensionContext>(
            new DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass(helper.symbolTable)));


    describe('When_domain_entity_extension_has_valid_extendee', () => {
        let entityName: string = "MyIdentifier";
        const _property_name: string = "Property1";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndDomainEntity()

                .withStartDomainEntityExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_entity_extension_has_invalid_extendee', () => {
        let entityName: string = "NotADomainEntityIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomainEntityExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", false, false)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Domain Entity additions");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("does not match");
        });
    });


    describe('When_domain_entity_extension_extends_domain_entity_subclass', () => {
        let entityName: string = "MyIdentifier";
        const subclassName: string = "MyIdentifierSubclass";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndDomainEntity()

                .withStartDomainEntitySubclass(subclassName, entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndDomainEntitySubclass()
                
.withStartDomainEntityExtension(subclassName)
                .withBooleanProperty("Property3", "because a property is required", true, false)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_entity_extension_extends_abstract_domain_entity', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAbstractEntity()
                
.withStartDomainEntityExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Domain Entity additions");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("does not match");
        });
    });
});