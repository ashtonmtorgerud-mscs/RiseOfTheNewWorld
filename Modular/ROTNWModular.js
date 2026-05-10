const { ref, createApp, defineAsyncComponent } = Vue;
const { loadModule } = window['vue3-sfc-loader'];

import { demonList, activeDemon, equipmentList, modal, log, colorScheme } from '../Composables/Data.js';
import { RollDice } from '../Models/Calculators.js';
import { Demon } from '../Models/Demon.js';
import { getBuffShadowStyle, activePage, activeTab, tabs, displayAilments, equip, birthDemon, gotSkill, prettify } from '../Composables/Prettify.js';
import { DataMaster } from '../Models/DataMaster.js';
import { sendMessage } from './Console.js';

// shared loader config
const options = {
  moduleCache: { vue: Vue },

  async getFile(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load ' + url);
    return await res.text();
  },

  addStyle(text) {
    const style = document.createElement('style');
    style.textContent = text;
    document.head.appendChild(style);
  }
};

// GLOBAL STATE (optional but clean)
const AppState = {
  // log,
  demonList,
  activeDemon,
  modal
};

document.addEventListener('DOMContentLoaded', () => {

  const app = createApp({
    
    setup() {
      const dataMaster = new DataMaster();
      // let log = ["Filler Text"];


      app.provide('activeDemon', activeDemon);
      app.provide('DataMaster', dataMaster);
      app.provide('prettify', prettify);
      app.provide('colorScheme', colorScheme);

      // console.log(prettify.activePage);

      // const savedState = localStorage.getItem('AUTOSAVE');
      // if (savedState) {
      //   dataMaster.saveFile = "AUTOSAVE";
      //   dataMaster.loadData();
      // }

      // dataMaster.loadData("AUTOSAVE");

                
      return { activePage, colorScheme, activeDemon, DataMaster, demonList, equipmentList, getBuffShadowStyle, activeTab, tabs, displayAilments, equip, birthDemon, sendMessage, log, prettify };
    },


    components: {
      Home: defineAsyncComponent(() =>
        loadModule('./Modular/Home.vue', options)
      ),
      Sheet: defineAsyncComponent(() =>
        loadModule('./Modular/Sheet.vue', options)
      ),
      Demons: defineAsyncComponent(() =>
        loadModule('./Modular/Demons.vue', options)
      ),
      Gear: defineAsyncComponent(() =>
        loadModule('./Modular/Gear.vue', options)
      ),
      Edit: defineAsyncComponent(() =>
        loadModule('./Modular/Edit.vue', options)
      ),
      Console: defineAsyncComponent(() =>
        loadModule('./Modular/Console.vue', options)
      ),
      Modal: defineAsyncComponent(() =>
        loadModule('./Modular/Modal.vue', options)
      )
    },
    template: `
        <div class="totalBackground  h-screen w-screen overflow-hidden p-1 select-none hidden lg:flex">
          <div class="h-full w-3/4" :class="prettify.runkusMode ? 'overflow-y-scroll' : ''">
        

            <Modal />

            <Home />

            <Sheet  :sendMessage="sendMessage" />
            <Demons :activePage="activePage"  :demonList="demonList" :birthDemon="birthDemon" />
            <Gear :activePage="activePage"  :demonList="demonList" :equipmentList="equipmentList" :equip="equip" />
            <Edit :activePage="activePage"  :demonList="demonList" :equipmentList="equipmentList" :equip="equip" />
          
          </div>
          
          <Console class="w-1/4"  :sendMessage="sendMessage" :log="log"/>
        </div>
        
    `
  });

  app.mount('#app');
});