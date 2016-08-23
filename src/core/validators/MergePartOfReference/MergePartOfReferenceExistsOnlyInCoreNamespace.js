using;
MetaEd.Grammar.Antlr;
using;
MetaEd.Grammar.Antlr.Extensions;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var MergePartOfReference;
            (function (MergePartOfReference) {
                class MergePartOfReferenceExistsOnlyInCoreNamespace {
                }
                ValidationRuleBase < MetaEdGrammar.MergePartOfReferenceContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, MergePartOfReferenceContext = context) {
                            var namespaceInfo = context.GetAncestorContext();
                            return !namespaceInfo.IsExtension;
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, MergePartOfReferenceContext = context) {
                            var namespaceInfo = context.GetAncestorContext();
                            var topLevelEntity = context.GetAncestorContext();
                            var propertyWithComponents = context.GetAncestorContext();
                            return;
                            string.Format("'merge' is invalid for property {0} on {1} '{2}' in extension namespace {3}.  'merge' is only valid for properties on types in a core namespace.", propertyWithComponents.IdNode().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), namespaceInfo.NamespaceName);
                        }
                    };
            })(MergePartOfReference = Validator.MergePartOfReference || (Validator.MergePartOfReference = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MergePartOfReferenceExistsOnlyInCoreNamespace.js.map