using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.Interchange
{
    public class InterchangeMustNotDuplicateIdentityTemplateName : ValidationRuleBase<MetaEdGrammar.InterchangeContext>
    {
        private readonly ISymbolTable _symbolTable;

        public InterchangeMustNotDuplicateIdentityTemplateName(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        private static string[] DuplicateIdentityTemplates(MetaEdGrammar.InterchangeContext context)
        {
            var identityTemplates = context.interchangeComponent().interchangeIdentityTemplate().Select(x => x.ID().GetText());

            //group and filter duplicates
            return identityTemplates.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
        }

        public override bool IsValid(MetaEdGrammar.InterchangeContext context)
        {
            return !DuplicateIdentityTemplates(context).Any();
        }

        public override string GetFailureMessage(MetaEdGrammar.InterchangeContext context)
        {
            var identifier = context.interchangeName().GetText();
            var duplicateIdentityTemplates = DuplicateIdentityTemplates(context);

            return string.Format("Interchange '{0}' declares duplicate identity template{2} '{1}'.", identifier, string.Join("', '", duplicateIdentityTemplates), duplicateIdentityTemplates.Count() > 1 ? "s" : string.Empty);
        }
    }
}
