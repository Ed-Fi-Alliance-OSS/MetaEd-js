var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DomainEntitySubclass;
            (function (DomainEntitySubclass) {
                class DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identityRenames = context.property().Where(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null).Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename());
                        if (!identityRenames.Any())
                            return true;
                        var entityType = context.DOMAIN_ENTITY().GetText();
                        var baseIdentifier = context.baseName().GetText();
                        var basePropertyIdentifier = identityRenames.First().baseKeyName().GetText();
                        var baseSymbolTable = this._symbolTable.Get(entityType, baseIdentifier);
                        if (baseSymbolTable == null)
                            return true;
                        var baseProperty = baseSymbolTable.PropertySymbolTable.Get(basePropertyIdentifier);
                        if (baseProperty == null)
                            return false;
                        return baseProperty.propertyComponents().propertyAnnotation().identity() != null;
                    }
                    getFailureMessage(context) {
                        var identifier = context.entityName().GetText();
                        var baseIdentifier = context.baseName().GetText();
                        var identityRenames = context.property().Where(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null).Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename());
                        var basePropertyIdentifier = identityRenames.First().baseKeyName().GetText();
                        return string.Format("DomainEntity '{0}' based on '{1}' tries to rename {2} which is not part of the identity.", identifier, baseIdentifier, basePropertyIdentifier);
                    }
                }
                DomainEntitySubclass.DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass = DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass;
            })(DomainEntitySubclass = Validator.DomainEntitySubclass || (Validator.DomainEntitySubclass = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass.js.map