"use strict";
/// <reference path="../../../src/grammar/gen/MetaEdGrammarListener.d.ts" />
const Gen = require('../../../src/grammar/gen/MetaEdGrammarListener');
const SymbolTableEntityType_1 = require("./SymbolTableEntityType");
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
        let propertyName = context.idNode();
        let withContextContext = context.propertyComponents().withContext();
        let withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().GetText();
        if (this._currentPropertySymbolTable == null) {
            return;
        }
        if (this._currentPropertySymbolTable.tryAdd(withContextPrefix + propertyName.GetText(), context))
            return;
        let metaEdFile = this._metaEdFileIndex.getFileAndLineNumber(propertyName.Symbol.Line);
        let duplicateFailure = {
            message: `Entity ${this._currentPropertySymbolTable.parent.name} has duplicate properties named ${propertyName.GetText()}`,
            characterPosition: propertyName.Symbol.Column,
            concatenatedLineNumber: propertyName.Symbol.Line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
        this._errorMessageCollection.add(duplicateFailure);
    }
    enterDomainEntity(context) {
        this.addEntity(this._symbolTableEntityType.domainEntityEntityType(), context.entityName().ID(), context);
    }
}
exports.SymbolTableBuilder = SymbolTableBuilder;
//# sourceMappingURL=SymbolTableBuilder.js.map