/// <reference path="../../../src/grammar/gen/MetaEdGrammar.d.ts" />
"use strict";
const AbstractEntityMustContainAnIdentity_1 = require("./AbstractEntity/AbstractEntityMustContainAnIdentity");
const ValidationLevel_1 = require("./ValidationLevel");
class ValidatorListener {
    withContext(context) {
        this._metaEdFileIndex = context.MetaEdFileIndex;
        this._warningMessageCollection = context.WarningMessageCollection;
        this._errorMessageCollection = context.ErrorMessageCollection;
        this._symbolTable = context.SymbolTable;
    }
    validateContext(validationRules, context) {
        validationRules.filter(x => x.level() == ValidationLevel_1.ValidationLevel.Error && !x.isValid(context))
            .forEach(y => this._errorMessageCollection.add(this.buildValidationMessage(y, context)));
        validationRules.filter(x => x.level() == ValidationLevel_1.ValidationLevel.Warning && !x.isValid(context))
            .forEach(y => this._warningMessageCollection.add(this.buildValidationMessage(y, context)));
    }
    buildValidationMessage(validationRule, context) {
        const metaEdFile = this._metaEdFileIndex.getFileAndLineNumber(context.start.line);
        return {
            message: validationRule.getFailureMessage(context),
            characterPosition: context.start.column,
            concatenatedLineNumber: context.start.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
    }
    enterAbstractEntity(context) {
        var validationRules = [new AbstractEntityMustContainAnIdentity_1.AbstractEntityMustContainAnIdentity()];
        this.validateContext(validationRules, context);
    }
}
exports.ValidatorListener = ValidatorListener;
//# sourceMappingURL=ValidatorListener.js.map