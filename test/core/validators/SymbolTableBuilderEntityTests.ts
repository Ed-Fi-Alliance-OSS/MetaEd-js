/// <reference path="../../../typings/index.d.ts" />
import chai = require('chai');
import MetaEdTextBuilder from "../../grammar/MetaEdTextBuilder";
import {ValidationTestHelper} from "./ValidationTestHelper";
import ValidationMessage from "../../../src/common/ValidationMessage"

let should = chai.should();

const entityName: string = "EntityName";
const propertyName: string = "PropertyName";
const doc: string = "doc";
const prop: string = "prop";
const edfi: string = "edfi";

describe('SymbolTableBuilderEntityTests', () => {

    describe('When_loading_domain_entity', () => {
        const symbolTableKey: string = "Domain Entity";

        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartDomainEntity(entityName)
                .withMetaEdId("100")
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .toString();


            helper.setup(metaEdText);
        });

        it('Should_load_into_symbol_table', () => {
            const entityContext = helper.symbolTable.get(symbolTableKey, entityName);
            entityContext.should.not.be.empty;
            entityContext.name.should.equal(entityName);
            entityContext.context.should.not.be.empty;
        });
    });

    describe('When_loading_duplicate_domain_entity', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartDomainEntity(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDomainEntity()

                .withStartDomainEntity(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .toString();


            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });

        it('should_report_position_of_error', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.concatenatedLineNumber.should.equal(9);
            failure.characterPosition.should.equal(16);
        });
    });

    describe('When_loading_abstract_entity', () => {
        const symbolTableKey: string = "Abstract Entity";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartAbstractEntity(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndAbstractEntity()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_abstract_entity', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartAbstractEntity(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndAbstractEntity()

                .withStartAbstractEntity(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndAbstractEntity()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_association', () => {
        const symbolTableKey: string = "Association";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartAssociation(entityName)
                .withDocumentation(doc)
                .withDomainEntityProperty("DomainEntity1", "documentation for domain entity 1")
                .withDomainEntityProperty("DomainEntity2", "documentation for domain entity 2")
                .withEndAssociation()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_association', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartAssociation(entityName)
                .withDocumentation(doc)
                .withDomainEntityProperty("DomainEntity1", "documentation for domain entity 1")
                .withDomainEntityProperty("DomainEntity2", "documentation for domain entity 2")
                .withEndAssociation()

                .withStartAssociation(entityName)
                .withDocumentation(doc)
                .withDomainEntityProperty("DomainEntity3", "documentation for domain entity 3")
                .withDomainEntityProperty("DomainEntity4", "documentation for domain entity 4")
                .withEndAssociation()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_association_extension', () => {
        const symbolTableKey: string = "Associationadditions";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartAssociationExtension(entityName)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndAssociationExtension()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_association_extension', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartAssociationExtension(entityName)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndAssociationExtension()

                .withStartAssociationExtension(entityName)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndAssociationExtension()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_association_subclass', () => {
        const symbolTableKey: string = "Associationbased on";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartAssociationSubclass(entityName, "Original")
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndAssociationSubclass()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_association_subclass', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartAssociationSubclass(entityName, "Original")
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndAssociationSubclass()

                .withStartAssociationSubclass(entityName, "Original")
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndAssociationSubclass()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_choice_type', () => {
        const symbolTableKey: string = "Choice Common Type";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartChoiceType(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndChoiceType()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_choice_type', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartChoiceType(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndChoiceType()

                .withStartChoiceType(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndChoiceType()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_common_decimal', () => {
        const symbolTableKey: string = "Common Decimal";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartCommonDecimal(entityName)
                .withDocumentation(doc)
                .withTotalDigits("10")
                .withDecimalPlaces("5")
                .withEndCommonDecimal()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_common_decimal', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartCommonDecimal(entityName)
                .withDocumentation(doc)
                .withTotalDigits("10")
                .withDecimalPlaces("5")
                .withEndCommonDecimal()

                .withStartCommonDecimal(entityName)
                .withDocumentation(doc)
                .withTotalDigits("10")
                .withDecimalPlaces("5")
                .withEndCommonDecimal()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_common_integer', () => {
        const symbolTableKey: string = "Common Integer";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartCommonInteger(entityName)
                .withDocumentation(doc)
                .withMinValue(0)
                .withMaxValue(100)
                .withEndCommonInteger()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_common_integer', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartCommonInteger(entityName)
                .withDocumentation(doc)
                .withMinValue(0)
                .withMaxValue(100)
                .withEndCommonInteger()

                .withStartCommonInteger(entityName)
                .withDocumentation(doc)
                .withMinValue(0)
                .withMaxValue(100)
                .withEndCommonInteger()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_common_short', () => {
        const symbolTableKey: string = "Common Short";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartCommonShort(entityName)
                .withDocumentation(doc)
                .withMinValue(0)
                .withMaxValue(100)
                .withEndCommonShort()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_common_short', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartCommonShort(entityName)
                .withDocumentation(doc)
                .withMinValue(0)
                .withMaxValue(100)
                .withEndCommonShort()

                .withStartCommonShort(entityName)
                .withDocumentation(doc)
                .withMinValue(0)
                .withMaxValue(100)
                .withEndCommonShort()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_common_string', () => {
        const symbolTableKey: string = "Common String";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartCommonString(entityName)
                .withDocumentation(doc)
                .withMinLength(0)
                .withMaxLength(100)
                .withEndCommonString()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_common_string', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartCommonString(entityName)
                .withDocumentation(doc)
                .withMinLength(0)
                .withMaxLength(100)
                .withEndCommonString()

                .withStartCommonString(entityName)
                .withDocumentation(doc)
                .withMinLength(0)
                .withMaxLength(100)
                .withEndCommonString()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_common_type', () => {
        const symbolTableKey: string = "Common Type";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartCommonType(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndCommonType()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_common_type', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartCommonType(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndCommonType()

                .withStartCommonType(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndCommonType()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_descriptor', () => {
        const symbolTableKey: string = "Descriptor";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartDescriptor(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDescriptor()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_descriptor', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartDescriptor(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDescriptor()

                .withStartDescriptor(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDescriptor()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_domain_entity_extension', () => {
        const symbolTableKey: string = "Domain Entityadditions";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartDomainEntityExtension(entityName)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDomainEntityExtension()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_domain_entity_extension', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartDomainEntityExtension(entityName)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDomainEntityExtension()

                .withStartDomainEntityExtension(entityName)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDomainEntityExtension()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_domain_entity_subclass', () => {
        const symbolTableKey: string = "Domain Entitybased on";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartDomainEntitySubclass(entityName, "Original")
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDomainEntitySubclass()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_domain_entity_subclass', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartDomainEntitySubclass(entityName, "Original")
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDomainEntitySubclass()

                .withStartDomainEntitySubclass(entityName, "Original")
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDomainEntitySubclass()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_enumeration', () => {
        const symbolTableKey: string = "Enumeration";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartEnumeration(entityName)
                .withDocumentation(doc)
                .withEnumerationItem(propertyName, prop)
                .withEndEnumeration()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_enumeration', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartEnumeration(entityName)
                .withDocumentation(doc)
                .withEnumerationItem(propertyName, "some optional documentation")
                .withEndEnumeration()

                .withStartEnumeration(entityName)
                .withDocumentation(doc)
                .withEnumerationItem(propertyName, "some optional documentation")
                .withEndEnumeration()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_inline_common_type', () => {
        const symbolTableKey: string = "Inline Common Type";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartInlineCommonType(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndInlineCommonType()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_inline_common_type', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartInlineCommonType(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndInlineCommonType()

                .withStartInlineCommonType(entityName)
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndInlineCommonType()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });

    describe('When_loading_interchange', () => {
        const symbolTableKey: string = "Interchange";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartInterchange(entityName)
                .withDocumentation(doc)
                .withElement(propertyName)
                .withEndInterchange()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });

    describe('When_loading_duplicate_interchange', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {

            const metaEdText: string = MetaEdTextBuilder.buildIt
                .withBeginNamespace(edfi)
                .withStartInterchange(entityName)
                .withDocumentation(doc)
                .withElement(propertyName)
                .withEndInterchange()

                .withStartInterchange(entityName)
                .withDocumentation(doc)
                .withElement(propertyName)
                .withEndInterchange()
                .withEndNamespace()
                .toString();

            helper.setup(metaEdText);
        });

        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure: ValidationMessage = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
});

