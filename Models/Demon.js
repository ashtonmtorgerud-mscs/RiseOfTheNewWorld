import { dMDAS } from "./Calculators.js";
import { Armor, Weapon } from "./Equipment.js";


export class Skill {
    constructor(iName, iDescription, iRollnames, iRolls) {
        this.name = iName;
        this.description = iDescription;
        this.rollNames = iRollnames;
        this.rolls = iRolls || [];
        this.skillType = 0;
    }
    checkRolls() {
        for (let i = this.rolls.length - 1; i >= 0; i--) {
            const rollValue = this.rolls[i]?.toString().trim();
            const rollName = this.rollNames[i]?.toString().trim();
            if (!rollValue && !rollName) {
                this.rolls.splice(i, 1);
                this.rollNames.splice(i, 1);
            }
        }

    }
}

export class Demon {
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
        this.bulwark = 0;
        this.mp = this.maxMp // Current MP
        this.exp = 0; // Current Experience Points
        this.maxExp = 43; // Maximum Experience Points for level up
        this.affinities = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.affinityMutator = [[], [], [], [], [], [], [], [], [], [], []];
        this.affinityMutatorColor = [false, false, false, false, false, false, false, false, false, false, false];
        this.ailmentResistances = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
        this.skillPotential = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.profile = [];
        this.skills = []; // Array of skills
        this.skillCount = 8;
        // this.accessoryCount = 3;

        this.buffs = [0, 0, 0];
        
        this.defaultWeapon = new Weapon('Bare Hands', 'An unarmed strike, inflicting weak strike damage to one foe', 0, ['Aim', 'Damage', 'Crit Rate', 'Damage (Crit)'], ['/roll (1d100-5+ag+lu/4+S*5)*(stkaim)*(0.16*S+1)_floor', '/roll (C*(stkpwr*(1+T*0.2)*(6+6*(st/20))))d6', '/math 96-(lu/4+ag/10+cb)*(1+S*0.16)_ceil', '/roll (C*(stkpwr*(1+T*0.2)*cm*(6+6*(st/20))))d6'], "Weapons/Fist");
        this.defaultWeapon.default = true;
        this.equippedWeapon = this.defaultWeapon;
        
        
        this.weapon = this.defaultWeapon;
        
        this.defaultArmor = new Armor("Nude", "You are naked", 0, 0, 0, []);
        this.defaultArmor.default = true;
        this.equippedArmor = this.defaultArmor;

        this.accessories = [{}, {}, {}]; // Array of accessories



        this.growthRates = [2, 2, 2, 2, 2];
        this.icon = 'Resources/DemonIcon.png';
        this.main = false;
        this.notes = "Write notes here..."
        this.ailments = []; // Array of ailments
        this.guard = false;
        this.dodge = false;
        this.description = '';
        this.birthrights = [];
        this.contract = ''; // Contract with a demon
        this.newTag = '';

        // Boosters
        this.statsBooster = [0, 0, 0, 0, 0];
        this.hpBooster = 0;
        this.mpBooster = 0;
        this.affinitiesReducer = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        this.affinitiesEvasion = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        this.skillPotentialBoost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.damageBooster = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        this.aimBooster = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        this.armorBooster = [0, 0];
        this.critBooster = 0;
        this.critMultiplier = 1.5;
        this.willPower = 1.0;
        this.speed = 1.0;
        this.carry = 1.0;

        this.allCost = 1.0;
        this.physCost = 1.0;
        this.magCost = 1.0;

