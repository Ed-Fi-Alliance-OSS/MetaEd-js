var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DomainEntity;
            (function (DomainEntity) {
                class DomainEntityMustContainNoMoreThanOneUniqueIdColumn extends ValidationRuleBase {
                    isValid(context) {
                        var namespaceInfo = context.GetAncestorContext();
                        return namespaceInfo.IsExtension || context.property().Count(x => x.GetProperty().PropertyName() == "UniqueId") <= 1;
                    }
                    getFailureMessage(context) {
                        return string.Format("Domain Entity {0} has multiple properties with a property name of 'UniqueId'.  Only one column in a core domain entity can be named 'UniqueId'.", context.entityName().ID().GetText());
                    }
                }
                DomainEntity.DomainEntityMustContainNoMoreThanOneUniqueIdColumn = DomainEntityMustContainNoMoreThanOneUniqueIdColumn;
            })(DomainEntity = Validator.DomainEntity || (Validator.DomainEntity = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityMustContainNoMoreThanOneUniqueIdColumn.js.map