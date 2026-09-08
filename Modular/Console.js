import { RollDice, dMDAS, resetRolledDice, rolledDice } from "../Models/Calculators.js";
import { activeDemon, demonList, equipmentList } from "../Composables/Data.js";
import { DataMaster } from "../Models/DataMaster.js";
import { prettify } from "../Composables/Prettify.js";
import { Skill } from "../Models/Demon.js";

// Creates the DataMaster, which handles all the data for the system
const dataMaster = new DataMaster();

// Starts the console. Taking the MessageInput string to determin an outcome
export function sendMessage(messageInput) {
    if (messageInput.trim() !== '') {
        let log = prettify.value.log;
        let lowercaseMessage = messageInput.trim().toLowerCase();

        // Check if the message starts with "/roll" 
        if (lowercaseMessage.startsWith('/roll') || lowercaseMessage.startsWith('/math')) {

            // Extract the dice notation (e.g., "3d6 + 2d10 + (4 * 5)")
            let calculation = lowercaseMessage.slice(5).trim();
            let comment = "";
            if (calculation.includes('-m')) {
                comment = calculation.split('-m')[1].trim();
                let caplet = comment.charAt(0).toUpperCase();
                let tempComment = comment.slice(1);
                comment = "C" + tempComment;

                comment = ", " + caplet + tempComment;
                calculation = calculation.split('-m')[0].trim();
            }


            // Check if ceiling or floor is being used
            let floor = false;
            let ceiling = false;
            if (calculation.includes('_floor')) { floor = true; calculation=calculation.replace('_floor', ''); }
            if (calculation.includes('_ceiling') || calculation.includes('_ceil')) { ceiling = true; calculation=calculation.replace('_ceiling', ''); }
            
            
            calculation.replace(' ', '');
            let total = 0;
            resetRolledDice();

            // Now call your dMDAS function to evaluate the expression (without parentheses)
            total = dMDAS(calculation, activeDemon.value);

            if (floor) {total = Math.floor(total);}
            if (ceiling) {total = Math.ceil(total);}

            // Log the result
            prettify.value.log.push (rolledDice + 'Total: ' + total + comment);
        } else if (lowercaseMessage.startsWith('/xpall') || lowercaseMessage.startsWith('/expall')) {



            //Add XP
            let xpAmount = 0;
            let defeatedLevel = 0;
            let defeatedCount = 0;
            let expString = messageInput.trim().toLowerCase().replace('/expall', '').replace('/xpall', '').trim();

            if (expString.includes('l')) {
                defeatedLevel = expString.split('l')[1];
                defeatedCount = parseInt(expString.split('l')[0]) || 1;
                xpAmount = Math.floor((defeatedLevel ** 1.75) + (defeatedLevel * 1.8 * 10) / 2) * defeatedCount;
            } else {
                xpAmount = parseInt(expString);
            }



            ///Validate Data
            if (isNaN(xpAmount) || xpAmount <= 0) {
                messageInput = "";
                prettify.value.log.push ('Invalid experience amount. Use format: /xp <amount>');
            }



            let levelUpMessage = "Base EXP: " + xpAmount;

            // Adds EXP for each demon
            demonList.value.forEach(demon => {
                let personalizedEXP = xpAmount;

                if (defeatedLevel != 0) {
                    personalizedEXP = Math.floor((xpAmount * Math.max(0.1, (1 + ((defeatedLevel - demon.level) / 10)))) / 1);
                }

                demon.exp += personalizedEXP;

                levelUpMessage += '\n' + demon.name + " gained " + personalizedEXP + "EXP";


                ///Level up
                while (demon.exp >= demon.maxExp) {



                    ///Block at max level
                    if (demon.level == 99) { demon.exp = 0; demon.maxExp = 0; break }

                    ///Level up and add available points
                    demon.level++;
                    if (demon.level % 2 === 0) {
                        demon.availablePoints++;
                    }

                    levelUpMessage += '\n' + demon.name + " leveled up! (" + (demon.level - 1) + " -> " + demon.level + ")";

                    //Randomly boost stats according to the growth rates
                    let statPool = [];

                    for (let i = 0; i < 5; i++) {
                        for (let j = 0; j < demon.growthRates[i]; j++) {
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
                        demon.stats[index]++;
                    }

                    ///Cut XP, increase max XP, HP, and MP, and increase the next max EXP needed for a level up
                    demon.exp -= demon.maxExp;
                    demon.maxExp = Math.floor(demon.maxExp * 1.1 + 50);
                    let oldHP = demon.maxHp;
                    demon.maxHp = Math.floor(50 + (demon.stats[2] + demon.level + (demon.stats[4] / 10)) * 7);
                    demon.hp += (demon.maxHp - oldHP);
                    let oldMP = demon.maxMp;
                    demon.maxMp = Math.floor(32 + ((demon.stats[1] * 8) + (demon.level) + (demon.stats[4] / 4)));
                    demon.mp += (demon.maxMp - oldMP);
                    demon.getVariables();
                }
            })

            prettify.value.log.push (levelUpMessage)
        
        } else if (lowercaseMessage.startsWith('/coeff')) {


            let formattedString = lowercaseMessage.slice(6).trim();
            let checkAll = formattedString.trim().endsWith('all');
            let checkClear = formattedString.trim().startsWith('clear');

            // Checks for matches
            let matches = [...formattedString.matchAll(/\{([^}]*)\}/g)];

            // Sets the data for the new coeff
            let newCoeffName = matches[0]?.[1] || "New Coeff";
            let newCoeffBox = matches[1]?.[1] || "";

            // Checks for all or clear to see if it will add the coeff to all demons or clear all the coeffs
            if (checkAll && checkClear){
                demonList.value.forEach(demon => {
                    demon.coeffs = [];
                })
                prettify.value.log.push ("Cleared all coeffs from all demons");
            } else if (checkAll){
                demonList.value.forEach(demon => {
                    demon.coeffs.push([newCoeffName, newCoeffBox]);
                })
                prettify.value.log.push ("Added coeff (" + newCoeffName + ', ' + newCoeffBox + ') to all demons' );
            } else if (checkClear){
                activeDemon.value.coeffs = [];
                prettify.value.log.push ("Cleared all coeffs on " + activeDemon.value.name);
            } else {
                activeDemon.value.coeffs.push([newCoeffName, newCoeffBox]);
                prettify.value.log.push ("Added coeff to " + activeDemon.value.name + " (" + newCoeffName + ", " + newCoeffBox + ")");
            }

            dataMaster.autoSave();


        } else if (lowercaseMessage.startsWith('/counter')) {


            // Initializes Variables
            let formattedString = lowercaseMessage.slice(8).trim();
            let checkAll = formattedString.trim().endsWith('all');
            let checkClear = formattedString.trim().startsWith('clear');

            // Checks for matches
            let matches = [...formattedString.matchAll(/\{([^}]*)\}/g)];

            // Puts the new counter's data up
            let newCounterName = matches[0]?.[1].toUpperCase() || "NEWCTR";
            let newCounterTally = parseInt(matches[1]?.[1] || 0);


            //Checks to see if it's clearing counters, adding to all, or clearing all 
            if (checkAll && checkClear){
                demonList.value.forEach(demon => {
                    demon.counters = [];
                })
                prettify.value.log.push ("Cleared all counters from all demons");
            } else if (checkAll){
                demonList.value.forEach(demon => {
                    demon.counters.push([newCounterName, newCounterTally]);
                })
                prettify.value.log.push ("Added coeff (" + newCounterName + ', ' + newCounterTally + ') to all demons' );
            } else if (checkClear){
                activeDemon.value.counters = [];
                prettify.value.log.push ("Cleared all counters on " + activeDemon.value.name);
            } else {
                activeDemon.value.counters.push([newCounterName, newCounterTally]);
                prettify.value.log.push ("Added counters to " + activeDemon.value.name + " (" + newCounterName + ", " + newCounterTally + ")");
            }
            dataMaster.autoSave();



        } else if (lowercaseMessage.startsWith('/levelup')) {

            // Initializes variables
            let levelUpCount = parseInt(lowercaseMessage.slice(8).trim()) || 1;
            prettify.value.log.push(activeDemon.value.level+levelUpCount);
            let targetLevel = Math.min(99, activeDemon.value.level+levelUpCount);
            
            
            // Starts the leveling loop
            while (activeDemon.value.level < targetLevel) {

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
                activeDemon.value.exp = 0;
                activeDemon.value.maxExp = Math.floor(activeDemon.value.maxExp * 1.1 + 50); // Increase maxExp by 20% each level
                let oldHP = activeDemon.value.maxHp;
                activeDemon.value.maxHp = Math.floor(50 + (activeDemon.value.stats[2] + activeDemon.value.level + (activeDemon.value.stats[4] / 10)) * 7);
                activeDemon.value.hp += (activeDemon.value.maxHp - oldHP);
                let oldMP = activeDemon.value.maxMp;
                activeDemon.value.maxMp = Math.floor(32 + ((activeDemon.value.stats[1] * 8) + (activeDemon.value.level) + (activeDemon.value.stats[4] / 4)));
                activeDemon.value.mp += (activeDemon.value.maxMp - oldMP);
                activeDemon.value.getVariables();
            }

            // Logs
            prettify.value.log.push("Leved up x" + levelUpCount );


            // Adds EXP
        } else if (lowercaseMessage.startsWith('/xp') || lowercaseMessage.startsWith('/exp')) {

            //Add XP
            let xpAmount = parseInt(messageInput.trim().match(/^\/(?:xp|exp)\s+(\d+)/i)?.[1] || 0);
            activeDemon.value.exp += xpAmount;


            ///Validate Data
            if (isNaN(xpAmount) || xpAmount <= 0) {
                messageInput = "";
                prettify.value.log.push ('Invalid experience amount. Use format: /xp <amount>');
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
                activeDemon.value.getVariables();
                prettify.value.log.push (activeDemon.value.name + " has leveled up to level " + activeDemon.value.level);
            }

            prettify.value.log.push ("/XP: " + activeDemon.value.name + " gained " + xpAmount + " EXP");
        } else if (lowercaseMessage.startsWith('/hp') || lowercaseMessage.startsWith('/heal')) {


            //include damage and healing
            let calculation = "";
            if (lowercaseMessage.startsWith('/hp')) {
                calculation = lowercaseMessage.slice(3).trim();
            } else if (lowercaseMessage.startsWith('/heal')) {
                calculation = lowercaseMessage.slice(5).trim();
            }
            calculation.replace(' ', '');
            let healthAmount = parseInt(dMDAS(calculation, activeDemon.value));

            // Ensures it's a number
            if (isNaN(healthAmount)) {
                prettify.value.log.push ('Invalid health amount. Use format: /hp <amount>');
                return;
            }


            // Adds health and makes sure it's not over the max
            activeDemon.value.hp += healthAmount;
            if (activeDemon.value.hp > activeDemon.value.maxHp + activeDemon.value.hpBooster) {
                activeDemon.value.hp = activeDemon.value.maxHp + activeDemon.value.hpBooster; // Cap the healing to max HP
            }

            // Prevent negative HP
            if (activeDemon.value.hp < 0) {
                activeDemon.value.hp = 0; 
            }

            // Logs 
            prettify.value.log.push ("/HP: Gained " + healthAmount + " HP");


        } else if (lowercaseMessage.startsWith('/mp')) {

            //include damage and healing
            let calculation = lowercaseMessage.slice(3).trim();
            calculation.replace(' ', '');
            let manaAmount = parseInt(dMDAS(calculation, activeDemon.value));


            if (isNaN(manaAmount)) {
                prettify.value.log.push ('Invalid mana amount. Use format: /mp <amount>');
                messageInput = "";
                return;
            }

            // Adds MP and ensures it's not above max
            activeDemon.value.mp += manaAmount;
            if (activeDemon.value.mp > activeDemon.value.maxMp + activeDemon.value.mpBooster) {
                activeDemon.value.mp = activeDemon.value.maxMp + activeDemon.value.mpBooster; // Cap the healing to max MP
            }

            // Prevent negative MP
            if (activeDemon.value.mp < 0) {
                activeDemon.value.mp = 0; 
            }

            // Logs
            prettify.value.log.push ("/MP: Gained " + manaAmount + " MP");


        } else if (lowercaseMessage.startsWith('/bulwark')) {

            // Sets Bulwark Variables
            let doAll = false;
            if (messageInput.includes('all')){
                doAll = true
            }

            //include damage and healing
            let calculation = lowercaseMessage.slice(8).trim();
            calculation.replace(' ', '');
            let bulwarkAmount = parseInt(dMDAS(calculation, activeDemon.value));


            // Verify Bulwark is a number
            if (isNaN(bulwarkAmount)) {
                prettify.value.log.push ('Invalid health amount. Use format: /bulwark <amount>');
                return;
            }


            // Cap the healing to max HP
            activeDemon.value.bulwark += bulwarkAmount;
            if (activeDemon.value.bulwark > activeDemon.value.maxHp + activeDemon.value.hpBooster) {
                activeDemon.value.bulwark = activeDemon.value.maxHp + activeDemon.value.hpBooster; 
            }

            // Prevent negative Bulwark
            if (activeDemon.value.bulwark < 0) {
                activeDemon.value.bulwark = 0; 
            }

            // Logs
            prettify.value.log.push ("/bulwark: gained " + bulwarkAmount + " bulwark");



        } else if (lowercaseMessage.startsWith('/cost')) {

            //include damage and healing
            let calculation = lowercaseMessage.slice(5).trim();
            let hpCost = false;
            let mpCost = true;
            if (calculation.endsWith('hp')) {
                hpCost = true;
                mpCost = false;
                calculation = calculation.slice(0, -2).trim();
            }

            // Removes spaces from the calculation and puts it through dMDAS
            calculation.replace(' ', '');
            let cost = parseInt(dMDAS(calculation, activeDemon.value));
            cost = Math.ceil(cost); // Ensure cost is an integer

            // Ensures the cost is a number
            if (isNaN(cost)) {
                prettify.value.log.push ("Invalid cost amount. Use format: /cost <amount> [hp/mp]");
                messageInput = "";
                return;
            }


            // Checks if there's enough HP or MP and checks which one it's taking
            if (hpCost && activeDemon.value.hp < cost) {
                prettify.value.log.push ("/cost: Not enough HP to cover the cost of " + cost + " HP");
                messageInput = "";
            } else if (mpCost && activeDemon.value.mp < cost) {
                prettify.value.log.push ("Not enough MP to cover the cost of " + cost + " MP");
                messageInput = "";
            } else
            if (hpCost && activeDemon.value.hp >= cost) {
                activeDemon.value.hp -= cost;
                prettify.value.log.push ("/cost: cost applied: " + cost + " HP");
                messageInput = "";
            } else if (mpCost && activeDemon.value.mp >= cost) {
                activeDemon.value.mp -= cost;
                prettify.value.log.push ("/cost: cost applied: " + cost + " MP");
                messageInput = "";
            } else{
                // Log
                prettify.value.log.push ("Command executed: " + lowercaseMessage.trim() + ", but there was an unexpected error.");
            }

            


        } else if (lowercaseMessage.startsWith('/speed')) {

            // Calculates and logs battlespeed
            let battleSpeed = dMDAS("1d100+ag+(lu/2)*(fast/100)", activeDemon.value);
            prettify.value.log.push ("Calculated battlespeed equals " + Math.floor(battleSpeed));

        } else if (lowercaseMessage.startsWith('/will')) {

            // Calculate for reducing eahc ailment

            // Check whether it's getting a will roll, reducing a specific ailment, or all ailments
            let willTarget = messageInput.toLowerCase().slice(5).trim();
            let willMessage = "";

            // If will is all
            if (willTarget == "all") {

                activeDemon.value.ailments.forEach(ailment => {
                    if (!ailment[2].isNaN) {

                        // Get will reduction Math
                        let willReduction = dMDAS("1d100", activeDemon.value);
                        if (willReduction > 95) { willReduction *= 2; }
                        willReduction += Math.floor(dMDAS("(lu+(vi/2))*(wilpwr/100)", activeDemon.value));
                        console.log(willReduction);
                        willMessage += '\n' + ailment[0] + ": " + ailment[2] + " -> "
                        ailment[2] -= willReduction;
                        willMessage += Math.max(ailment[2], 0);
                        if (ailment[2] <= 0) {
                            willMessage += ' (Cured)';
                        }

                    }
                })
            }

            // Ensures the will is accurate
            let willTargetNumber = parseInt(willTarget) || 0;
            if (willTargetNumber > 0 && willTargetNumber <= activeDemon.value.ailments.length) {

                // Get will reduction Math
                let willReduction = dMDAS("1d100", activeDemon.value);
                if (willReduction > 95) { willReduction *= 2; }
                willReduction += Math.floor(dMDAS("(lu+(vi/2))*(wilpwr/100)", activeDemon.value));

                willMessage += '\n' + activeDemon.value.ailments[willTarget - 1][0] + ": " + activeDemon.value.ailments[willTarget - 1][1] + " -> "
                activeDemon.value.ailments[willTarget - 1][2] -= willReduction;
                willMessage += Math.max(activeDemon.value.ailments[willTarget - 1][1], 0);

            }
            if (willTarget == '') {
                // Get will reduction Math
                let willReduction = dMDAS("1d100", activeDemon.value);
                let gotCrit = "";
                if (willReduction > 95) { willReduction *= 2; gotCrit = " CRITICAL WILL" }

                let willBoost = Math.floor(dMDAS("lu+(vi/2)*(wilpwr/100)_floor", activeDemon.value));
                willMessage = "1d100+(lu+(vi/2))*(wilpwr/100)_floor (" + willReduction + gotCrit + "), Total: " + (willReduction + willBoost);
            }

            // Cleanup Ailments
            activeDemon.value.ailments = activeDemon.value.ailments.filter(a => a[2] > 0);

            // Log it
            prettify.value.log.push ("Will: " + willMessage);


        } else if (lowercaseMessage.startsWith('/inflict')) {


            // Initialize Variables for ailment infliction
            let input = messageInput.toLowerCase().slice(8).trim().split(" ");
            let willPower = dMDAS("1d100+(lu+vi/2)*(wilpwr/100)", activeDemon.value);
            let potency = dMDAS(input[1], activeDemon.value);

            // If the willpower 
            if (willPower > potency && potency != -1) {
                prettify.value.log.push ("Overcame potency!");
            } else {
                if (potency == -1) {potency = 100} else { potency *= 2; }
                switch (input[0]) {
                    case "burn": activeDemon.value.ailments.push(['Burning', 1, potency, 'Take fire damage at the start of each turn']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "freeze": activeDemon.value.ailments.push(['Frozen', 2, potency, '-999 eva | -5% elmtres']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "shock": activeDemon.value.ailments.push(['Shock', 3, potency, 'Next hit with a crit chance crits']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "mirage": activeDemon.value.ailments.push(['Mirage', 4, potency, '-40% allaim | Cannot pick targets']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "poison": activeDemon.value.ailments.push(['Poison', 5, potency, 'Take toxic damage at the end of each turn']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "confusion": activeDemon.value.ailments.push(['Confused', 6, potency, 'Will or skip turn, hit ally if high fail']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "seal": activeDemon.value.ailments.push(['Sealed', 7, potency, 'Cannot use skills']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "curse": activeDemon.value.ailments.push(['Cursed', 8, potency, 'Cannot recover HP/MP']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "bind": activeDemon.value.ailments.push(['Bind', 9, potency, 'Turn is skipped | -999 eva']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "charm": activeDemon.value.ailments.push(['Charmed', 10, potency, 'Will or skip, buff/heal source on high fail']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "fear": activeDemon.value.ailments.push(['Afraid', 11, potency, 'Will or skip, cannot crit']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "sleep": activeDemon.value.ailments.push(['Sleeping', 12, potency, '-999 eva | turn skipped. Cured if hit']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "rage": activeDemon.value.ailments.push(['Enraged', 13, potency, 'Always weapon attacks source of rage | -100% allres | +100% physpwr']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "exhaustion": activeDemon.value.ailments.push(['Exhaustion', 14, potency, 'Start Eeach turn: /mp -mmp/10 | -50% allres']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "enervation": activeDemon.value.ailments.push(['Enervation', 15, potency, 'Will to use skills | -50% St | -50% Ma | -50% Vi']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "bleeding": activeDemon.value.ailments.push(['Bleeding', 16, potency, 'Take damage as you recover potency']); prettify.value.log.push ("Inflicted " + input[0]); break;
                    case "mortal": activeDemon.value.ailments.push(['Mortal', 17, potency, 'REDUCE HP TO 0 AND CURE']); prettify.value.log.push ("Inflicted " + input[0]); break;
                }

                
            }

            dataMaster.autoSave();




        } else if (lowercaseMessage.startsWith('/damage')) {

            // Get variables to calculate damage
            let input = messageInput.toLowerCase();
            let useArmy = true;
            let useResistance = true;
            let useRakukaja = true;

            // check to see if it's ignoring resistance or rakukaja
            if (input.includes("_nores")) {
                useResistance = false;
                input = input.replace("_nores", "");
            }
            if (input.includes("_noraku")) {
                useRakukaja = false;
                input = input.replace("_noraku", "");
            }

            //get the raw damage
            let rawDamage = input.slice(7).trim();

            rawDamage = dMDAS(rawDamage, activeDemon.value);
            let msgRawDamage = Math.floor(rawDamage);

            // See if it's using rakukaja and reduce the damage if so
            if (useRakukaja) {
                let rakuAmount = activeDemon.value.buffs[1];
                if (activeDemon.value.guard){
                    rakuAmount++;
                }
                if (rakuAmount>4){
                    rakuAmount == 4;
                }
                rawDamage *= 1 - rakuAmount * 0.16;
            }

            // Apply defense reduction from character stats and armor
            if (useResistance) {
                rawDamage = Math.floor(rawDamage * ((200 / (200 + (((activeDemon.value.stats[2] + activeDemon.value.statsBooster[2]) + (activeDemon.value.equippedArmor.resistance + activeDemon.value.armorBooster[0])) * (1 + (((activeDemon.value.stats[2] + activeDemon.value.statsBooster[2]) + (activeDemon.value.equippedArmor.resistance + activeDemon.value.armorBooster[0])) / 30)))))));
            }

            // Make sure the final damage is at least 10
            if (rawDamage < 1) { rawDamage = 1; }
            let finalDamage = parseInt(rawDamage) || 1;

            // Reduce from bulwark if there is any
            if (activeDemon.value.bulwark >= finalDamage) { activeDemon.value.bulwark = Math.max(activeDemon.value.bulwark - finalDamage, 0); finalDamage = 0; }
            else {
                finalDamage -= activeDemon.value.bulwark
                activeDemon.value.bulwark = 0;
            }

            // Apply remaining damage to player
            activeDemon.value.hp -= finalDamage;

            if (activeDemon.value.hp < 0) { activeDemon.value.hp = 0; }

            // Handle other commands starting with "/"
            prettify.value.log.push ("/Damage: " + finalDamage + " damage received from: " + msgRawDamage);

        } else if (lowercaseMessage.startsWith('/washskills')) {

            // Check if it's for all demons
            let washall = false;
            if (messageInput.includes("all")) { washall = true }

            // Update the skills with the proper ones from the updated skills list
            fetch("Resources/skills.json").then(response => response.json()).then(data => {
                activeDemon.value.skills.forEach(skill => {
                    let skillData = data.find(dataSkill => dataSkill.name.toLowerCase() === skill.name.toLowerCase());
                    Object.assign(skill, skillData);
                });

                if (washall) {
                    demonList.value.forEach(demon => {
                        demon.skills.forEach(skill => {
                            let skillData = data.find(dataSkill => dataSkill.name.toLowerCase() === skill.name.toLowerCase());
                            Object.assign(skill, skillData);
                            console.error('all');
                        });
                        demon.getVariables();
                        demon.recalculateVitals();
                    })
                }

                activeDemon.value.getVariables();
                activeDemon.value.recalculateVitals();


            }).catch(error => {
                // return ('Skill not found: ' + skillName);
                console.error('Error fetching skill data:', error);
            });


            // Log
            prettify.value.log.push ('Skills have been washed');


        } else if (lowercaseMessage.startsWith('/wash')) {

            let portString = messageInput;
            let doAll = false;
            if (messageInput.includes('all')){
                doAll = true
            }
            // Clean the demon's HP, coefficient, ailments, etc
            activeDemon.value.getVariables();
            activeDemon.value.recalculateVitals();
            activeDemon.value.hp = activeDemon.value.maxHp + activeDemon.value.hpBooster;
            activeDemon.value.mp = activeDemon.value.maxMp + activeDemon.value.mpBooster;
            activeDemon.value.buffs = [0, 0, 0]; // Reset buffs
            activeDemon.value.ailments = []; // Reset ailments
            activeDemon.value.coefficient = 1; // Reset coefficient
            activeDemon.value.bulwark = 0;
            activeDemon.value.coeffs = [];
            activeDemon.value.counters = [];

            if (!doAll){
                prettify.value.log.push ('Demon washed and stats recalculated');
                return;
            }

            demonList.value.forEach(demon => {
                // Clean the demon's HP, coefficient, ailments, etc
                demon.getVariables();
                demon.recalculateVitals();
                demon.hp = demon.maxHp + demon.hpBooster;
                demon.mp = demon.maxMp + demon.mpBooster;
                demon.buffs = [0, 0, 0]; // Reset buffs
                demon.ailments = []; // Reset ailments
                demon.bulwark = 0;
                demon.coefficient = 1; // Reset coefficient
                demon.coeffs = [];
                demon.counters = [];

            })

            
            prettify.value.log.push ('All demons washed and stats recalculated');


        } else if (lowercaseMessage.startsWith('/fairy')) {

            // Clean the demon's HP, coefficient, ailments, etc
            activeDemon.value.getVariables();
            activeDemon.value.recalculateVitals();
            activeDemon.value.hp = activeDemon.value.maxHp + activeDemon.value.hpBooster;
            activeDemon.value.mp += Math.ceil((activeDemon.value.maxMp + activeDemon.value.mpBooster) / 10);
            activeDemon.value.mp = Math.min(activeDemon.value.mp, activeDemon.value.maxMp);
            activeDemon.value.buffs = activeDemon.value.buffs.map(b => Math.max(b, 0));
            activeDemon.value.ailments = [];
            prettify.value.log.push ('Fairy!!!!!!');

        } else if (lowercaseMessage.startsWith('/powerlevel')) {

            // Clean the demon's HP, coefficient, ailments, etc
            activeDemon.value.getVariables();
            activeDemon.value.recalculateVitals();


            prettify.value.log.push (
                'Power levels:' + '\n' +
                'Physical Power: ' + activeDemon.value.damageGenusBooster[0] + '\n' +
                'Elemental Power: ' + activeDemon.value.damageGenusBooster[1] + '\n' +
                'Mystical Power: ' + activeDemon.value.damageGenusBooster[2] + '\n' +
                'Magical Power: ' + activeDemon.value.damageGenusBooster[3] + '\n' +
                'All Power: ' + activeDemon.value.damageGenusBooster[4] + '\n' + '\n' +

                'Strike Power: ' + activeDemon.value.damageBooster[0] + '\n' +
                'Slash Power: ' + activeDemon.value.damageBooster[1] + '\n' +
                'Pierce Power: ' + activeDemon.value.damageBooster[2] + '\n' +
                'Fire Power: ' + activeDemon.value.damageBooster[3] + '\n' +
                'Ice Power: ' + activeDemon.value.damageBooster[4] + '\n' +
                'Electric Power: ' + activeDemon.value.damageBooster[5] + '\n' +
                'Force Power: ' + activeDemon.value.damageBooster[6] + '\n' +
                'Toxic Power: ' + activeDemon.value.damageBooster[7] + '\n' +
                'Psionic Power: ' + activeDemon.value.damageBooster[8] + '\n' +
                'Light Power: ' + activeDemon.value.damageBooster[9] + '\n' +
                'Gloom Power: ' + activeDemon.value.damageBooster[10] + '\n' +
                'Almighty Power: ' + activeDemon.value.damageBooster[11] + '\n' +
                'Ailment Power: ' + activeDemon.value.damageBooster[12] + '\n' +
                'Healing Power: ' + activeDemon.value.damageBooster[13] + '\n' + '\n' +

                'Aim Boosters:' + '\n' +
                'Strike Aim: ' + activeDemon.value.aimBooster[0] + '\n' +
                'Slash Aim: ' + activeDemon.value.aimBooster[1] + '\n' +
                'Pierce Aim: ' + activeDemon.value.aimBooster[2] + '\n' +
                'Fire Aim: ' + activeDemon.value.aimBooster[3] + '\n' +
                'Ice Aim: ' + activeDemon.value.aimBooster[4] + '\n' +
                'Electric Aim: ' + activeDemon.value.aimBooster[5] + '\n' +
                'Force Aim: ' + activeDemon.value.aimBooster[6] + '\n' +
                'Toxic Aim: ' + activeDemon.value.aimBooster[7] + '\n' +
                'Psionic Aim: ' + activeDemon.value.aimBooster[8] + '\n' +
                'Light Aim: ' + activeDemon.value.aimBooster[9] + '\n' +
                'Gloom Aim: ' + activeDemon.value.aimBooster[10] + '\n' +
                'Almighty Aim: ' + activeDemon.value.aimBooster[11] + '\n' + '\n' +

                'Genus Power Levels:' + '\n' +
                'Physical Genus Power: ' + activeDemon.value.damageGenusBooster[0] + '\n' +
                'Elemental Genus Power: ' + activeDemon.value.damageGenusBooster[1] + '\n' +
                'Mystical Genus Power: ' + activeDemon.value.damageGenusBooster[2] + '\n' +
                'Magical Genus Power: ' + activeDemon.value.damageGenusBooster[3] + '\n' +
                'All Genus Power: ' + activeDemon.value.damageGenusBooster[4] + '\n' + '\n' +

                'Genus Aim Levels:' + '\n' +
                'Physical Genus Aim: ' + activeDemon.value.aimGenusBooster[0] + '\n' +
                'Elemental Genus Aim: ' + activeDemon.value.aimGenusBooster[1] + '\n' +
                'Mystical Genus Aim: ' + activeDemon.value.aimGenusBooster[2] + '\n' +
                'Magical Genus Aim: ' + activeDemon.value.aimGenusBooster[3] + '\n' +
                'All Genus Aim: ' + activeDemon.value.aimGenusBooster[4] + '\n' + '\n' +

                'Ailment Power:' + '\n' +
                'Burn: ' + activeDemon.value.ailmentBooster[0] + '\n' +
                'Freeze: ' + activeDemon.value.ailmentBooster[1] + '\n' +
                'Shock: ' + activeDemon.value.ailmentBooster[2] + '\n' +
                'Mirage: ' + activeDemon.value.ailmentBooster[3] + '\n' +
                'Poison: ' + activeDemon.value.ailmentBooster[4] + '\n' +
                'Confusion: ' + activeDemon.value.ailmentBooster[5] + '\n' +
                'Mute: ' + activeDemon.value.ailmentBooster[6] + '\n' +
                'Curse: ' + activeDemon.value.ailmentBooster[7] + '\n' +
                'Bind: ' + activeDemon.value.ailmentBooster[8] + '\n' +
                'Charm: ' + activeDemon.value.ailmentBooster[9] + '\n' +
                'Fear: ' + activeDemon.value.ailmentBooster[10] + '\n' +
                'Sleep: ' + activeDemon.value.ailmentBooster[11] + '\n' +
                'Rage: ' + activeDemon.value.ailmentBooster[12] + '\n' +
                'Exhaustion: ' + activeDemon.value.ailmentBooster[13] + '\n' +
                'Enervation: ' + activeDemon.value.ailmentBooster[14] + '\n' +
                'Bleeding: ' + activeDemon.value.ailmentBooster[15] + '\n' +
                'Mortal: ' + activeDemon.value.ailmentBooster[16] + '\n' + '\n' +

                'Skill Potentials:' + '\n' +
                'Strike Potential: ' + activeDemon.value.skillPotentialBoost[0] + '\n' +
                'Slash Potential: ' + activeDemon.value.skillPotentialBoost[1] + '\n' +
                'Pierce Potential: ' + activeDemon.value.skillPotentialBoost[2] + '\n' +
                'Fire Potential: ' + activeDemon.value.skillPotentialBoost[3] + '\n' +
                'Ice Potential: ' + activeDemon.value.skillPotentialBoost[4] + '\n' +
                'Electric Potential: ' + activeDemon.value.skillPotentialBoost[5] + '\n' +
                'Force Potential: ' + activeDemon.value.skillPotentialBoost[6] + '\n' +
                'Toxic Potential: ' + activeDemon.value.skillPotentialBoost[7] + '\n' +
                'Psionic Potential: ' + activeDemon.value.skillPotentialBoost[8] + '\n' +
                'Light Potential: ' + activeDemon.value.skillPotentialBoost[9] + '\n' +
                'Gloom Potential: ' + activeDemon.value.skillPotentialBoost[10] + '\n' +
                'Almighty Potential: ' + activeDemon.value.skillPotentialBoost[11] + '\n' +
                'Ailment Potential: ' + activeDemon.value.skillPotentialBoost[12] + '\n' +
                'Healing Potential: ' + activeDemon.value.skillPotentialBoost[13] + '\n' +
                'Tactical Potential: ' + activeDemon.value.skillPotentialBoost[14] + '\n' + '\n' +

                'Affinities Resistance:' + '\n' +
                'Strike Resistance: ' + activeDemon.value.affinitiesReducer[0] + '\n' +
                'Slash Resistance: ' + activeDemon.value.affinitiesReducer[1] + '\n' +
                'Pierce Resistance: ' + activeDemon.value.affinitiesReducer[2] + '\n' +
                'Fire Resistance: ' + activeDemon.value.affinitiesReducer[3] + '\n' +
                'Ice Resistance: ' + activeDemon.value.affinitiesReducer[4] + '\n' +
                'Electric Resistance: ' + activeDemon.value.affinitiesReducer[5] + '\n' +
                'Force Resistance: ' + activeDemon.value.affinitiesReducer[6] + '\n' +
                'Toxic Resistance: ' + activeDemon.value.affinitiesReducer[7] + '\n' +
                'Psionic Resistance: ' + activeDemon.value.affinitiesReducer[8] + '\n' +
                'Light Resistance: ' + activeDemon.value.affinitiesReducer[9] + '\n' +
                'Gloom Resistance: ' + activeDemon.value.affinitiesReducer[10] + '\n' + '\n' +

                'Affinities Evasion:' + '\n' +
                'Strike Evasion: ' + activeDemon.value.affinitiesEvasion[0] + '\n' +
                'Slash Evasion: ' + activeDemon.value.affinitiesEvasion[1] + '\n' +
                'Pierce Evasion: ' + activeDemon.value.affinitiesEvasion[2] + '\n' +
                'Fire Evasion: ' + activeDemon.value.affinitiesEvasion[3] + '\n' +
                'Ice Evasion: ' + activeDemon.value.affinitiesEvasion[4] + '\n' +
                'Electric Evasion: ' + activeDemon.value.affinitiesEvasion[5] + '\n' +
                'Force Evasion: ' + activeDemon.value.affinitiesEvasion[6] + '\n' +
                'Toxic Evasion: ' + activeDemon.value.affinitiesEvasion[7] + '\n' +
                'Psionic Evasion: ' + activeDemon.value.affinitiesEvasion[8] + '\n' +
                'Light Evasion: ' + activeDemon.value.affinitiesEvasion[9] + '\n' +
                'Gloom Evasion: ' + activeDemon.value.affinitiesEvasion[10] + '\n' + '\n' +

                'Genus Resistances:' + '\n' +
                'Physical Resistance: ' + activeDemon.value.affinitiesGenusReducer[0] + '\n' +
                'Elemental Resistance: ' + activeDemon.value.affinitiesGenusReducer[1] + '\n' +
                'Mystical Resistance: ' + activeDemon.value.affinitiesGenusReducer[2] + '\n' +
                'Magic Resistance: ' + activeDemon.value.affinitiesGenusReducer[3] + '\n' +
                'All Resistance: ' + activeDemon.value.affinitiesGenusReducer[4] + '\n' + '\n' +

                'Genus Evasion:' + '\n' +
                'Physical Evasion: ' + activeDemon.value.affinitiesGenusEvasion[0] + '\n' +
                'Elemental Evasion: ' + activeDemon.value.affinitiesGenusEvasion[1] + '\n' +
                'Mystical Evasion: ' + activeDemon.value.affinitiesGenusEvasion[2] + '\n' +
                'Magic Evasion: ' + activeDemon.value.affinitiesGenusEvasion[3] + '\n' +
                'All Evasion: ' + activeDemon.value.affinitiesGenusEvasion[4] + '\n' + '\n' +

                'Crit Bonus: ' + activeDemon.value.critBooster + '\n' +
                'Crit Multiplier: ' + activeDemon.value.critMultiplier + '\n' + '\n' +
                
                'AllCost: ' + activeDemon.value.allCost + '\n' +
                'PhysicalCost: ' + activeDemon.value.physCost + '\n' +
                'MagicalCost: ' + activeDemon.value.magCost + '\n' + '\n' +

                'Armor Boosters:' + '\n' +
                'Armor Resistance Boost: ' + activeDemon.value.armorBooster[0] + '\n' +
                'Armor Evasion Boost: ' + activeDemon.value.armorBooster[1]

            );


        } else if (lowercaseMessage.startsWith('/display')) {


            // formates the data from the message to display the skill
            let importData = messageInput.trim().toLowerCase().slice(8).trim();
            let skillName = importData;

            // Import data from the Skills.json
            fetch("Resources/skills.json").then(response => response.json()).then(data => {
                let gotSkill = false;
                let skillData = data.find(skill => skill.name.toLowerCase().replace(/[\s']/g, '') === skillName.toLowerCase());
                
                // Get the data and turn display skill into the skill and turn on display skill stuff
                if (skillData.name != "") {
                    prettify.value.selectedSkill = skillData || new Skill("", "", [], []);
                    prettify.value.displaySkill = true;
                    gotSkill = true;
                    messageInput = '';
                    activeDemon.value.getVariables();
                    activeDemon.value.recalculateVitals();
                    prettify.value.log.push("Displayed skill: " + skillName);
                }

                // Catch incase there was a problem
                if (!gotSkill) {
                    prettify.value.log.push("Could not find a skill Display");
                    displaySkill.value = false;
                }

            }).catch(error => {
                prettify.value.log.push('Skill not found: ' + skillName);
                console.error('Error fetching skill data:', error);
            }
            );

            dataMaster.autoSave();

        } else if (lowercaseMessage.startsWith('/learn')) {

            
            let importData = messageInput.trim().toLowerCase().slice(6).trim().split(' ');
            // Get the skill data from TheRiseOfTheNewWorld/Resources/skills.json 

            let skillName = importData[0];
            if (skillName.toLowerCase() == "null") { 
                let eraseSkill = new Skill('', '', [],[] )

                if (activeDemon.value.skills[importData[1]-1]){
                    activeDemon.value.skills[importData[1]-1] = importData[0];
                }

                return;
            }

            fetch("Resources/skills.json").then(response => response.json()).then(data => {
                let skillsCount = activeDemon.value.skills.filter(skill => skill.name !== "").length;
                let gotSkill = false;
                let skillData = data.find(skill => skill.name.toLowerCase().replace(/[\s']/g, '') === skillName.toLowerCase());
                
                const skillSlot = parseInt(importData[1]) || -1;
                // console.log("activeDemon.value.skillCount " + activeDemon.value.skillCount);

                if (skillsCount > activeDemon.value.skillCount-1 && skillSlot == -1) {
                    // console.log("A skill slot is: " + skillSlot);
                    prettify.value.log.push ("All skill slots are full, please specifiy a specific slot");
                    return;
                }
                if (importData.length == 1) {
                    
                    //Find the first available slot rather than using skillsCount
                    let firstAvailableSkillSlot = 0;
                    for (let i = 0; i < 8; i++){
                        if (activeDemon.value.skills[i].name == ''){
                            firstAvailableSkillSlot = i;
                            console.log("gothere and i is equal to: " + i);
                            i+=8;
                        }
                    }

                    activeDemon.value.skills[firstAvailableSkillSlot] = skillData || new Skill("", "", [], []);
                    prettify.value.log.push ("Imported skill: " + skillName + " to slot " + (skillsCount + 1));
                    gotSkill = true;
                };
                // console.log("activeDemon.value.skillsCount is: " + activeDemon.value.skillCount);
                if (skillSlot >= 1 && skillSlot <= activeDemon.value.skillCount) {
                    console.log("C skill slot is: " + skillSlot);
                    activeDemon.value.skills[skillSlot - 1] = skillData || new Skill("", "", [], []);
                    prettify.value.log.push ("Imported skill: " + skillName + " to slot " + (skillSlot));
                    gotSkill = true;
                    messageInput = '';
                }
                activeDemon.value.getVariables();
                activeDemon.value.recalculateVitals();
                if (!gotSkill) {
                    prettify.value.log.push ("Could not find a skill slot to import to. Use /import skill <name> [slot]");
                }

            }).catch(error => {
                prettify.value.log.push ('Skill not found: ' + skillName);
                console.error('Error fetching skill data:', error);
            }
            );

            dataMaster.autoSave();


        } else if (lowercaseMessage.startsWith('/import')) {

            // Opens the import menu from the modal
            if (messageInput.trim() === '/import') {
                prettify.value.modal = true; // Open the import modal
                prettify.value.modalTab = 'import';
                prettify.value.log.push ('Import menu opened');
            }

            let importData = messageInput.trim().toLowerCase().slice(7).trim().split(' ');



            // Depreciates stuff for getting skills, replaces by /learn
            if (importData[0] === 'skill') {

                let skillName = importData[1];

                fetch("Resources/skills.json").then(response => response.json()).then(data => {
                    let skillsCount = activeDemon.value.skills.filter(skill => skill.name !== "").length;
                    let gotSkill = false;
                    let skillData = data.find(skill => skill.name.toLowerCase().replace(/[\s']/g, '') === skillName.toLowerCase());
                    const skillSlot = parseInt(importData[2]) || -1;
                    if (skillsCount > 7 && skillSlot == -1) {
                        prettify.value.log.push ("All 8 skill slots are full, please specifiy a specific slot");
                        return;
                    }
                    if (importData.length == 2) {
                        activeDemon.value.skills[skillsCount] = skillData || new Skill("", "", [], []);
                        prettify.value.log.push ("Imported skill: " + skillName + " to slot " + (skillsCount + 1));
                        gotSkill = true;
                    };

                    if (skillSlot >= 0 && skillSlot <= 8) {
                        activeDemon.value.skills[skillSlot - 1] = skillData || new Skill("", "", [], []);
                        prettify.value.log.push ("Imported skill: " + skillName + " to slot " + (skillsCount));
                        gotSkill = true;
                        messageInput = '';
                    }
                    activeDemon.value.getVariables();
                    activeDemon.value.recalculateVitals();
                    if (!gotSkill) {
                        prettify.value.log.push ("Could not find a skill slot to import to. Use /import skill <name> [slot]");
                    }

                }).catch(error => {
                    prettify.value.log.push ('Skill not found: ' + skillName);
                    console.error('Error fetching skill data:', error);
                }
                );
            }
            dataMaster.autoSave();


        
        } else if (lowercaseMessage.startsWith('/colors')) {
            
            // Opens the colors menu
            prettify.value.getColors();
            prettify.value.modalTab = 'colorSchemeEditor';
            prettify.value.modal = true;


        } else if (lowercaseMessage.startsWith('/runkus')) {

            // Turns on runkusmode, a silly scrolling easter egg
            for (let i = 0; i < 9; i++){
                prettify.value.setColors(i, 'red')
            }
            prettify.value.runkusMode = !prettify.value.runkusMode;


        } else if (lowercaseMessage.startsWith('/clear')) {
            
            // Resets the log 
            prettify.value.log = [];


        } else if (messageInput.startsWith('/deletelocalstorage') || messageInput.startsWith('/clearallsavedata')) {
            
            
            // Deletes all the localstorage
            localStorage.clear();
            prettify.value.log.push ("Cleared all saved data");



        } else if (lowercaseMessage.startsWith('/deletedemon')) {

            // Ensures the first and only demon can't be deleted
            if (demonList.value.length === 1) {
                prettify.value.log.push ('Cannot delete the last demon!');
                messageInput = '';
                return
            }


            // If there's no argumenets deletes the active demon
            if (messageInput == '/deletedemon') {
                demonList.value.forEach((demon, index) => {
                    if (demon === activeDemon.value && demon != demonList.value[0]) {
                        
                        //Clear eqmuipment ownership of the soon to be deleted demon
                        let unequipIDsList = [];
                        if (demon.equippedWeapon.id){ unequipIDsList.push(demon.equippedWeapon.id);}
                        if (demon.equippedArmor.id){ unequipIDsList.push(demon.equippedArmor.id);}
                        demon.accessories.forEach(acc =>{
                            if (acc.id){ unequipIDsList.push(acc.id);}
                        })
                        
                        // Clears equippers of items
                        equipmentList.value.forEach(itm =>{
                            if (unequipIDsList.includes(itm.id)){
                                itm.equipped = false;
                                itm.equipper = '';
                            }
                        })

                        // Cleans up the data
                        demonList.value.splice(index, 1);
                        activeDemon.value = demonList.value[0];
                        prettify.value.log.push ('Demon Deleted');
                        messageInput = '';
                        return;
                    }
                    if (demon === activeDemon.value && demon == demonList.value[0]) {

                        prettify.value.log.push ('Cannot delete the first demon');
                        messageInput = '';
                        return;
                    }
                });
                return;

            }

            // Checks for an argument for a specific demon to delete
            let index = parseInt(lowercaseMessage.slice(12).trim()) || 0;
            if (index == 0) {
                messageInput = '';
            }

            // Ensure you're not deleting the first demon
            if (index > 0 && !activeDemon.value.main) {
                

                //Clear eqmuipment ownership of the soon to be deleted demon
                let unequipIDsList = [];
                if (demonList.value[index].equippedWeapon.id){ unequipIDsList.push(demonList.value[index].equippedWeapon.id);}
                if (demonList.value[index].equippedArmor.id){ unequipIDsList.push(demonList.value[index].equippedArmor.id);}
                demonList.value[index].accessories.forEach(acc =>{
                    if (acc.id){ unequipIDsList.push(acc.id);}
                })
                        
                equipmentList.value.forEach(itm =>{
                    if (unequipIDsList.includes(itm.id)){
                        itm.equipped = false;
                        itm.equipper = '';
                    }
                })

                
                demonList.value.splice(index, 1); // Remove the demon from the list
                activeDemon.value = demonList.value[0];  // Set activeDemon to the new first demon
                prettify.value.log.push ('Demon Deleted');
            } else if (index === 0) {
                prettify.value.log.push ('Cannot delete the first demon!');
            } else {
                prettify.value.log.push ('Demon is a main demon and cannot be deleted');
            }


        } else if (lowercaseMessage.startsWith('/load')) {

            // Loads data from localstorage using datamaster
            if (lowercaseMessage.split(' ').length > 1) {
                dataMaster.saveFile = lowercaseMessage.toUpperCase().split(' ')[1];
            } else {
                dataMaster.saveFile = "SAVEDATA";
            }
            prettify.value.displaySkill = '';
            prettify.value.skillPage = 0;
            dataMaster.loadData();


        } else if (lowercaseMessage.startsWith('/save')) {

            // Saves data to localstorage

            // Check save slot
            if (lowercaseMessage.split(' ').length > 1) {
                dataMaster.saveFile = lowercaseMessage.toUpperCase().split(' ')[1];
            } else {
                dataMaster.saveFile = "SAVEDATA";
            }

            dataMaster.saveData();
            prettify.value.log.push ("Saved Data");

        } else if (lowercaseMessage.startsWith('/print')) {
            
            // Prints the current demon's data to the console
            console.log(activeDemon.value)
            prettify.value.log.push ("Printed Data to the Browser Console");

        } else if (lowercaseMessage.startsWith('/delete')) {

            // Deletes a savefile from the localstorage
            let trimmedMessage = lowercaseMessage.slice(7).trim().toUpperCase();
            localStorage.removeItem(trimmedMessage);
            prettify.value.log.push ("Deleted Data: " + trimmedMessage);

        } else if (lowercaseMessage.startsWith('/download')) {

            // Downloads data from localstorage
            let trimmedMessage = lowercaseMessage.slice(9).trim();
            dataMaster.downloadData(trimmedMessage);
            prettify.value.log.push ("Downloaded Data");

        } else if (lowercaseMessage.startsWith('/listofsaves') || lowercaseMessage.startsWith('/listofsaves')) {

            // Gets a list of saves from localstorage and displays them in the log 
            let listOfSaves = "";
            for (let i = 0; i < localStorage.length; i++) {
                listOfSaves += (localStorage.key(i)) + ', ';
            }

            // dataMaster.downloadData(trimmedMessage);
            prettify.value.log.push ("List of saves: " + listOfSaves);

        } else if (lowercaseMessage.startsWith('/buffs')) {

            // Alters buffs

            // Gets variables
            let checkMessage = lowercaseMessage.slice(6).trim();
            let targetBuff = -1;
            let changeMessage = "";

            // Checks which buff is being altered
            switch (checkMessage.split(' ')[0]) {
                case ('atk'): targetBuff=0; break;
                case ('def'): targetBuff=1; break;
                case ('hit'): targetBuff=2; break;
                default: targetBuff=0; break;
            }

            // Checking how much it's being altered
            let buffChangeValue = parseInt( checkMessage.split(' ')[2], activeDemon ) | 0;


            // Checking how it's being altered
            switch (checkMessage.split(' ')[1]) {
                case ('add'):  case ('increase'): activeDemon.value.buffs[targetBuff] += buffChangeValue; changeMessage="increased by"; break;
                case ('set'):  case ('equals'): activeDemon.value.buffs[targetBuff] = buffChangeValue; changeMessage="set to"; break;
                case ('sub'): case ('subtract'): case ('decrease'): activeDemon.value.buffs[targetBuff] -= buffChangeValue; changeMessage="decreased by"; break;
            }

            // Updating and logging
            activeDemon.value.buffs[targetBuff] = Math.max(activeDemon.value.buffs[targetBuff], -4);
            activeDemon.value.buffs[targetBuff] = Math.min(activeDemon.value.buffs[targetBuff], 4);
            prettify.value.log.push ( activeDemon.value.name + "'s " + ["ATK","DEF","HIT"][targetBuff] + " has been " + changeMessage + " " + buffChangeValue );

        } else if (lowercaseMessage.startsWith('/recalculatevitals')) {
            activeDemon.value.recalculateVitals();
            prettify.value.log.push ("/recalculatevitals: Vitals recalculated");
        } else if (lowercaseMessage.startsWith('/randomizestats')) {


            // Randomizes stats a little bit to make each demon unique, really just a DM thing
            let randomizeAmount = parseInt(lowercaseMessage.slice(15).trim()) | 0;
            if (activeDemon.value.stats.every(stat => stat > randomizeAmount) & randomizeAmount > 0 & randomizeAmount < 51 ){
                activeDemon.value.stats = activeDemon.value.stats.map (stat => {return stat -= randomizeAmount;})
                for (let i = 0; i < randomizeAmount*5; i++){
                    activeDemon.value.stats[RollDice(1, 5)-1]++;
                }
                prettify.value.log.push("Ranomzed stats with a range of " + randomizeAmount)
            } else{
                prettify.value.log.push("Could not Ranomze stats")
            }



        } else if (lowercaseMessage.startsWith('/melt')) {


            // A way to turn eqiupped equipment into a default weapon opr armor. Mostly for old data so not in the commands list
            let checkMessage = lowercaseMessage.slice(5).trim();
            if (checkMessage == "weapon"){
                activeDemon.value.defaultWeapon = activeDemon.value.equippedWeapon;
                
                equipmentList.value = equipmentList.value.filter ( item => item.id != activeDemon.value.equippedWeapon.id );
                activeDemon.value.equippedWeapon.default = true;
                prettify.value.log.push ("Equipped weapon is now the default weapon");
            } else
            if (checkMessage == "armor"){
                activeDemon.value.defaultArmor = activeDemon.value.equippedArmor;
                
                equipmentList.value = equipmentList.value.filter ( item => item.id != activeDemon.value.equippedArmor.id );
                activeDemon.value.equippedArmor.default = true;
                prettify.value.log.push ("Equipped armor is now the default armor");
            } else
            if (checkMessage == "both"){

                activeDemon.value.defaultWeapon = activeDemon.value.equippedWeapon;
                
                equipmentList.value = equipmentList.value.filter ( item => item.id != activeDemon.value.equippedWeapon.id );
                activeDemon.value.equippedWeapon.default = true;

                activeDemon.value.defaultArmor = activeDemon.value.equippedArmor;
                
                equipmentList.value = equipmentList.value.filter ( item => item.id != activeDemon.value.equippedArmor.id );
                activeDemon.value.equippedArmor.default = true;
                prettify.value.log.push ("Equipped weapon and equipped armor are now the default weapon and armor");
            }
        
        } else if (lowercaseMessage.startsWith('/help')) {

            const helpMessage = "List of commands:\n" +
                "/roll <dice_expression> or /math <expression> - Roll dice or calculate math expressions (e.g. 3d6 + 2d10 + (4 * 5)). Supports _floor and _ceiling/_ceil flags.\n" +
                "/xp <amount> or /exp <amount> - Add experience points to your active demon. Levels up automatically when XP thresholds are met.\n" +
                "/hp <amount> - Modify your demon's HP by the specified amount (positive or negative). HP is capped between -maxHp and maxHp.\n" +
                "/mp <amount> - Modify your demon's MP by the specified amount. MP cannot go below zero.\n" +
                "/bulwark <amount> - Adjust your demon's bulwark (shield) by the given amount. Caps at max HP.\n" +
                "/cost <amount> [hp/mp] - Spend MP (default) or HP (if specified) as skill cost. Example: /cost 10 (MP), /cost 5hp (HP).\n" +
                "/damage <amount> [_noarmy] [_nores] [_noraku] - Apply damage to your demon. Optional flags disable army reduction, resistance, or Rakukaja buff respectively.\n" +
                "/wash - Fully heal HP and MP, reset buffs and ailments, and recalculate stats.\n" +
                "/import skill <name> [slot] - Import a skill by name into the next available or specified skill slot (0-7).\n" +
                "/clear - Clear the message log.\n" +
                "/deletelocalstorage or /clearallsavedata - Clear all saved data from localStorage.\n" +
                "/deletedemon [index] - Delete a demon by index (cannot delete the first or main demon).\n" +
                "/load [saveFile] - Load a save file (default: SAVEDATA).\n" +
                "/save [saveFile] - Save current data to a save file (default: SAVEDATA).\n" +
                "/print - Print saved data to the browser console.\n" +
                "/delete <key> - Delete a specific key from localStorage.\n" +
                "/download <filename> - Download saved data as a file.\n" +
                "/listofsaves - List all saved data keys in localStorage.\n" +
                "/unlock <demon|army|edit|all> - Unlock specific UI tabs or features.\n" +
                "/recalculatevitals - Recalculate your demon’s vitals and stats.\n";
            prettify.value.modal = true; // Open the import modal
            prettify.value.modalTab = 'help';
            prettify.value.log.push ("Loaded help menu");

        } else if (lowercaseMessage.startsWith('/unequipall')) {
            

            // Goes through all demons and unequips all their items. Does not affect equipmentlist. It's a backup
            demonList.value.forEach(demon =>{
                demon.accessories = [{}, {}, {}];
            });
            equipmentList.value.forEach(item => {
                item.equipped = false;
                item.equipper = '';
            })


        } else if (messageInput.startsWith('/destroyallitemsforce')) {
            
            // Destroys all items incase of a glitch or something
            demonList.value.forEach(demon =>{
                demon.equippedWeapon = demon.defaultWeapon;
                demon.equippedArmor = demon.defaultArmor;
                demon.accessories = [{}, {}, {}];
            });
            equipmentList.value = [];


        } else if (lowercaseMessage.startsWith('/')) {
            
            // Handle other commands starting with "/"
            prettify.value.log.push (`${lowercaseMessage.trim()} is not a valid command`);

        } else {
            // Regular message
            prettify.value.log.push (messageInput.trim());
        }
        // Keep only the latest 100 messages
        if (prettify.value.log.length > 100) {
            prettify.value.log.shift(); // Remove the oldest message
        }

        

        // Scroll to the bottom of the message log
        setTimeout(() => {
            const messageLog = document.getElementById('messageLog');
            messageLog.scrollTop = messageLog.scrollHeight; // Scroll to the bottom of the message log
        }, 5);

    }
};