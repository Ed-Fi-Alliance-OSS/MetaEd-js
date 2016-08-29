"use strict";
class CrossEntityTypeNamingValidator {
    constructor() {
        this._trackedEntityNames = new HashSet();
    }
    withContext(context) {
        this._context = context;
    }
    beforeAddEntity(candidateEntityType, candidateEntityName, candidateContext) {
        if (candidateContext.IsExtensionContext())
            return true;
        if (candidateContext instanceof MetaEdGrammar.DomainContext
            || candidateContext instanceof MetaEdGrammar.SubdomainContext
            || candidateContext instanceof MetaEdGrammar.InterchangeContext
            || candidateContext instanceof MetaEdGrammar.EnumerationContext
            || candidateContext instanceof MetaEdGrammar.DescriptorContext)
            return true;
        if (this._trackedEntityNames.Contains(candidateEntityName.ToString())) {
            let metaEdFile = this._context.metaEdFileIndex.getFileAndLineNumber(candidateEntityName.Symbol.Line);
            let failure = {
                message: `${candidateEntityType} named ${candidateEntityName} is a duplicate declaration of that name.`,
                characterPosition: candidateEntityName.Symbol.Column,
                concatenatedLineNumber: candidateEntityName.Symbol.Line,
                fileName: metaEdFile.fileName,
                lineNumber: metaEdFile.lineNumber
            };
            this._context.errorMessageCollection.push(failure);
            return false;
        }
        this._trackedEntityNames.Add(candidateEntityName.ToString());
        return true;
    }
    reset() {
        this._trackedEntityNames.Clear();
    }
}
exports.CrossEntityTypeNamingValidator = CrossEntityTypeNamingValidator;
//# sourceMappingURL=CrossEntityTypeNamingValidator.js.map