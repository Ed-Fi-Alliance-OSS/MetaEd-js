var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var MergePartOfReference;
            (function (MergePartOfReference) {
                class MergeStatementMustStartMergePathWithPropertyName extends ValidationRuleBase {
                    isValid(context) {
                        var parent = __as__(context.Parent, MetaEdGrammar.ReferencePropertyContext);
                        if (parent == null)
                            return false;
                        var referenceName = parent.propertyName().IdText();
                        return context.mergePropertyPath().propertyPath().PropertyPathParts()[0] == referenceName;
                    }
                    getFailureMessage(context) {
                        return "Merge statement must start first property path with the referenced entity name of the current property.";
                    }
                }
                MergePartOfReference.MergeStatementMustStartMergePathWithPropertyName = MergeStatementMustStartMergePathWithPropertyName;
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MergeStatementMustStartMergePathWithPropertyName.js.map