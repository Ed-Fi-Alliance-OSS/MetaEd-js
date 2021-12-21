import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace } from 'metaed-core';
import { Workbook } from '../model/sheet/Workbook';
import { Row } from '../model/sheet/Row';
import { Worksheet } from '../model/sheet/Worksheet';
import { ElementGroupDefinition } from '../model/ElementGroupDefinition';
import { EntityDefinition } from '../model/EntityDefinition';
import { ElementDefinition } from '../model/ElementDefinition';
import { EnumerationDefinition } from '../model/EnumerationDefinition';
import { EnumerationItemDefinition } from '../model/EnumerationItemDefinition';
import { createRow, newRow, setRow } from '../model/sheet/Row';
import { exportWorkbook, newWorkbook } from '../model/sheet/Workbook';
import { newWorksheet } from '../model/sheet/Worksheet';
import {
  pluginElementDefinitionsForNamespace,
  pluginElementGroupDefinitionsForNamespace,
  pluginEntityDefinitionsForNamespace,
  pluginEnumerationDefinitionsForNamespace,
  pluginEnumerationItemDefinitionsForNamespace,
} from '../enhancer/EnhancerHelper';

const generatorName = 'edfiMappingedu.MappingEduGenerator';

const normalizeLineBreaks = (str: string): string => {
  if (str == null) return '';
  const [first, ...rest] = str.split(/\r?\n/g);
  return rest.length > 0 ? `${first} ${rest.join(', ')}` : str;
};
const removeExtraWhitespace = (string: string): string => string.replace(/\s\s+/g, ' ');
const removeOuterQuotes = (string: string): string =>
  string.charAt(0) === '"' && string.charAt(string.length - 1) === '"' ? string.slice(1, -1) : string;
const normalizeDefinition = (definition: string): string =>
  removeOuterQuotes(removeExtraWhitespace(normalizeLineBreaks(definition)).trim());

const normalizeEntityPath = (entityPath: string[]): string => entityPath.join('.');
const normalizeDataType = (string: string): string => string.replace('xs:', '');