        // 
        this.ailmentBooster = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];

        // 0 = phys, 1 = elemental, 2 = mystic, 3 = magic, 4 = all
        this.affinitiesGenusReducer = [1.0, 1.0, 1.0, 1.0, 1.0];
        this.affinitiesGenusEvasion = [1.0, 1.0, 1.0, 1.0, 1.0];
        this.damageGenusBooster = [1.0, 1.0, 1.0, 1.0, 1.0];
        this.aimGenusBooster = [1.0, 1.0, 1.0, 1.0, 1.0];

        this.senses = {
            see: 1.0,
            hear: 1.0,
            smell:  1.0,
            feel:  1.0,
            taste:  1.0,
            sixth:  1.0
        },

        this.academia = {
            anthropology:  1.0,
            artisanship:  1.0,
            biology:  1.0,
            engineering:  1.0,
            mathematics:  1.0,
            occultism:  1.0,
            philosophy:  1.0
        },

        this.social = {
            acting:  1.0,
            authority:  1.0,
            charm:  1.0,
            courage:  1.0,
            discernment:  1.0
        },

        this.iq = 100;

        this.iqBoost = 0;
        this.willPowerBoost = 0;
        this.speedBoost = 0;
        this.carryBoost = 0;

        this.sensesBoost = {
            see: 0.0,
            hear: 0.0,
            smell:  0.0,
            feel:  0.0,
            taste:  0.0,
            sixth:  0.0
        },

        this.academiaBoost = {
            anthropology:  0.0,
            artisanship:  0.0,
            biology:  0.0,
            engineering:  0.0,
            mathematics:  0.0,
            occultism:  0.0,
            philosophy:  0.0
        },

        this.socialBoost = {
            acting:  0.0,
            authority: 0.0,
            charm: 0.0,
            courage: 0.0,
            discernment: 0.0
        },


        this.coefficient = 1;

        // 
        this.coeffs = [];
        this.counters = [];

        for (let i = 0; i < 32; i++) {
            this.skills.push(new Skill("", "", [], []));
        }

    }

    recalculateVitals() {
        let oldHP = this.maxHp;
        this.maxHp = Math.floor(50 + (this.stats[2] + this.statsBooster[2] + this.level + ((this.stats[4] + this.statsBooster[4]) / 10)) * 7); // Maximum HP
        this.hp += (this.maxHp - oldHP);

        let oldMP = this.maxMp;
        this.maxMp = Math.floor(32 + (((this.stats[1] + this.statsBooster[1]) * 8) + this.level + ((this.stats[4] + this.statsBooster[4]) / 4))); // Maximum MP
        this.mp += (this.maxMp - oldMP);

        for (let i = 0; i < this.ailments.length; i++) {
            this.ailments.forEach((ailment, index) => {
                if (this.ailments[i][0] == ailment[0] && i != index) {
                    // console.log(this.ailments[i][0] + " matches with " + ailment[0])
                    let newPotency = Math.ceil(Math.max(this.ailments[i][2], ailment[2]) + Math.sqrt(Math.min(this.ailments[i][2], ailment[2])));
                    this.ailments[i][2] = newPotency;
                    this.ailments[index][2] = 0;
                    this.ailments = this.ailments.filter(a => a[2] > 0);
                }
            });
        }


        this.coeffs = this.coeffs.filter(
            (coeff, index, self) =>
                index === self.findIndex(c => c[0] == coeff[0] && c[1] == coeff[1])
        );

        for (let i = 0; i < this.counters.length; i++) {
            this.counters.forEach((counter, index) => {
                if (this.counters[i][0] == counter[0] && i != index) {
                    // console.log(this.ailments[i][0] + " matches with " + ailment[0])
                    let newCount = this.counters[i][1] + counter[1];
                    this.counters[i][1] = newCount;
                    this.counters[index][1] = 'replace';
                    this.counters = this.counters.filter(a => a[1] != 'replace');
                }
            });
        }


    }

    readAffinity(iAffinity) {
        switch (iAffinity) {
            case ("-"): return 1; // Neutral
            case ("Wk"): return 1.5; // Weak
            case ("Str"): return 0.5; // Strong
            case ("Nul"): return 0; // Null
            case ("Drn"): return 0; // Absorb
            case ("Rpl"): return 0; // Resist
            default: return 1; // Default to Neutral
        }
    }

    getAffinities(iIntiger){

        let index = parseInt(iIntiger);


        if (this.affinityMutator[index].length == 0 || resolveAffinityFromMix(this.affinityMutator[index]) == '-'){
            return this.affinities[index];
        }
        // return this.affinityMutator[index];
        // return "A";


        this.affinityMutatorColor[index] = true;
        return resolveAffinityFromMix(this.affinityMutator[index]);
        // return(a, b) => order.indexOf(a) > order.indexOf(b) ? a : b;


    }


    getVariables() {
        this.recalculateVitals();
        this.statsBooster = [0, 0, 0, 0, 0];
        this.hpBooster = 0;
        this.mpBooster = 0;
        this.affinityMutator = [[], [], [], [], [], [], [], [], [], [], []]; //For changing the affinity like - to Str or Nul
        this.affinityMutatorColor = [false, false, false, false, false, false, false, false, false, false, false];
        this.affinitiesReducer = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]; //For reducing damage based on affinity
        this.affinitiesEvasion = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]; //For dodging based on affinity
        this.skillPotentialBoost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //For reducing skill cosed based on affinity
        this.damageBooster = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]; // For increasing damage based on affinity
        this.aimBooster = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]; //For increasing aim based on affinity
        this.affinitiesGenusReducer = [1.0, 1.0, 1.0, 1.0, 1.0];
        this.affinitiesGenusEvasion = [1.0, 1.0, 1.0, 1.0, 1.0];
        this.damageGenusBooster = [1.0, 1.0, 1.0, 1.0, 1.0];
        this.aimGenusBooster = [1.0, 1.0, 1.0, 1.0, 1.0];
        this.ailmentBooster = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        this.armorBooster = [0, 0];


        this.critBooster = 0;
        this.critMultiplier = 1.5;

        this.allCost = 1.0;
        this.physCost = 1.0;
        this.magCost = 1.0;



        this.checkBoxes = [];


        this.iqBoost = 0;
        this.willPowerBoost = 0;
        this.speedBoost = 0;
        this.carryBoost = 0;

        this.sensesBoost = {
            see: 0.0,
            hear: 0.0,
            smell: 0.0,
            feel: 0.0,
            taste: 0.0,
            sixth: 0.0
        },

        this.academiaBoost = {
            anthropology: 0.0,
            artisanship: 0.0,
            biology: 0.0,
            engineering: 0.0,
            mathematics: 0.0,
            occultism: 0.0,
            philosophy: 0.0
        },

        this.socialBoost = {
            acting: 0.0,
            authority: 0.0,
            charm: 0.0,
            courage: 0.0,
            discernment: 0.0
        },
        

        

        // this.nextThingToDo =  "Make Each of the talents and IQ and Speed and Carry have a boost for the checkboxes, so I can edit the original",
        this.accessories.forEach(accessory => {
            // this.checkBoxes.push(accessory);
            // accessory.boxes.forEach(box => {
            // console.log( box );
            // });
            if(accessory.boxes){
                accessory.boxes.forEach(box => {
                    this.checkBoxes.push(box);
                    // console.log(box);
                })
            }
            // console.log(accessory.boxes);
            // accessory.boxes.forEach(box => {
                // this.checkBoxes.push(box);
            // })
        });
        this.equippedArmor.boxes.forEach(box => {
            this.checkBoxes.push(box);
        });
        this.equippedWeapon.rolls.forEach(roll => {
            this.checkBoxes.push(roll);
        });
        this.skills.forEach(skill => {
            skill.rolls.forEach(roll => {
                this.checkBoxes.push(roll);
            });
        });
        this.birthrights.forEach(birthright => {
            this.checkBoxes.push(birthright);
        });
        this.coeffs.forEach(coeff => {
            this.checkBoxes.push(coeff[1]);
        })
        this.ailments.forEach(ailment => {
            this.checkBoxes.push(ailment[3]);
        })

        // Replace checkBoxes with expanded version where '|' splits into multiple entries
        this.checkBoxes = this.checkBoxes
            .filter(cb => cb !== "" && cb !== " " && cb !== null && cb !== undefined)
            .flatMap(cb => {
                if (cb.includes("|")) {
                    return cb.split("|").map(c => c.trim());
                }
                return cb;
            });


        this.checkBoxes.forEach(checkBox => {
            try {
                if (checkBox.startsWith("+") || checkBox.startsWith("-")) {

                    // Variable Declaration
                    let percentage = false;
                    let percentageBoost = 1;
                    if (checkBox.split(' ')[0].endsWith('%')) { percentage = true; }
                    let valueBoost = dMDAS(checkBox.split(' ')[0], this);
                    let attributeBoost = checkBox.split(' ')[1].toLowerCase();



                    switch (attributeBoost) {

                        // Stats Boosters
                        case ("hp"): if (percentage) { percentageBoost = this.maxHp / 100 }; this.hpBooster += valueBoost * percentageBoost; break;
                        case ("mp"): if (percentage) { percentageBoost = this.maxMp / 100 }; this.mpBooster += valueBoost * percentageBoost; break;
                        case ("str"): case ("st"): case ("strength"): if (percentage) { percentageBoost = this.stats[0] / 100 }; this.statsBooster[0] += Math.floor(valueBoost * percentageBoost); break;
                        case ("mag"): case ("ma"): case ("magic"): if (percentage) { percentageBoost = this.stats[1] / 100 }; this.statsBooster[1] += Math.floor(valueBoost * percentageBoost); break;
                        case ("vit"): case ("vi"): case ("vitality"): if (percentage) { percentageBoost = this.stats[2] / 100 }; this.statsBooster[2] += Math.floor(valueBoost * percentageBoost); break;
                        case ("agi"): case ("ag"): case ("agility"): if (percentage) { percentageBoost = this.stats[3] / 100 }; this.statsBooster[3] += Math.floor(valueBoost * percentageBoost); break;
                        case ("luc"): case ("lu"): case ("luck"): if (percentage) { percentageBoost = this.stats[4] / 100 }; this.statsBooster[4] += Math.floor(valueBoost * percentageBoost); break;
                        case ("critbooster"): case ("cb"): this.critBooster += valueBoost; break;
                        case ("critmultiplier"): case ("cm"): this.critMultiplier += valueBoost; break;

                        // Damage Boosters
                        case ("strikepower"): case ("stkpwr"): this.damageBooster[0] += valueBoost * 0.01; break;
                        case ("slashpower"): case ("slhpwr"): this.damageBooster[1] += valueBoost * 0.01; break;
                        case ("piercepower"): case ("prcpwr"): this.damageBooster[2] += valueBoost * 0.01; break;
                        case ("firepower"): case ("firpwr"): this.damageBooster[3] += valueBoost * 0.01; break;
                        case ("icepower"): case ("icepwr"): this.damageBooster[4] += valueBoost * 0.01; break;
                        case ("elecpower"): case ("elcpwr"): this.damageBooster[5] += valueBoost * 0.01; break;
                        case ("forcepower"): case ("frcpwr"): this.damageBooster[6] += valueBoost * 0.01; break;
                        case ("toxicpower"): case ("toxpwr"): this.damageBooster[7] += valueBoost * 0.01; break;
                        case ("psychicpower"): case ("psypwr"): this.damageBooster[8] += valueBoost * 0.01; break;
                        case ("lightpower"): case ("lgtpwr"): this.damageBooster[9] += valueBoost * 0.01; break;
                        case ("gloompower"): case ("glmpwr"): this.damageBooster[10] += valueBoost * 0.01; break;
                        case ("almightypower"): case ("almpwr"): this.damageBooster[11] += valueBoost * 0.01; break;
                        case ("ailmentpower"): case ("ailpwr"): this.damageBooster[12] += valueBoost * 0.01; break;
                        case ("healingpower"): case ("hlgpwr"): this.damageBooster[13] += valueBoost * 0.01; break;

                        // Aim Boosters
                        case ("strikeaim"): case ("stkaim"): this.aimBooster[0] += valueBoost * 0.01; break;
                        case ("slashaIm"): case ("slhaim"): this.aimBooster[1] += valueBoost * 0.01; break;
                        case ("pierceaim"): case ("prcaim"): this.aimBooster[2] += valueBoost * 0.01; break;
                        case ("fireaim"): case ("firaim"): this.aimBooster[3] += valueBoost * 0.01; break;
                        case ("iceaim"): case ("iceaim"): this.aimBooster[4] += valueBoost * 0.01; break;
                        case ("elecaim"): case ("elcaim"): this.aimBooster[5] += valueBoost * 0.01; break;
                        case ("forceaim"): case ("frcaim"): this.aimBooster[6] += valueBoost * 0.01; break;
                        case ("toxicaim"): case ("toxaim"): this.aimBooster[7] += valueBoost * 0.01; break;
                        case ("psychicaim"): case ("psyaim"): this.aimBooster[8] += valueBoost * 0.01; break;
                        case ("lightaim"): case ("lgtaim"): this.aimBooster[9] += valueBoost * 0.01; break;
                        case ("gloomaim"): case ("glmaim"): this.aimBooster[10] += valueBoost * 0.01; break;
                        case ("almightyaim"): case ("almaim"): this.aimBooster[11] += valueBoost * 0.01; break;


                        case ("physpower"): case ("physpwr"): this.damageGenusBooster[0] += valueBoost * 0.01; break;
                        case ("elmtpower"): case ("elmtpwr"): this.damageGenusBooster[1] += valueBoost * 0.01; break;
                        case ("mystpower"): case ("mystpwr"): this.damageGenusBooster[2] += valueBoost * 0.01; break;
                        case ("magpower"): case ("magpwr"): this.damageGenusBooster[3] += valueBoost * 0.01; break;
                        case ("allpower"): case ("allpwr"): this.damageGenusBooster[4] += valueBoost * 0.01; break;

                        case ("physaim"): case ("physaim"): this.aimGenusBooster[0] += valueBoost * 0.01; break;
                        case ("elmtaim"): case ("elmtaim"): this.aimGenusBooster[1] += valueBoost * 0.01; break;
                        case ("mystaim"): case ("mystaim"): this.aimGenusBooster[2] += valueBoost * 0.01; break;
                        case ("magaim"): case ("magaim"): this.aimGenusBooster[3] += valueBoost * 0.01; break;
                        case ("allaim"): case ("allaim"): this.aimGenusBooster[4] += valueBoost * 0.01; break;


                        // Damage Boosters
                        case ("burnailment"): case ("brnail"): this.ailmentBooster[0] += valueBoost * 0.01; break;
                        case ("freezeailment"): case ("frzail"): this.ailmentBooster[1] += valueBoost * 0.01; break;
                        case ("shockailment"): case ("shkail"): this.ailmentBooster[2] += valueBoost * 0.01; break;
                        case ("mirageailment"): case ("mrgail"): this.ailmentBooster[3] += valueBoost * 0.01; break;
                        case ("poisonailment"): case ("psnail"): this.ailmentBooster[4] += valueBoost * 0.01; break;
                        case ("confusionailment"): case ("cfnail"): this.ailmentBooster[5] += valueBoost * 0.01; break;
                        case ("muteailment"): case ("mutail"): this.ailmentBooster[6] += valueBoost * 0.01; break;
                        case ("curseailment"): case ("crsail"): this.ailmentBooster[7] += valueBoost * 0.01; break;
                        case ("stunalment"): case ("stnail"): case ("binail"): this.ailmentBooster[8] += valueBoost * 0.01; break;
                        case ("charmailment"): case ("crmail"): this.ailmentBooster[9] += valueBoost * 0.01; break;
                        case ("fearailment"): case ("ferail"): this.ailmentBooster[10] += valueBoost * 0.01; break;
                        case ("sleepailment"): case ("slpail"): this.ailmentBooster[11] += valueBoost * 0.01; break;
                        case ("rageailment"): case ("rageail"): case ("ragail"): case ("rgeail"): this.ailmentBooster[12] += valueBoost * 0.01; break;
                        case ("exhaustionailment"): case ("exhail"): this.ailmentBooster[13] += valueBoost * 0.01; break;
                        case ("enervationailment"): case ("evtail"): this.ailmentBooster[14] += valueBoost * 0.01; break;
                        case ("bleedingailment"): case ("bldail"): this.ailmentBooster[15] += valueBoost * 0.01; break;
                        case ("mortalailment"): case ("mrlail"): this.ailmentBooster[16] += valueBoost * 0.01; break;


                        // Affinities Boosters
                        case ("strikepotential"): case ("stkpot"): this.skillPotentialBoost[0] += valueBoost; break;
                        case ("slashpotential"): case ("slhpot"): this.skillPotentialBoost[1] += valueBoost; break;
                        case ("piercepotential"): case ("prcpot"): this.skillPotentialBoost[2] += valueBoost; break;
                        case ("firepotential"): case ("firpot"): this.skillPotentialBoost[3] += valueBoost; break;
                        case ("icepotential"): case ("icepot"): this.skillPotentialBoost[4] += valueBoost; break;
                        case ("elecpotential"): case ("elcpot"): this.skillPotentialBoost[5] += valueBoost; break;
                        case ("forcepotential"): case ("frcpot"): this.skillPotentialBoost[6] += valueBoost; break;
                        case ("toxicpotential"): case ("toxpot"): this.skillPotentialBoost[7] += valueBoost; break;
                        case ("psychicpotential"): case ("psypot"): this.skillPotentialBoost[8] += valueBoost; break;
                        case ("lightpotential"): case ("lgtpot"): this.skillPotentialBoost[9] += valueBoost; break;
                        case ("gloompotential"): case ("glmpot"): this.skillPotentialBoost[10] += valueBoost; break;
                        case ("almightypotential"): case ("almpot"): this.skillPotentialBoost[11] += valueBoost; break;
                        case ("ailmentpotential"): case ("ailpot"): this.skillPotentialBoost[12] += valueBoost; break;
                        case ("healingpotential"): case ("hlgpot"): this.skillPotentialBoost[13] += valueBoost; break;
                        case ("tacticalpotential"): case ("tacpot"): this.skillPotentialBoost[14] += valueBoost; break;

                        // Affinities Reducers
                        case ("strikeresistance"): case ("stkres"): this.affinitiesReducer[0] *= (100 - valueBoost) / 100; break;
                        case ("slashresistance"): case ("slhres"): this.affinitiesReducer[1] *= (100 - valueBoost) / 100; break;
                        case ("pierceresistance"): case ("prcres"): this.affinitiesReducer[2] *= (100 - valueBoost) / 100; break;
                        case ("fireresistance"): case ("firres"): this.affinitiesReducer[3] *= (100 - valueBoost) / 100; break;
                        case ("iceresistance"): case ("iceres"): this.affinitiesReducer[4] *= (100 - valueBoost) / 100; break;
                        case ("elecresistance"): case ("elcres"): this.affinitiesReducer[5] *= (100 - valueBoost) / 100; break;
                        case ("forceresistance"): case ("frcres"): this.affinitiesReducer[6] *= (100 - valueBoost) / 100; break;
                        case ("toxicresistance"): case ("toxres"): this.affinitiesReducer[7] *= (100 - valueBoost) / 100; break;
                        case ("psychicresistance"): case ("psyres"): this.affinitiesReducer[8] *= (100 - valueBoost) / 100; break;
                        case ("lightresistance"): case ("lgtres"): this.affinitiesReducer[9] *= (100 - valueBoost) / 100; break;
                        case ("gloomresistance"): case ("glmres"): this.affinitiesReducer[10] *= (100 - valueBoost) / 100; break;

                        // Affinities Evasion
                        case ("strikeevasion"): case ("stkeva"): this.affinitiesEvasion[0] *= (100 + valueBoost) / 100; break;
                        case ("slashevasion"): case ("slheva"): this.affinitiesEvasion[1] *= (100 + valueBoost) / 100; break;
                        case ("pierceevasion"): case ("prceva"): this.affinitiesEvasion[2] *= (100 + valueBoost) / 100; break;
                        case ("fireevasion"): case ("fireva"): this.affinitiesEvasion[3] *= (100 + valueBoost) / 100; break;
                        case ("iceevasion"): case ("iceeva"): this.affinitiesEvasion[4] *= (100 + valueBoost) / 100; break;
                        case ("elecevasion"): case ("elceva"): this.affinitiesEvasion[5] *= (100 + valueBoost) / 100; break;
                        case ("forceevasion"): case ("frceva"): this.affinitiesEvasion[6] *= (100 + valueBoost) / 100; break;
                        case ("toxicevasion"): case ("toxeva"): this.affinitiesEvasion[7] *= (100 + valueBoost) / 100; break;
                        case ("psychicevasion"): case ("psyeva"): this.affinitiesEvasion[8] *= (100 + valueBoost) / 100; break;
                        case ("lightevasion"): case ("lgteva"): this.affinitiesEvasion[9] *= (100 + valueBoost) / 100; break;
                        case ("gloomevasion"): case ("glmeva"): this.affinitiesEvasion[10] *= (100 + valueBoost) / 100; break;

                        // Affinities Genus Reducers
                        case ("physresistance"): case ("physres"): this.affinitiesGenusReducer[0] *= (100 - valueBoost) / 100; break;
                        case ("elemresistance"): case ("elmtres"): this.affinitiesGenusReducer[1] *= (100 - valueBoost) / 100; break;
                        case ("mystresistance"): case ("mystres"): this.affinitiesGenusReducer[2] *= (100 - valueBoost) / 100; break;
                        case ("magicresistance"): case ("magres"): this.affinitiesGenusReducer[3] *= (100 - valueBoost) / 100; break;
                        case ("allresistance"): case ("allres"): this.affinitiesGenusReducer[4] *= (100 - valueBoost) / 100; break;


                        // Affinities Genus Reducers
                        case ("physevasion"): case ("physeva"): this.affinitiesGenusEvasion[0] *= 1 + (valueBoost / 100); break;
                        case ("elemevasion"): case ("elmteva"): this.affinitiesGenusEvasion[1] *= 1 + (valueBoost / 100); break;
                        case ("mystevasion"): case ("mysteva"): this.affinitiesGenusEvasion[2] *= 1 + (valueBoost / 100); break;
                        case ("magicevasion"): case ("mageva"): this.affinitiesGenusEvasion[3] *= 1 + (valueBoost / 100); break;
                        case ("allevasion"): case ("alleva"): this.affinitiesGenusEvasion[4] *= 1 + (valueBoost / 100); break;

                        case ("physicalcost"): case ("physcost"): this.physCost += valueBoost * 0.01; break;
                        case ("magicalcost"): case ("magcost"): this.magCost += valueBoost * 0.01; break;
                        case ("allcost"): this.allCost += valueBoost * 0.01; break;
                                        // this.sensesBoost.see += valueBoost * 0.01;

                        // Armor Boosters
                        case ("ares"): case ("armorresistance"): case ("aresist"): case ("armorresist"): if (percentage) { percentageBoost = this.armor[1] / 100 }; this.armorBooster[0] += valueBoost * percentageBoost; break;
                        case ("aeva"): case ("armorevasion"): case ("aevasion"): case ("armoreva"): if (percentage) { percentageBoost = this.armor[2] / 100 }; this.armorBooster[1] += valueBoost * percentageBoost; break;

                        // Evasion and Resistance Boosters
                        case ("res"): case ("resistance"): if (percentage) { percentageBoost = this.armor[1] / 100 }; this.armorBooster[0] += valueBoost * percentageBoost; break;
                        case ("eva"): case ("evasion"): if (percentage) { percentageBoost = this.armor[2] / 100 }; this.armorBooster[1] += valueBoost * percentageBoost; break;


                        case ("willpower"): case ("wilpwr"): this.willPowerBoost += valueBoost * 0.01; break;
                        case ("fast"): case ("spe"): case ("speed"): case ("spd"): this.speedBoost += valueBoost * 0.01; break;
                        case ("carry"): this.carryBoost += valueBoost * 0.01; break;

                        // Talents

                        // Sense

                        case "talsee": case "talsight": this.sensesBoost.see += valueBoost * 0.01; return;
                        case "talher": case "talhear": this.sensesBoost.hear += valueBoost * 0.01;  return;
                        case "talsml": case "talsmell": this.sensesBoost.smell += valueBoost * 0.01;  return;
                        case "talfel": case "talfeel": this.sensesBoost.feel += valueBoost * 0.01;  return;
                        case "taltst": case "taltaste": this.sensesBoost.taste += valueBoost * 0.01;  return;
                        case "talsxt": case "talsixth": this.sensesBoost.sixth += valueBoost * 0.01;  return;
                        
                        case "talatp": case "talanthropology": this.academiaBoost.anthropology += valueBoost * 0.01; return;
                        case "talart": case "talartisanship":  case "talartisan": this.academiaBoost.artisanship += valueBoost * 0.01; return;
                        case "talbio": case "talbiology": this.academiaBoost.biology += valueBoost * 0.01; return;
                        case "taleng": case "talengineer": case "talengineering": this.academiaBoost.engineering += valueBoost * 0.01; return;
                        case "talmat": case "talmath": case "talmathematics": this.academiaBoost.mathematics += valueBoost * 0.01; return;
                        case "taloct": case "taloccult": case "taloccultism": this.academiaBoost.occultism += valueBoost * 0.01; return;
                        case "talphi": case "talphilosophy": this.academiaBoost.philosophy += valueBoost * 0.01; return;
                        
                        case "talaut": case "talauthority": this.socialBoost.authority += valueBoost * 0.01; return;
                        case "talcrg": case "talcourage": this.socialBoost.courage += valueBoost * 0.01; return;
                        case "talcrm": case "talcharm": this.socialBoost.charm += valueBoost * 0.01; return;
                        case "talact": case "talacting": this.socialBoost.acting += valueBoost * 0.01; return;
                        case "taldcm": case "taldiscernment": this.socialBoost.discernment += valueBoost * 0.01; return;

                        case "iq": this.iqBoost += valueBoost; return;


                    }
                } else if (checkBox.startsWith("•")){
                    // Split the message into 2 parts
                    let checkParts = checkBox.slice(1).trim().split(' ');
                    this.affinityMutator[affinityToNumber(checkParts[1])].push(checkParts[0]);
                }
            } catch (exception) {
                console.warn(exception)
            }

        });


        // Floor all booster values to prevent decimals
        this.recalculateVitals();
        // HP and MP
        this.hpBooster = Math.floor(this.hpBooster);
        this.mpBooster = Math.floor(this.mpBooster);

        // Stats (str, mag, vit, agi, luc)
        this.statsBooster = this.statsBooster.map(Math.floor);

        // Affinities (11 elements)
        // this.affinitiesReducer = this.affinitiesReducer.map(Math.floor);

        // Skill Potentials (15 elements)
        this.skillPotentialBoost = this.skillPotentialBoost.map(Math.floor);

        // Damage Boosters (15 elements)
        // this.damageBooster = this.damageBooster.map(Math.floor);

    }


}




