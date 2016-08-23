using;
System.Linq;
using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DomainEntitySubclass;
            (function (DomainEntitySubclass) {
                class DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce {
                }
                ValidationRuleBase < MetaEdGrammar.DomainEntitySubclassContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, DomainEntitySubclassContext = context) {
                            var identityRenameCount = context.property()
                                .Count(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null);
                            return identityRenameCount <= 1;
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, DomainEntitySubclassContext = context) {
                            var identifier = context.entityName().GetText();
                            var baseIdentifier = context.baseName().GetText();
                            var identityRenames = context.property()
                                .Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename())
                                .Where(x => x != null);
                            var basePropertyIdentifier = string.Join(", ", identityRenames.Select(pkr => pkr.baseKeyName().GetText()));
                            return string.Format("Domain Entity '{0}' based on '{1}' tries to rename columns {2}.  Only one identity rename is allowed for a given Domain Entity.", identifier, baseIdentifier, basePropertyIdentifier);
                        }
                    };
            })(DomainEntitySubclass = Validator.DomainEntitySubclass || (Validator.DomainEntitySubclass = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce.js.map