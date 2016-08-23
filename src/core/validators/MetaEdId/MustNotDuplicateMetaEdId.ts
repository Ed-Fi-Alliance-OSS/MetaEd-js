using System.Collections.Generic;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.MetaEdId
{
    public class MustNotDuplicateMetaEdId : ValidationRuleBase<MetaEdGrammar.MetaEdIdContext>
    {
        private readonly ISet<string> _trackedMetaEdIds = new HashSet<string>();

        public override bool IsValid(MetaEdGrammar.MetaEdIdContext context)
        {
            string metaEdId = context.GetValue();
            return _trackedMetaEdIds.Add(metaEdId);
        }

        public override string GetFailureMessage(MetaEdGrammar.MetaEdIdContext context)
        {
            string metaEdId = context.GetValue();
            return
                string.Format(
                    "MetaEdId '{0}' exists on multiple entities.  All MetaEdIds must be globally unique.",
                    metaEdId);
        }
    }
}