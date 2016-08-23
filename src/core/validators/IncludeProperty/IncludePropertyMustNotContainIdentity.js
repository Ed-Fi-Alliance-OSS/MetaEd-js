var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var IncludeProperty;
            (function (IncludeProperty) {
                class IncludePropertyMustNotContainIdentity extends ValidationRuleBase {
                    isValid(context) {
                        return context.propertyComponents().propertyAnnotation().identity() == null;
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return string.Format("Include property '{0}' is invalid to be used for the identity of {1} '{2}'", context.propertyName().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName());
                    }
                }
                IncludeProperty.IncludePropertyMustNotContainIdentity = IncludePropertyMustNotContainIdentity;
            })(IncludeProperty = Validator.IncludeProperty || (Validator.IncludeProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IncludePropertyMustNotContainIdentity.js.map