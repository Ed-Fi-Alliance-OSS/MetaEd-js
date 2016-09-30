import {MetaEdGrammarListener} from '../../../src/grammar/gen/MetaEdGrammarListener';

import {IMetaEdContext} from '../tasks/MetaEdContext'
import {SymbolTable} from './SymbolTable'
import {IMetaEdFileIndex} from '../../grammar/IMetaEdFileIndex'
import ValidationMessage from '../../common/ValidationMessage'
import PropertySymbolTable from './PropertySymbolTable'
import SymbolTableEntityType from './SymbolTableEntityType';


export class SymbolTableBuilder extends MetaEdGrammarListener implements ISymbolTableBuilder {
    symbolTable: any;
    metaEdFileIndex: any;
    errorMessageCollection: any;
    builderListener: any;
    currentPropertySymbolTable: any;

    constructor(builderListener) {
        super();
        this.builderListener = builderListener;
    }

    withContext(metaEdContext) {
        this.metaEdFileIndex = metaEdContext.metaEdFileIndex;
        this.errorMessageCollection = metaEdContext.errorMessageCollection;
        this.symbolTable = metaEdContext.symbolTable;
        this.builderListener.withContext(metaEdContext);
    }

    _addEntity(entityType, entityNameIdNode, context) {
        if (!this.builderListener.beforeAddEntity(entityType, entityNameIdNode, context))
            return;
        if (this.symbolTable.tryAdd(entityType, entityNameIdNode.getText(), context)) {
            this.currentPropertySymbolTable = this.symbolTable.get(entityType, entityNameIdNode.getText()).propertySymbolTable;
            return;
        }
        let metaEdFile = this.metaEdFileIndex.getFileAndLineNumber(entityNameIdNode.symbol.line);
        let failure = {
            message: "Duplicate " + entityType + " named " + entityNameIdNode,
            characterPosition: entityNameIdNode.symbol.column,
            concatenatedLineNumber: entityNameIdNode.symbol.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
        this.errorMessageCollection.push(failure);
    }

    _addProperty(context) {
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
        this._addEntity(SymbolTableEntityType.domainEntityEntityType(), context.entityName().ID(), context);
    }

    exitDomainEntity(context) {
        this.currentPropertySymbolTable = null;
    }

    enterAbstractEntity(context) {
        this._addEntity(SymbolTableEntityType.abstractEntityEntityType(), context.abstractEntityName().ID(), context);
    }

    exitAbstractEntity(context) {
        this.currentPropertySymbolTable = null;
    }

    enterAssociation(context) {
        this._addEntity(SymbolTableEntityType.associationEntityType(), context.associationName().ID(), context);
    }

    exitAssociation(context) {
        this.currentPropertySymbolTable = null;
    }

    enterAssociationExtension(context) {
        this._addEntity(SymbolTableEntityType.associationExtensionEntityType(), context.extendeeName().ID(), context);
    }

    exitAssociationExtension(context) {
        this.currentPropertySymbolTable = null;
    }

    enterAssociationSubclass(context) {
        this._addEntity(SymbolTableEntityType.associationSubclassEntityType(), context.associationName().ID(), context);
    }

    exitAssociationSubclass(context) {
        this.currentPropertySymbolTable = null;
    }

    enterChoiceType(context) {
        this._addEntity(context.CHOICE_TYPE().getText(), context.choiceName().ID(), context);
    }

    exitChoiceType(context) {
        this.currentPropertySymbolTable = null;
    }

    enterCommonDecimal(context) {
        this._addEntity(context.COMMON_DECIMAL().getText(), context.commonDecimalName().ID(), context);
    }

    exitCommonDecimal(context) {
        this.currentPropertySymbolTable = null;
    }

    enterCommonInteger(context) {
        this._addEntity(context.COMMON_INTEGER().getText(), context.commonIntegerName().ID(), context);
    }

    exitCommonInteger(context) {
        this.currentPropertySymbolTable = null;
    }

    enterCommonShort(context) {
        this._addEntity(context.COMMON_SHORT().getText(), context.commonShortName().ID(), context);
    }

    exitCommonShort(context) {
        this.currentPropertySymbolTable = null;
    }

    enterCommonString(context) {
        this._addEntity(context.COMMON_STRING().getText(), context.commonStringName().ID(), context);
    }

    exitCommonString(context) {
        this.currentPropertySymbolTable = null;
    }

    enterCommonType(context) {
        this._addEntity(SymbolTableEntityType.commonTypeEntityType(), context.commonName().ID(), context);
    }

    exitCommonType(context) {
        this.currentPropertySymbolTable = null;
    }

    enterCommonTypeExtension(context) {
        this._addEntity(SymbolTableEntityType.commonTypeExtensionEntityType(), context.extendeeName().ID(), context);
    }

    exitCommonTypeExtension(context) {
        this.currentPropertySymbolTable = null;
    }

    enterDescriptor(context) {
        this._addEntity(context.DESCRIPTOR_ENTITY().getText(), context.descriptorName().ID(), context);
    }

    exitDescriptor(context) {
        this.currentPropertySymbolTable = null;
    }

    enterDomain(context) {
        this._addEntity(context.DOMAIN().getText(), context.domainName().ID(), context);
    }

    exitDomain(context) {
        this.currentPropertySymbolTable = null;
    }

    enterDomainEntityExtension(context) {
        this._addEntity(SymbolTableEntityType.domainEntityExtensionEntityType(), context.extendeeName().ID(), context);
    }

    exitDomainEntityExtension(context) {
        this.currentPropertySymbolTable = null;
    }

    enterDomainEntitySubclass(context) {
        this._addEntity(SymbolTableEntityType.domainEntitySubclassEntityType(), context.entityName().ID(), context);
    }

    exitDomainEntitySubclass(context) {
        this.currentPropertySymbolTable = null;
    }

    enterEnumeration(context) {
        this._addEntity(SymbolTableEntityType.enumerationEntityType(), context.enumerationName().ID(), context);
    }

    exitEnumeration(context) {
        this.currentPropertySymbolTable = null;
    }

    enterInlineCommonType(context) {
        this._addEntity(SymbolTableEntityType.inlineCommonTypeEntityType(), context.inlineCommonName().ID(), context);
    }

    exitInlineCommonType(context) {
        this.currentPropertySymbolTable = null;
    }

    enterInterchange(context) {
        this._addEntity(context.INTERCHANGE().getText(), context.interchangeName().ID(), context);
    }

    exitInterchange(context) {
        this.currentPropertySymbolTable = null;
    }

    enterInterchangeExtension(context) {
        this._addEntity(context.INTERCHANGE().getText() + context.ADDITIONS().getText(), context.extendeeName().ID(), context);
    }

    exitInterchangeExtension(context) {
        this.currentPropertySymbolTable = null;
    }

    enterSubdomain(context) {
        this._addEntity(context.SUBDOMAIN().getText(), context.subdomainName().ID(), context);
    }

    exitSubdomain(context) {
        this.currentPropertySymbolTable = null;
    }

    enterBooleanProperty(context) {
         this._addProperty(context);
    }

    enterDateProperty(context) {
         this._addProperty(context);
    }

    enterCurrencyProperty(context) {
         this._addProperty(context);
    }

    enterDecimalProperty(context) {
         this._addProperty(context);
    }

    enterDescriptorProperty(context) {
         this._addProperty(context);
    }

    enterDurationProperty(context) {
         this._addProperty(context);
    }

    enterEnumerationProperty(context) {
         this._addProperty(context);
    }

    enterIncludeProperty(context) {
         this._addProperty(context);
    }

    enterIntegerProperty(context) {
         this._addProperty(context);
    }

    enterReferenceProperty(context) {
         this._addProperty(context);
    }

    enterSharedDecimalProperty(context) {
         this._addProperty(context);
    }

    enterSharedIntegerProperty(context) {
         this._addProperty(context);
    }

    enterSharedShortProperty(context) {
         this._addProperty(context);
    }

    enterSharedStringProperty(context) {
         this._addProperty(context);
    }

    enterShortProperty(context) {
         this._addProperty(context);
    }

    enterStringProperty(context) {
         this._addProperty(context);
    }

    enterTimeProperty(context) {
         this._addProperty(context);
    }

    enterYearProperty(context) {
         this._addProperty(context);
    }
}