var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var InlineCommonType;
            (function (InlineCommonType) {
                class InlineCommonTypeExistsOnlyInCoreNamespace extends ValidationRuleBase {
                    isValid(context) {
                        var namespaceInfo = context.GetAncestorContext();
                        return !namespaceInfo.IsExtension;
                    }
                    getFailureMessage(context) {
                        var namespaceInfo = context.GetAncestorContext();
                        return string.Format("Inline Common Type '{0}' is not valid in extension namespace '{1}'.", context.EntityName(), namespaceInfo.NamespaceName);
                    }
                }
                InlineCommonType.InlineCommonTypeExistsOnlyInCoreNamespace = InlineCommonTypeExistsOnlyInCoreNamespace;
            })(InlineCommonType = Validator.InlineCommonType || (Validator.InlineCommonType = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InlineCommonTypeExistsOnlyInCoreNamespace.js.map