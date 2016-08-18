"use strict";
/// <reference path="../../../typings/index.d.ts" />
const chai = require('chai');
const MetaEdTextBuilder_1 = require("../../grammar/MetaEdTextBuilder");
const ValidationTestHelper_1 = require("./ValidationTestHelper");
let should = chai.should();
const entityName = "EntityName";
const propertyName = "PropertyName";
const doc = "doc";
const prop = "prop";
const edfi = "edfi";
describe('SymbolTableBuilderEntityTests', () => {
    describe('When_loading_domain_entity', () => {
        const symbolTableKey = "Domain Entity";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
        it('should_report_position_of_error', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure = helper.errorMessageCollection.get(0);
            failure.concatenatedLineNumber.should.equal(9);
            failure.characterPosition.should.equal(16);
        });
    });
    describe('When_loading_abstract_entity', () => {
        const symbolTableKey = "Abstract Entity";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
    describe('When_loading_association', () => {
        const symbolTableKey = "Association";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
    describe('When_loading_association_extension', () => {
        const symbolTableKey = "Associationadditions";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        // public class When_loading_duplicate_domain_entity : BaseSymbolTableBuilderTest
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        // {
        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
    describe('When_loading_association_subclass', () => {
        const symbolTableKey = "Associationbased on";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
    describe('When_loading_choice_type', () => {
        const symbolTableKey = "Choice Common Type";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
    describe('When_loading_common_decimal', () => {
        const symbolTableKey = "Common Decimal";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
    describe('When_loading_common_integer', () => {
        const symbolTableKey = "Common Integer";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
    describe('When_loading_common_short', () => {
        const symbolTableKey = "Common Short";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
    describe('When_loading_common_string', () => {
        const symbolTableKey = "Common String";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
    describe('When_loading_common_type', () => {
        const symbolTableKey = "Common Type";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace(edfi)
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
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
    describe('When_loading_descriptor', () => {
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace(edfi)
        // protected override string MetaEdText()
                .withDocumentation(doc)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDescriptor()
                .withEndNamespace()
                .toString();
            helper.setup(metaEdText);
        //     {
        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });
    describe('When_loading_duplicate_descriptor', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
        //         var metaEdTextBuilder = new MetaEdTextBuilder();
        //         metaEdTextBuilder.WithBeginNamespace("edfi")
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
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
    describe('When_loading_domain_entity_extension', () => {
        const symbolTableKey = "Domain Entityadditions";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace(edfi)
        //             .WithStartDomainEntity(_entity_name)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDomainEntityExtension()
                .toString();
            helper.setup(metaEdText);
        });
        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });
    describe('When_loading_duplicate_domain_entity_extension', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
        //             .WithDocumentation("because documentation is required")
        });
    });
    describe('When_loading_domain_entity_subclass', () => {
        const symbolTableKey = "Domain Entitybased on";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace(edfi)
                .withStartDomainEntitySubclass(entityName, "Original")
                .withDocumentation(doc)
        //             .WithBooleanProperty(_property_name, "because a property is required", true, false)
        //             .WithEndDomainEntity();
                .withEndNamespace()
                .toString();
            helper.setup(metaEdText);
        //
        it('should_load_into_symbol_table', () => {
            helper.symbolTable.get(symbolTableKey, entityName).should.not.be.null;
        });
    });
    describe('When_loading_duplicate_domain_entity_subclass', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace(edfi)
        //         metaEdTextBuilder.WithStartDomainEntity(_entity_name)
                .withBooleanProperty(propertyName, prop, true, false)
                .withEndDomainEntitySubclass()
        //             .WithDocumentation("because documentation is required")
                .withDocumentation(doc)
        //             .WithBooleanProperty(_property_name, "because a property is required", true, false)
        //             .WithEndDomainEntity()
                .withEndNamespace()
                .toString();
            helper.setup(metaEdText);
        //
        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
    describe('When_loading_enumeration', () => {
        const symbolTableKey = "Enumeration";
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        //
        //     [Test]
        // public void Should_report_the_duplicate()
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        //     {
        it('should_report_the_duplicate', () => {
            helper.errorMessageCollection.count.should.equal(1);
        //         var failure = _errorMessageCollection[0];
        //         failure.Message.ShouldContain(_entity_name);
        //         failure.Message.ShouldContain("Duplicate");
        });
        //
        //     [Test]
        const symbolTableKey = "Inline Common Type";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        // public void Should_report_position_of_error()
            helper.errorMessageCollection.count.should.equal(1);
        //         var failure = _errorMessageCollection[0];
        //         failure.ConcatenatedLineNumber.ShouldEqual(9);
        //         failure.CharacterPosition.ShouldEqual(16);
        });
        // }
    describe('When_loading_interchange', () => {
        const symbolTableKey = "Interchange";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder_1.default.buildIt
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
            let failure = helper.errorMessageCollection.get(0);
            failure.message.should.contain(entityName);
            failure.message.should.contain("Duplicate");
        });
    });
});
//# sourceMappingURL=SymbolTableBuilderEntityTests.js.map