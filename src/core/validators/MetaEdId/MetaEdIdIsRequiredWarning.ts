module MetaEd.Core.Validator.MetaEdId {
    export class MetaEdIdIsRequiredWarning implements IValidationRule<MetaEdGrammar.AbstractEntityContext>, IValidationRule<MetaEdGrammar.AssociationContext>, IValidationRule<MetaEdGrammar.AssociationExtensionContext>, IValidationRule<MetaEdGrammar.AssociationSubclassContext>, IValidationRule<MetaEdGrammar.BooleanPropertyContext>, IValidationRule<MetaEdGrammar.ChoiceTypeContext>, IValidationRule<MetaEdGrammar.CommonDecimalContext>, IValidationRule<MetaEdGrammar.CommonIntegerContext>, IValidationRule<MetaEdGrammar.CommonShortContext>, IValidationRule<MetaEdGrammar.CommonStringContext>, IValidationRule<MetaEdGrammar.CommonTypeContext>, IValidationRule<MetaEdGrammar.CommonTypeExtensionContext>, IValidationRule<MetaEdGrammar.CurrencyPropertyContext>, IValidationRule<MetaEdGrammar.DatePropertyContext>, IValidationRule<MetaEdGrammar.DecimalPropertyContext>, IValidationRule<MetaEdGrammar.DescriptorContext>, IValidationRule<MetaEdGrammar.DescriptorPropertyContext>, IValidationRule<MetaEdGrammar.DomainContext>, IValidationRule<MetaEdGrammar.DomainEntityContext>, IValidationRule<MetaEdGrammar.DomainItemContext>, IValidationRule<MetaEdGrammar.DomainEntityExtensionContext>, IValidationRule<MetaEdGrammar.DomainEntitySubclassContext>, IValidationRule<MetaEdGrammar.DurationPropertyContext>, IValidationRule<MetaEdGrammar.EnumerationContext>, IValidationRule<MetaEdGrammar.EnumerationItemContext>, IValidationRule<MetaEdGrammar.EnumerationPropertyContext>, IValidationRule<MetaEdGrammar.FirstDomainEntityContext>, IValidationRule<MetaEdGrammar.IncludePropertyContext>, IValidationRule<MetaEdGrammar.InlineCommonTypeContext>, IValidationRule<MetaEdGrammar.IntegerPropertyContext>, IValidationRule<MetaEdGrammar.InterchangeContext>, IValidationRule<MetaEdGrammar.InterchangeElementContext>, IValidationRule<MetaEdGrammar.InterchangeExtensionContext>, IValidationRule<MetaEdGrammar.InterchangeIdentityTemplateContext>, IValidationRule<MetaEdGrammar.PercentPropertyContext>, IValidationRule<MetaEdGrammar.ReferencePropertyContext>, IValidationRule<MetaEdGrammar.SecondDomainEntityContext>, IValidationRule<MetaEdGrammar.SharedDecimalPropertyContext>, IValidationRule<MetaEdGrammar.SharedIntegerPropertyContext>, IValidationRule<MetaEdGrammar.SharedShortPropertyContext>, IValidationRule<MetaEdGrammar.SharedStringPropertyContext>, IValidationRule<MetaEdGrammar.ShortPropertyContext>, IValidationRule<MetaEdGrammar.StringPropertyContext>, IValidationRule<MetaEdGrammar.SubdomainContext>, IValidationRule<MetaEdGrammar.TimePropertyContext>, IValidationRule<MetaEdGrammar.YearPropertyContext>
    {
        public get level(): ValidationLevel {
            return ValidationLevel.Warning;
        }
        private isValid(context: MetaEdGrammar.MetaEdIdContext): boolean {
            return context != null && !string.IsNullOrWhiteSpace(context.GetValue());
        }
        private getEntityFailureMessage(entityIdentifier: string, entityName: string): string {
            return string.Format("{0} '{1}' is missing MetaEdId value.",
                entityIdentifier,
                entityName);
        }
        private getPropertyFailureMessage(entityIdentifier: string, entityName: string, propertyIdentifier: string, propertyName: string): string {
            return string.Format("{0} '{1}' on {2} '{3}' is missing MetaEdId value.",
                propertyIdentifier,
                propertyName,
                entityIdentifier,
                entityName);
        }
        private getItemFailureMessage(entityIdentifier: string, entityName: string, itemName: string): string {
            return string.Format("Enumeration Item '{0}' on {1} '{2} is missing MetaEdId value.",
                itemName,
                entityIdentifier,
                entityName);
        }
        public isValid(context: MetaEdGrammar.YearPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.TimePropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.SubdomainContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.StringPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.ShortPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.SharedStringPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.SharedShortPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.SharedIntegerPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.SharedDecimalPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.SecondDomainEntityContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.ReferencePropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.PercentPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.EnumerationItemContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.InterchangeIdentityTemplateContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.InterchangeExtensionContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.InterchangeElementContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.InterchangeContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.IntegerPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.InlineCommonTypeContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.IncludePropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.FirstDomainEntityContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.EnumerationPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.EnumerationContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.DurationPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.DomainItemContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.DomainEntitySubclassContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.DomainEntityExtensionContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.DomainEntityContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.DomainContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.DescriptorPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.DescriptorContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.DecimalPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.DatePropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.CurrencyPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.CommonTypeExtensionContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.CommonTypeContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.CommonStringContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.CommonShortContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.CommonIntegerContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.CommonDecimalContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.ChoiceTypeContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.BooleanPropertyContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.AssociationSubclassContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.AssociationExtensionContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.AssociationContext): boolean {
            return IsValid(context.metaEdId());
        }
        public isValid(context: MetaEdGrammar.AbstractEntityContext): boolean {
            return IsValid(context.metaEdId());
        }
        public getFailureMessage(context: MetaEdGrammar.AbstractEntityContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.SubdomainContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.InterchangeExtensionContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.InterchangeContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.InlineCommonTypeContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.EnumerationContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.DomainEntitySubclassContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.DomainEntityExtensionContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.DomainEntityContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.DomainContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.DescriptorContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.CommonTypeExtensionContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.CommonTypeContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.CommonStringContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.CommonShortContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.CommonIntegerContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.CommonDecimalContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.ChoiceTypeContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.AssociationSubclassContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.AssociationExtensionContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.AssociationContext): string {
            return GetEntityFailureMessage(context.EntityIdentifier(), context.EntityName());
        }
        public getFailureMessage(context: MetaEdGrammar.BooleanPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.CurrencyPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.DatePropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.DecimalPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.DescriptorPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.DurationPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.EnumerationPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.FirstDomainEntityContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.IncludePropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.IntegerPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.PercentPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.ReferencePropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.SecondDomainEntityContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.SharedDecimalPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.SharedIntegerPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.SharedShortPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.SharedStringPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.ShortPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.StringPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.TimePropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.YearPropertyContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetPropertyFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(),
                context.PropertyIdentifier(), context.PropertyName());
        }
        public getFailureMessage(context: MetaEdGrammar.EnumerationItemContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetItemFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.IdText());
        }
        public getFailureMessage(context: MetaEdGrammar.InterchangeElementContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetItemFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.IdText());
        }
        public getFailureMessage(context: MetaEdGrammar.InterchangeIdentityTemplateContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetItemFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.IdText());
        }
        public getFailureMessage(context: MetaEdGrammar.DomainItemContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return GetItemFailureMessage(topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), context.IdText());
        }
    }
}