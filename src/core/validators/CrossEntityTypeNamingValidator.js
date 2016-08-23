var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
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
                    if (candidateContext instanceof MetaEdGrammar.DomainContext || candidateContext instanceof MetaEdGrammar.SubdomainContext || candidateContext instanceof MetaEdGrammar.InterchangeContext || candidateContext instanceof MetaEdGrammar.EnumerationContext || candidateContext instanceof MetaEdGrammar.DescriptorContext)
                        return true;
                    if (this._trackedEntityNames.Contains(candidateEntityName.ToString())) {
                        var metaEdFile = this._context.MetaEdFileIndex.GetFileAndLineNumber(candidateEntityName.Symbol.Line);
                        var failure = __init(new ValidationMessage(), {
                            Message: string.Format("{0} named {1} is a duplicate declaration of that name.", candidateEntityType, candidateEntityName),
                            CharacterPosition: candidateEntityName.Symbol.Column,
                            ConcatenatedLineNumber: candidateEntityName.Symbol.Line,
                            FileName: metaEdFile.FileName,
                            LineNumber: metaEdFile.LineNumber
                        });
                        this._context.ErrorMessageCollection.Add(failure);
                        return false;
                    }
                    this._trackedEntityNames.Add(candidateEntityName.ToString());
                    return true;
                }
                reset() {
                    this._trackedEntityNames.Clear();
                }
            }
            Validator.CrossEntityTypeNamingValidator = CrossEntityTypeNamingValidator;
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CrossEntityTypeNamingValidator.js.map