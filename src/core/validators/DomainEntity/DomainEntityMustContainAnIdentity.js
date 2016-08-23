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
            var DomainEntity;
            (function (DomainEntity) {
                class DomainEntityMustContainAnIdentity {
                }
                ValidationRuleBase < MetaEdGrammar.DomainEntityContext >
                    {
                        override: bool, IsValid(MetaEdGrammar, DomainEntityContext = context) {
                            return context.property().Any(x => x.GetProperty().propertyComponents().propertyAnnotation().identity() != null);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, DomainEntityContext = context) {
                            return string.Format("Domain Entity {0} does not have an identity specified.", context.entityName().ID().GetText());
                        }
                    };
            })(DomainEntity = Validator.DomainEntity || (Validator.DomainEntity = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityMustContainAnIdentity.js.map