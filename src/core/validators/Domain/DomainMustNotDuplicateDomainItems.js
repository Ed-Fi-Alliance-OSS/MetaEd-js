var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var Domain;
            (function (Domain) {
                class DomainMustNotDuplicateDomainItems extends ValidationRuleBase {
                    static getDuplicateDomainItems(context) {
                        var domainItemNames = context.domainItem().Select(x => x.IdText());
                        return domainItemNames.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
                    }
                    isValid(context) {
                        return !GetDuplicateDomainItems(context).Any();
                    }
                    getFailureMessage(context) {
                        var identifier = context.EntityName();
                        var duplicateDomainItems = GetDuplicateDomainItems(context);
                        return string.Format("Domain '{0}' declares duplicate domain item{2} '{1}'.", identifier, string.Join("', '", duplicateDomainItems), duplicateDomainItems.Count() > 1 ? "s" : string.Empty);
                    }
                }
                Domain.DomainMustNotDuplicateDomainItems = DomainMustNotDuplicateDomainItems;
            })(Domain = Validator.Domain || (Validator.Domain = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainMustNotDuplicateDomainItems.js.map