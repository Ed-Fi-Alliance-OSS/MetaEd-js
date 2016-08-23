var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var MetaEdId;
            (function (MetaEdId) {
                class MustNotDuplicateMetaEdId extends ValidationRuleBase {
                    constructor(...args) {
                        super(...args);
                        this._trackedMetaEdIds = new HashSet();
                    }
                    isValid(context) {
                        var metaEdId = context.GetValue();
                        return this._trackedMetaEdIds.Add(metaEdId);
                    }
                    getFailureMessage(context) {
                        var metaEdId = context.GetValue();
                        return string.Format("MetaEdId '{0}' exists on multiple entities.  All MetaEdIds must be globally unique.", metaEdId);
                    }
                }
                MetaEdId.MustNotDuplicateMetaEdId = MustNotDuplicateMetaEdId;
            })(MetaEdId = Validator.MetaEdId || (Validator.MetaEdId = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MustNotDuplicateMetaEdId.js.map