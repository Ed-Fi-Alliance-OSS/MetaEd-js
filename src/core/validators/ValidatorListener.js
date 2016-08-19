/// <reference path="../../../src/grammar/gen/MetaEdGrammar.d.ts" />
/// <reference path="../../../src/grammar/gen/MetaEdGrammarListener.d.ts" />
"use strict";
const MetaEdGrammarListener_1 = require('../../../src/grammar/gen/MetaEdGrammarListener');
const ValidationLevel_1 = require("./ValidationLevel");
class ValidatorListener extends MetaEdGrammarListener_1.MetaEdGrammarListener {
    constructor(ruleProvider) {
        super();
        this.ruleProvider = ruleProvider;
    }
    withContext(context) {
        this.metaEdFileIndex = context.metaEdFileIndex;
        this.warningMessageCollection = context.warningMessageCollection;
        this.errorMessageCollection = context.errorMessageCollection;
        this.symbolTable = context.symbolTable;
    }
    validateContext(context) {
        const validationRules = this.ruleProvider.getAll(this.symbolTable);
        validationRules.filter(x => x.level() == ValidationLevel_1.ValidationLevel.Error && !x.isValid(context))
            .forEach(y => this.errorMessageCollection.add(this.buildValidationMessage(y, context)));
        validationRules.filter(x => x.level() == ValidationLevel_1.ValidationLevel.Warning && !x.isValid(context))
            .forEach(y => this.warningMessageCollection.add(this.buildValidationMessage(y, context)));
    }
    buildValidationMessage(validationRule, context) {
        const metaEdFile = this.metaEdFileIndex.getFileAndLineNumber(context.start.line);
        return {
            message: validationRule.getFailureMessage(context),
            characterPosition: context.start.column,
            concatenatedLineNumber: context.start.line,
            fileName: metaEdFile.fileName,
            lineNumber: metaEdFile.lineNumber
        };
    }
    enterAbstractEntity(context) {
        this.validateContext(context);
    }
}
exports.ValidatorListener = ValidatorListener;
//# sourceMappingURL=ValidatorListener.js.map