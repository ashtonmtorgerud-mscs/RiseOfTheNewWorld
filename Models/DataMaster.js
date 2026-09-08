const { createApp, ref, onMounted } = Vue;
import { Demon, Skill } from "./Demon.js";
import { demonList, activeDemon, equipmentList, modal, log, colorScheme } from '../Composables/Data.js';
import { prettify } from "../Composables/Prettify.js";
import { Weapon, Armor, Accessory, Equipment } from "./Equipment.js";

export class DataMaster {
    constructor() {

        // Initialize Variables
        this.fileData = {};
        this.saveFile = "AUTOSAVE";
        this.skillSlot = 1;
        this.primedSaveData = false;


        // Puts information from a file into the modalstring
        this.uploadFromFile = (file) => {
            const selectedFile = file.target.files[0];
            if (!selectedFile) {
                return;
            }

            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    prettify.value.modalString = JSON.stringify(data, null, 2);
                } catch (error) {
                    console.error("Error loading data:", error);
                    prettify.value.log.push("Error loading data: " + error);
                }
            };

            reader.readAsText(selectedFile);

        };

        // Parses information from the modal string into a piece of data depending on the IType input
        this.parseFromModal = (iType) => {
            // console.log("Got Here");
            try {
                switch (iType) {
                
                    // Imports a demon
                    case ("demon"):
                        let demonData = JSON.parse(prettify.value.modalString);

                        let demon = new Demon();  
                        assignExisting(demon, demonData);



                        // Turns demon's outdated equipment into new versions of equipment and adds it to the equipmentlist
                        if (demonData.weapon) {
                            let tempWeapon = new Weapon(demonData.weapon.name, demonData.weapon.description, 0, demonData.weapon.rollNames, demonData.weapon.rolls, "Weapon");
                            tempWeapon.equipper = demon.name;
                            tempWeapon.equipped = true;
                            
                            demon.equippedWeapon = tempWeapon;
                            equipmentList.value.push(tempWeapon);
                        }
                        
                        if (demonData.armor) {
                            let tempArmor = new Armor(demonData.armor[0], "", 0, demonData.armor[1], demonData.armor[2], []);
                            tempArmor.equipper = demon.name;
                            tempArmor.equipped = true;
                            demon.equippedArmor = tempArmor;
                            equipmentList.value.push(tempArmor);
                        }

                        if (demon.accessories) {
                            demon.accessories.forEach((acc, index) => {
                                if (acc[0] == ''){
                                    demon.accessories[index] = {};
                                } else
                                if (Array.isArray(acc)) {
                                    // console.log("#" + index + " acc[0]" + acc[0])
                                    let portAcc = new Accessory(acc[0], '', 0, [acc[1]]);
                                    portAcc.equipper = demon.name;
                                    portAcc.equipped = true;
                                    demon.accessories[index] = portAcc;
                                    equipmentList.value.push(portAcc)
                                }
                            })
                        }



                        // Cleans up the modal, saves, adds data
                        demon.recalculateVitals();  
                        demonList.value.push(demon);
                        activeDemon.value = demonList.value[demonList.value.length - 1]; 
                        prettify.value.modalString = "";
                        prettify.value.modal = false;
                        break;

                    case ("skill"):
                        let skillData = JSON.parse(prettify.value.modalString);
                        let skill = new Skill();  // Create a new Skill instance
                        Object.assign(skill, skillData);  // Copy saved data into the skill instance
                        activeDemon.value.skills[this.skillSlot - 1] = skill; // Assign the skill to the active demon's skill slot
                        activeDemon.value.getVariables();
                        activeDemon.value.recalculateVitals(); // Recalculate the demon's stats
                        prettify.value.modalString = "";
                        prettify.value.modal = false;
                        prettify.value.log.push("Imported Data to skill slot #" + this.skillSlot);
                        break;
                    case ("equipment"):

                    // Adds a list of equipment to the equipmentlist
                    let equipmentData = JSON.parse(prettify.value.modalString);
                        equipmentData.forEach(ed => {
                            let item = new Equipment('', '', 0)
                            if (ed.itemType == 'Weapon') {
                                item = new Weapon('', '', 0, [], [], '');
                            } else if (ed.itemType == 'Armor') {
                                item = new Armor('', '', 0, 0, 0, []);
                            } else if (ed.itemType == 'Accessory') {
                                item = new Accessory('', '', 0, []);
                            } else {
                                return;
                            }
                            item.id = crypto.randomUUID();
                            item.equipped = false;
                            item.equipper = '';
                            Object.assign(item, ed);
                            equipmentList.value.push(item);
                        });


                        prettify.value.modalString = "";
                        prettify.value.modal = false;
                        
                        break;
                    case ("item"):
                        
                        // Imports the data from Modalstring into the ItemList
                        try {
                            let itemData = JSON.parse(prettify.value.modalString);
                            console.log("itemdata: ", itemData);
                            let item = new Equipment('', '', 0)
                            if (itemData.itemType == 'Weapon') {
                                item = new Weapon('', '', 0, [], [], '');
                            } else if (itemData.itemType == 'Armor') {
                                item = new Armor('', '', 0, 0, 0, []);
                            } else if (itemData.itemType == 'Accessory') {
                                item = new Accessory('', '', 0, []);
                            } else {
                                prettify.value.modalString = "";
                                prettify.value.modal = false;
                                return;
                            }
                            
                            Object.assign(item, itemData);
                            
                            item.id = crypto.randomUUID();
                            item.equipped = false;
                            item.equipper = '';
                            
                            equipmentList.value.push(item);
                            prettify.value.log.push("Imported Data as an item");
                            
                            
                            // Informs the uyser couldn't add data
                        } catch {
                            prettify.value.log.push("Could not import data");
                        }
                        
                        // Clears modal and ends case
                        prettify.value.modalString = "";
                        prettify.value.modal = false;
                        break;
                    case ("save"):

                        // Parse JSON 
                        this.fileData = JSON.parse(prettify.value.modalString);
                        localStorage.setItem("IMPORTDATA", JSON.stringify(this.fileData));
                        this.saveFile = "IMPORTDATA";
                        this.loadData();

                        prettify.value.modalString = "";
                        prettify.value.modal = false;

                        break;
                }



            } catch (error) {
                prettify.value.modal = false;
                log.value.push("Error parsing data: " + error.message);
            }
        }

        // Update fileData based on the current state of the game
        this.updateFileData = () => {

            this.fileData = {
                demons: demonList.value,
                colorScheme: colorScheme.value,
                equipment: equipmentList.value,
                universalNotes: prettify.value.universalNotes,
                version: "1.2.7"
            };
        }

        // Print the current fileData to the console nicely formatted
        this.printData = () => {
            this.updateFileData();
            console.log(JSON.stringify(this.fileData));
        }

        this.downloadData = (iType) => {

            // Initialize variables for downloading
            let skillSlot = 0;
            let fileName = "saveddata";
            let fileExtension = "json";


            // Check if it's a skill or item to know to apply from the correct slot
            if (iType.startsWith("skill")) {
                skillSlot = parseInt(iType.charAt(iType.length - 1)) || 0;
                iType = iType.slice(0, -1);
                iType = iType.trim();
            }

            if (iType.startsWith("item")) {
                skillSlot = parseInt(iType.slice(4)) || 0;
                iType = "item";
            }


            // Check the type of data being downloaded
            if (
                iType !== "demon" &&
                iType !== "skill" &&
                iType !== "save" &&
                iType !== "equipment" &&
                iType !== "item"
            ) {
                log.value.push("Invalid type for download. Use 'demon', 'skill', or 'save'.");
                return;
            }


            if (iType == "skill" && (skillSlot > 8 || skillSlot < 1)) {
                return;
            }


            // Prepares save and clears dataStr
            this.updateFileData();
            let dataStr = "";
            
            // Formates the dataStr based on Itype
            switch (iType) {
                case ("demon"): dataStr = JSON.stringify(activeDemon.value, null, 2); fileExtension = "dmn"; fileName = activeDemon.value.name; break;
                case ("save"): dataStr = JSON.stringify(this.fileData, null, 2); fileExtension = "rnw"; fileName = "SaveData"; break;
                case ("skill"): dataStr = JSON.stringify(activeDemon.value.skills[skillSlot - 1], null, 2); fileExtension = "skl"; fileName = activeDemon.value.skills[skillSlot - 1].name; break;
                case ("equipment"): dataStr = JSON.stringify(equipmentList.value, null, 2); fileExtension = "skl"; fileName = "EqiupmentList"; break;
                case ("item"): dataStr = JSON.stringify(equipmentList.value[skillSlot - 1], null, 2); fileExtension = "skl"; fileName = equipmentList.value[skillSlot - 1].name; break;
            }

            // Actual Downloading
            const blob = new Blob([dataStr], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName + ".json"// + fileExtension; // Default filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Load saved data from localStorage and update game state
        this.loadData = () => {
            const savedData = localStorage.getItem(this.saveFile);


            if (savedData) {

                // Checks for availablility and prepares data
                this.fileData = JSON.parse(savedData);
                if (!this.fileData.demons) { prettify.value.log.push ("Could not load data"); return; }
                demonList.value = [];
                let demonsArray = this.fileData.demons;
                equipmentList.value = this.fileData.equipment || [];

                let blackListedIDs = [];
                equipmentList.value.forEach(item => {
                    try { blackListedIDs.push(item.id) }
                    catch { }
                })


                // starts the loop of demons for the save file's demonList
                demonsArray.forEach(demonData => {

                    let demon = new Demon();  
                    assignExisting(demon, demonData);  

                    // Prepares the demon's skills
                    if (Array.isArray(demon.skills)) {
                        demon.skills = demon.skills.map(skillData => new Skill(
                            skillData.name,
                            skillData.description,
                            skillData.rollNames || [],
                            skillData.rolls || []
                        ));
                        demon.skills.forEach((skill, index) => {
                            demon.skills[index].skillType = demonData.skills[index].skillType;
                        })
                    }

                    // Turns the old weapon & armor type into the new type
                    if (demonData.weapon) {
                        let tempWeapon = new Weapon(demonData.weapon.name, demonData.weapon.description, 0, demonData.weapon.rollNames, demonData.weapon.rolls, "Weapon");
                        tempWeapon.equipper = demon.name;
                        tempWeapon.equipped = true;        
                        demon.equippedWeapon = tempWeapon;
                        equipmentList.value.push(tempWeapon);
                    }
                    
                    if (demonData.armor) {
                        let tempArmor = new Armor(demonData.armor[0], "", 0, demonData.armor[1], demonData.armor[2], []);
                        tempArmor.equipper = demon.name;
                        tempArmor.equipped = true;
                        demon.equippedArmor = tempArmor;
                        equipmentList.value.push(tempArmor);
                    }

                    
                    // Parses Accessories
                    if (demon.accessories) {
                        demon.accessories.forEach((acc, index) => {
                            if (acc[0] == ''){
                                demon.accessories[index] = {};
                            } else
                            if (Array.isArray(acc)) {
                                // console.log("#" +index + " acc[0]"+acc[0])
                                let portAcc = new Accessory(acc[0], '', 0, [acc[1]]);
                                portAcc.equipper = demon.name;
                                portAcc.equipped = true;
                                demon.accessories[index] = portAcc;
                                equipmentList.value.push(portAcc)
                            }
                        })
                    }
                    // Adds the demon and updates
                    demon.recalculateVitals();
                    demonList.value.push(demon);
                });

                // Loads the save file
                prettify.value.log.push("Loaded: " + this.saveFile);
                prettify.value.universalNotes = this.fileData.universalNotes;

                // Loads the colorscheme
                colorScheme.value = this.fileData.colorScheme || ['indigo', 'blue', 'sky', 'cyan', 'teal', 'emerald', 'green', 'purple', 'fuchsia'];


                // Set the active demon
                activeDemon.value = demonList.value[0];

                // Sync up
                demonList.value.forEach(demon => {
                    demon.getVariables();
                });

            } else {
                prettify.value.log.push("Failed to load Data");
                console.warn("Something went wrong bruv");
            }
        }


        // Save current game state to localStorage
        this.saveData = () => {
            // Update fileData before saving to ensure latest data is stored
            this.updateFileData();

            localStorage.setItem(this.saveFile, JSON.stringify(this.fileData));
        }


        this.autoSave = () => {

            // Sync up
            demonList.value.forEach(demon => {
                demon.getVariables();
            });
            this.updateFileData();
            this.saveFile = "AUTOSAVE";
            this.saveData();

        }

    }
}

// Assign existing is a function that makes it so if an object has extra keys, they are not added to the base object. Like Object.assign but without adding excess
function assignExisting(target, source) {
    for (const key of Object.keys(target)) {
        if (!Object.hasOwn(source, key)) continue;

        if (
            target[key] !== null &&
            source[key] !== null &&
            typeof target[key] === "object" &&
            typeof source[key] === "object" &&
            !Array.isArray(target[key]) &&
            !Array.isArray(source[key])
        ) {
            assignExisting(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
}
