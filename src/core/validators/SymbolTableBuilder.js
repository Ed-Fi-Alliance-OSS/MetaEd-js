// @flow
import { MetaEdGrammarListener } from '../../../src/grammar/gen/MetaEdGrammarListener';

import type SymbolTable from './SymbolTable';
import SymbolTableEntityType from './SymbolTableEntityType';

export default class SymbolTableBuilder extends MetaEdGrammarListener {
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
    if (!this.builderListener.beforeAddEntity(entityType, entityNameIdNode, ruleContext)) return;
    if (this.symbolTable.tryAdd(entityType, entityNameIdNode.getText(), ruleContext)) {
      const entityContext = this.symbolTable.get(entityType, entityNameIdNode.getText());
      if (entityContext == null) throw new Error('SymbolTableBuilder._addEntity() error should never happen');
      this.currentPropertySymbolTable = entityContext.propertySymbolTable;
      return;
    }
    const metaEdFile = this.metaEdFileIndex.getFileAndLineNumber(entityNameIdNode.symbol.line);
    const failure = {
      message: `Duplicate ${entityType} named ${entityNameIdNode}`,
      characterPosition: entityNameIdNode.symbol.column,
      concatenatedLineNumber: entityNameIdNode.symbol.line,
      fileName: metaEdFile.fileName,
      lineNumber: metaEdFile.lineNumber,
    };
    this.errorMessageCollection.push(failure);
  }

  _addProperty(ruleContext: any) {
    const propertyName = ruleContext.propertyName().ID();
    const withContextContext = ruleContext.propertyComponents().withContext();
    const withContextPrefix = withContextContext == null ? '' : withContextContext.withContextName().ID().getText();
    if (this.currentPropertySymbolTable == null) {
      return;
    }
    if (this.currentPropertySymbolTable.tryAdd(withContextPrefix + propertyName.getText(), ruleContext)) return;
    const metaEdFile = this.metaEdFileIndex.getFileAndLineNumber(propertyName.symbol.line);
    const duplicateFailure = {
      message: `Entity ${this.currentPropertySymbolTable.parentName()} has duplicate properties named ${propertyName.getText()}`,
      characterPosition: propertyName.symbol.column,
      concatenatedLineNumber: propertyName.symbol.line,
      fileName: metaEdFile.fileName,
      lineNumber: metaEdFile.lineNumber,
    };
    this.errorMessageCollection.push(duplicateFailure);
  }

  enterDomainEntity(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.domainEntity(), ruleContext.entityName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitDomainEntity(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterAbstractEntity(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.abstractEntity(), ruleContext.abstractEntityName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitAbstractEntity(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterAssociation(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.association(), ruleContext.associationName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitAssociation(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterAssociationExtension(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.associationExtension(), ruleContext.extendeeName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitAssociationExtension(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterAssociationSubclass(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.associationSubclass(), ruleContext.associationName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitAssociationSubclass(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterChoiceType(ruleContext: any) {
    this._addEntity(ruleContext.CHOICE_TYPE().getText(), ruleContext.choiceName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitChoiceType(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterCommonDecimal(ruleContext: any) {
    this._addEntity(ruleContext.COMMON_DECIMAL().getText(), ruleContext.commonDecimalName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitCommonDecimal(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterCommonInteger(ruleContext: any) {
    this._addEntity(ruleContext.COMMON_INTEGER().getText(), ruleContext.commonIntegerName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitCommonInteger(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterCommonShort(ruleContext: any) {
    this._addEntity(ruleContext.COMMON_SHORT().getText(), ruleContext.commonShortName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitCommonShort(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterCommonString(ruleContext: any) {
    this._addEntity(ruleContext.COMMON_STRING().getText(), ruleContext.commonStringName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitCommonString(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterCommonType(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.commonType(), ruleContext.commonName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitCommonType(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterCommonTypeExtension(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.commonTypeExtension(), ruleContext.extendeeName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitCommonTypeExtension(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterDescriptor(ruleContext: any) {
    this._addEntity(ruleContext.DESCRIPTOR_ENTITY().getText(), ruleContext.descriptorName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitDescriptor(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterDomain(ruleContext: any) {
    this._addEntity(ruleContext.DOMAIN().getText(), ruleContext.domainName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitDomain(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterDomainEntityExtension(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.domainEntityExtension(), ruleContext.extendeeName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitDomainEntityExtension(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterDomainEntitySubclass(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.domainEntitySubclass(), ruleContext.entityName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitDomainEntitySubclass(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterEnumeration(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.enumeration(), ruleContext.enumerationName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitEnumeration(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterInlineCommonType(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.inlineCommonType(), ruleContext.inlineCommonName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitInlineCommonType(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterInterchange(ruleContext: any) {
    this._addEntity(ruleContext.INTERCHANGE().getText(), ruleContext.interchangeName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitInterchange(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterInterchangeExtension(ruleContext: any) {
    this._addEntity(ruleContext.INTERCHANGE().getText() + ruleContext.ADDITIONS().getText(), ruleContext.extendeeName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitInterchangeExtension(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterSubdomain(ruleContext: any) {
    this._addEntity(ruleContext.SUBDOMAIN().getText(), ruleContext.subdomainName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
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
