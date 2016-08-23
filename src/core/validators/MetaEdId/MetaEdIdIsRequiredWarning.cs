using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.MetaEdId
{
    public class MetaEdIdIsRequiredWarning :
        IValidationRule<MetaEdGrammar.AbstractEntityContext>,
        IValidationRule<MetaEdGrammar.AssociationContext>,
        IValidationRule<MetaEdGrammar.AssociationExtensionContext>,
        IValidationRule<MetaEdGrammar.AssociationSubclassContext>,
        IValidationRule<MetaEdGrammar.BooleanPropertyContext>,
        IValidationRule<MetaEdGrammar.ChoiceTypeContext>,
        IValidationRule<MetaEdGrammar.CommonDecimalContext>,
        IValidationRule<MetaEdGrammar.CommonIntegerContext>,
        IValidationRule<MetaEdGrammar.CommonShortContext>,
        IValidationRule<MetaEdGrammar.CommonStringContext>,
        IValidationRule<MetaEdGrammar.CommonTypeContext>,
        IValidationRule<MetaEdGrammar.CommonTypeExtensionContext>,
        IValidationRule<MetaEdGrammar.CurrencyPropertyContext>,
        IValidationRule<MetaEdGrammar.DatePropertyContext>,
        IValidationRule<MetaEdGrammar.DecimalPropertyContext>,
        IValidationRule<MetaEdGrammar.DescriptorContext>,
        IValidationRule<MetaEdGrammar.DescriptorPropertyContext>,
        IValidationRule<MetaEdGrammar.DomainContext>,
        IValidationRule<MetaEdGrammar.DomainEntityContext>,
        IValidationRule<MetaEdGrammar.DomainItemContext>,
        IValidationRule<MetaEdGrammar.DomainEntityExtensionContext>,
        IValidationRule<MetaEdGrammar.DomainEntitySubclassContext>,
        IValidationRule<MetaEdGrammar.DurationPropertyContext>,
        IValidationRule<MetaEdGrammar.EnumerationContext>,
        IValidationRule<MetaEdGrammar.EnumerationItemContext>,
        IValidationRule<MetaEdGrammar.EnumerationPropertyContext>,
        IValidationRule<MetaEdGrammar.FirstDomainEntityContext>,
        IValidationRule<MetaEdGrammar.IncludePropertyContext>,
        IValidationRule<MetaEdGrammar.InlineCommonTypeContext>,
        IValidationRule<MetaEdGrammar.IntegerPropertyContext>,
        IValidationRule<MetaEdGrammar.InterchangeContext>,
        IValidationRule<MetaEdGrammar.InterchangeElementContext>,
        IValidationRule<MetaEdGrammar.InterchangeExtensionContext>,
        IValidationRule<MetaEdGrammar.InterchangeIdentityTemplateContext>,
        IValidationRule<MetaEdGrammar.PercentPropertyContext>,
        IValidationRule<MetaEdGrammar.ReferencePropertyContext>,
        IValidationRule<MetaEdGrammar.SecondDomainEntityContext>,
        IValidationRule<MetaEdGrammar.SharedDecimalPropertyContext>,
        IValidationRule<MetaEdGrammar.SharedIntegerPropertyContext>,
        IValidationRule<MetaEdGrammar.SharedShortPropertyContext>,
        IValidationRule<MetaEdGrammar.SharedStringPropertyContext>,
        IValidationRule<MetaEdGrammar.ShortPropertyContext>,
        IValidationRule<MetaEdGrammar.StringPropertyContext>,
        IValidationRule<MetaEdGrammar.SubdomainContext>,
        IValidationRule<MetaEdGrammar.TimePropertyContext>,
        IValidationRule<MetaEdGrammar.YearPropertyContext>
    {

        public ValidationLevel Level { get { return ValidationLevel.Warning; } }

        private bool IsValid(MetaEdGrammar.MetaEdIdContext context)
        {
            return context != null && !string.IsNullOrWhiteSpace(context.GetValue());
        }

        private string GetEntityFailureMessage(string entityIdentifier, string entityName)
        {
            return
                string.Format(
                    "{0} '{1}' is missing MetaEdId value.",
                    entityIdentifier,
                    entityName);
        }

        private string GetPropertyFailureMessage(string entityIdentifier, string entityName, string propertyIdentifier, string propertyName)
        {
            return
                string.Format(
                    "{0} '{1}' on {2} '{3}' is missing MetaEdId value.",
                    propertyIdentifier,
                    propertyName,
                    entityIdentifier,
                    entityName);
        }

        private string GetItemFailureMessage(string entityIdentifier, string entityName, string itemName)
        {
            return
                string.Format(
                    "Enumeration Item '{0}' on {1} '{2} is missing MetaEdId value.",
                    itemName,
                    entityIdentifier,
                    entityName);
        }

        #region IsValid Passthrough
        public bool IsValid(MetaEdGrammar.YearPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.TimePropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.SubdomainContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.StringPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.ShortPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.SharedStringPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.SharedShortPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.SharedIntegerPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.SharedDecimalPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.SecondDomainEntityContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.ReferencePropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.PercentPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.EnumerationItemContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.InterchangeIdentityTemplateContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.InterchangeExtensionContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.InterchangeElementContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.InterchangeContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.IntegerPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.InlineCommonTypeContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.IncludePropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.FirstDomainEntityContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.EnumerationPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.EnumerationContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.DurationPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.DomainItemContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.DomainEntitySubclassContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.DomainEntityExtensionContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.DomainEntityContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.DomainContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.DescriptorPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.DescriptorContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.DecimalPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.DatePropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.CurrencyPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.CommonTypeExtensionContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.CommonTypeContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.CommonStringContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.CommonShortContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.CommonIntegerContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.CommonDecimalContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.ChoiceTypeContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.BooleanPropertyContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.AssociationSubclassContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.AssociationExtensionContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.AssociationContext context)
        {
            return IsValid(context.metaEdId());
        }

        public bool IsValid(MetaEdGrammar.AbstractEntityContext context)
        {
            return IsValid(context.metaEdId());
        }
        #endregion

        #region Entity Failure Messages
        public string GetFailureMessage(MetaEdGrammar.AbstractEntityContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.SubdomainContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.InterchangeExtensionContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.InterchangeContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.InlineCommonTypeContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.EnumerationContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.DomainEntitySubclassContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.DomainEntityExtensionContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.DomainEntityContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.DomainContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.DescriptorContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.CommonTypeExtensionContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.CommonTypeContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.CommonStringContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.CommonShortContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.CommonIntegerContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.CommonDecimalContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.ChoiceTypeContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.AssociationSubclassContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.AssociationExtensionContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }

        public string GetFailureMessage(MetaEdGrammar.AssociationContext context)
        {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        #endregion

        #region Property Failure Messages
        public string GetFailureMessage(MetaEdGrammar.BooleanPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.CurrencyPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.DatePropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.DecimalPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.DescriptorPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.DurationPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.EnumerationPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.FirstDomainEntityContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.IncludePropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.IntegerPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.PercentPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.ReferencePropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.SecondDomainEntityContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.SharedDecimalPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.SharedIntegerPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.SharedShortPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.SharedStringPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.ShortPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.StringPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.TimePropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }

        public string GetFailureMessage(MetaEdGrammar.YearPropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        #endregion

        public string GetFailureMessage(MetaEdGrammar.EnumerationItemContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetItemFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.IdText());
        }

        public string GetFailureMessage(MetaEdGrammar.InterchangeElementContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetItemFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.IdText());
        }

        public string GetFailureMessage(MetaEdGrammar.InterchangeIdentityTemplateContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetItemFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.IdText());
        }

        public string GetFailureMessage(MetaEdGrammar.DomainItemContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetItemFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.IdText());
        }
    }
}