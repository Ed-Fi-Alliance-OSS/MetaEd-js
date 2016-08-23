using;
System.Collections.Generic;
using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var MetaEdId;
            (function (MetaEdId) {
                class MustNotDuplicateMetaEdId {
                }
                ValidationRuleBase < MetaEdGrammar.MetaEdIdContext >
                    {
                        readonly: ISet < string > _trackedMetaEdIds, new: HashSet(),
                        override: bool, IsValid(MetaEdGrammar, MetaEdIdContext = context) {
                            string;
                            metaEdId = context.GetValue();
                            return _trackedMetaEdIds.Add(metaEdId);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, MetaEdIdContext = context) {
                            string;
                            metaEdId = context.GetValue();
                            return;
                            string.Format("MetaEdId '{0}' exists on multiple entities.  All MetaEdIds must be globally unique.", metaEdId);
                        }
                    };
            })(MetaEdId = Validator.MetaEdId || (Validator.MetaEdId = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MustNotDuplicateMetaEdId.js.map