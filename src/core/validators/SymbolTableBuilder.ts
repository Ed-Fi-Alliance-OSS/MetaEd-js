/// <reference path="../../../src/grammar/gen/MetaEdGrammarListener.d.ts" />
import {MetaEdGrammarListener} from '../../../src/grammar/gen/MetaEdGrammarListener';

import {IMetaEdContext} from '../tasks/MetaEdContext'
import {ISymbolTable} from './SymbolTable'
import {IMetaEdFileIndex} from '../../grammar/IMetaEdFileIndex'
import ValidationMessage from '../../common/ValidationMessage'
import PropertySymbolTable from './PropertySymbolTable'
import {ISymbolTableBuilderListener} from './ISymbolTableBuilderListener'
import SymbolTableEntityType from './SymbolTableEntityType';
import {IListenerWithContext} from "./IListenerWithContext";

declare type ITerminalNode = any;

export interface ISymbolTableBuilder extends IListenerWithContext {
    withContext(context: IMetaEdContext): void;
}

export class SymbolTableBuilder extends MetaEdGrammarListener implements ISymbolTableBuilder {
    private symbolTable: ISymbolTable;
    private metaEdFileIndex: IMetaEdFileIndex;
    private errorMessageCollection: ValidationMessage[];
    private builderListener: ISymbolTableBuilderListener;
    private currentPropertySymbolTable: PropertySymbolTable;
    private symbolTableEntityType : SymbolTableEntityType;

