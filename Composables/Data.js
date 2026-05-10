const { createApp, ref, onMounted } = Vue;
import { Demon, Skill } from "../Models/Demon.js";
import { Equipment, Weapon, Armor, Accessory } from "../Models/Equipment.js"


export let player = new Demon("Adam");
player.getVariables();
export let demonList = ref([player]); // List of demons
export let equipmentList = ref([new Weapon('Baseball Bat', 'pu-tunk', 5, [], [], 'Weapon'), new Accessory("Watch", "Tells the time", 1, [], []), new Armor('Kevlar', 'A sturdy vest for ample defense', 20.5, 10, 3, []), new Accessory("Amethyst Amulet", "Slightly increases magic damage", 1, [], ['+100 HP']), new Accessory("Brass Bracers", "IDK something", 6, [], []) ] );
export let activeDemon = ref(player); // Currently active demon
export let colorScheme = ref(['indigo', 'blue', 'sky', 'cyan', 'teal', 'emerald', 'green', 'purple', 'fuchsia' ]);
export let modal = ref(false);
export let log = ref([]);
export function birthDemon(demon) {demonList.value.push(demon);}
export function getAD() { return activeDemon }