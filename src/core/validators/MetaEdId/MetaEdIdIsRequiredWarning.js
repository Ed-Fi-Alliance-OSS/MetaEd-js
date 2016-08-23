var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var MetaEdId;
            (function (MetaEdId) {
                class MetaEdIdIsRequiredWarning {
                    get level() {
                        return ValidationLevel.Warning;
                    }
                    isValid(context) {
                        return context != null && !string.IsNullOrWhiteSpace(context.GetValue());
                    }
                    getEntityFailureMessage(entityIdentifier, entityName) {
                        return string.Format("{0} '{1}' is missing MetaEdId value.", entityIdentifier, entityName);
                    }
                    getPropertyFailureMessage(entityIdentifier, entityName, propertyIdentifier, propertyName) {
                        return string.Format("{0} '{1}' on {2} '{3}' is missing MetaEdId value.", propertyIdentifier, propertyName, entityIdentifier, entityName);
                    }
                    getItemFailureMessage(entityIdentifier, entityName, itemName) {
                        return string.Format("Enumeration Item '{0}' on {1} '{2} is missing MetaEdId value.", itemName, entityIdentifier, entityName);
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    isValid(context) {
                        return IsValid(context.metaEdId());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.PropertyIdentifier(), context.PropertyName());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetItemFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.IdText());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetItemFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.IdText());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetItemFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.IdText());
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return GetItemFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.IdText());
                    }
                }
                MetaEdId.MetaEdIdIsRequiredWarning = MetaEdIdIsRequiredWarning;
            })(MetaEdId = Validator.MetaEdId || (Validator.MetaEdId = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=MetaEdIdIsRequiredWarning.js.map