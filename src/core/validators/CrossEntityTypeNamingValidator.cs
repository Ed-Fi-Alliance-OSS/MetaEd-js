using System.Collections.Generic;
using Antlr4.Runtime;
using Antlr4.Runtime.Tree;
using MetaEd.Common.Services;
using MetaEd.Core.Tasks;
using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator
{
    public class CrossEntityTypeNamingValidator : ISymbolTableBuilderListener
    {
        private readonly ISet<string> _trackedEntityNames = new HashSet<string>();
        private IMetaEdContext _context;

        public void WithContext(IMetaEdContext context)
        {
            _context = context;
        }

        public bool BeforeAddEntity(string candidateEntityType, ITerminalNode candidateEntityName, ParserRuleContext candidateContext)
        {
            // MetaEd extension entities don't define a new identifier
            if (candidateContext.IsExtensionContext()) return true;

            // Domains, Subdomains, Interchanges, enumerations and descriptors don't have standard cross entity naming issues
            if (candidateContext is MetaEdGrammar.DomainContext ||
                candidateContext is MetaEdGrammar.SubdomainContext ||
                candidateContext is MetaEdGrammar.InterchangeContext ||
                candidateContext is MetaEdGrammar.EnumerationContext ||
                candidateContext is MetaEdGrammar.DescriptorContext) return true;

            if (_trackedEntityNames.Contains(candidateEntityName.ToString()))
            {
                var metaEdFile = _context.MetaEdFileIndex.GetFileAndLineNumber(candidateEntityName.Symbol.Line);
                var failure = new ValidationMessage
                                    {
                                        Message = string.Format("{0} named {1} is a duplicate declaration of that name.", candidateEntityType, candidateEntityName),
                                        CharacterPosition = candidateEntityName.Symbol.Column,
                                        ConcatenatedLineNumber = candidateEntityName.Symbol.Line,
                                        FileName = metaEdFile.FileName,
                                        LineNumber = metaEdFile.LineNumber
                                    };
                _context.ErrorMessageCollection.Add(failure);
                return false;
            }

            _trackedEntityNames.Add(candidateEntityName.ToString());
            return true;
        }

        public void Reset()
        {
            _trackedEntityNames.Clear();
        }
    }
}
