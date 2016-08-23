var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var MergePartOfReference;
            (function (MergePartOfReference) {
                class MergePartOfReferenceExistsOnlyInCoreNamespace extends ValidationRuleBase {
                    isValid(context) {
                        var namespaceInfo = context.GetAncestorContext();
                        return !namespaceInfo.IsExtension;
                    }
                    getFailureMessage(context) {
                        var namespaceInfo = context.GetAncestorContext();
                        var topLevelEntity = context.GetAncestorContext();
                        var propertyWithComponents = context.GetAncestorContext();
                        return string.Format("'merge' is invalid for property {0} on {1} '{2}' in extension namespace {3}.  'merge' is only valid for properties on types in a core namespace.", propertyWithComponents.IdNode().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), namespaceInfo.NamespaceName);
                    }
                }
                MergePartOfReference.MergePartOfReferenceExistsOnlyInCoreNamespace = MergePartOfReferenceExistsOnlyInCoreNamespace;
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MergePartOfReferenceExistsOnlyInCoreNamespace.js.map