/// <reference path="../../../src/grammar/gen/MetaEdGrammarListener.d.ts" />
import {MetaEdGrammarListener} from '../../../src/grammar/gen/MetaEdGrammarListener';

import {IMetaEdContext} from '../tasks/MetaEdContext'
import {ISymbolTable} from './SymbolTable'
import {IMetaEdFileIndex} from '../../grammar/IMetaEdFileIndex'
import ValidationMessage from '../../common/ValidationMessage'
import PropertySymbolTable from './PropertySymbolTable'
import {ISymbolTableBuilderListener} from './ISymbolTableBuilderListener'
import List from 'typescript-dotnet-commonjs/System/Collections/List'
import SymbolTableEntityType from './SymbolTableEntityType';
import {IListenerWithContext} from "./IListenerWithContext";
import ParserRuleContext = MetaEdGrammar.ParserRuleContext;

declare type ITerminalNode = any;

export interface ISymbolTableBuilder extends IListenerWithContext {
    withContext(context: IMetaEdContext): void;
}

export class SymbolTableBuilder extends MetaEdGrammarListener implements ISymbolTableBuilder {
    private _symbolTable: ISymbolTable;
    private _metaEdFileIndex: IMetaEdFileIndex;
    private _errorMessageCollection: List<ValidationMessage>;
    private _builderListener: ISymbolTableBuilderListener;
    private _currentPropertySymbolTable: PropertySymbolTable;
    private _symbolTableEntityType : SymbolTableEntityType;

    constructor(builderListener: ISymbolTableBuilderListener) {
        super();
        this._builderListener = builderListener;
        this._symbolTableEntityType = new SymbolTableEntityType();
    }
    public withContext(context: IMetaEdContext): void {
        this._metaEdFileIndex = context.metaEdFileIndex;
        this._errorMessageCollection = context.errorMessageCollection;
        this._symbolTable = context.symbolTable;
        this._builderListener.withContext(context);
    }
    private addEntity(entityType: string, entityName: ITerminalNode, context: ParserRuleContext): void {
        if (!this._builderListener.beforeAddEntity(entityType, entityName, context))
            return;
        if (this._symbolTable.tryAdd(entityType, entityName.getText(), context)) {
            this._currentPropertySymbolTable = this._symbolTable.get(entityType, entityName.getText()).propertySymbolTable;
            return;
        }
        let metaEdFile = this._metaEdFileIndex.getFileAndLineNumber(entityName.symbol.line);
        let failure: ValidationMessage = {
            message: "Duplicate " + entityType + " named " + entityName,
            characterPosition: entityName.symbol.column,
            concatenatedLineNumber: entityName.symbol.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
        this._errorMessageCollection.add(failure);
    }
    private addProperty(context): void {
        let propertyName = context.propertyName().ID();
        let withContextContext = context.propertyComponents().withContext();
        let withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().getText();
        if (this._currentPropertySymbolTable == null) {
            return;
        }
        if (this._currentPropertySymbolTable.tryAdd(withContextPrefix + propertyName.getText(), context))
            return;
        let metaEdFile = this._metaEdFileIndex.getFileAndLineNumber(propertyName.symbol.line);
        let duplicateFailure: ValidationMessage = {
            message: `Entity ${this._currentPropertySymbolTable.parent.name} has duplicate properties named ${propertyName.getText()}`,
            characterPosition: propertyName.symbol.column,
            concatenatedLineNumber: propertyName.symbol.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
        this._errorMessageCollection.add(duplicateFailure);
    }

    public enterDomainEntity(context): void {
        this.addEntity(this._symbolTableEntityType.domainEntityEntityType(), context.entityName().ID(), context);
    }

    public exitDomainEntity(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterAbstractEntity(context): void {
        this.addEntity(this._symbolTableEntityType.abstractEntityEntityType(), context.abstractEntityName().ID(), context);
    }

    public exitAbstractEntity(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterAssociation(context): void {
        this.addEntity(this._symbolTableEntityType.associationEntityType(), context.associationName().ID(), context);
    }

    public exitAssociation(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterAssociationExtension(context): void {
        this.addEntity(this._symbolTableEntityType.associationExtensionEntityType(), context.extendeeName().ID(), context);
    }

    public exitAssociationExtension(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterAssociationSubclass(context): void {
        this.addEntity(this._symbolTableEntityType.associationSubclassEntityType(), context.associationName().ID(), context);
    }

    public exitAssociationSubclass(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterChoiceType(context): void {
        this.addEntity(context.CHOICE_TYPE().getText(), context.choiceName().ID(), context);
    }

    public exitChoiceType(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterCommonDecimal(context): void {
        this.addEntity(context.COMMON_DECIMAL().getText(), context.commonDecimalName().ID(), context);
    }

    public exitCommonDecimal(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterCommonInteger(context): void {
        this.addEntity(context.COMMON_INTEGER().getText(), context.commonIntegerName().ID(), context);
    }

    public exitCommonInteger(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterCommonShort(context): void {
        this.addEntity(context.COMMON_SHORT().getText(), context.commonShortName().ID(), context);
    }

    public exitCommonShort(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterCommonString(context): void {
        this.addEntity(context.COMMON_STRING().getText(), context.commonStringName().ID(), context);
    }

    public exitCommonString(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterCommonType(context): void {
        this.addEntity(this._symbolTableEntityType.commonTypeEntityType(), context.commonName().ID(), context);
    }

    public exitCommonType(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterCommonTypeExtension(context): void {
        this.addEntity(this._symbolTableEntityType.commonTypeExtensionEntityType(), context.extendeeName().ID(), context);
    }

    public exitCommonTypeExtension(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterDescriptor(context): void {
        this.addEntity(context.DESCRIPTOR_ENTITY().getText(), context.descriptorName().ID(), context);
    }

    public exitDescriptor(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterDomain(context): void {
        this.addEntity(context.DOMAIN().getText(), context.domainName().ID(), context);
    }

    public exitDomain(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterDomainEntityExtension(context): void {
        this.addEntity(this._symbolTableEntityType.domainEntityExtensionEntityType(), context.extendeeName().ID(), context);
    }

    public exitDomainEntityExtension(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterDomainEntitySubclass(context): void {
        this.addEntity(this._symbolTableEntityType.domainEntitySubclassEntityType(), context.entityName().ID(), context);
    }

    public exitDomainEntitySubclass(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterEnumeration(context): void {
        this.addEntity(this._symbolTableEntityType.enumerationEntityType(), context.enumerationName().ID(), context);
    }

    public exitEnumeration(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterInlineCommonType(context): void {
        this.addEntity(this._symbolTableEntityType.inlineCommonTypeEntityType(), context.inlineCommonName().ID(), context);
    }

    public exitInlineCommonType(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterInterchange(context): void {
        this.addEntity(context.INTERCHANGE().getText(), context.interchangeName().ID(), context);
    }

    public exitInterchange(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterInterchangeExtension(context): void {
        this.addEntity(context.INTERCHANGE().getText() + context.ADDITIONS().getText(), context.extendeeName().ID(), context);
    }

    public exitInterchangeExtension(context): void {
        this._currentPropertySymbolTable = null;
    }

    public enterSubdomain(context): void {
        this.addEntity(context.SUBDOMAIN().getText(), context.subdomainName().ID(), context);
    }

    public exitSubdomain(context): void {
        this._currentPropertySymbolTable = null;
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