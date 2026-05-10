const { ref, reactive, createApp, defineAsyncComponent } = Vue;
import { activeDemon, colorScheme, demonList, equipmentList } from "./Data.js";
import { Demon, Skill } from "../Models/Demon.js";
import { Accessory, Armor, Weapon } from "../Models/Equipment.js";



export const prettify = ref({
  activeTab: 'profile',


  

  modal: false,
  modalTab: '',
  modalString: '',
  editingEqiupment: null,

  rolledDice: '',


  tabs: ['profile', 'battle', 'notes'],
  talentTabs: [false, false, false, false],
  gotSkill: false,
  activePage: ref('Sheet'),
  // activePage: ref('Gear'),
  displayAilments: false,
  displaySkill: false,
  selectedSkill: '',
  messageInput: "",
  log: [],

  useUniversalNotes: false,
  universalNotes: "",

  skillPage: 0,
  editingSkill: activeDemon.value.skills[0],
  editingSkillIndex: 0,
  esi: 0,

  runkusMode: false,

  holdingShift: false,

  formatDamageIntake(affinity, index) {
    if (this.holdingShift) {
      return '/damage (c*' + ['stkres', 'slhres', 'prcres', 'firres', 'iceres', 'elcres', 'frcres', 'toxres', 'psyres', 'lgtres', 'glmres'][index] + ')*'
    }
    return '/damage (c*' + activeDemon.value.readAffinity(affinity) + '*' + ['stkres', 'slhres', 'prcres', 'firres', 'iceres', 'elcres', 'frcres', 'toxres', 'psyres', 'lgtres', 'glmres'][index] + ')*'
  },

  fixDemonSkillCount(iDemon) {

    let tempArray = iDemon.skills;
    let arraySize = iDemon.skillCount;

    iDemon.skills = [];

    for (let i = 0; i < iDemon.skillCount; i++) {
      // if (tempArray[i] && tempArray[i].name != ''){
      iDemon.skills.push((tempArray[i] || new Skill('', '', [], [])));
      // }
    }

    this.skillPage = 0;

  },



  getBuffShadowStyle(buff) {
    const absBuff = Math.abs(buff);
    if (buff === 0) return {};

    const color = buff > 0 ? '0, 191, 255' : '255, 99, 132';
    const intensity = 0.2 + absBuff * 0.2;

    return {
      boxShadow: `0 0 ${5 + absBuff * 3}px rgba(${color}, ${intensity})`
    };
  },

  birthDemon(demonName) {
    demonList.value.push(new Demon(demonName));
    activeDemon.value = demonList.value[demonList.value.length - 1];
    this.activePage = 'Editor';
  },

  findItem(iItem) {
    // console.log(equipmentList.value);
    equipmentList.value.push(iItem);
  },

  deleteItem(iItemID) {
    equipmentList.value.forEach((item, index) => {
      if (item.id == iItemID) {
        equipmentList.value.splice(index, 1)
      }
    })
    demonList.value.forEach((demon, i) => {

      if (demon.equippedWeapon.id == iItemID) {
        demon.equippedWeapon = demon.defaultWeapon;
      }

      if (demon.equippedArmor.id == iItemID) {
        demon.equippedArmor = demon.defaultArmor;
      }

      demon.accessories.forEach((acc, index) => {
        if (acc.id == iItemID) {
          demon.accessories[i] = {};
        }
      })
    })


  },


  skillifyWeapon(weapon) {




    let skillName = weapon.name || '';
    let skillDesc = weapon.description || '';
    let skillRollNames = weapon.rollNames || [];
    let skillRolls = weapon.rolls || [];

    let boomerang = new Skill(skillName, skillDesc, skillRollNames, skillRolls);

    return boomerang;

  },



  // equip(item, activeDemon) {
  //   if (item.itemType === "Accessory") {
  //     const index = activeDemon.accessories.findIndex(
  //       acc => acc && Object.keys(acc).length === 0
  //     );

  //     if (index !== -1 && !item.equipped) {
  //       item.equipped = true;
  //       item.equipper = activeDemon.name;
  //       activeDemon.accessories[index] = item;
  //     } else {
  //       this.log.push("Cannot equip more than 3 items")
  //     }
  //   }
  // },


  unequipWeapon(weapon, activeDemon) {


    const item = weapon;

    if (!item || !item.id) return;
    const original = equipmentList.value.find(eq => eq.id === item.id);

    if (original) {
      original.equipped = false;
      original.equipper = "";
    }

    activeDemon.equippedWeapon = activeDemon.defaultWeapon;

  },

  unequipArmor(armor, activeDemon) {

    const item = armor;

    if (!item || !item.id) return;
    const original = equipmentList.value.find(eq => eq.id === item.id);

    if (original) {
      original.equipped = false;
      original.equipper = "";
    }

    activeDemon.equippedArmor = activeDemon.defaultArmor;
  },

  unequipAccessory(index, activeDemon) {

    const item = activeDemon.accessories[index];

    if (!item || !item.id) return;

    const original = equipmentList.value.find(eq => eq.id === item.id);

    if (original) {
      original.equipped = false;
      original.equipper = "";
    }

    activeDemon.accessories[index] = {};
  },

  newItem(iString) {
    switch (iString) {
      case ('Weapon'): return this.editingEqiupment = new Weapon('New Weapon', 'Weapon Description', 0, ['Aim', 'Damage', 'Crit Rate', 'Damage (Crit)'], ['/roll (1d100-5+ag+lu/4)*(stkaim)*(0.2*S+1)_floor', '/roll (C*(stkpwr*(1+T*0.2)*(6+6*(st/20))))d6', '/math 96-(lu/4+ag/10+cb)*(1+S*0.2)_ceil', '/roll (C*(stkpwr*(1+T*0.2)*1.5*(6+6*(st/20))))d6'], "Weapon"); break;
      case ('Armor'): return this.editingEqiupment = new Armor('New Armor', 'Armor Description', 1, 0, 0, []); break;
      case ('Accessory'): return this.editingEqiupment = new Accessory('New Accessory', 'Accessory Description', 1, ['+Effect']);

    }
  },

  showWeapons: true,
  showArmor: true,
  showAccessories: true,
  showEquipped: true,

  filterEquipment(equipmentList) {
    return equipmentList.filter(item => {

      if (!this.showWeapons && item.itemType === "Weapon") return false;
      if (!this.showArmor && item.itemType === "Armor") return false;
      if (!this.showAccessories && item.itemType === "Accessory") return false;
      if (!this.showEquipped && item.equipped) return false;

      return true;
    });
  },


  getColors(){
    return colorScheme.value;
  },
  setColors(index, color){
    colorScheme.value[index] = color;
  },
  resetColors(){
    colorScheme.value = ['indigo', 'blue', 'sky', 'cyan', 'teal', 'emerald', 'green', 'purple', 'fuchsia' ];
  },
  allColors(){
    return [
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "pink",
      "rose",
      "slate",
      "gray",
      "zinc",
      "neutral",
      "stone"
    ]
  }




});






