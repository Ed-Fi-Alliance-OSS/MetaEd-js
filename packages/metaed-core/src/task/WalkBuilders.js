// @flow
import antlr4 from 'antlr4';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';
import type { State } from '../State';
import { nextMacroTask } from './NextMacroTask';
import { AssociationBuilder } from '../builder/AssociationBuilder';
import { AssociationExtensionBuilder } from '../builder/AssociationExtensionBuilder';
import { AssociationSubclassBuilder } from '../builder/AssociationSubclassBuilder';
import { ChoiceBuilder } from '../builder/ChoiceBuilder';
import { CommonBuilder } from '../builder/CommonBuilder';
import { CommonExtensionBuilder } from '../builder/CommonExtensionBuilder';
import { DecimalTypeBuilder } from '../builder/DecimalTypeBuilder';
import { DescriptorBuilder } from '../builder/DescriptorBuilder';
import { DomainBuilder } from '../builder/DomainBuilder';
import { DomainEntityBuilder } from '../builder/DomainEntityBuilder';
import { DomainEntityExtensionBuilder } from '../builder/DomainEntityExtensionBuilder';
import { DomainEntitySubclassBuilder } from '../builder/DomainEntitySubclassBuilder';
import { EnumerationBuilder } from '../builder/EnumerationBuilder';
import { IntegerTypeBuilder } from '../builder/IntegerTypeBuilder';
import { InterchangeBuilder } from '../builder/InterchangeBuilder';
import { NamespaceInfoBuilder } from '../builder/NamespaceInfoBuilder';
import { SharedDecimalBuilder } from '../builder/SharedDecimalBuilder';
import { SharedIntegerBuilder } from '../builder/SharedIntegerBuilder';
import { SharedStringBuilder } from '../builder/SharedStringBuilder';
import { StringTypeBuilder } from '../builder/StringTypeBuilder';

export async function execute(state: State): Promise<void> {
  const builders: Array<MetaEdGrammarListener> = [];

  // NamespaceInfoBuilder goes first, all others have a dependency on it
  builders.push(new NamespaceInfoBuilder(state.metaEd, state.validationFailure));

  builders.push(new AssociationBuilder(state.metaEd, state.validationFailure));
  builders.push(new AssociationExtensionBuilder(state.metaEd, state.validationFailure));
  builders.push(new AssociationSubclassBuilder(state.metaEd, state.validationFailure));
  builders.push(new ChoiceBuilder(state.metaEd, state.validationFailure));
  builders.push(new CommonBuilder(state.metaEd, state.validationFailure));
  builders.push(new CommonExtensionBuilder(state.metaEd, state.validationFailure));
  builders.push(new DecimalTypeBuilder(state.metaEd, state.validationFailure));
  builders.push(new DescriptorBuilder(state.metaEd, state.validationFailure));
  builders.push(new DomainBuilder(state.metaEd, state.validationFailure));
  builders.push(new DomainEntityBuilder(state.metaEd, state.validationFailure));
  builders.push(new DomainEntityExtensionBuilder(state.metaEd, state.validationFailure));
  builders.push(new DomainEntitySubclassBuilder(state.metaEd, state.validationFailure));
  builders.push(new EnumerationBuilder(state.metaEd, state.validationFailure));
  builders.push(new IntegerTypeBuilder(state.metaEd, state.validationFailure));
  builders.push(new InterchangeBuilder(state.metaEd, state.validationFailure));
  builders.push(new SharedDecimalBuilder(state.metaEd, state.validationFailure));
  builders.push(new SharedIntegerBuilder(state.metaEd, state.validationFailure));
  builders.push(new SharedStringBuilder(state.metaEd, state.validationFailure));
  builders.push(new StringTypeBuilder(state.metaEd, state.validationFailure));

  const parseTreeWalker = new antlr4.tree.ParseTreeWalker();

  // eslint-disable-next-line no-restricted-syntax
  for (const builder of builders) {
    parseTreeWalker.walk(builder, state.parseTree);
    await nextMacroTask();
  }
}
