using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var MergePartOfReference;
            (function (MergePartOfReference) {
                class MergeStatementMustStartMergePathWithPropertyName {
                }
                ValidationRuleBase < MetaEdGrammar.MergePartOfReferenceContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, MergePartOfReferenceContext = context) {
                            var parent = context.Parent;
                            if (parent == null)
                                return false;
                            var referenceName = parent.propertyName().IdText();
                            return context.mergePropertyPath().propertyPath().PropertyPathParts()[0] == referenceName;
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, MergePartOfReferenceContext = context) {
                            return "Merge statement must start first property path with the referenced entity name of the current property.";
                        }
                    };
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MergeStatementMustStartMergePathWithPropertyName.js.map