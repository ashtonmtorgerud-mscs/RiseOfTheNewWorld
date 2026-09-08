const { ref, reactive, createApp, defineAsyncComponent } = Vue;
import { activeDemon, colorScheme, demonList, equipmentList } from "./Data.js";
import { Demon, Skill } from "../Models/Demon.js";
import { Accessory, Armor, Weapon } from "../Models/Equipment.js";
import { sendMessage } from "../Modular/Console.js";



export const prettify = ref({


  // Initialize Variables
  activeTab: 'profile',

  modal: false,
  modalTab: '',
  modalString: '',
  editingEquipment: null,
  rolledDice: '',


  tabs: ['profile', 'battle', 'notes'],
  talentTabs: [false, false, false, true],
  gotSkill: false,
  activePage: ref('Sheet'),
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


  // 
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


  // Creates the style for the buff tracker's glow withing the Battle Tab of the Sheet 
  getBuffShadowStyle(buff) {
    const absBuff = Math.abs(buff);
    if (buff === 0) return {};

    const color = buff > 0 ? '0, 191, 255' : '255, 99, 132';
    const intensity = 0.4 + absBuff * 0.15; // Range: 0.4 - 1.0

    return {
      boxShadow: `0 0 ${5 + absBuff * 3}px rgba(${color}, ${intensity})`
    };
  },

  // Creates a new Demon in the DemonList
  birthDemon(demonName) {
    demonList.value.push(new Demon(demonName));
    activeDemon.value = demonList.value[demonList.value.length - 1];
    this.activePage = 'Editor';
  },

  // Creates a new item in the Equipmentlist
  findItem(iItem) {
    // console.log(equipmentList.value);
    equipmentList.value.push(iItem);
  },

  // Deletes an item based on the ID. Woah a lot of this code is self explainatory. Amazing
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


  // Turns a weapon into a skill to be displayed under display skill in the Sheet menu
  skillifyWeapon(weapon) {

    let skillName = weapon.name || '';
    let skillDesc = weapon.description || '';
    let skillRollNames = weapon.rollNames || [];
    let skillRolls = weapon.rolls || [];

    let boomerang = new Skill(skillName, skillDesc, skillRollNames, skillRolls);

    return boomerang;

  },


  // Finds an item based on the passed weapon and reverts it to be unequipped and sets the demon's equipped weapon to it's default
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

    // Finds an item based on the passed armor and reverts it to be unequipped and sets the demon's equipped armor to it's default
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


  // Finds an item based on the passed accessory and reverts it to be unequipped and sets the demon's equipped accessory to it's default
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

  // Creates a new weapon for the create modal based on the string
  newItem(iString) {
    switch (iString) {
      case ('Weapon'): return this.editingEquipment = new Weapon('New Weapon', 'Weapon Description', 0, ['Aim', 'Damage', 'Crit Rate', 'Damage (Crit)'], ['/roll (1d100-5+ag+lu/4)*(stkaim)*(0.2*S+1)_floor', '/roll (C*(stkpwr*(1+T*0.2)*(6+6*(st/20))))d6', '/math 96-(lu/4+ag/10+cb)*(1+S*0.2)_ceil', '/roll (C*(stkpwr*(1+T*0.2)*cm*(6+6*(st/20))))d6'], "Weapon"); break;
      case ('Armor'): return this.editingEquipment = new Armor('New Armor', 'Armor Description', 1, 0, 0, []); break;
      case ('Accessory'): return this.editingEquipment = new Accessory('New Accessory', 'Accessory Description', 1, ['+Effect']);

    }
  },


  // Variables and functions for filtering gear in the Gear Menu

  // Initializing Variables
  showWeapons: true,
  showArmor: true,
  showAccessories: true,
  showEquipped: true,
  filterEquipmentPage: 0,
  sortEquipmentBy: 'newest',



  // Used by Modular/Gear.vue to get a list of equipment based on the filters 
  filterEquipment(equipmentList) {

    let filteredEquipmentList = equipmentList;
    switch(this.sortEquipmentBy){
      case 'newest': filteredEquipmentList = [...filteredEquipmentList].reverse(); break
      case 'rarity': filteredEquipmentList = [...filteredEquipmentList].sort((a, b) => b.grade - a.grade); break
      case 'inverserarity': filteredEquipmentList = [...filteredEquipmentList].sort((a, b) => a.grade - b.grade); break
      case 'alphabetically': filteredEquipmentList = [...filteredEquipmentList].sort((a, b) => a.name.localeCompare(b.name)); break
      case 'inversealphabetically': filteredEquipmentList = [...filteredEquipmentList].sort((a, b) => b.name.localeCompare(a.name)); break
      default: break;
    }


    return filteredEquipmentList.filter(item => {

      if (!this.showWeapons && item.itemType === "Weapon") return false;
      if (!this.showArmor && item.itemType === "Armor") return false;
      if (!this.showAccessories && item.itemType === "Accessory") return false;
      if (!this.showEquipped && item.equipped) return false;

      return true;
    });
  },


  // Color Scheme Editor Functions, most should be self explanatory
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
  },


  // Downloads an item from an ID
  downloadItemFromID(itemID){
    equipmentList.value.forEach((item, index) => {
      if (!item.id) {return;}
      if (item.id == itemID){
        sendMessage(item.name);
      }
    });
  }
});


// End of the prettify object






// Triggers for the holdingShift variable to keep track of whether the user is holding shift

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