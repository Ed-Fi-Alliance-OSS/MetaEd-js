import { TableNameGroup, TableNameComponent, isTableNameComponent } from './Table';

export function flattenNameComponentsFromGroup(nameGroup: TableNameGroup): TableNameComponent[] {
  const result: TableNameComponent[] = [];
  nameGroup.nameElements.forEach((nameElement) => {
    if (isTableNameComponent(nameElement)) {
      result.push(nameElement as TableNameComponent);
    } else {
      result.push(...flattenNameComponentsFromGroup(nameElement as TableNameGroup));
    }
  });
  return result;
}

export function simpleTableNameGroupConcat(nameGroup: TableNameGroup): string {
  return flattenNameComponentsFromGroup(nameGroup)
    .map((nameComponent) => nameComponent.name)
    .reduce((a, b) => a + b, '');
}
