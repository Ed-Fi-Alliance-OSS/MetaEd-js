"use strict";
//TODO: extends MetaEdGrammarBaseListener
class SymbolTableBuilder {
    constructor(builderListener) {
        this._builderListener = builderListener;
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
        if (this._symbolTable.tryAdd(entityType, entityName.GetText(), context)) {
            this._currentPropertySymbolTable = this._symbolTable.getEntityContext(entityType, entityName.GetText()).propertySymbolTable;
            return;
        }
        let metaEdFile = this._metaEdFileIndex.getFileAndLineNumber(entityName.Symbol.Line);
        let failure = {
            message: "Duplicate " + entityType + " named " + entityName,
            characterPosition: entityName.Symbol.Column,
            concatenatedLineNumber: entityName.Symbol.Line,
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
    //TODO: These are called from Antlr but are undefined.
    enterEveryRule(ctx /*ParserRuleContext*/) { }
    exitEveryRule(ctx /*ParserRuleContext*/) { }
    visitTerminal(ctx /*TerminalNode*/) { }
}
exports.SymbolTableBuilder = SymbolTableBuilder;
//# sourceMappingURL=SymbolTableBuilder.js.map