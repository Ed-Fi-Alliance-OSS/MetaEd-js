var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var Descriptor;
            (function (Descriptor) {
                class DescriptorMapTypeItemsMustBeUnique extends ValidationRuleBase {
                    static duplicateShortDescriptions(context) {
                        if (context.withMapType() == null)
                            return new Array(0);
                        var shortDescriptions = context.withMapType().enumerationItem().Select(x => x.shortDescription().GetText());
                        return shortDescriptions.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
                    }
                    isValid(context) {
                        return !DuplicateShortDescriptions(context).Any();
                    }
                    getFailureMessage(context) {
                        var identifier = context.descriptorName().GetText();
                        var duplicateShortDescriptions = DuplicateShortDescriptions(context);
                        return string.Format("Descriptor '{0}' declares duplicate item{2} '{1}'.", identifier, string.Join("', '", duplicateShortDescriptions), duplicateShortDescriptions.Count() > 1 ? "s" : string.Empty);
                    }
                }
                Descriptor.DescriptorMapTypeItemsMustBeUnique = DescriptorMapTypeItemsMustBeUnique;
            })(Descriptor = Validator.Descriptor || (Validator.Descriptor = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DescriptorMapTypeItemsMustBeUnique.js.map