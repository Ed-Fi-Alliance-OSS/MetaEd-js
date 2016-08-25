import { ValidationRuleBase } from "../ValidationRuleBase";
export class CrossEntityTypeNamingValidator implements ISymbolTableBuilderListener {
    private _trackedEntityNames: ISet<string> = new HashSet<string>();
    private _context: IMetaEdContext;
    public withContext(context: IMetaEdContext): void {
        this._context = context;
    }
    public beforeAddEntity(candidateEntityType: string, candidateEntityName: ITerminalNode, candidateContext: ParserRuleContext): boolean {
        if (candidateContext.IsExtensionContext())
            return true;
        if (candidateContext instanceof MetaEdGrammar.DomainContext || candidateContext instanceof MetaEdGrammar.SubdomainContext || candidateContext instanceof MetaEdGrammar.InterchangeContext || candidateContext instanceof MetaEdGrammar.EnumerationContext || candidateContext instanceof MetaEdGrammar.DescriptorContext)
            return true;
        if (this._trackedEntityNames.Contains(candidateEntityName.ToString())) {
            var metaEdFile = this._context.MetaEdFileIndex.GetFileAndLineNumber(candidateEntityName.Symbol.Line);
            var failure = __init(new ValidationMessage(), {
                Message: `${candidateEntityType} named ${candidateEntityName} is a duplicate declaration of that name.`,
                CharacterPosition: candidateEntityName.Symbol.Column,
                ConcatenatedLineNumber: candidateEntityName.Symbol.Line,
                FileName: metaEdFile.FileName,
                LineNumber: metaEdFile.LineNumber
            });
            this._context.ErrorMessageCollection.Add(failure);
            return false;
        }
        this._trackedEntityNames.Add(candidateEntityName.ToString());
        return true;
    }
    public reset(): void {
        this._trackedEntityNames.Clear();
    }
}
