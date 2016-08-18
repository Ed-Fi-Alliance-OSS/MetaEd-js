/// <reference path="../../../src/grammar/gen/MetaEdGrammarListener.d.ts" />
import Gen = require('../../../src/grammar/gen/MetaEdGrammarListener');

import {IMetaEdContext} from '../tasks/MetaEdContext'
import {ISymbolTable} from './SymbolTable'
import {IMetaEdFileIndex} from '../../grammar/IMetaEdFileIndex'
import ValidationMessage from '../../common/ValidationMessage'
import PropertySymbolTable from './PropertySymbolTable'
import {IPropertyWithComponents} from '../../grammar/IPropertyWithComponents'
import {ISymbolTableBuilderListener} from './ISymbolTableBuilderListener'
import List from 'typescript-dotnet-commonjs/System/Collections/List'
import SymbolTableEntityType from "./SymbolTableEntityType";

declare type ITerminalNode = any;
export declare type ParserRuleContext = any;

export interface ISymbolTableBuilder {
    withContext(context: IMetaEdContext): void;
}

export class SymbolTableBuilder extends Gen.MetaEdGrammarListener implements ISymbolTableBuilder {
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
        this._metaEdFileIndex = context.MetaEdFileIndex;
        this._errorMessageCollection = context.ErrorMessageCollection;
        this._symbolTable = context.SymbolTable;
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
    private addProperty(context: IPropertyWithComponents): void {
        let propertyName = context.idNode();
        let withContextContext = context.propertyComponents().withContext();
        let withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().GetText();
        if (this._currentPropertySymbolTable == null) {
            return;
        }
        if (this._currentPropertySymbolTable.tryAdd(withContextPrefix + propertyName.GetText(), context))
            return;
        let metaEdFile = this._metaEdFileIndex.getFileAndLineNumber(propertyName.Symbol.Line);
        let duplicateFailure: ValidationMessage = {
            message: `Entity ${this._currentPropertySymbolTable.parent.name} has duplicate properties named ${propertyName.GetText()}`,
            characterPosition: propertyName.Symbol.Column,
            concatenatedLineNumber: propertyName.Symbol.Line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
        this._errorMessageCollection.add(duplicateFailure);
    }

    public enterDomainEntity(context): void {
        this.addEntity(this._symbolTableEntityType.domainEntityEntityType(), context.entityName().ID(), context);
    }

    // public exitDomainEntity(context: MetaEdGrammar.DomainEntityContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterAbstractEntity(context: MetaEdGrammar.AbstractEntityContext): void {
    //     addEntity(SymbolTableEntityType.AbstractEntityEntityType(), context.abstractEntityName().ID(), context);
    // }
    // public exitAbstractEntity(context: MetaEdGrammar.AbstractEntityContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterAssociation(context: MetaEdGrammar.AssociationContext): void {
    //     addEntity(SymbolTableEntityType.AssociationEntityType(), context.associationName().ID(), context);
    // }
    // public exitAssociation(context: MetaEdGrammar.AssociationContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterAssociationExtension(context: MetaEdGrammar.AssociationExtensionContext): void {
    //     addEntity(SymbolTableEntityType.AssociationExtensionEntityType(), context.extendeeName().ID(), context);
    // }
    // public exitAssociationExtension(context: MetaEdGrammar.AssociationExtensionContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterAssociationSubclass(context: MetaEdGrammar.AssociationSubclassContext): void {
    //     addEntity(SymbolTableEntityType.AssociationSubclassEntityType(), context.associationName().ID(), context);
    // }
    // public exitAssociationSubclass(context: MetaEdGrammar.AssociationSubclassContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterChoiceType(context: MetaEdGrammar.ChoiceTypeContext): void {
    //     addEntity(context.CHOICETYPE().GetText(), context.choiceName().ID(), context);
    // }
    // public exitChoiceType(context: MetaEdGrammar.ChoiceTypeContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterCommonDecimal(context: MetaEdGrammar.CommonDecimalContext): void {
    //     addEntity(context.COMMONDECIMAL().GetText(), context.commonDecimalName().ID(), context);
    // }
    // public exitCommonDecimal(context: MetaEdGrammar.CommonDecimalContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterCommonInteger(context: MetaEdGrammar.CommonIntegerContext): void {
    //     addEntity(context.COMMONINTEGER().GetText(), context.commonIntegerName().ID(), context);
    // }
    // public exitCommonInteger(context: MetaEdGrammar.CommonIntegerContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterCommonShort(context: MetaEdGrammar.CommonShortContext): void {
    //     addEntity(context.COMMONSHORT().GetText(), context.commonShortName().ID(), context);
    // }
    // public exitCommonShort(context: MetaEdGrammar.CommonShortContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterCommonString(context: MetaEdGrammar.CommonStringContext): void {
    //     addEntity(context.COMMONSTRING().GetText(), context.commonStringName().ID(), context);
    // }
    // public exitCommonString(context: MetaEdGrammar.CommonStringContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterCommonType(context: MetaEdGrammar.CommonTypeContext): void {
    //     addEntity(SymbolTableEntityType.CommonTypeEntityType(), context.commonName().ID(), context);
    // }
    // public exitCommonType(context: MetaEdGrammar.CommonTypeContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterCommonTypeExtension(context: MetaEdGrammar.CommonTypeExtensionContext): void {
    //     addEntity(SymbolTableEntityType.CommonTypeExtensionEntityType(), context.extendeeName().ID(), context);
    // }
    // public exitCommonTypeExtension(context: MetaEdGrammar.CommonTypeExtensionContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterDescriptor(context: MetaEdGrammar.DescriptorContext): void {
    //     addEntity(context.DESCRIPTORENTITY().GetText(), context.descriptorName().ID(), context);
    // }
    // public exitDescriptor(context: MetaEdGrammar.DescriptorContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterDomain(context: MetaEdGrammar.DomainContext): void {
    //     addEntity(context.DOMAIN().GetText(), context.domainName().ID(), context);
    // }
    // public exitDomain(context: MetaEdGrammar.DomainContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterDomainEntityExtension(context: MetaEdGrammar.DomainEntityExtensionContext): void {
    //     addEntity(SymbolTableEntityType.DomainEntityExtensionEntityType(), context.extendeeName().ID(), context);
    // }
    // public exitDomainEntityExtension(context: MetaEdGrammar.DomainEntityExtensionContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterDomainEntitySubclass(context: MetaEdGrammar.DomainEntitySubclassContext): void {
    //     addEntity(SymbolTableEntityType.DomainEntitySubclassEntityType(), context.entityName().ID(), context);
    // }
    // public exitDomainEntitySubclass(context: MetaEdGrammar.DomainEntitySubclassContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterEnumeration(context: MetaEdGrammar.EnumerationContext): void {
    //     addEntity(SymbolTableEntityType.EnumerationEntityType(), context.enumerationName().ID(), context);
    // }
    // public exitEnumeration(context: MetaEdGrammar.EnumerationContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterInlineCommonType(context: MetaEdGrammar.InlineCommonTypeContext): void {
    //     addEntity(SymbolTableEntityType.InlineCommonTypeEntityType(), context.inlineCommonName().ID(), context);
    // }
    // public exitInlineCommonType(context: MetaEdGrammar.InlineCommonTypeContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterInterchange(context: MetaEdGrammar.InterchangeContext): void {
    //     addEntity(context.INTERCHANGE().GetText(), context.interchangeName().ID(), context);
    // }
    // public exitInterchange(context: MetaEdGrammar.InterchangeContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterInterchangeExtension(context: MetaEdGrammar.InterchangeExtensionContext): void {
    //     addEntity(context.INTERCHANGE().GetText() + context.ADDITIONS().GetText(), context.extendeeName().ID(), context);
    // }
    // public exitInterchangeExtension(context: MetaEdGrammar.InterchangeExtensionContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterSubdomain(context: MetaEdGrammar.SubdomainContext): void {
    //     addEntity(context.SUBDOMAIN().GetText(), context.subdomainName().ID(), context);
    // }
    // public exitSubdomain(context: MetaEdGrammar.SubdomainContext): void {
    //     this._currentPropertySymbolTable = null;
    // }
    // public enterBooleanProperty(context: MetaEdGrammar.BooleanPropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterDateProperty(context: MetaEdGrammar.DatePropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterCurrencyProperty(context: MetaEdGrammar.CurrencyPropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterDecimalProperty(context: MetaEdGrammar.DecimalPropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterDescriptorProperty(context: MetaEdGrammar.DescriptorPropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterDurationProperty(context: MetaEdGrammar.DurationPropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterEnumerationProperty(context: MetaEdGrammar.EnumerationPropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterIncludeProperty(context: MetaEdGrammar.IncludePropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterIntegerProperty(context: MetaEdGrammar.IntegerPropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterReferenceProperty(context: MetaEdGrammar.ReferencePropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterSharedDecimalProperty(context: MetaEdGrammar.SharedDecimalPropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterSharedIntegerProperty(context: MetaEdGrammar.SharedIntegerPropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterSharedShortProperty(context: MetaEdGrammar.SharedShortPropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterSharedStringProperty(context: MetaEdGrammar.SharedStringPropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterShortProperty(context: MetaEdGrammar.ShortPropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterStringProperty(context: MetaEdGrammar.StringPropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterTimeProperty(context: MetaEdGrammar.TimePropertyContext): void {
    //     AddProperty(context);
    // }
    // public enterYearProperty(context: MetaEdGrammar.YearPropertyContext): void {
    //     AddProperty(context);
    // }
}