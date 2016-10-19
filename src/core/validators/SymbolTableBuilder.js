// @flow
import {MetaEdGrammarListener} from '../../../src/grammar/gen/MetaEdGrammarListener';

import {IMetaEdContext} from '../tasks/MetaEdContext'
import type SymbolTable from './SymbolTable'
import {IMetaEdFileIndex} from '../../grammar/IMetaEdFileIndex'
import ValidationMessage from '../../common/ValidationMessage'
import PropertySymbolTable from './PropertySymbolTable'
import SymbolTableEntityType from './SymbolTableEntityType';


export class SymbolTableBuilder extends MetaEdGrammarListener {
    symbolTable: SymbolTable;
    metaEdFileIndex: any;
    errorMessageCollection: any;
    builderListener: any;
    currentPropertySymbolTable: any;

    constructor(builderListener: any) {
        super();
        this.builderListener = builderListener;
    }

    withContext(metaEdContext: any) {
        this.metaEdFileIndex = metaEdContext.metaEdFileIndex;
        this.errorMessageCollection = metaEdContext.errorMessageCollection;
        this.symbolTable = metaEdContext.symbolTable;
        this.builderListener.withContext(metaEdContext);
    }

    _addEntity(entityType: string, entityNameIdNode: any, ruleContext: any) {
        if (!this.builderListener.beforeAddEntity(entityType, entityNameIdNode, ruleContext))
            return;
        if (this.symbolTable.tryAdd(entityType, entityNameIdNode.getText(), ruleContext)) {
            const entityContext = this.symbolTable.get(entityType, entityNameIdNode.getText());
            if (entityContext == null) throw new Error("SymbolTableBuilder._addEntity() error should never happen");
            this.currentPropertySymbolTable = entityContext.propertySymbolTable;
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

    _addProperty(ruleContext: any) {
        let propertyName = ruleContext.propertyName().ID();
        let withContextContext = ruleContext.propertyComponents().withContext();
        let withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().getText();
        if (this.currentPropertySymbolTable == null) {
            return;
        }
        if (this.currentPropertySymbolTable.tryAdd(withContextPrefix + propertyName.getText(), ruleContext))
            return;
        let metaEdFile = this.metaEdFileIndex.getFileAndLineNumber(propertyName.symbol.line);
        let duplicateFailure = {
            message: `Entity ${this.currentPropertySymbolTable.parentName()} has duplicate properties named ${propertyName.getText()}`,
            characterPosition: propertyName.symbol.column,
            concatenatedLineNumber: propertyName.symbol.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
        this.errorMessageCollection.push(duplicateFailure);
    }

    enterDomainEntity(ruleContext: any) {
        this._addEntity(SymbolTableEntityType.domainEntityEntityType(), ruleContext.entityName().ID(), ruleContext);
    }

    exitDomainEntity(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterAbstractEntity(ruleContext: any) {
        this._addEntity(SymbolTableEntityType.abstractEntityEntityType(), ruleContext.abstractEntityName().ID(), ruleContext);
    }

    exitAbstractEntity(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterAssociation(ruleContext: any) {
        this._addEntity(SymbolTableEntityType.associationEntityType(), ruleContext.associationName().ID(), ruleContext);
    }

    exitAssociation(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterAssociationExtension(ruleContext: any) {
        this._addEntity(SymbolTableEntityType.associationExtensionEntityType(), ruleContext.extendeeName().ID(), ruleContext);
    }

    exitAssociationExtension(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterAssociationSubclass(ruleContext: any) {
        this._addEntity(SymbolTableEntityType.associationSubclassEntityType(), ruleContext.associationName().ID(), ruleContext);
    }

    exitAssociationSubclass(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterChoiceType(ruleContext: any) {
        this._addEntity(ruleContext.CHOICE_TYPE().getText(), ruleContext.choiceName().ID(), ruleContext);
    }

    exitChoiceType(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterCommonDecimal(ruleContext: any) {
        this._addEntity(ruleContext.COMMON_DECIMAL().getText(), ruleContext.commonDecimalName().ID(), ruleContext);
    }

    exitCommonDecimal(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterCommonInteger(ruleContext: any) {
        this._addEntity(ruleContext.COMMON_INTEGER().getText(), ruleContext.commonIntegerName().ID(), ruleContext);
    }

    exitCommonInteger(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterCommonShort(ruleContext: any) {
        this._addEntity(ruleContext.COMMON_SHORT().getText(), ruleContext.commonShortName().ID(), ruleContext);
    }

    exitCommonShort(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterCommonString(ruleContext: any) {
        this._addEntity(ruleContext.COMMON_STRING().getText(), ruleContext.commonStringName().ID(), ruleContext);
    }

    exitCommonString(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterCommonType(ruleContext: any) {
        this._addEntity(SymbolTableEntityType.commonTypeEntityType(), ruleContext.commonName().ID(), ruleContext);
    }

    exitCommonType(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterCommonTypeExtension(ruleContext: any) {
        this._addEntity(SymbolTableEntityType.commonTypeExtensionEntityType(), ruleContext.extendeeName().ID(), ruleContext);
    }

    exitCommonTypeExtension(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterDescriptor(ruleContext: any) {
        this._addEntity(ruleContext.DESCRIPTOR_ENTITY().getText(), ruleContext.descriptorName().ID(), ruleContext);
    }

    exitDescriptor(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterDomain(ruleContext: any) {
        this._addEntity(ruleContext.DOMAIN().getText(), ruleContext.domainName().ID(), ruleContext);
    }

    exitDomain(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterDomainEntityExtension(ruleContext: any) {
        this._addEntity(SymbolTableEntityType.domainEntityExtensionEntityType(), ruleContext.extendeeName().ID(), ruleContext);
    }

    exitDomainEntityExtension(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterDomainEntitySubclass(ruleContext: any) {
        this._addEntity(SymbolTableEntityType.domainEntitySubclassEntityType(), ruleContext.entityName().ID(), ruleContext);
    }

    exitDomainEntitySubclass(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterEnumeration(ruleContext: any) {
        this._addEntity(SymbolTableEntityType.enumerationEntityType(), ruleContext.enumerationName().ID(), ruleContext);
    }

    exitEnumeration(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterInlineCommonType(ruleContext: any) {
        this._addEntity(SymbolTableEntityType.inlineCommonTypeEntityType(), ruleContext.inlineCommonName().ID(), ruleContext);
    }

    exitInlineCommonType(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterInterchange(ruleContext: any) {
        this._addEntity(ruleContext.INTERCHANGE().getText(), ruleContext.interchangeName().ID(), ruleContext);
    }

    exitInterchange(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterInterchangeExtension(ruleContext: any) {
        this._addEntity(ruleContext.INTERCHANGE().getText() + ruleContext.ADDITIONS().getText(), ruleContext.extendeeName().ID(), ruleContext);
    }

    exitInterchangeExtension(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterSubdomain(ruleContext: any) {
        this._addEntity(ruleContext.SUBDOMAIN().getText(), ruleContext.subdomainName().ID(), ruleContext);
    }

    exitSubdomain(ruleContext: any) {
        this.currentPropertySymbolTable = null;
    }

    enterBooleanProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterDateProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterCurrencyProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterDecimalProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterDescriptorProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterDurationProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterEnumerationProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterIncludeProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterIntegerProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterReferenceProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterSharedDecimalProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterSharedIntegerProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterSharedShortProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterSharedStringProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterShortProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterStringProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterTimeProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }

    enterYearProperty(ruleContext: any) {
         this._addProperty(ruleContext);
    }
}