const sortBy =
  (...props: string[]) =>
  (a: Record<string, any>, b: Record<string, any>): number => {
    // eslint-disable-next-line no-restricted-syntax
    for (const prop of props) {
      // eslint-disable-next-line no-continue
      if (a[prop] == null || b[prop] == null) continue;
      const aa = a[prop].toLowerCase() || '';
      const bb = b[prop].toLowerCase() || '';
      if (aa < bb) return -1;
      if (aa > bb) return 1;
    }
    return 0;
  };

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const workbook: Workbook = newWorkbook();

  metaEd.namespace.forEach((namespace: Namespace) => {
    const elementGroupDefinitions: ElementGroupDefinition[] = pluginElementGroupDefinitionsForNamespace(metaEd, namespace);
    const entityDefinitions: EntityDefinition[] = pluginEntityDefinitionsForNamespace(metaEd, namespace);
    const elementDefinitions: ElementDefinition[] = pluginElementDefinitionsForNamespace(metaEd, namespace);
    const enumerationDefinitions: EnumerationDefinition[] = pluginEnumerationDefinitionsForNamespace(metaEd, namespace);
    const enumerationItemDefinitions: EnumerationItemDefinition[] = pluginEnumerationItemDefinitionsForNamespace(
      metaEd,
      namespace,
    );

    const elementGroupDefinitionSheet: Worksheet = newWorksheet('ElementGroupDefinitions');
    const entityDefinitionSheet: Worksheet = newWorksheet('EntityDefinitions');
    const elementDefinitionSheet: Worksheet = newWorksheet('ElementDefinitions');
    const enumerationDefinitionSheet: Worksheet = newWorksheet('EnumerationDefinitions');
    const enumerationItemDefinitionSheet: Worksheet = newWorksheet('EnumerationItems');
    workbook.sheets.push(elementGroupDefinitionSheet);
    workbook.sheets.push(entityDefinitionSheet);
    workbook.sheets.push(elementDefinitionSheet);
    workbook.sheets.push(enumerationDefinitionSheet);
    workbook.sheets.push(enumerationItemDefinitionSheet);

    elementGroupDefinitions.forEach((elementGroupDefinition: ElementGroupDefinition) => {
      const row: Row = newRow();

      setRow(row, 'Element Group', elementGroupDefinition.elementGroup);
      setRow(row, 'Definition', normalizeDefinition(elementGroupDefinition.definition));

      elementGroupDefinitionSheet.rows.push(createRow(row));
    });
    elementGroupDefinitionSheet['!cols'] = [{ wpx: 100 }, { wpx: 1000 }];
    elementGroupDefinitionSheet.rows.sort(sortBy('Element Group', 'Definition'));

    entityDefinitions.forEach((entityDefinition: EntityDefinition) => {
      const row: Row = newRow();

      setRow(row, 'Element Group', entityDefinition.elementGroup);
      setRow(row, 'Entity', normalizeEntityPath(entityDefinition.entityPath));
      setRow(row, 'Definition', normalizeDefinition(entityDefinition.definition));

      entityDefinitionSheet.rows.push(createRow(row));
    });
    entityDefinitionSheet.rows.sort(sortBy('Element Group', 'Entity'));
    entityDefinitionSheet['!cols'] = [{ wpx: 100 }, { wpx: 250 }, { wpx: 1000 }];

    elementDefinitions.forEach((elementDefinition: ElementDefinition) => {
      const row: Row = newRow();

      setRow(row, 'Element Group', elementDefinition.elementGroup);
      setRow(row, 'Entity', normalizeEntityPath(elementDefinition.entityPath));
      setRow(row, 'Element', elementDefinition.element);
      setRow(row, 'Definition', normalizeDefinition(elementDefinition.definition));
      setRow(row, 'Data Type', normalizeDataType(elementDefinition.dataType));
      setRow(row, 'Field Length', elementDefinition.fieldLength);
      setRow(row, 'URL', elementDefinition.url);
      setRow(row, 'Technical Name', elementDefinition.technicalName);
      setRow(row, 'EXT_Required', elementDefinition.isRequired ? '1' : '0');

      elementDefinitionSheet.rows.push(createRow(row));
    });
    elementDefinitionSheet.rows.sort(sortBy('Element Group', 'Entity', 'Element'));
    elementDefinitionSheet['!cols'] = [
      { wpx: 100 },
      { wpx: 250 },
      { wpx: 100 },
      { wpx: 1000 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
    ];

    enumerationDefinitions.forEach((enumerationDefinition: EnumerationDefinition) => {
      const row: Row = newRow();

      setRow(row, 'Element Group', enumerationDefinition.elementGroup);
      setRow(row, 'Enumeration', enumerationDefinition.enumeration);
      setRow(row, 'Definition', normalizeDefinition(enumerationDefinition.definition));

      enumerationDefinitionSheet.rows.push(createRow(row));
    });
    enumerationDefinitionSheet.rows.sort(sortBy('Element Group', 'Enumeration'));
    enumerationDefinitionSheet['!cols'] = [{ wpx: 100 }, { wpx: 250 }, { wpx: 1000 }];

    enumerationItemDefinitions.forEach((enumerationItemDefinition: EnumerationItemDefinition) => {
      const row: Row = newRow();

      setRow(row, 'Element Group', enumerationItemDefinition.elementGroup);
      setRow(row, 'Enumeration', enumerationItemDefinition.enumeration);
      setRow(row, 'Code Value', enumerationItemDefinition.codeValue);
      setRow(row, 'Short Description', enumerationItemDefinition.shortDescription);
      setRow(row, 'Description', enumerationItemDefinition.description);

      enumerationItemDefinitionSheet.rows.push(createRow(row));
    });
    enumerationItemDefinitionSheet.rows.sort(sortBy('Element Group', 'Enumeration', 'Code Value'));
    enumerationItemDefinitionSheet['!cols'] = [{ wpx: 100 }, { wpx: 250 }, { wpx: 250 }, { wpx: 250 }, { wpx: 250 }];
  });

  const generatedOutput: GeneratedOutput[] = [
    {
      name: 'MappingEdu',
      namespace: 'Documentation',
      folderName: 'MappingEdu',
      fileName: 'MappingEdu.xlsx',
      resultString: '',
      resultStream: exportWorkbook(workbook, 'buffer'),
    },
  ];

  return {
    generatorName,
    generatedOutput,
  };
}
