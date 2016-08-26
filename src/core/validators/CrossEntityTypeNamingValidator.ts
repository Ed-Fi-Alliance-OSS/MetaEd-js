import { ValidationRuleBase } from "./ValidationRuleBase";
import ValidationMessage from "../../common/ValidationMessage"
import {ISymbolTableBuilderListener, ITerminalNode} from "./ISymbolTableBuilderListener"
import {IMetaEdContext} from "../tasks/MetaEdContext"
import ParserRuleContext = MetaEdGrammar.ParserRuleContext;

export class CrossEntityTypeNamingValidator implements ISymbolTableBuilderListener {
    private _trackedEntityNames: ISet<string> = new HashSet<string>();
    private _context: IMetaEdContext;
    public withContext(context: IMetaEdContext): void {
        this._context = context;
    }
    public beforeAddEntity(candidateEntityType: string, candidateEntityName: ITerminalNode, candidateContext: ParserRuleContext): boolean {
        if (candidateContext.IsExtensionContext())
            return true;
        if (candidateContext instanceof MetaEdGrammar.DomainContext
            || candidateContext instanceof MetaEdGrammar.SubdomainContext
            || candidateContext instanceof MetaEdGrammar.InterchangeContext
            || candidateContext instanceof MetaEdGrammar.EnumerationContext
            || candidateContext instanceof MetaEdGrammar.DescriptorContext)
            return true;

        if (this._trackedEntityNames.Contains(candidateEntityName.ToString())) {
            let metaEdFile = this._context.metaEdFileIndex.getFileAndLineNumber(candidateEntityName.Symbol.Line);
            let failure: ValidationMessage = {
                message: `${candidateEntityType} named ${candidateEntityName} is a duplicate declaration of that name.`,
                characterPosition: candidateEntityName.Symbol.Column,
                concatenatedLineNumber: candidateEntityName.Symbol.Line,
                fileName: metaEdFile.fileName,
                lineNumber: metaEdFile.lineNumber
            };
            this._context.errorMessageCollection.add(failure);
            return false;
        }
        this._trackedEntityNames.Add(candidateEntityName.ToString());
        return true;
    }
    public reset(): void {
        this._trackedEntityNames.Clear();
    }
}
