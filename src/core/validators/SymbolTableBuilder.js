// @flow
import R from 'ramda';
import { MetaEdGrammarListener } from '../../grammar/gen/MetaEdGrammarListener';
import { addAction, addErrorMessage, setSymbolTable } from '../State';
import type { State } from '../../core/State';
import SymbolTable from './SymbolTable';
import { propertyNameHandlingSharedProperty } from './ValidationHelper';
import SymbolTableEntityType from './SymbolTableEntityType';
import { getFilenameAndLineNumber } from '../tasks/FileIndex';
import type { ValidationMessage } from './ValidationTypes';


export default class SymbolTableBuilder extends MetaEdGrammarListener {
  state: State;
  newSymbolTable: SymbolTable;
  currentPropertySymbolTable: any;

  withState(state: State) {
    this.state = state;
    this.newSymbolTable = new SymbolTable();
  }

  postBuildState(): State {
    return R.pipe(setSymbolTable(this.newSymbolTable), addAction('SymbolTableBuilder'))(this.state);
  }

  _addEntity(entityType: string, entityNameIdNode: any, ruleContext: any) {
    if (this.newSymbolTable.tryAdd(entityType, entityNameIdNode.getText(), ruleContext)) {
      const entityContext = this.newSymbolTable.get(entityType, entityNameIdNode.getText());
      if (entityContext == null) throw new Error('SymbolTableBuilder._addEntity() error should never happen');
      this.currentPropertySymbolTable = entityContext.propertySymbolTable;
      return;
    }

    const { filename, lineNumber } = getFilenameAndLineNumber(this.state.get('fileIndex'), entityNameIdNode.symbol.line);
    const failure: ValidationMessage = {
      message: `Duplicate ${entityType} named ${entityNameIdNode}`,
      characterPosition: entityNameIdNode.symbol.column,
      concatenatedLineNumber: entityNameIdNode.symbol.line,
      filename,
      lineNumber,
      tokenText: entityNameIdNode.symbol.text,
    };
    this.state = R.pipe(addErrorMessage(failure), addAction('SymbolTableBuilder'))(this.state);
  }

  _addProperty(ruleContext: any) {
    // TODO: if assertion fails, add entry to new "indeterminate" state validation collection
    const propertyName: any = propertyNameHandlingSharedProperty(ruleContext);
    if (propertyName == null || ruleContext.propertyComponents() == null || ruleContext.propertyComponents().exception) return;

    const withContextContext = ruleContext.propertyComponents().withContext();
    const withContextPrefix =
      (withContextContext == null || withContextContext.withContextName() == null || withContextContext.withContextName().exception) ?
        '' : withContextContext.withContextName().ID().getText();
    if (this.currentPropertySymbolTable == null) {
      return;
    }
    if (this.currentPropertySymbolTable.tryAdd(withContextPrefix + propertyName.ID().getText(), ruleContext)) return;

    const propertyNameToken = propertyName.ID();
    const { filename, lineNumber } = getFilenameAndLineNumber(this.state.get('fileIndex'), propertyNameToken.symbol.line);
    const duplicateFailure: ValidationMessage = {
      message: `Entity ${this.currentPropertySymbolTable.parentName()} has duplicate properties named ${propertyNameToken.getText()}`,
      characterPosition: propertyNameToken.symbol.column,
      concatenatedLineNumber: propertyNameToken.symbol.line,
      filename,
      lineNumber,
      tokenText: propertyNameToken.symbol.text,
    };
    this.state = R.pipe(addErrorMessage(duplicateFailure), addAction('SymbolTableBuilder'))(this.state);
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

  enterChoice(ruleContext: any) {
    this._addEntity(ruleContext.CHOICE().getText(), ruleContext.choiceName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitChoice(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterSharedDecimal(ruleContext: any) {
    this._addEntity(ruleContext.SHARED_DECIMAL().getText(), ruleContext.sharedDecimalName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitSharedDecimal(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterSharedInteger(ruleContext: any) {
    this._addEntity(ruleContext.SHARED_INTEGER().getText(), ruleContext.sharedIntegerName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitSharedInteger(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterSharedShort(ruleContext: any) {
    this._addEntity(ruleContext.SHARED_SHORT().getText(), ruleContext.sharedShortName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitSharedShort(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterSharedString(ruleContext: any) {
    this._addEntity(ruleContext.SHARED_STRING().getText(), ruleContext.sharedStringName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitSharedString(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterCommon(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.common(), ruleContext.commonName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitCommon(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterCommonExtension(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.commonExtension(), ruleContext.extendeeName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitCommonExtension(ruleContext: any) {
    this.currentPropertySymbolTable = null;
  }

  enterDescriptor(ruleContext: any) {
    this._addEntity(ruleContext.DESCRIPTOR().getText(), ruleContext.descriptorName().ID(), ruleContext);
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

  enterInlineCommon(ruleContext: any) {
    this._addEntity(SymbolTableEntityType.inlineCommon(), ruleContext.inlineCommonName().ID(), ruleContext);
  }

  // eslint-disable-next-line no-unused-vars
  exitInlineCommon(ruleContext: any) {
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

  enterAssociationProperty(ruleContext: any) {
    this._addProperty(ruleContext);
  }

  enterBooleanProperty(ruleContext: any) {
    this._addProperty(ruleContext);
  }

  enterChoiceProperty(ruleContext: any) {
    this._addProperty(ruleContext);
  }

  enterCommonProperty(ruleContext: any) {
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

  enterDomainEntityProperty(ruleContext: any) {
    this._addProperty(ruleContext);
  }

  enterDurationProperty(ruleContext: any) {
    this._addProperty(ruleContext);
  }

  enterEnumerationProperty(ruleContext: any) {
    this._addProperty(ruleContext);
  }

  enterIntegerProperty(ruleContext: any) {
    this._addProperty(ruleContext);
  }

  enterInlineCommonProperty(ruleContext: any) {
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