    constructor(builderListener: ISymbolTableBuilderListener) {
        super();
        this.builderListener = builderListener;
        this.symbolTableEntityType = new SymbolTableEntityType();
    }
    public withContext(context: IMetaEdContext): void {
        this.metaEdFileIndex = context.metaEdFileIndex;
        this.errorMessageCollection = context.errorMessageCollection;
        this.symbolTable = context.symbolTable;
        this.builderListener.withContext(context);
    }
    private addEntity(entityType: string, entityName: ITerminalNode, context: any): void {
        if (!this.builderListener.beforeAddEntity(entityType, entityName, context))
            return;
        if (this.symbolTable.tryAdd(entityType, entityName.getText(), context)) {
            this.currentPropertySymbolTable = this.symbolTable.get(entityType, entityName.getText()).propertySymbolTable;
            return;
        }
        let metaEdFile = this.metaEdFileIndex.getFileAndLineNumber(entityName.symbol.line);
        let failure: ValidationMessage = {
            message: "Duplicate " + entityType + " named " + entityName,
            characterPosition: entityName.symbol.column,
            concatenatedLineNumber: entityName.symbol.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
        this.errorMessageCollection.push(failure);
    }
    private addProperty(context): void {
        let propertyName = context.propertyName().ID();
        let withContextContext = context.propertyComponents().withContext();
        let withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().getText();
        if (this.currentPropertySymbolTable == null) {
            return;
        }
        if (this.currentPropertySymbolTable.tryAdd(withContextPrefix + propertyName.getText(), context))
            return;
        let metaEdFile = this.metaEdFileIndex.getFileAndLineNumber(propertyName.symbol.line);
        let duplicateFailure: ValidationMessage = {
            message: `Entity ${this.currentPropertySymbolTable.parent.name} has duplicate properties named ${propertyName.getText()}`,
            characterPosition: propertyName.symbol.column,
            concatenatedLineNumber: propertyName.symbol.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
        this.errorMessageCollection.push(duplicateFailure);
    }

    public enterDomainEntity(context): void {
        this.addEntity(this.symbolTableEntityType.domainEntityEntityType(), context.entityName().ID(), context);
    }

    public exitDomainEntity(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterAbstractEntity(context): void {
        this.addEntity(this.symbolTableEntityType.abstractEntityEntityType(), context.abstractEntityName().ID(), context);
    }

    public exitAbstractEntity(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterAssociation(context): void {
        this.addEntity(this.symbolTableEntityType.associationEntityType(), context.associationName().ID(), context);
    }

    public exitAssociation(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterAssociationExtension(context): void {
        this.addEntity(this.symbolTableEntityType.associationExtensionEntityType(), context.extendeeName().ID(), context);
    }

    public exitAssociationExtension(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterAssociationSubclass(context): void {
        this.addEntity(this.symbolTableEntityType.associationSubclassEntityType(), context.associationName().ID(), context);
    }

    public exitAssociationSubclass(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterChoiceType(context): void {
        this.addEntity(context.CHOICE_TYPE().getText(), context.choiceName().ID(), context);
    }

    public exitChoiceType(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterCommonDecimal(context): void {
        this.addEntity(context.COMMON_DECIMAL().getText(), context.commonDecimalName().ID(), context);
    }

    public exitCommonDecimal(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterCommonInteger(context): void {
        this.addEntity(context.COMMON_INTEGER().getText(), context.commonIntegerName().ID(), context);
    }

    public exitCommonInteger(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterCommonShort(context): void {
        this.addEntity(context.COMMON_SHORT().getText(), context.commonShortName().ID(), context);
    }

    public exitCommonShort(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterCommonString(context): void {
        this.addEntity(context.COMMON_STRING().getText(), context.commonStringName().ID(), context);
    }

    public exitCommonString(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterCommonType(context): void {
        this.addEntity(this.symbolTableEntityType.commonTypeEntityType(), context.commonName().ID(), context);
    }

    public exitCommonType(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterCommonTypeExtension(context): void {
        this.addEntity(this.symbolTableEntityType.commonTypeExtensionEntityType(), context.extendeeName().ID(), context);
    }

    public exitCommonTypeExtension(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterDescriptor(context): void {
        this.addEntity(context.DESCRIPTOR_ENTITY().getText(), context.descriptorName().ID(), context);
    }

    public exitDescriptor(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterDomain(context): void {
        this.addEntity(context.DOMAIN().getText(), context.domainName().ID(), context);
    }

    public exitDomain(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterDomainEntityExtension(context): void {
        this.addEntity(this.symbolTableEntityType.domainEntityExtensionEntityType(), context.extendeeName().ID(), context);
    }

    public exitDomainEntityExtension(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterDomainEntitySubclass(context): void {
        this.addEntity(this.symbolTableEntityType.domainEntitySubclassEntityType(), context.entityName().ID(), context);
    }

    public exitDomainEntitySubclass(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterEnumeration(context): void {
        this.addEntity(this.symbolTableEntityType.enumerationEntityType(), context.enumerationName().ID(), context);
    }

    public exitEnumeration(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterInlineCommonType(context): void {
        this.addEntity(this.symbolTableEntityType.inlineCommonTypeEntityType(), context.inlineCommonName().ID(), context);
    }

    public exitInlineCommonType(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterInterchange(context): void {
        this.addEntity(context.INTERCHANGE().getText(), context.interchangeName().ID(), context);
    }

    public exitInterchange(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterInterchangeExtension(context): void {
        this.addEntity(context.INTERCHANGE().getText() + context.ADDITIONS().getText(), context.extendeeName().ID(), context);
    }

    public exitInterchangeExtension(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterSubdomain(context): void {
        this.addEntity(context.SUBDOMAIN().getText(), context.subdomainName().ID(), context);
    }

    public exitSubdomain(context): void {
        this.currentPropertySymbolTable = null;
    }

    public enterBooleanProperty(context): void {
         this.addProperty(context);
    }

    public enterDateProperty(context): void {
         this.addProperty(context);
    }

    public enterCurrencyProperty(context): void {
         this.addProperty(context);
    }

    public enterDecimalProperty(context): void {
         this.addProperty(context);
    }

    public enterDescriptorProperty(context): void {
         this.addProperty(context);
    }

    public enterDurationProperty(context): void {
         this.addProperty(context);
    }

    public enterEnumerationProperty(context): void {
         this.addProperty(context);
    }

    public enterIncludeProperty(context): void {
         this.addProperty(context);
    }

    public enterIntegerProperty(context): void {
         this.addProperty(context);
    }

    public enterReferenceProperty(context): void {
         this.addProperty(context);
    }

    public enterSharedDecimalProperty(context): void {
         this.addProperty(context);
    }

    public enterSharedIntegerProperty(context): void {
         this.addProperty(context);
    }

    public enterSharedShortProperty(context): void {
         this.addProperty(context);
    }

    public enterSharedStringProperty(context): void {
         this.addProperty(context);
    }

    public enterShortProperty(context): void {
         this.addProperty(context);
    }

    public enterStringProperty(context): void {
         this.addProperty(context);
    }

    public enterTimeProperty(context): void {
         this.addProperty(context);
    }

    public enterYearProperty(context): void {
         this.addProperty(context);
    }
}