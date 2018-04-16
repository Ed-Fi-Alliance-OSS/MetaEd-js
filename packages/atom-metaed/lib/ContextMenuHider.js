/** @babel */
// @flow

import R from 'ramda';
import { $ } from 'atom-space-pen-views';
import { isCoreMetaEdFile } from './MakeCoreTabsReadOnly';

function findAll(commands: string[]) {
  const found = [];
  const menus = atom.contextMenu.itemSets;

  /* eslint-disable */
  for (const menu in menus) {
    const items = menus[menu].items;
    for (let i = items.length; i--;) {
      const item = items[i];
      if (!item) {
        continue;
      }
      if (commands.indexOf(item.command) >= 0) {
        item.originMenu = menus[menu];
        item.currentParent = menus[menu];
        item.position = i;
        found.push(item);
      }
    }
  }
  /* eslint-enable */
  return found;
}

const sortByPosition = R.sortBy(R.prop('position'));

class CommandGroups {
  name: string;
  commands: string[];
  items: any;
  itemsByOriginMenu: any;

  constructor(name: string, commands: string[]) {
    this.name = name;
    this.commands = commands;
    this.items = findAll(this.commands);
    this.itemsByOriginMenu = R.groupWith(R.eqProps('originMenu'), this.items);
  }

  destructor() {
    this.reset();
    if (this.items) {
      /* eslint-disable */
      for (let i = this.items.length; i--;) {
        const item = this.items[i];
        delete item.originMenu;
        delete item.currentParent;
        delete item.position;
      }
      /* eslint-enable */
    }

    delete this.name;
    delete this.commands;
    delete this.items;
    delete this.itemsByOriginMenu;
  }

  hide() {
    if (!this.items) return;

    this.reset();

    this.itemsByOriginMenu.forEach(itemsForOriginMenu => {
      const itemsForOriginMenuSorted = R.reverse(sortByPosition(itemsForOriginMenu));
      itemsForOriginMenuSorted.forEach(item => {
        item.originMenu.items.splice(item.position, 1);
        // eslint-disable-next-line no-param-reassign
        item.currentParent = null;
      });
    });
  }

  show() {
    this.reset();
  }

  reset() {
    if (!this.items) return;

    this.itemsByOriginMenu.forEach(itemsForOriginMenu => {
      const itemsForOriginMenuSorted = sortByPosition(itemsForOriginMenu);
      itemsForOriginMenuSorted.forEach(item => {
        const origin = item.originMenu;
        if (item.currentParent !== origin) {
          // eslint-disable-next-line no-param-reassign
          item.currentParent = origin;
          origin.items.splice(item.position, 0, item);
        }
      });
    });
  }
}

export function hideTreeViewContextMenuOperationsWhenCore() {
  if (!atom.packages.isPackageLoaded('tree-view')) return;
  atom.packages.activatePackage('tree-view').then(pkg => {
    const contextMenuCommandsToHide = [
      'tree-view:move',
      'tree-view:duplicate',
      'tree-view:remove',
      // copy remains
      'tree-view:cut',
      'tree-view:paste',
      'atom-metaed:createNewExtensionProject',
      'tree-view:add-file',
      'tree-view:add-folder',
    ];
    const contextMenuHider = new CommandGroups('Things', contextMenuCommandsToHide);

    const treeView = pkg.mainModule.getTreeViewInstance();
    const treeViewEl = atom.views.getView(treeView);

    // TODO: how to dispose/make disposable?
    $(treeViewEl).on('mousedown', event => {
      if (event.which !== 3) return;
      if (isCoreMetaEdFile(treeView.selectedPath)) {
        contextMenuHider.hide();
      } else {
        contextMenuHider.show();
      }
    });
  });
}
