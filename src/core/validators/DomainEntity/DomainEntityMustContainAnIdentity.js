var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DomainEntity;
            (function (DomainEntity) {
                class DomainEntityMustContainAnIdentity extends ValidationRuleBase {
                    isValid(context) {
                        return context.property().Any(x => x.GetProperty().propertyComponents().propertyAnnotation().identity() != null);
                    }
                    getFailureMessage(context) {
                        return string.Format("Domain Entity {0} does not have an identity specified.", context.entityName().ID().GetText());
                    }
                }
                DomainEntity.DomainEntityMustContainAnIdentity = DomainEntityMustContainAnIdentity;
            })(DomainEntity = Validator.DomainEntity || (Validator.DomainEntity = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityMustContainAnIdentity.js.map