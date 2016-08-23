using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.DescriptorProperty
{
    public class DescriptorPropertyMustMatchADescriptor : ValidationRuleBase<MetaEdGrammar.DescriptorPropertyContext>
    {
        private readonly ISymbolTable _symbolTable;

        public DescriptorPropertyMustMatchADescriptor(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.DescriptorPropertyContext context)
        {
            var identifierToMatch = context.propertyName().GetText();
            var descriptorType = MetaEdGrammar.TokenName(MetaEdGrammar.DESCRIPTOR_ENTITY);

            return _symbolTable.IdentifierExists(descriptorType, identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.DescriptorPropertyContext context)
        {
            return string.Format("Descriptor property '{0}' does not match any declared descriptor.", context.propertyName().GetText());
        }
    }
}