function affinityToNumber(iString) {
    // let affinitiesArray = ['Strike', 'Slash', 'Pierce', 'Fire', 'Ice', 'Electricity', 'Force', 'Toxic', 'Psionic', 'Light', 'Gloom'];
    let affinitiesArray = ['Strike', 'Slash', 'Pierce', 'Fire', 'Ice', 'Electricity', 'Force', 'Toxic', 'Psionic', 'Light', 'Gloom', 'Burn', 'Freeze', 'Shock', 'Mirage', 'Poison', 'Confusion', 'Seal', 'Curse', 'Bind', 'Charm', 'Fear', 'Sleep', 'Rage', 'Exhaustion', 'Enervation', 'Bleeding', 'Mortal'];
    let pickNumber = -1;
    if (iString.toLowerCase() == 'electric') { return 5 }
    affinitiesArray.forEach((affinity, index) => {
        if (iString.toLowerCase() == affinity.toLowerCase()){
            pickNumber =  index;
        }
    });
    return pickNumber;
}

function resolveAffinityFromMix(iArray){
    // console.log(iArray[0]);
    if(!Array.isArray(iArray)){
        return "-"
    }
    // console.log("gothere");
    
    let weakCount = iArray.filter(aff => { return aff.toLowerCase() == 'weak'})
    let strongCount = iArray.filter(aff => { return aff.toLowerCase() == 'resist'})
    let nullCount = iArray.filter(aff => { return aff.toLowerCase() == 'null'})
    let repelCount = iArray.filter(aff => { return aff.toLowerCase() == 'repel'})
    let drainCount = iArray.filter(aff => { return aff.toLowerCase() == 'drain'})
    let goodOnes = [...strongCount, ...nullCount, ...repelCount, ...drainCount];
    if (weakCount.length > goodOnes.length){
        return 'Wk';
    } if (weakCount.length == goodOnes.length){
        return '-';
    }
    goodOnes = goodOnes.splice(weakCount.length);
    // console.log(nullCount);
    let retVal = '-';
    switch (goodOnes[goodOnes.length-1].toLowerCase()){
        case ("weak"): retVal = 'Wk'; break;
        case ("resist"): retVal = 'Str'; break;
        case ("null"): retVal = 'Nul'; break;
        case ("drain"): retVal = 'Drn'; break;
        case ("repel"): retVal = 'Rpl'; break;
    }
    return retVal;
}


// console.log(resolveAffinityFromMix(['weak', 'weak', 'resist', 'weak',  'null']));