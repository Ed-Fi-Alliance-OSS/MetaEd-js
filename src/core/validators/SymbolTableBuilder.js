"use strict";
/// <reference path="../../../src/grammar/gen/MetaEdGrammarListener.d.ts" />
const MetaEdGrammarListener_1 = require('../../../src/grammar/gen/MetaEdGrammarListener');
const SymbolTableEntityType_1 = require('./SymbolTableEntityType');
class SymbolTableBuilder extends MetaEdGrammarListener_1.MetaEdGrammarListener {
    constructor(builderListener) {
        super();
        this.builderListener = builderListener;
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
    }
    withContext(context) {
        this.metaEdFileIndex = context.metaEdFileIndex;
        this.errorMessageCollection = context.errorMessageCollection;
        this.symbolTable = context.symbolTable;
        this.builderListener.withContext(context);
    }
    addEntity(entityType, entityName, context) {
        if (!this.builderListener.beforeAddEntity(entityType, entityName, context))
            return;
        if (this.symbolTable.tryAdd(entityType, entityName.getText(), context)) {
            this.currentPropertySymbolTable = this.symbolTable.get(entityType, entityName.getText()).propertySymbolTable;
            return;
        }
        let metaEdFile = this.metaEdFileIndex.getFileAndLineNumber(entityName.symbol.line);
        let failure = {
            message: "Duplicate " + entityType + " named " + entityName,
            characterPosition: entityName.symbol.column,
            concatenatedLineNumber: entityName.symbol.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
        this.errorMessageCollection.push(failure);
    }
    addProperty(context) {
        let propertyName = context.propertyName().ID();
        let withContextContext = context.propertyComponents().withContext();
        let withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().getText();
        if (this.currentPropertySymbolTable == null) {
            return;
        }
        if (this.currentPropertySymbolTable.tryAdd(withContextPrefix + propertyName.getText(), context))
            return;
        let metaEdFile = this.metaEdFileIndex.getFileAndLineNumber(propertyName.symbol.line);
        let duplicateFailure = {
            message: `Entity ${this.currentPropertySymbolTable.parent.name} has duplicate properties named ${propertyName.getText()}`,
            characterPosition: propertyName.symbol.column,
            concatenatedLineNumber: propertyName.symbol.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
        this.errorMessageCollection.push(duplicateFailure);
    }
    enterDomainEntity(context) {
        this.addEntity(this.symbolTableEntityType.domainEntityEntityType(), context.entityName().ID(), context);
    }
    exitDomainEntity(context) {
        this.currentPropertySymbolTable = null;
    }
    enterAbstractEntity(context) {
        this.addEntity(this.symbolTableEntityType.abstractEntityEntityType(), context.abstractEntityName().ID(), context);
    }
    exitAbstractEntity(context) {
        this.currentPropertySymbolTable = null;
    }
    enterAssociation(context) {
        this.addEntity(this.symbolTableEntityType.associationEntityType(), context.associationName().ID(), context);
    }
    exitAssociation(context) {
        this.currentPropertySymbolTable = null;
    }
    enterAssociationExtension(context) {
        this.addEntity(this.symbolTableEntityType.associationExtensionEntityType(), context.extendeeName().ID(), context);
    }
    exitAssociationExtension(context) {
        this.currentPropertySymbolTable = null;
    }
    enterAssociationSubclass(context) {
        this.addEntity(this.symbolTableEntityType.associationSubclassEntityType(), context.associationName().ID(), context);
    }
    exitAssociationSubclass(context) {
        this.currentPropertySymbolTable = null;
    }
    enterChoiceType(context) {
        this.addEntity(context.CHOICE_TYPE().getText(), context.choiceName().ID(), context);
    }
    exitChoiceType(context) {
        this.currentPropertySymbolTable = null;
    }
    enterCommonDecimal(context) {
        this.addEntity(context.COMMON_DECIMAL().getText(), context.commonDecimalName().ID(), context);
    }
    exitCommonDecimal(context) {
        this.currentPropertySymbolTable = null;
    }
    enterCommonInteger(context) {
        this.addEntity(context.COMMON_INTEGER().getText(), context.commonIntegerName().ID(), context);
    }
    exitCommonInteger(context) {
        this.currentPropertySymbolTable = null;
    }
    enterCommonShort(context) {
        this.addEntity(context.COMMON_SHORT().getText(), context.commonShortName().ID(), context);
    }
    exitCommonShort(context) {
        this.currentPropertySymbolTable = null;
    }
    enterCommonString(context) {
        this.addEntity(context.COMMON_STRING().getText(), context.commonStringName().ID(), context);
    }
    exitCommonString(context) {
        this.currentPropertySymbolTable = null;
    }
    enterCommonType(context) {
        this.addEntity(this.symbolTableEntityType.commonTypeEntityType(), context.commonName().ID(), context);
    }
    exitCommonType(context) {
        this.currentPropertySymbolTable = null;
    }
    enterCommonTypeExtension(context) {
        this.addEntity(this.symbolTableEntityType.commonTypeExtensionEntityType(), context.extendeeName().ID(), context);
    }
    exitCommonTypeExtension(context) {
        this.currentPropertySymbolTable = null;
    }
    enterDescriptor(context) {
        this.addEntity(context.DESCRIPTOR_ENTITY().getText(), context.descriptorName().ID(), context);
    }
    exitDescriptor(context) {
        this.currentPropertySymbolTable = null;
    }
    enterDomain(context) {
        this.addEntity(context.DOMAIN().getText(), context.domainName().ID(), context);
    }
    exitDomain(context) {
        this.currentPropertySymbolTable = null;
    }
    enterDomainEntityExtension(context) {
        this.addEntity(this.symbolTableEntityType.domainEntityExtensionEntityType(), context.extendeeName().ID(), context);
    }
    exitDomainEntityExtension(context) {
        this.currentPropertySymbolTable = null;
    }
    enterDomainEntitySubclass(context) {
        this.addEntity(this.symbolTableEntityType.domainEntitySubclassEntityType(), context.entityName().ID(), context);
    }
    exitDomainEntitySubclass(context) {
        this.currentPropertySymbolTable = null;
    }
    enterEnumeration(context) {
        this.addEntity(this.symbolTableEntityType.enumerationEntityType(), context.enumerationName().ID(), context);
    }
    exitEnumeration(context) {
        this.currentPropertySymbolTable = null;
    }
    enterInlineCommonType(context) {
        this.addEntity(this.symbolTableEntityType.inlineCommonTypeEntityType(), context.inlineCommonName().ID(), context);
    }
    exitInlineCommonType(context) {
        this.currentPropertySymbolTable = null;
    }
    enterInterchange(context) {
        this.addEntity(context.INTERCHANGE().getText(), context.interchangeName().ID(), context);
    }
    exitInterchange(context) {
        this.currentPropertySymbolTable = null;
    }
    enterInterchangeExtension(context) {
        this.addEntity(context.INTERCHANGE().getText() + context.ADDITIONS().getText(), context.extendeeName().ID(), context);
    }
    exitInterchangeExtension(context) {
        this.currentPropertySymbolTable = null;
    }
    enterSubdomain(context) {
        this.addEntity(context.SUBDOMAIN().getText(), context.subdomainName().ID(), context);
    }
    exitSubdomain(context) {
        this.currentPropertySymbolTable = null;
    }
    enterBooleanProperty(context) {
        this.addProperty(context);
    }
    enterDateProperty(context) {
        this.addProperty(context);
    }
    enterCurrencyProperty(context) {
        this.addProperty(context);
    }
    enterDecimalProperty(context) {
        this.addProperty(context);
    }
    enterDescriptorProperty(context) {
        this.addProperty(context);
    }
    enterDurationProperty(context) {
        this.addProperty(context);
    }
    enterEnumerationProperty(context) {
        this.addProperty(context);
    }
    enterIncludeProperty(context) {
        this.addProperty(context);
    }
    enterIntegerProperty(context) {
        this.addProperty(context);
    }
    enterReferenceProperty(context) {
        this.addProperty(context);
    }
    enterSharedDecimalProperty(context) {
        this.addProperty(context);
    }
    enterSharedIntegerProperty(context) {
        this.addProperty(context);
    }
    enterSharedShortProperty(context) {
        this.addProperty(context);
    }
    enterSharedStringProperty(context) {
        this.addProperty(context);
    }
    enterShortProperty(context) {
        this.addProperty(context);
    }
    enterStringProperty(context) {
        this.addProperty(context);
    }
    enterTimeProperty(context) {
        this.addProperty(context);
    }
    enterYearProperty(context) {
        this.addProperty(context);
    }
}
exports.SymbolTableBuilder = SymbolTableBuilder;
//# sourceMappingURL=SymbolTableBuilder.js.map