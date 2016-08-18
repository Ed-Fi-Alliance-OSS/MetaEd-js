"use strict";
/// <reference path="../../../src/grammar/gen/MetaEdGrammarListener.d.ts" />
const Gen = require('../../../src/grammar/gen/MetaEdGrammarListener');
const SymbolTableEntityType_1 = require('./SymbolTableEntityType');
class SymbolTableBuilder extends Gen.MetaEdGrammarListener {
    constructor(builderListener) {
        super();
        this._builderListener = builderListener;
        this._symbolTableEntityType = new SymbolTableEntityType_1.default();
    }
    withContext(context) {
        this._metaEdFileIndex = context.MetaEdFileIndex;
        this._errorMessageCollection = context.ErrorMessageCollection;
        this._symbolTable = context.SymbolTable;
        this._builderListener.withContext(context);
    }
    addEntity(entityType, entityName, context) {
        if (!this._builderListener.beforeAddEntity(entityType, entityName, context))
            return;
        if (this._symbolTable.tryAdd(entityType, entityName.getText(), context)) {
            this._currentPropertySymbolTable = this._symbolTable.get(entityType, entityName.getText()).propertySymbolTable;
            return;
        }
        let metaEdFile = this._metaEdFileIndex.getFileAndLineNumber(entityName.symbol.line);
        let failure = {
            message: "Duplicate " + entityType + " named " + entityName,
            characterPosition: entityName.symbol.column,
            concatenatedLineNumber: entityName.symbol.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
        this._errorMessageCollection.add(failure);
    }
    addProperty(context) {
        let propertyName = context.propertyName().ID();
        let withContextContext = context.propertyComponents().withContext();
        let withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().getText();
        if (this._currentPropertySymbolTable == null) {
            return;
        }
        if (this._currentPropertySymbolTable.tryAdd(withContextPrefix + propertyName.getText(), context))
            return;
        let metaEdFile = this._metaEdFileIndex.getFileAndLineNumber(propertyName.symbol.line);
        let duplicateFailure = {
            message: `Entity ${this._currentPropertySymbolTable.parent.name} has duplicate properties named ${propertyName.getText()}`,
            characterPosition: propertyName.symbol.column,
            concatenatedLineNumber: propertyName.symbol.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
        this._errorMessageCollection.add(duplicateFailure);
    }
    enterDomainEntity(context) {
        this.addEntity(this._symbolTableEntityType.domainEntityEntityType(), context.entityName().ID(), context);
    }
    exitDomainEntity(context) {
        this._currentPropertySymbolTable = null;
    }
    enterAbstractEntity(context) {
        this.addEntity(this._symbolTableEntityType.abstractEntityEntityType(), context.abstractEntityName().ID(), context);
    }
    exitAbstractEntity(context) {
        this._currentPropertySymbolTable = null;
    }
    enterAssociation(context) {
        this.addEntity(this._symbolTableEntityType.associationEntityType(), context.associationName().ID(), context);
    }
    exitAssociation(context) {
        this._currentPropertySymbolTable = null;
    }
    enterAssociationExtension(context) {
        this.addEntity(this._symbolTableEntityType.associationExtensionEntityType(), context.extendeeName().ID(), context);
    }
    exitAssociationExtension(context) {
        this._currentPropertySymbolTable = null;
    }
    enterAssociationSubclass(context) {
        this.addEntity(this._symbolTableEntityType.associationSubclassEntityType(), context.associationName().ID(), context);
    }
    exitAssociationSubclass(context) {
        this._currentPropertySymbolTable = null;
    }
    enterChoiceType(context) {
        this.addEntity(context.CHOICETYPE().GetText(), context.choiceName().ID(), context);
    }
    exitChoiceType(context) {
        this._currentPropertySymbolTable = null;
    }
    enterCommonDecimal(context) {
        this.addEntity(context.COMMONDECIMAL().GetText(), context.commonDecimalName().ID(), context);
    }
    exitCommonDecimal(context) {
        this._currentPropertySymbolTable = null;
    }
    enterCommonInteger(context) {
        this.addEntity(context.COMMONINTEGER().GetText(), context.commonIntegerName().ID(), context);
    }
    exitCommonInteger(context) {
        this._currentPropertySymbolTable = null;
    }
    enterCommonShort(context) {
        this.addEntity(context.COMMONSHORT().GetText(), context.commonShortName().ID(), context);
    }
    exitCommonShort(context) {
        this._currentPropertySymbolTable = null;
    }
    enterCommonString(context) {
        this.addEntity(context.COMMONSTRING().GetText(), context.commonStringName().ID(), context);
    }
    exitCommonString(context) {
        this._currentPropertySymbolTable = null;
    }
    enterCommonType(context) {
        this.addEntity(this._symbolTableEntityType.commonTypeEntityType(), context.commonName().ID(), context);
    }
    exitCommonType(context) {
        this._currentPropertySymbolTable = null;
    }
    enterCommonTypeExtension(context) {
        this.addEntity(this._symbolTableEntityType.commonTypeExtensionEntityType(), context.extendeeName().ID(), context);
    }
    exitCommonTypeExtension(context) {
        this._currentPropertySymbolTable = null;
    }
    enterDescriptor(context) {
        this.addEntity(context.DESCRIPTOR_ENTITY().GetText(), context.descriptorName().ID(), context);
    }
    exitDescriptor(context) {
        this._currentPropertySymbolTable = null;
    }
    enterDomain(context) {
        this.addEntity(context.DOMAIN().GetText(), context.domainName().ID(), context);
    }
    exitDomain(context) {
        this._currentPropertySymbolTable = null;
    }
    enterDomainEntityExtension(context) {
        this.addEntity(this._symbolTableEntityType.domainEntityExtensionEntityType(), context.extendeeName().ID(), context);
    }
    exitDomainEntityExtension(context) {
        this._currentPropertySymbolTable = null;
    }
    enterDomainEntitySubclass(context) {
        this.addEntity(this._symbolTableEntityType.domainEntitySubclassEntityType(), context.entityName().ID(), context);
    }
    exitDomainEntitySubclass(context) {
        this._currentPropertySymbolTable = null;
    }
    enterEnumeration(context) {
        this.addEntity(this._symbolTableEntityType.enumerationEntityType(), context.enumerationName().ID(), context);
    }
    exitEnumeration(context) {
        this._currentPropertySymbolTable = null;
    }
    enterInlineCommonType(context) {
        this.addEntity(this._symbolTableEntityType.inlineCommonTypeEntityType(), context.inlineCommonName().ID(), context);
    }
    exitInlineCommonType(context) {
        this._currentPropertySymbolTable = null;
    }
    enterInterchange(context) {
        this.addEntity(context.INTERCHANGE().GetText(), context.interchangeName().ID(), context);
    }
    exitInterchange(context) {
        this._currentPropertySymbolTable = null;
    }
    enterInterchangeExtension(context) {
        this.addEntity(context.INTERCHANGE().GetText() + context.ADDITIONS().GetText(), context.extendeeName().ID(), context);
    }
    exitInterchangeExtension(context) {
        this._currentPropertySymbolTable = null;
    }
    enterSubdomain(context) {
        this.addEntity(context.SUBDOMAIN().GetText(), context.subdomainName().ID(), context);
    }
    exitSubdomain(context) {
        this._currentPropertySymbolTable = null;
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