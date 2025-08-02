const { createApp, ref } = Vue;
document.addEventListener('DOMContentLoaded', () => {
    createApp({
        setup() {


            activePage = ref('Sheet');
            activeTab = ref('profile'); // Reactive variable for active tab
            tabs = ref(['profile', 'combat', 'notes', 'inventory']); // Array of tabs
            modal = ref(false); // Reactive variable for modal visibility
            modalTab = ref('TakeDamage');

            started = ref(true);
            introTab = ref(-1);
            let startingAmbience = ref(new Audio("Resources/IntroAudioAmbience.mp3"));
            startingAmbience.value.loop = true;
            startingAmbience.value.volume = 0.4;
            let readingText = ref("", speed = 64);
            let timeoutHandles = [];


            function RollDice(dice, sides) {
                let total = 0;
                for (let i = 0; i < dice; i++) {
                    total += Math.floor(Math.random() * sides+1);
                }
                return total;
            }

            function dMDAS(iCalculation) {


                let calculation = iCalculation;
                // console.log("dMDAS");
                // Let it be known that I programmed this shit myself, the PdMDAS function was by my own two hands, I tried to get AI to do it and it couldn't. I see no God up here besides me!
                if (calculation.includes("+") || calculation.includes("+") || calculation.includes("*") || calculation.includes("/") || calculation.includes("d")) {

                    // Gather Variables
                    let operands = calculation.split(/[+\-*/d]/)
                    let operators = [...calculation.match(/[+\-*/d]/g)];
                    let parsedOperands = [];





                    
                    // Parse Opperands
                    operands.forEach(operand => {
                        operand = operand.trim().toLowerCase();

                        // Match known keywords
                        switch (operand) {
                            case "str": case "st":
                                parsedOperands.push(activeDemon.value.stats[0]+activeDemon.value.statsBooster[0]);
                                return;
                            case "mag": case "ma":
                                parsedOperands.push(activeDemon.value.stats[1]+activeDemon.value.statsBooster[1]);
                                return;
                            case "vit": case "vi":
                                parsedOperands.push(activeDemon.value.stats[2]+activeDemon.value.statsBooster[2]);
                                return;
                            case "agi": case "ag":
                                parsedOperands.push(activeDemon.value.stats[3]+activeDemon.value.statsBooster[3]);
                                return;
                            case "luc": case "lu":
                                parsedOperands.push(activeDemon.value.stats[4]+activeDemon.value.statsBooster[4]);
                                return;
                            case "hp":
                                parsedOperands.push(activeDemon.value.hp);
                                return;
                            case "mhp":
                                parsedOperands.push(activeDemon.value.maxHp+activeDemon.value.hpBooster);
                                return;
                            case "mp":
                                parsedOperands.push(activeDemon.value.mp);
                                return;
                            case "mmp":
                                parsedOperands.push(activeDemon.value.maxMp+activeDemon.value.mpBooster);
                                return;
                            case "t":
                                parsedOperands.push(activeDemon.value.buffs[0]);
                                return;
                            case "r":
                                parsedOperands.push(activeDemon.value.buffs[1]);
                                return;
                            case "s":
                                parsedOperands.push(activeDemon.value.buffs[2]);
                                return;
                        }

                        // If not a variable, try to parse as number
                        const parsed = parseFloat(operand);
                        parsedOperands.push(isNaN(parsed) ? 0 : parsed);
                    });


                    // First, roll dice
                    for (let i = 0; i < operators.length; i++) {
                        if (operators[i] === 'd') {
                            // Perform the operation
                            parsedOperands[i] = RollDice(parsedOperands[i], parsedOperands[i + 1]);

                            // Remove the next operand since it has been used
                            parsedOperands.splice(i + 1, 1);
                            operators.splice(i, 1);  // Remove the operator as well
                            i--;  // Adjust index because we've shifted elements
                        }
                    }

                    // First, handle multiplication (*) and division (/), which have higher precedence
                    for (let i = 0; i < operators.length; i++) {
                        if (operators[i] === '*' || operators[i] === '/') {
                            // Perform the operation
                            if (operators[i] === '*') {
                                parsedOperands[i] *= parsedOperands[i + 1];
                            } else if (operators[i] === '/') {
                                parsedOperands[i] /= parsedOperands[i + 1];
                            }

                            // Remove the next operand since it has been used
                            parsedOperands.splice(i + 1, 1);
                            operators.splice(i, 1);  // Remove the operator as well
                            i--;  // Adjust index because we've shifted elements
                        }
                    }

                    // console.log('After * and / operations:', parsedOperands);

                    // Now, handle addition (+) and subtraction (-)
                    for (let i = 0; i < operators.length; i++) {
                        if (operators[i] === '+') {
                            parsedOperands[i] += parsedOperands[i + 1];
                        } else if (operators[i] === '-') {
                            parsedOperands[i] -= parsedOperands[i + 1];
                        }

                        // Remove the next operand after the operation
                        parsedOperands.splice(i + 1, 1);
                        operators.splice(i, 1);  // Remove the operator as well
                        i--;  // Adjust index because we've shifted elements
                    }

                    calculation = parsedOperands[0];

                }

                // return calculation;
                return calculation;

            }

            function startReading(iText) {

                timeoutHandles.forEach(clearTimeout);
                timeoutHandles = [];

                readingText.value = "";
                let textArray = iText.split(" ");

                //foreach in textArray
                textArray.forEach((word, index) => {
                    handle = setTimeout(() => {
                        readingText.value += (index > 0 ? " " : "") + word;
                    }, speed * index);
                    timeoutHandles.push(handle);
                });


            }

            class CharacterCreator {
                constructor() {
                    this.playerName = "Adam";
                    this.characterName = "Eve";
                    this.sex = "Male";
                    this.icon = "Resources/PersonIcon.png";
                    this.ethnicities = ["White", "Hispanic", "Asian", "Black", "Native American", "Middle Eastern", "Jeet", "Jewish", "Polynesian", "Mixed", "Other"];
                    this.selectedEthnicity = 0;
                    this.religions = ["Christian", "Agnostic", "Atheist", "Buddhist", "Jewish", "Muslim", "Hindu", "Satanist", "Pagan", "Shamenist", "Taoist", "Spiritual", "Gnostic", "Other"]
                    this.selectedReligion = 0;
                    this.activities = ["Lifting Weights", "Meditation", "Cooking a healthy meal", "Jogging", "Socializing"];
                    this.leisures = ["Sports", "Reading", "Binge Watching", "Frisbee", "Gambling"];
                    this.activityBuff = 0;
                    this.leisureBuff = 0;
                    this.keywords = [];
                    this.lifespan = 80;
                    this.married = false;
                    this.alcoholic = false;
                    this.hardDrugs = false;
                    this.baptized = false;
                    this.smoker = false;
                    this.adultry = false;
                    this.murderer = false;




                    let formattedData = JSON.stringify(this);

                    this.printMyself = () => {
                        this.characterCreate();
                        downloadFutharkFile(formattedData);
                    }

                    this.characterCreate = () => {
                        player.name = this.characterName;
                        player.stats = [2, 2, 2, 2, 2];
                        player.stats[this.activityBuff]++;
                        player.stats[this.leisureBuff]++;
                        player.icon = this.icon;
                        player.main = true;
                        player.maxHp = Math.floor(50 + (activeDemon.value.stats[2] + activeDemon.value.level + (activeDemon.value.stats[4] / 10)) * 7);
                        player.maxMp = Math.floor(32 + ((activeDemon.value.stats[1] * 8) + (activeDemon.value.level) + (activeDemon.value.stats[4] / 4)));
                        player.hp = player.maxHp;
                        player.mp = player.maxMp;
                        player.keywords.push(this.sex);
                        player.keywords.push(this.religions[this.selectedReligion]);
                        player.keywords.push(this.ethnicities[this.selectedEthnicity]);
                        if (this.married) { player.keywords.push("Baptized"); }
                        if (this.married) { player.keywords.push("Married"); }
                        if (this.alcoholic) { player.keywords.push("Alcoholic"); this.lifespan -= 20; }
                        if (this.hardDrugs) { player.keywords.push("Drug Addict"); this.lifespan -= 25; }
                        if (this.smoker) { player.keywords.push("Smoker"); this.lifespan -= 10; }
                        if (this.killer) { player.keywords.push("Killer"); }
                        if (!this.married && !this.adultry) { player.keywords.push("Chaste"); }
                        player.skills[0] = new Skill("Agi", "Mild fire damage to 1 foe", [])
                    }


                    //Create Demon
                    this.createDemon = (name) => {
                        demonList.value.push(new Demon(name, []));
                    }


                }

            }

            let characterCreator = ref(new CharacterCreator());


            // Army Class
            class Army {
                constructor(iSoldiers) {
                    this.soldiers = iSoldiers;
                    this.inactiveSoldiers = [new Soldier('Skull Servant', 10, 1, 1, 'Resources/DemonIcon.png', 1, 0)];
                    this.guard = this.soldiers[0].guard;
                    this.charges = 0;
                }

                calculateTotalPower() {
                    return this.soldiers.reduce((total, soldier) => {
                        return total + soldier.power;
                    }, 0);
                }

                swapOutInactive(oldPlace, newPlace) {
                    if (oldPlace < 0 || oldPlace >= this.inactiveSoldiers.length || newPlace < 0 || newPlace >= this.inactiveSoldiers.length) {
                        console.error('Invalid index for swapping soldiers.');
                        return;
                    }
                    let tempArmy = this.inactiveSoldiers;
                    let tempSolder = tempArmy[oldPlace];
                    tempArmy[oldPlace] = tempArmy[newPlace];
                    tempArmy[newPlace] = tempSolder;
                    army.inactiveSoldiers = tempArmy;
                }

                swapOut(oldPlace, newPlace) {
                    if (oldPlace < 0 || oldPlace >= this.soldiers.length || newPlace < 0 || newPlace >= this.soldiers.length) {
                        console.error('Invalid index for swapping soldiers.');
                        return;
                    }
                    let tempArmy = this.soldiers;
                    let tempSolder = tempArmy[oldPlace];
                    tempArmy[oldPlace] = tempArmy[newPlace];
                    tempArmy[newPlace] = tempSolder;
                    army.soldiers = tempArmy;
                }

                addSoldier() {
                    let newSoldier = new Soldier('New Soldier', 10, 1, 1, 'Resources/DemonIcon.png', 1, 1);
                    this.soldiers.push(newSoldier);
                }

                addInactiveSoldier() {
                    let newSoldier = new Soldier('New Soldier', 10, 1, 1, 'Resources/DemonIcon.png', 1, 1);
                    this.inactiveSoldiers.push(newSoldier);
                }

                deleteSoldier(index) {
                    if (index < 0 || index >= this.soldiers.length) {
                        console.error('Invalid index for deleting soldier.');
                        return;
                    }
                    // this.soldiers.push(this.soldiers[index]);
                    this.soldiers.splice(index, 1);
                }

                deleteInactiveSoldier(index) {
                    if (index < 0 || index >= this.inactiveSoldiers.length) {
                        console.error('Invalid index for deleting soldier.');
                        return;
                    }
                    this.inactiveSoldiers.splice(index, 1);
                }

                holdBack(index) {

                    this.inactiveSoldiers.push(this.soldiers[index]);
                    this.soldiers.splice(index, 1);
                }

                // Activate Soldier
                chargeIn(index) {
                    this.soldiers.push(this.inactiveSoldiers[index]);
                    this.inactiveSoldiers.splice(index, 1);
                }

                totalUnits() {
                    return this.soldiers.reduce((total, soldier) => {
                        return total + soldier.units;
                    }, 0);
                }


                takeDamage(iDamage) {
                    if (this.soldiers.length <= 0) {
                        return iDamage;
                    }

                    // Calculate damage reduction based on front liner's guard
                    let frontLiner = this.soldiers[0];
                    let guardReduction = frontLiner.guard / 100;
                    let reducedDamage = iDamage * (1 - guardReduction);
                    let armyDamage = iDamage - reducedDamage;

                    // Apply army damage to soldiers
                    let remainingArmyDamage = armyDamage;
                    let soldierIndex = 0;

                    while (remainingArmyDamage > 0 && soldierIndex < this.soldiers.length) {
                        let currentSoldier = this.soldiers[soldierIndex];
                        let totalSoldierHealth = currentSoldier.maxHp * currentSoldier.units;
                        
                        if (remainingArmyDamage >= totalSoldierHealth) {
                            // This soldier is completely destroyed
                            remainingArmyDamage -= totalSoldierHealth;
                            this.soldiers.splice(soldierIndex, 1);
                            // Don't increment soldierIndex since we removed an element
                        } else {
                            // Damage this soldier partially
                            let newTotalHealth = totalSoldierHealth - remainingArmyDamage;
                            let newUnits = Math.ceil(newTotalHealth / currentSoldier.maxHp);
                            let newHp = newTotalHealth - ((newUnits - 1) * currentSoldier.maxHp);
                            
                            // Update soldier stats
                            currentSoldier.units = newUnits;
                            currentSoldier.hp = newHp;
                            
                            remainingArmyDamage = 0;
                        }
                    }

                    // If there's still damage after destroying all soldiers, return it to player
                    if (remainingArmyDamage > 0) {
                        reducedDamage += remainingArmyDamage;
                    }

                    return reducedDamage;
                }

                totalPower() {
                    let totalPower = 0;
                    let highestPower = 0;
                    let boostingPower = 0;
                    let powers = [];

                    this.soldiers.forEach(soldier => {

                        for (let i = 0; i < soldier.units; i++) {
                            powers.push(soldier.power);
                        }
                    });

                    // Sort powers in descending order
                    powers.sort((a, b) => b - a);


                    // Boost power based on index
                    powers.forEach((power, index) => {
                        totalPower += power / (index + 1);

                    });
                    totalPower = Math.floor(totalPower);

                    // totalPower = Math.floor(highestPower + boostingPower);
                    return totalPower;
                }


            }



            // Skills for Soldiers
            class Assault {
                constructor(iName, iType, iPower, iCost) {
                    this.name = iName;
                    this.type = iType;
                    this.power = iPower;
                    this.cost = iCost;
                    this.morale = 10;

                }
            }

            // Soldier Class for Army
            class Soldier {
                constructor(
                    iName, iHealth, iPower, iGuard, iIcon, iUnits, iEndurance
                ) {
                    this.name = iName;
                    this.maxHp = iHealth;
                    this.hp = iHealth;
                    this.power = iPower;
                    this.guard = iGuard;
                    this.icon = iIcon;
                    this.units = iUnits;
                    this.endurance = iEndurance;
                    this.assaults = [new Assault('Skirmish', 'Physical', 10, 0), new Assault('Shield Wall', 'Tactical', 0, 1), new Assault('Arrow Rain', 'Physical', 4, 1)];
                }


            }



            let army = ref(new Army([
                new Soldier('Einherjar ShieldWaller', 50, 2, 20, 'Resources/DemonIcon.png', 20, 7),
                new Soldier('Angels', 31, 3, 5, 'Resources/DemonIcon.png', 40, 3),
                new Soldier('Virtues', 40, 5, 4, 'Resources/DemonIcon.png', 20, 5),


            ]));
            army.value.soldiers[1].assaults = [new Assault('Skirmish', 'Physical', 10, 0), new Assault('Humble Blessing', 'Healing', 5, 1), new Assault('Heaven\'s Arrows', 'Light', 7, 3)];



            // Demon class definition

            class Skill {
                constructor(iName, iDescription, iRollnames, iRolls ) {
                    this.name = iName;
                    this.description = iDescription;
                    this.rollNames = iRollnames;
                    this.rolls = iRolls || [];
                    this.aoe = [
                        [0, 0, 1, 0, 0],
                        [0, 1, 1, 1, 0],
                        [1, 1, 1, 1, 1],
                        [0, 1, 1, 1, 0],
                        [0, 0, 1, 0, 0]
                    ]
                }
            }


            class Demon {
                constructor(iName = "New Demon") {
                    this.name = iName;
                    this.race = 'Human';
                    this.alignment = 'Neutral';
                    this.keywords = ['Human', 'Humanoid']; // Keywords for the demon
                    this.level = 1;
                    this.availablePoints = 0;
                    this.stats = [3, 2, 2, 3, 2]; // St, Ma, Vi, Ag, Lu
                    this.maxHp = Math.floor(50 + (this.stats[2] + this.level + (this.stats[4] / 10)) * 7); // Maximum HP
                    this.hp = this.maxHp; // Current HP
                    this.maxMp = Math.floor(32 + ((this.stats[1] * 8) + (this.level) + (this.stats[4] / 4))); // Maximum MP
                    this.mp = this.maxMp // Current MP
                    this.exp = 0; // Current Experience Points
                    this.maxExp = 43; // Maximum Experience Points for level up
                    this.affinities = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]; // Array of affinities (resistances)
                    this.skillPotential = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.profile = [];
                    this.skills = []; // Array of skills
                    this.contract = ''; // Contract with a demon
                    this.buffs = [0, 0, 0]; // Buffs for St, Ma, Vi, Ag, Lu
                    this.weapon = ['Bare Hands', [],]; // Array of weapons
                    this.armor = ['Clothes', 1, 2,]; // Array of armor
                    this.accessories = [['Watch', 'Tells the Time'], ['', ''], ['', '']]; // Array of accessories
                    this.growthRates = [2, 2, 2, 2, 2];
                    this.icon = 'Resources/DemonIcon.png';
                    this.main = false;


                    // Boosters
                    this.statsBooster = [0, 0, 0, 0, 0];
                    this.hpBooster = 0;
                    this.mpBooster = 0;
                    this.affinitiesBooster = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.skillPotentialBoost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.affinitiesDamageBooster = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


                    for (let i = 0; i < 8; i++){
                        this.skills.push(new Skill("", "", [], []));
                    }

                }

                recalculateVitals() {
                    let oldHP = this.maxHp;
                    this.maxHp = Math.floor(50 + (this.stats[2] + this.level + (this.stats[4] / 10)) * 7); // Maximum HP
                    this.hp += (this.maxHp - oldHP);
                    // this.hp = this.maxHp; // Current HP
                    this.maxMp = Math.floor(32 + ((this.stats[1] * 8) + (this.level) + (this.stats[4] / 4))); // Maximum MP
                    // this.mp = this.maxMp // Current MP

                }


                getVariables(){
                    this.statsBooster = [0, 0, 0, 0, 0];
                    this.hpBooster = 0;
                    this.mpBooster = 0;
                    this.affinitiesBooster = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.skillPotentialBoost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.DamageBooster = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.checkBoxes = [];


                    this.accessories.forEach(accessory => {
                        this.checkBoxes.push(accessory[1]);
                    });
                    this.skills.forEach(skill => {
                        skill.rolls.forEach(roll => {
                            this.checkBoxes.push(roll);
                        })
                        
                    });


                    this.checkBoxes.forEach(checkBox => {
                        try {
                            if(checkBox.startsWith("+") || checkBox.startsWith("-")){
                                
                                // Variable Declaration
                                let percentage = false;
                                let percentageBoost = 1;
                                if (checkBox.split(' ')[0].endsWith('%')) { percentage = true; }
                                let valueBoost = parseInt(accessory[1].split(' ')[0]);
                                let attributeBoost = accessory[1].split(' ')[1].toLowerCase();

                                

                                switch (attributeBoost){
                                    case ("hp"): if (percentage){ percentageBoost = this.maxHp/100 }; this.hpBooster += valueBoost*percentageBoost; break;
                                    case ("mp"): if (percentage){ percentageBoost = this.maxMp/100 }; this.mpBooster += valueBoost*percentageBoost; break;
                                    case ("str"): case ("st"): case ("strength"):  if (percentage){ percentageBoost = this.stats[0]/100 }; this.statsBooster[0] += Math.floor(valueBoost*percentageBoost); break;
                                    case ("mag"): case ("ma"): case ("magic"):  if (percentage){ percentageBoost = this.stats[1]/100 }; this.statsBooster[1] += Math.floor(valueBoost*percentageBoost); break;
                                    case ("vit"): case ("vi"): case ("vitality"):  if (percentage){ percentageBoost = this.stats[1]/100 }; this.statsBooster[2] += Math.floor(valueBoost*percentageBoost); break;
                                    case ("agi"): case ("ag"): case ("agility"):  if (percentage){ percentageBoost = this.stats[1]/100 }; this.statsBooster[3] += Math.floor(valueBoost*percentageBoost); break;
                                    case ("luc"): case ("lu"): case ("luck"):  if (percentage){ percentageBoost = this.stats[1]/100 }; this.statsBooster[4] += Math.floor(valueBoost*percentageBoost); break;
                                    case ("strikedamage"): case ("stkdmg"): this.DamageBooster[0] += valueBoost; break;
                                    case ("slashdamage"):  case ("slhdmg"): this.DamageBooster[1] += valueBoost; break;
                                    case ("piercedamage"): case ("prcdmg"): this.DamageBooster[2] += valueBoost; break;
                                    case ("firedamage"):   case ("firdmg"): this.DamageBooster[3] += valueBoost; break;
                                    case ("icedamage"):    case ("icedmg"): this.DamageBooster[4] += valueBoost; break;
                                    case ("elecdamage"):   case ("elcdmg"): this.DamageBooster[5] += valueBoost; break;
                                    case ("forcedamage"):  case ("frcdmg"): this.DamageBooster[6] += valueBoost; break;
                                    case ("toxicdamage"):  case ("toxdmg"): this.DamageBooster[7] += valueBoost; break;
                                    case ("psychicdamage"):case ("psydmg"): this.DamageBooster[8] += valueBoost; break;
                                    case ("lightdamage"):  case ("lgtdmg"): this.DamageBooster[9] += valueBoost; break;
                                    case ("darkdamage"):   case ("drkdmg"): this.DamageBooster[10] += valueBoost; break;
                                    case ("strikepotential"): case ("stkpot"): this.skillPotentialBoost[0] += valueBoost; break;
                                    case ("slashpotential"):  case ("slhpot"): this.skillPotentialBoost[1] += valueBoost; break;
                                    case ("piercepotential"): case ("prcpot"): this.skillPotentialBoost[2] += valueBoost; break;
                                    case ("firepotential"):   case ("firpot"): this.skillPotentialBoost[3] += valueBoost; break;
                                    case ("icepotential"):    case ("icepot"): this.skillPotentialBoost[4] += valueBoost; break;
                                    case ("elecpotential"):   case ("elcpot"): this.skillPotentialBoost[5] += valueBoost; break;
                                    case ("forcepotential"):  case ("frcpot"): this.skillPotentialBoost[6] += valueBoost; break;
                                    case ("toxicpotential"):  case ("toxpot"): this.skillPotentialBoost[7] += valueBoost; break;
                                    case ("psychicpotential"):case ("psypot"): this.skillPotentialBoost[8] += valueBoost; break;
                                    case ("lightpotential"):  case ("lgtpot"): this.skillPotentialBoost[9] += valueBoost; break;
                                    case ("darkpotential"):   case ("drkpot"): this.skillPotentialBoost[10] += valueBoost; break;
                                    case ("almightypotential"): case ("almpot"): this.skillPotentialBoost[11] += valueBoost; break;
                                    case ("ailmentpotential"):  case ("ailpot"): this.skillPotentialBoost[12] += valueBoost; break;
                                    case ("healingpotential"):  case ("hlgpot"): this.skillPotentialBoost[13] += valueBoost; break;
                                    case ("tacticalpotential"): case ("tacpot"): this.skillPotentialBoost[14] += valueBoost; break;
                                    case ("strikeresistance"): case ("stkres"): this.affinitiesBooster[0] += valueBoost; break;
                                    case ("slashresistance"):  case ("slhres"): this.affinitiesBooster[1] += valueBoost; break;
                                    case ("pierceresistance"): case ("prcres"): this.affinitiesBooster[2] += valueBoost; break;
                                    case ("fireresistance"):   case ("firres"): this.affinitiesBooster[3] += valueBoost; break;
                                    case ("iceresistance"):    case ("iceres"): this.affinitiesBooster[4] += valueBoost; break;
                                    case ("elecresistance"):   case ("elcres"): this.affinitiesBooster[5] += valueBoost; break;
                                    case ("forceresistance"):  case ("frcres"): this.affinitiesBooster[6] += valueBoost; break;
                                    case ("toxicresistance"):  case ("toxres"): this.affinitiesBooster[7] += valueBoost; break;
                                    case ("psychicresistance"):case ("psyres"): this.affinitiesBooster[8] += valueBoost; break;
                                    case ("lightresistance"):  case ("lgtres"): this.affinitiesBooster[9] += valueBoost; break;
                                    case ("darkresistance"):   case ("drkres"): this.affinitiesBooster[10] += valueBoost; break;
                                }
                                
                            }
                            console.log(accessory[1]);
                        } catch (exception){
                            console.warn(exception)
                        }
                    });
                }


            }


            // Create a new Demon instance
            let player = new Demon("Adam");
            player.skills[0] = new Skill("Agi", "Mild fire damage to 1 foe", ['Aim', 'Damage'], ['/roll 1d100', '/roll 12d6'])
            player.getVariables();

            let demonList = ref([
                player
            ]); // List of demons
            let activeDemon = ref(player); // Currently active demon
            let selectedSkill = ref(new Skill("", "", [], []));
            let displaySkill = ref(false);


            let log = ref([]);
            let messageInput = ref('');


            let sendMessage = () => {
                if (messageInput.value.trim() !== '') {

                    let lowercaseMessage = messageInput.value.trim().toLowerCase();


                    // Check if the message starts with "/roll" 
                    if (lowercaseMessage.startsWith('/roll')) {

                        // Extract the dice notation (e.g., "3d6 + 2d10 + (4 * 5)")
                        let calculation = lowercaseMessage.slice(5).trim();
                        calculation.replace(' ', '');
                        let total = 0;


                        // Flag if floor() is used
                        let useFloor = false;

                        // Check for floor() wrapper
                        if (calculation.toLowerCase().startsWith("floor(") && calculation.endsWith(")")) {
                            useFloor = true;
                            calculation = calculation.slice(6, -1); // remove 'floor(' and ')'
                        }

                        // Function to handle parentheses by recursively evaluating them
                        function evaluateParentheses(expression) {
                            // Regex to find the innermost parentheses
                            const regex = /\(([^()]+)\)/g;

                            // Replace parentheses with evaluated results
                            while (regex.test(expression)) {
                                expression = expression.replace(regex, (match, subExpr) => {
                                    // Here, we call dMDAS to evaluate the expression inside the parentheses
                                    return dMDAS(subExpr);
                                });
                            }

                            return expression;
                        }

                        // First, process the expression to handle parentheses
                        calculation = evaluateParentheses(calculation);

                        // Now call your dMDAS function to evaluate the expression (without parentheses)
                        total = dMDAS(calculation);
                        console.log("Total: " + total)
                        // Log the result
                        log.value.push('total: ' + total);
                    } else if (lowercaseMessage.startsWith('/xp') || lowercaseMessage.startsWith('/exp')) {

                        //Add XP
                        let xpAmount = parseInt(messageInput.value.trim().match(/^\/(?:xp|exp)\s+(\d+)/i)?.[1] || 0);
                        activeDemon.value.exp += xpAmount;


                        ///Validate Data
                        if (isNaN(xpAmount) || xpAmount <= 0) {
                            log.value.push('Invalid experience amount. Use format: /xp <amount>');
                            return;
                        }

                        ///Level up
                        while (activeDemon.value.exp >= activeDemon.value.maxExp) {

                            ///Block at max level
                            if (activeDemon.value.level == 99) { activeDemon.value.exp = 0; activeDemon.value.maxExp = 0; break }

                            ///Level up and add available points
                            activeDemon.value.level++;
                            if (activeDemon.value.level % 2 === 0) {
                                activeDemon.value.availablePoints++;
                            }

                            //Randomly boost stats according to the growth rates
                            let statPool = [];

                            for (let i = 0; i < 5; i++) {
                                for (let j = 0; j < activeDemon.value.growthRates[i]; j++) {
                                    statPool.push(i);
                                }
                            }

                            // Shuffle the pool
                            for (let i = statPool.length - 1; i > 0; i--) {
                                let j = Math.floor(Math.random() * (i + 1));
                                [statPool[i], statPool[j]] = [statPool[j], statPool[i]];
                            }

                            // Increase 3 stats
                            let chosen = statPool.slice(0, 3);
                            for (let index of chosen) {
                                activeDemon.value.stats[index]++;
                            }

                            ///Cut XP, increase max XP, HP, and MP
                            activeDemon.value.exp -= activeDemon.value.maxExp;
                            activeDemon.value.maxExp = Math.floor(activeDemon.value.maxExp * 1.1 + 50); // Increase maxExp by 20% each level
                            // activeDemon.value.maxHp = Math.floor(50 + (activeDemon.value.stats[2] + activeDemon.value.level + (activeDemon.value.stats[4] / 10)) * 7);
                            let oldHP = activeDemon.value.maxHp;
                            activeDemon.value.maxHp = Math.floor(50 + (activeDemon.value.stats[2] + activeDemon.value.level + (activeDemon.value.stats[4] / 10)) * 7);
                            activeDemon.value.hp += (activeDemon.value.maxHp - oldHP);
                            let oldMP = activeDemon.value.maxMp;
                            activeDemon.value.maxMp = Math.floor(32 + ((activeDemon.value.stats[1] * 8) + (activeDemon.value.level) + (activeDemon.value.stats[4] / 4)));
                            activeDemon.value.mp += (activeDemon.value.maxMp - oldMP);
                        }

                        log.value.push(`Command executed: ${lowercaseMessage.trim()}`);
                    } else if (lowercaseMessage.startsWith('/hp')) {

                        //include damage and healing
                        let healthAmount = parseInt(messageInput.value.trim().match(/^\/(?:hp)\s+(-?\d+)/i)?.[1] || 0);


                        if (isNaN(healthAmount)) {
                            log.value.push('Invalid health amount. Use format: /hp <amount>');
                            return;
                        }



                        activeDemon.value.hp += healthAmount;
                        if (activeDemon.value.hp > activeDemon.value.maxHp+activeDemon.value.hpBooster) {
                            activeDemon.value.hp = activeDemon.value.maxHp+activeDemon.value.hpBooster; // Cap the healing to max HP
                        }

                        if (activeDemon.value.hp < -activeDemon.value.maxHp+activeDemon.value.hpBooster) {
                            activeDemon.value.hp = -activeDemon.value.maxHp+activeDemon.value.hpBooster; // Prevent negative HP
                        }




                        log.value.push(`Command executed: ${lowercaseMessage.trim()}`);
                    } else if (lowercaseMessage.startsWith('/mp')) {

                        //include damage and healing
                        let manaAmount = parseInt(messageInput.value.trim().match(/^\/(?:mp)\s+(-?\d+)/i)?.[1] || 0);


                        if (isNaN(manaAmount)) {
                            log.value.push('Invalid health amount. Use format: /mp <amount>');
                            return;
                        }

                        activeDemon.value.mp += manaAmount;
                        if (activeDemon.value.mp > activeDemon.value.maxMp+activeDemon.value.mpBooster) {
                            activeDemon.value.mp = activeDemon.value.maxMp+activeDemon.value.mpBooster; // Cap the healing to max MP
                        }

                        if (activeDemon.value.mp < 0) {
                            activeDemon.value.mp = 0; // Prevent negative MP
                        }




                        log.value.push(`Command executed: ${lowercaseMessage.trim()}`);
                    } else if (messageInput.value.startsWith('/damage')) {

                        //get the raw damage
                        let rawDamage = lowercaseMessage.slice(7).trim();

                        rawDamage = dMDAS(rawDamage);
                        // //Reduce for Army
                        // if (army.value.soldiers.length > 0) {
                        //     armyReduction = Math.max(1, Math.ceil(rawDamage * (army.value.soldiers[0].guard * 0.01)));
                        // }


                        rawDamage = Math.floor(
                            ((rawDamage *
                                (1 - activeDemon.value.
                                    buffs[1] * 0.15))) *
                            ((200 / (200 + ((activeDemon.value.stats[2] + activeDemon.value.armor[2]) *
                                (1 + ((activeDemon.value.stats[2] + activeDemon.value.armor[2]) / 30))))))
                        );

                        if (rawDamage < 1) { rawDamage = 1; }

                        activeDemon.value.hp -= rawDamage;

                        if (activeDemon.value.hp < 0) { activeDemon.value.hp = 0; }


                        // Handle other commands starting with "/"
                        log.value.push(`Command executed: ${lowercaseMessage.trim()} ` + rawDamage + 'damage taken');

                    } else if (messageInput.value.startsWith('/clear')) {
                        // Handle other commands starting with "/"
                        log.value = [];
                    } else if (messageInput.value.startsWith('/deletedemon')){

                    // Delete Demon
                    let index = parseInt(lowercaseMessage.slice(12).trim()) || 0;
                    if (index == 0){
                        messageInput.value = '';
                    }

                        


                    // Ensure you're not deleting the first demon
                    if (index > 0 && !activeDemon.main) {
                        demonList.value.splice(index, 1); // Remove the demon from the list
                        activeDemon = demonList.value[0];  // Set activeDemon to the new first demon
                        log.value.push('Demon Deleted');
                    } else if (index === 0) {
                        log.value.push('Cannot delete the first demon!');
                    } else {
                        log.value.push('Demon is a main demon and cannot be deleted');
                    }
                        

                    } else if (messageInput.value.startsWith('/')) {
                        // Handle other commands starting with "/"
                        log.value.push(`Command executed: ${lowercaseMessage.trim()}`);
                    } else {
                        // Regular message
                        log.value.push(messageInput.value.trim());
                    }
                    // Keep only the latest 100 messages
                    if (log.value.length > 100) {
                        log.value.shift(); // Remove the oldest message
                    }

                    messageInput.value = '';
                }
            };


            let getBuffShadowStyle = (buff) => {
                const absBuff = Math.abs(buff);
                if (buff === 0) return {};

                const color = buff > 0 ? '0, 191, 255' : '255, 99, 132'; // Blue or Red (RGB)
                const intensity = 0.2 + absBuff * 0.2; // Range: 0.4 - 1.0

                return {
                    boxShadow: `0 0 ${5 + absBuff * 3}px rgba(${color}, ${intensity})`

                };
            }

            function transliterateToFuthark(text) {
                const futharkMap = {
                    a: 'ᚨ', b: 'ᛒ', c: 'ᚲ', d: 'ᛞ', e: 'ᛖ', f: 'ᚠ',
                    g: 'ᚷ', h: 'ᚺ', i: 'ᛁ', j: 'ᛃ', k: 'ᚲ', l: 'ᛚ',
                    m: 'ᛗ', n: 'ᚾ', o: 'ᛟ', p: 'ᛈ', q: 'ᚲ', r: 'ᚱ',
                    s: 'ᛊ', t: 'ᛏ', u: 'ᚢ', v: 'ᚠ', w: 'ᚹ', x: 'ᛉ',
                    y: 'ᛃ', z: 'ᛉ',

                    // Optional: include space or punctuation handling
                    ' ': ' ', '.': '.', ',': ',', '!': '!', '?': '?'
                };

                return text
                    .toLowerCase()
                    .split('')
                    .map(char => futharkMap[char] || char)
                    .join('');
            }

            class damageTaker{
                constructor(){
                    this.resistanceReduce = true;
                    this.defenseReduce = true;
                    this.armyReduce = true;
                    this.coefficient = 1;

                    this.takeDamage = (damage) => {
                        messageInput = damage.toString();
                        if (this.resistanceReduce){
                            messageInput = '(' + messageInput + '*' 
                        }
                        
                    }

                }

            } 



            function downloadFutharkFile(inputText, filename = "ᚠᚢᛏᚺᚨᚱᚴᛟᚢᛏᛈᚢᛏ.txt") {
                const transliterated = transliterateToFuthark(inputText);
                const blob = new Blob([transliterated], { type: "text/plain;charset=utf-8" });

                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }


            return { activePage, activeTab, tabs, log, messageInput, sendMessage, demonList, activeDemon, player, getBuffShadowStyle, army, modal, started, introTab, readingText, startReading, startingAmbience, characterCreator, modalTab, selectedSkill, displaySkill };


        }
    }).mount('#app');
});