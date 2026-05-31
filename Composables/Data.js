const { createApp, ref, onMounted } = Vue;
import { Demon, Skill } from "../Models/Demon.js";
import { Equipment, Weapon, Armor, Accessory } from "../Models/Equipment.js"


export let player = new Demon("Adam");
player.getVariables();
export let demonList = ref([player]); // List of demons
export let equipmentList = ref([]);
export let activeDemon = ref(player); // Currently active demon
export let colorScheme = ref(['indigo', 'blue', 'sky', 'cyan', 'teal', 'emerald', 'green', 'purple', 'fuchsia' ]);
export let modal = ref(false);
export let log = ref([]);
export function birthDemon(demon) {demonList.value.push(demon);}
export function getAD() { return activeDemon }