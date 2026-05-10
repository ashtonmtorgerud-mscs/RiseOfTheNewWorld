const { createApp, ref, onMounted } = Vue;
import { Demon, Skill } from "./Demon.js";
import { demonList, activeDemon, equipmentList, modal, log, colorScheme } from '../Composables/Data.js';


// let dmdemonList.value = ref([]);
// let activeDemon.valueref(new Demon("Placeholder"));
import { prettify } from "../Composables/Prettify.js";
import { Weapon, Armor, Accessory, Equipment } from "./Equipment.js";

export class DataMaster {
    constructor() {
        // Initialize the fileData as an empty object
        this.fileData = {};
        this.saveFile = "AUTOSAVE";
        // prettify.value.modalString = "";
        this.skillSlot = 1;
        // this.selectedSkill = -1;

        // Initialize fileData with the current data
        this.uploadFromFile = (file) => {
            const selectedFile = file.target.files[0];
            // prettify.modalString = "Successful upload";
            if (!selectedFile) {
                // console.log("No file selected");
                return;
            }

            // console.log("File uploaded:", selectedFile);

            // Create a new FileReader
            const reader = new FileReader();

            // console.log(prettify.value.modalString);

            reader.onload = (event) => {
                try {
                    // Parse the file contents as JSON
                    const data = JSON.parse(event.target.result);
                    // prettify.value.modal = false;
                    prettify.value.modalString = JSON.stringify(data, null, 2); // Pretty print the JSON
                    // prettify.value.modal = true;
                    // console.log("Data loaded successfully:", data);
                    // console.log(prettify.value.modalString);
                } catch (error) {
                    console.error("Error loading data:", error);
                    // prettify.value.modalString = "Error loading JSON data.";
                    prettify.value.log.push("Error loading data: " + error);
                }
            };

            reader.readAsText(selectedFile); // Read the file as text

            // prettify.value.modalString = 'fromFunction';
        };

        this.parseFromModal = (iType) => {
            // console.log("Got Here");
            try {
                switch (iType) {
                    case ("demon"):
                        let demonData = JSON.parse(prettify.value.modalString);
                        let demon = new Demon();  // Create a new Demon instance
                        Object.assign(demon, demonData);  // Copy saved data into the demon instance
                        demon.recalculateVitals();  // Optionally recalculate stats or do any necessary setup
                        demonList.value.push(demon);
                        activeDemon.value = demonList.value[demonList.value.length - 1]; // Set the newly created demon as active
                        if (!activeDemon.value.equippedWeapon.default) {equipmentList.value.push(activeDemon.value.equippedWeapon)};
                        if (!activeDemon.value.equippedArmor.default) {equipmentList.value.push(activeDemon.value.equippedArmor)};
                        activeDemon.value.accessories.forEach(acc => {
                            if (acc.id){
                                equipmentList.value.push(acc);
                                console.log(acc);
                            }
                        });
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
                        break;
                    case ("equipment"):
                        let equipmentData = JSON.parse(prettify.value.modalString);
                        let equipment = [];  
                        

                        equipmentData.forEach(ed =>{
                            let item = new Equipment('', '', 0)
                            if (ed.itemType == 'Weapon'){
                                item = new Weapon('', '', 0, [], [], '');
                            } else if (ed.itemType == 'Armor'){
                                item = new Armor ('', '', 0, 0, 0, []);
                            } else if (ed.itemType == 'Accessory'){
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
                        console.log("got to item");
                        let itemData = JSON.parse(prettify.value.modalString);
                        let item = new Equipment('', '', 0)
                        if (itemData.itemType == 'Weapon'){
                            item = new Weapon('', '', 0, [], [], '');
                        } else if (itemData.itemType == 'Armor'){
                            item = new Armor ('', '', 0, 0, 0, []);
                        } else if (itemData.itemType == 'Accessory'){
                            item = new Accessory('', '', 0, []);
                        } else {
                            return;
                        }
                        item.id = crypto.randomUUID(); 
                        item.equipped = false;
                        item.equipper = '';
                        Object.assign(item, itemData);
                        equipmentList.value.push(item);
                        prettify.value.modalString = "";
                        prettify.value.modal = false;
                        break;
                    case ("save"):

                        // Parse JSON 
                        let iSaveData = JSON.parse(prettify.value.modalString);

                        console.log("iSaveData: ", iSaveData);

                        // Demons
                        demonList.value = [];
                        equipmentList.value = [];
                        iSaveData.demons.forEach(demon => {

                            let loopDemon = new Demon();
                            Object.assign(loopDemon, demon);
                            

                            if (loopDemon.weapon) {
                                let tempWeapon = new Weapon(loopDemon.weapon.name, loopDemon.weapon.description, 0, loopDemon.weapon.rollNames, loopDemon.weapon.rolls, "Weapon");
                                tempWeapon.equipper = loopDemon.name;
                                tempWeapon.equipped = true;

                                loopDemon.equippedWeapon = tempWeapon;
                                equipmentList.value.push(tempWeapon);
                            }

                            if (loopDemon.armor){
                                let tempArmor = new Armor(loopDemon.armor[0], "", 0, loopDemon.armor[1], loopDemon.armor[2], []);
                                console.log(loopDemon.armor[1], loopDemon.armor[2]);
                                tempArmor.equipper = loopDemon.name;
                                tempArmor.equipped = true;
                                loopDemon.equippedArmor = tempArmor;
                                equipmentList.value.push(tempArmor);
                            }

                            if (demon.accessories){
                                demon.accessories.forEach((acc, index) => {
                                    if(Array.isArray(acc) && acc[0] != ''){
                                        console.log("#" +index + " acc[0]"+acc[0])
                                        let portAcc = new Accessory(acc[0], '', 0, [acc[1]]);
                                        portAcc.equipper = demon.name;
                                        portAcc.equipped = true;
                                        demon.accessories[index] = portAcc;
                                        equipmentList.value.push(portAcc)
                                    }
                                })


                            }

                            demonList.value.push(loopDemon);

                        });
                        activeDemon.value = demonList.value[0];
                        // Close Modal

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
                // favoriteThing: "boobs",
                demons: demonList.value,
                colorScheme: colorScheme.value,
                equipment: equipmentList.value,
                universalNotes: prettify.value.universalNotes
                // army: army.value
            };
            // console.log("file data", this.fileData);
            // console.log("UpdateFileDataPrint:");
            // console.log(this.fileData);
        }

        // Print the current fileData to the console nicely formatted
        this.printData = () => {
            this.updateFileData();
            console.log(JSON.stringify(this.fileData));
        }

        this.downloadData = (iType) => {

            let skillSlot = 0;
            let fileName = "saveddata";
            let fileExtension = "json";
            if (iType.startsWith("skill") || iType.startsWith("item")) {
                skillSlot = parseInt(iType.charAt(iType.length - 1)) || 0;
                iType = iType.slice(0, -1);
                iType = iType.trim();
            }

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


            // console.log(/);
            this.updateFileData();
            let dataStr = "";
            switch (iType) {
                case ("demon"): dataStr = JSON.stringify(activeDemon.value, null, 2); fileExtension = "dmn"; fileName = activeDemon.value.name; break;
                case ("save"): dataStr = JSON.stringify(this.fileData, null, 2); fileExtension = "rnw"; fileName = "SaveData"; break;
                case ("skill"): dataStr = JSON.stringify(activeDemon.value.skills[skillSlot - 1], null, 2); fileExtension = "skl"; fileName = activeDemon.value.skills[skillSlot - 1].name; break;
                case ("equipment"): dataStr = JSON.stringify(equipmentList.value, null, 2); fileExtension = "skl"; fileName = "EqiupmentList"; break;
                case ("item"): dataStr = JSON.stringify(equipmentList.value[skillSlot - 1], null, 2); fileExtension = "skl"; fileName = equipmentList.value[skillSlot - 1].name; break;
            }

            // console.log(fileName + ".json", dataStr );
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

            // console.log(savedData);
            if (savedData) {
                this.fileData = JSON.parse(savedData);
                // console.log("savedata: ", this.fileData);
                if (this.fileData.demons.length < 1) { return; }
                // console.log("savedata 2: ", this.fileData);
                // Update the game variables with loaded data
                // console.log(this.fileData.demons);
                demonList.value = [];
                let demonsArray = this.fileData.demons;
                let equipsArray = this.fileData.equipment;
                // console.log(demonsArray);

                // Object.assign(army.value, this.fileData.army);
                demonsArray.forEach(demonData => {
                    // console.log(demonData);

                    let demon = new Demon();  // Create a new Demon instance
                    Object.assign(demon, demonData);  // Copy saved data into the demon instance


                    // Fix the weapon (assuming it's a Skill too)
                    if (demon.weapon) {
                        // demon.weapon = new Skill(
                        //     demon.weapon.name,
                        //     demon.weapon.description,
                        //     demon.weapon.rollNames || [],
                        //     demon.weapon.rolls || []
                        // );

                        demon.equippedWeapon = new Weapon(demon.weapon.name, demon.weapon.description, 0, demon.weapon.rollNames, demon.weapon.rolls, "Weapon");
                    }

                    if (demon.armor){
                        demon.equippedArmor = new Armor(demon.armor[0], "", 0, demon.armor[1], demon.armor[2], []);
                    }

                    // Reconstruct each skill in the array
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

                    if (demon.weapon) {
                                let tempWeapon = new Weapon(demon.weapon.name, demon.weapon.description, 0, demon.weapon.rollNames, demon.weapon.rolls, "Weapon");
                                tempWeapon.equipper = demon.name;
                                tempWeapon.equipped = true;

                                demon.equippedWeapon = tempWeapon;
                                equipmentList.value.push(tempWeapon);
                            }

                            if (demon.armor){
                                let tempArmor = new Armor(demon.armor[0], "", 0, demon.armor[1], demon.armor[2], []);
                                console.log(demon.armor[1], demon.armor[2]);
                                tempArmor.equipper = demon.name;
                                tempArmor.equipped = true;
                                demon.equippedArmor = tempArmor;
                                equipmentList.value.push(tempArmor);
                            }

                            if (demon.accessories){
                                demon.accessories.forEach((acc, index) => {
                                    if(Array.isArray(acc) && acc[0] != ''){
                                        console.log("#" +index + " acc[0]"+acc[0])
                                        let portAcc = new Accessory(acc[0], '', 0, [acc[1]]);
                                        portAcc.equipper = demon.name;
                                        portAcc.equipped = true;
                                        demon.accessories[index] = portAcc;
                                        equipmentList.value.push(portAcc)
                                    }
                                })


                            }


                    demon.recalculateVitals();  // Optionally recalculate stats or do any necessary setup
                    demonList.value.push(demon);  // Add the demon to the list
                });

                // console.log

                prettify.value.universalNotes = this.fileData.universalNotes;
                equipmentList.value = this.fileData.equipment || [];
                colorScheme.value = this.fileData.colorScheme || ['indigo', 'blue', 'sky', 'cyan', 'teal', 'emerald', 'green', 'purple', 'fuchsia' ];
                // console.log(this.fileData);

                // console.log(equipsArray);

                // equipsArray.forEach(equipData => {
                //     console.log("Demon Data:", demonData);
                // });


                // Set the active demon
                activeDemon.value = demonList.value[0];
                
            } else {
                
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
            // console.log("DemonList:");
            // console.log(demonList);
            this.updateFileData();
            this.saveFile = "AUTOSAVE";
            this.saveData();

        }

    }
}