export let getBuffShadowStyle = (buff) => {
  const absBuff = Math.abs(buff);
  if (buff === 0) return {};

  const color = buff > 0 ? '0, 191, 255' : '255, 99, 132'; // Blue or Red (RGB)
  const intensity = 0.2 + absBuff * 0.2; // Range: 0.4 - 1.0

  return {
    boxShadow: `0 0 ${5 + absBuff * 3}px rgba(${color}, ${intensity})`

  };
}

export let activeTab = 'profile';
export let tabs = ['profile', 'combat', 'notes'];
export let gotSkill = false;
export let activePage = ref('Gear');
export let displayAilments = false;


export function birthDemon(demonName) {
  demonList.value.push(new Demon(demonName));

  activeDemon.value = demonList.value[demonList.value.length - 1];

  activePage = 'Editor'

}


export function equip(item, activeDemon) {

  switch (item.itemType) {
    case ("Weapon"):

      if (activeDemon.equippedWeapon.default == true) {
        activeDemon.equippedWeapon = item;
        item.equipped = true;
        item.equipper = activeDemon.name;
      } else {
        prettify.value.log.push("This demon already has a weapon equipped");
      }



      break;
    case ("Armor"):

      if (activeDemon.equippedArmor.default == true) {
        activeDemon.equippedArmor = item;
        item.equipped = true;
        item.equipper = activeDemon.name;
      } else {
        prettify.value.log.push("This demon already has armor equipped");
      }




      break;
    case ("Accessory"):
      const index = activeDemon.accessories.findIndex(
        acc => acc && Object.keys(acc).length === 0 && acc.constructor === Object
      );


      if (index !== -1 && !item.equipped) {
        item.equipped = true;
        item.equipper = activeDemon.name;
        activeDemon.accessories[index] = item;
      } else {
        prettify.value.log.push("Cannot equip more than 3 items");
      }
      break;

  }
}


window.addEventListener('keydown', (e) => {
  if (e.key === 'Shift') {
    prettify.value.holdingShift = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'Shift') {
    prettify.value.holdingShift = false;
  }
});

window.addEventListener('blur', () => {
  prettify.value.holdingShift = false;
});