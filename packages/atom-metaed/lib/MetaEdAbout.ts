import path from 'path';
import { scanForPlugins, newState } from 'metaed-core';
import { atomMetaEdPackageJson } from './Utility';

const metaedAboutBackground = path.resolve(__dirname, '../static/MetaEd-About-Background.png');

export class MetaEdAboutModel {
  getTitle: () => string;

  getIconName: () => string;

  constructor() {
    this.getTitle = () => 'About';
    this.getIconName = () => 'info';
  }
}

export function metaEdAboutView(): () => HTMLElement {
  return () => {
    const pluginList: string[] = scanForPlugins(newState()).map(pm => `${pm.npmName} ${pm.version}`);
    const version: string = atomMetaEdPackageJson() != null ? ` v${atomMetaEdPackageJson().version}` : '';

    const template = `
      <div class='metaed-container' style='display: flex; flex-flow: column wrap; justify-content: center; align-items: center; height: 100%; width: 100%;'>
        <div class='metaed-image' style='position: relative;'>
          <img src='${metaedAboutBackground}' alt=''/>

          <p class='metaed-info' style='position:absolute; bottom:0; font-size:11px; font-family:"Arial"; padding:0px 37px; width:100%; height:185px; text-align:left; overflow-y:scroll'>
            MetaEd is ©2019 Ed-Fi Alliance, LLC. Click <a href="https://www.ed-fi.org/getting-started/license-ed-fi-technology/">here</a> for license information.
            <br/>
            atom-metaed${version}
            <br/>
            <br/>
            ${pluginList.length > 0 ? 'Installed Plugins: <br/>' : ''}
            ${pluginList.join('<br/>')}
          </p>
        </div>
      </div>
    `;

    // eslint-disable-next-line no-undef, document
    const element = document.createElement('div');
    element.innerHTML = template;
    return element;
  };
}
