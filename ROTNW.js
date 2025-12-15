const { createApp, ref, onMounted } = Vue;
document.addEventListener('DOMContentLoaded', () => {
    createApp({
        setup() {

        

            activePage = ref('Sheet');
            activeTab = ref('profile'); // Reactive variable for active tab
            tabs = ref(['profile', 'combat', 'notes']); // Array of tabs
            selectedImportCategory = ref('')
            modal = ref(false); // Reactive variable for modal visibility
            modalTab = ref('import');
            unlockedTabs = ref([true, true, true, true]);

            started = ref(true);
            introTab = ref(-1);
            let startingAmbience = ref(new Audio("Resources/IntroAudioAmbience.mp3"));
            startingAmbience.value.loop = true;
            startingAmbience.value.volume = 0.4;
            let readingText = ref("", speed = 64);
            let timeoutHandles = [];
            let rolledDice = "";
            let displayAilments = ref(false);




            function RollDice(dice, sides) {
                let total = 0;
                for (let i = 0; i < dice; i++) {
                    total += Math.floor(Math.random() * sides + 1);
                }
                return total;
            }

            function dMDAS(iCalculation) {

                let calculation = iCalculation;
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



                if (calculation.includes("+") || calculation.includes("-") || calculation.includes("*") || calculation.includes("/") || calculation.includes("d")) {

                    // Gather Variables
                    let operands = calculation.split(/[+\-*/d]/)
                    let operators = [...calculation.match(/[+\-*/d]/g)];
                    let parsedOperands = [];

                    // Power Genus Calc
                    let physP = activeDemon.value.damageGenusBooster[0]*activeDemon.value.damageGenusBooster[4];
                    let elmtP = activeDemon.value.damageGenusBooster[1]*activeDemon.value.damageGenusBooster[2]*activeDemon.value.damageGenusBooster[3]*activeDemon.value.damageGenusBooster[4];
                    let mystP = activeDemon.value.damageGenusBooster[3]*activeDemon.value.damageGenusBooster[2]*activeDemon.value.damageGenusBooster[4];
                    
                    // Resist Genus Calc
                    let physR = activeDemon.value.affinitiesGenusReducer[0]*activeDemon.value.affinitiesGenusReducer[4];
                    let elmtR = activeDemon.value.affinitiesGenusReducer[1]*activeDemon.value.affinitiesGenusReducer[2]*activeDemon.value.affinitiesGenusReducer[3];
                    let mystR = activeDemon.value.affinitiesGenusReducer[3]*activeDemon.value.affinitiesGenusReducer[2]*activeDemon.value.affinitiesGenusReducer[4];
                    let allR = activeDemon.value.affinitiesGenusReducer[4];

                    // Evasion Genus Calc
                    let allEva = activeDemon.value.affinitiesGenusEvasion[4];
                    let physEva = activeDemon.value.affinitiesGenusEvasion[0]*activeDemon.value.affinitiesGenusEvasion[4];
                    let elmtEva = activeDemon.value.affinitiesGenusEvasion[1]*activeDemon.value.affinitiesGenusEvasion[2]*activeDemon.value.affinitiesGenusEvasion[3];


                    // Aim Genus Calc
                    let physAim = activeDemon.value.aimGenusBooster[0]*activeDemon.value.aimGenusBooster[4];
                    let elmtAim = activeDemon.value.aimGenusBooster[1]*activeDemon.value.aimGenusBooster[2]*activeDemon.value.aimGenusBooster[3]*activeDemon.value.aimGenusBooster[4];
                    let mystAim = activeDemon.value.aimGenusBooster[3]*activeDemon.value.aimGenusBooster[2]*activeDemon.value.aimGenusBooster[4];

                    // let elmtEva = 100;
                    console.log("allEva", allEva)
                    let mystEva = activeDemon.value.affinitiesGenusEvasion[3]*activeDemon.value.affinitiesGenusEvasion[2]*activeDemon.value.affinitiesGenusEvasion[4];
                    let guardMuch = 0;
                    let dodgeMuch = 0;
                    if (activeDemon.guard){guardMuch = 1;}
                    if (activeDemon.dodge){dodgeMuch = 1;}

                    // Parse Opperands
                    operands.forEach(operand => {
                        operand = operand.trim().toLowerCase();

                        // Match known keywords
                        switch (operand) {

                            // Stats
                            case "str": case "st": parsedOperands.push(activeDemon.value.stats[0] + activeDemon.value.statsBooster[0]); return;
                            case "mag": case "ma": parsedOperands.push(activeDemon.value.stats[1] + activeDemon.value.statsBooster[1]); return;
                            case "vit": case "vi": parsedOperands.push(activeDemon.value.stats[2] + activeDemon.value.statsBooster[2]); return;
                            case "agi": case "ag": parsedOperands.push(activeDemon.value.stats[3] + activeDemon.value.statsBooster[3]); return;
                            case "luc": case "lu": parsedOperands.push(activeDemon.value.stats[4] + activeDemon.value.statsBooster[4]); return;
                            case "hp": parsedOperands.push(activeDemon.value.hp); return;
                            case "mhp": parsedOperands.push(activeDemon.value.maxHp + activeDemon.value.hpBooster); return;
                            case "mp": parsedOperands.push(activeDemon.value.mp); return;
                            case "mmp": parsedOperands.push(activeDemon.value.maxMp + activeDemon.value.mpBooster); return;
                            case "critbooster": case "cb": parsedOperands.push(activeDemon.value.critBooster); return;

                            // Buffs
                            case "t": parsedOperands.push(activeDemon.value.buffs[0]); return;
                            case "r": parsedOperands.push( Math.min(4, activeDemon.value.buffs[1]+guardMuch)); return;
                            case "s": parsedOperands.push( Math.min(4, activeDemon.value.buffs[2]+dodgeMuch)); return;
                            case "c": parsedOperands.push(dMDAS(activeDemon.value.coefficient + "+0")); return;
                            case "armypower": parsedOperands.push(army.value.totalPower()); return;
                            case "wilpwr": case "willpower": parsedOperands.push(activeDemon.value.willPower); return; 


                            // 0 = phys, 1 = elemental, 2 = mystic, 3 = magic, 4 = all
                            

                            // Damage Boosters (renamed to use 'power' to avoid dice parsing issues)
                            case ("strikepower"): case ("stkpwr"): parsedOperands.push(activeDemon.value.damageBooster[0]*physP); return;
                            case ("slashpower"): case ("slhpwr"): parsedOperands.push(activeDemon.value.damageBooster[1]*physP); return;
                            case ("piercepower"): case ("prcpwr"): parsedOperands.push(activeDemon.value.damageBooster[2]*physP); return;
                            case ("firepower"): case ("firpwr"): parsedOperands.push(activeDemon.value.damageBooster[3]*elmtP); return;
                            case ("icepower"): case ("icepwr"): parsedOperands.push(activeDemon.value.damageBooster[4]*elmtP); return;
                            case ("elecpower"): case ("elcpwr"): parsedOperands.push(activeDemon.value.damageBooster[5]*elmtP); return;
                            case ("forcepower"): case ("frcpwr"): parsedOperands.push(activeDemon.value.damageBooster[6]*elmtP); return;
                            case ("toxicpower"): case ("toxpwr"): parsedOperands.push(activeDemon.value.damageBooster[7]*elmtP); return;
                            case ("psionicpower"): case ("psipwr"):case ("psychicpower"): case ("psypwr"): parsedOperands.push(activeDemon.value.damageBooster[8]*elmtP); return;
                            case ("lightpower"): case ("lgtpwr"): parsedOperands.push(activeDemon.value.damageBooster[9]*mystP); return;
                            case ("gloompower"): case ("glmpwr"): parsedOperands.push(activeDemon.value.damageBooster[10]*mystP); return;
                            case ("almightypower"): case ("almpwr"): parsedOperands.push(activeDemon.value.damageBooster[11]*mystP); return;
                            case ("ailmentpower"): case ("ailpwr"): parsedOperands.push(activeDemon.value.damageBooster[12]*mystP); return;
                            case ("healingpower"): case ("hlgpwr"): parsedOperands.push(activeDemon.value.damageBooster[13*mystP]); return;

                            // Aim Boosters
                            case ("strikeaim"): case ("stkaim"): parsedOperands.push(activeDemon.value.aimBooster[0] * physAim); return;
                            case ("slashaim"): case ("slhaim"): parsedOperands.push(activeDemon.value.aimBooster[1] * physAim); return;
                            case ("pierceaim"): case ("prcaim"): parsedOperands.push(activeDemon.value.aimBooster[2] * physAim); return;
                            case ("fireaim"): case ("firaim"): parsedOperands.push(activeDemon.value.aimBooster[3] * elmtAim); return;
                            case ("iceaim"): case ("iceaim"): parsedOperands.push(activeDemon.value.aimBooster[4] * elmtAim); return;
                            case ("elecaim"): case ("elcaim"): parsedOperands.push(activeDemon.value.aimBooster[5] * elmtAim); return;
                            case ("forceaim"): case ("frcaim"): parsedOperands.push(activeDemon.value.aimBooster[6] * elmtAim); return;
                            case ("toxicaim"): case ("toxim"): parsedOperands.push(activeDemon.value.aimBooster[7] * elmtAim); return;
                            case ("psionicaim"): case ("psiaim"): case ("psychicaim"): case ("psyaim"): parsedOperands.push(activeDemon.value.aimBooster[8] * elmtAim); return;
                            case ("lightaim"): case ("lgtaim"): parsedOperands.push(activeDemon.value.aimBooster[9] * mystAim); return;
                            case ("gloomaim"): case ("glmaim"): parsedOperands.push(activeDemon.value.aimBooster[10] * mystAim); return;
                            case ("almightyaim"): case ("almaim"): parsedOperands.push(activeDemon.value.aimBooster[11] * mystAim); return;


    
                            // Skill Potential
                            case ("strikepotential"): case ("stkpot"): parsedOperands.push(activeDemon.value.skillPotential[0] + activeDemon.value.skillPotentialBoost[0]); return;
                            case ("slashpotential"): case ("slhpot"): parsedOperands.push(activeDemon.value.skillPotential[1] + activeDemon.value.skillPotentialBoost[1]); return;
                            case ("piercepotential"): case ("prcpot"): parsedOperands.push(activeDemon.value.skillPotential[2] + activeDemon.value.skillPotentialBoost[2]); return;
                            case ("firepotential"): case ("firpot"): parsedOperands.push(activeDemon.value.skillPotential[3] + activeDemon.value.skillPotentialBoost[3]); return;
                            case ("icepotential"): case ("icepot"): parsedOperands.push(activeDemon.value.skillPotential[4] + activeDemon.value.skillPotentialBoost[4]); return;
                            case ("elecpotential"): case ("elcpot"): parsedOperands.push(activeDemon.value.skillPotential[5] + activeDemon.value.skillPotentialBoost[5]); return;
                            case ("forcepotential"): case ("frcpot"): parsedOperands.push(activeDemon.value.skillPotential[6] + activeDemon.value.skillPotentialBoost[6]); return;
                            case ("toxicpotential"): case ("toxpot"): parsedOperands.push(activeDemon.value.skillPotential[7] + activeDemon.value.skillPotentialBoost[7]); return;
                            case ("psionicpotential"): case ("psipot"): case ("psychicpotential"): case ("psypot"): parsedOperands.push(activeDemon.value.skillPotential[8] + activeDemon.value.skillPotentialBoost[8]); return;
                            case ("lightpotential"): case ("lgtpot"): parsedOperands.push(activeDemon.value.skillPotential[9] + activeDemon.value.skillPotentialBoost[9]); return;
                            case ("gloompotential"): case ("glmpot"): parsedOperands.push(activeDemon.value.skillPotential[10] + activeDemon.value.skillPotentialBoost[10]); return;
                            case ("almightypotential"): case ("almpot"): parsedOperands.push(activeDemon.value.skillPotential[11] + activeDemon.value.skillPotentialBoost[11]); return;
                            case ("ailmentpotential"): case ("ailpot"): parsedOperands.push(activeDemon.value.skillPotential[12] + activeDemon.value.skillPotentialBoost[12]); return;
                            case ("healingpotential"): case ("hlgpot"): parsedOperands.push(activeDemon.value.skillPotential[13] + activeDemon.value.skillPotentialBoost[13]); return;
                            case ("tacticalpotential"): case ("tacpot"): parsedOperands.push(activeDemon.value.skillPotential[14] + activeDemon.value.skillPotentialBoost[14]); return;

                            // Damage Resistances
                            case ("strikeresistance"): case ("stkres"): parsedOperands.push(activeDemon.value.affinitiesReducer[0]*physR); return;
                            case ("slashresistance"): case ("slhres"): parsedOperands.push(activeDemon.value.affinitiesReducer[1]*physR); return;
                            case ("pierceresistance"): case ("prcres"): parsedOperands.push(activeDemon.value.affinitiesReducer[2]*physR); return;
                            case ("fireresistance"): case ("firres"): parsedOperands.push(activeDemon.value.affinitiesReducer[3]*elmtR); return;
                            case ("iceresistance"): case ("iceres"): parsedOperands.push(activeDemon.value.affinitiesReducer[4]*elmtR); return;
                            case ("elecresistance"): case ("elcres"): parsedOperands.push(activeDemon.value.affinitiesReducer[5]*elmtR); return;
                            case ("forceresistance"): case ("frcres"): parsedOperands.push(activeDemon.value.affinitiesReducer[6]*elmtR); return;
                            case ("toxicresistance"): case ("toxres"): parsedOperands.push(activeDemon.value.affinitiesReducer[7]*elmtR); return;
                            case ("psionicresistance"): case ("psires"): case ("psychicresistance"): case ("psyres"): parsedOperands.push(activeDemon.value.affinitiesReducer[8]*elmtR); return;
                            case ("lightresistance"): case ("lgtres"): parsedOperands.push(activeDemon.value.affinitiesReducer[9]*mystR); return;
                            case ("gloomresistance"): case ("glmres"): parsedOperands.push(activeDemon.value.affinitiesReducer[10]*mystR); return;
                            case ("allresistance"): case ("allres"): parsedOperands.push(allR); return;
                            
                            // Damage Evasion
                            case ("strikeevasion"): case ("stkeva"): parsedOperands.push(activeDemon.value.affinitiesEvasion[0]*physEva*allEva); return;
                            case ("slashevasion"): case ("slheva"): parsedOperands.push(activeDemon.value.affinitiesEvasion[1]*physEva*allEva); return;
                            case ("pierceevasion"): case ("prceva"): parsedOperands.push(activeDemon.value.affinitiesEvasion[2]*physEva*allEva); return;
                            case ("fireevasion"): case ("fireva"): parsedOperands.push(activeDemon.value.affinitiesEvasion[3]*elmtEva*allEva); return;
                            case ("iceevasion"): case ("iceeva"): parsedOperands.push(activeDemon.value.affinitiesEvasion[4]*elmtEva*allEva); return;
                            case ("elecevasion"): case ("elceva"): parsedOperands.push(activeDemon.value.affinitiesEvasion[5]*elmtEva*allEva); return;
                            case ("forceevasion"): case ("frceva"): parsedOperands.push(activeDemon.value.affinitiesEvasion[6]*elmtEva*allEva); return;
                            case ("toxicevasion"): case ("toxeva"): parsedOperands.push(activeDemon.value.affinitiesEvasion[7]*elmtEva*allEva); return;
                            case ("psionicevasion"): case ("psieva"): case ("psychicevasion"): case ("psyeva"): parsedOperands.push(activeDemon.value.affinitiesEvasion[8]*elmtEva*allEva); return;
                            case ("lightevasion"): case ("lgteva"): parsedOperands.push(activeDemon.value.affinitiesEvasion[9])*mystEva*allEva; return;
                            case ("gloomevasion"): case ("glmeva"): parsedOperands.push(activeDemon.value.affinitiesEvasion[10]*mystEva*allEva); return;

                            case ("physicalevasion"): case ("physeva"): parsedOperands.push(physEva*allEva); return;
                            case ("elementalevasion"): case ("elmeva"): parsedOperands.push(elmtEva*allEva); return;
                            case ("mysticevasion"): case ("mysteva"): parsedOperands.push(mystEva*allEva); return;
                            case ("allevasion"): case ("alleva"): parsedOperands.push(allEva); return; 

                            // Ailment Power
                            case ("burnailment"): case ("brnail"): parsedOperands.push(activeDemon.value.ailmentBooster[0]); return;
                            case ("freezeailment"): case ("frzail"): parsedOperands.push(activeDemon.value.ailmentBooster[1]); return;
                            case ("shockailment"): case ("shkail"): parsedOperands.push(activeDemon.value.ailmentBooster[2]); return;
                            case ("mirageailment"): case ("mrgail"): parsedOperands.push(activeDemon.value.ailmentBooster[3]); return;
                            case ("poisonailment"): case ("psnail"): parsedOperands.push(activeDemon.value.ailmentBooster[4]); return;
                            case ("confusionailment"): case ("cfnail"): parsedOperands.push(activeDemon.value.ailmentBooster[5]); return;
                            case ("muteailment"): case ("mutail"): parsedOperands.push(activeDemon.value.ailmentBooster[6]); return;
                            case ("curseailment"): case ("crsail"): parsedOperands.push(activeDemon.value.ailmentBooster[7]); return;
                            case ("bindailment"): case ("bndail"): parsedOperands.push(activeDemon.value.ailmentBooster[8]); return;
                            case ("charmailment"): case ("crmail"): parsedOperands.push(activeDemon.value.ailmentBooster[9]); return;
                            case ("fearailment"): case ("ferail"): parsedOperands.push(activeDemon.value.ailmentBooster[10]); return;
                            case ("sleepailment"): case ("slpail"): parsedOperands.push(activeDemon.value.ailmentBooster[11]); return;
                            case ("rageailment"): case ("rgeail"): parsedOperands.push(activeDemon.value.ailmentBooster[12]); return;
                            case ("exhaustionailment"): case ("exhail"): parsedOperands.push(activeDemon.value.ailmentBooster[13]); return;
                            case ("enervationailment"): case ("evtail"): parsedOperands.push(activeDemon.value.ailmentBooster[14]); return;
                            case ("bleedingailment"): case ("bldail"): parsedOperands.push(activeDemon.value.ailmentBooster[15]); return;
                            case ("mortalailment"): case ("mrlail"): case ("ftlail"): parsedOperands.push(activeDemon.value.ailmentBooster[16]); return;

                            // Armor Defense and Evasion
                            case ("ares"): case("armorresistance"): case ("aresistance"): case("armorres"): parsedOperands.push(activeDemon.value.armorBooster[0]); return;
                            case ("aeva"): case("armorevasion"): case ("aevasion"): case("armoreva"): parsedOperands.push(activeDemon.value.armorBooster[1]); return;
                            
                        }



                        // If not a variable, try to parse as number
                        const parsed = parseFloat(operand);
                        parsedOperands.push(isNaN(parsed) ? 0 : parsed);
                    });


                    // First, roll dice
                    for (let i = 0; i < operators.length; i++) {
                        if (operators[i] === 'd') {


                            rolledDice = (Math.floor(parsedOperands[i]) + "d" + parsedOperands[i + 1]);

                            // Perform the operation
                            parsedOperands[i] = RollDice(parsedOperands[i], parsedOperands[i + 1]);
                            
                            rolledDice = "Rolled " + rolledDice + " (" + parsedOperands[i] + "), ";

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




            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣟⢿⢟⣿⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣿⡽⠿⠝⠻⠻⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢟⠑⠁⠀⠀⠈⠘⠽⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⠝⠈⠀⠀⠀⠀⠈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⠁⠀⠀⠀⠀⠀⠀⠈⣺⣿⣽⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣝⠀⠀⠀⠀⠀⠀⠀⠀⣹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⢀⣺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣷⢀⠀⠀⠀⠀⠀⠠⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣧⡄⠀⠀⠀⢀⢠⣲⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣀⢄⢀⣂⣴⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣮⣾⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣿⣿⡿⣿⣿⣿⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣾⢿⣽⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣻⢾⣻⣟⣾⡿⣿⣽⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣯⣟⣗⡯⣗⣟⢟⣾⢿⣟⣿⣟⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣟⣿⣾⢿⣻⣟⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣺⣽⣪⢪⡣⡫⢯⡫⡿⣽⣯⣷⡿⣿⣿⣿⡿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⡿⣿⣿⣻⣿⣯⣷⣿⡿⣿⢽⡫⡯⣯⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣗⡷⡯⣟⣮⢜⠔⡅⡣⠣⣻⡺⡻⣻⡾⣷⢿⣻⣟⣿⣳⣿⣽⣯⣿⣟⣿⡿⣿⡿⣿⡿⣿⣿⢿⣿⡿⣿⡿⣿⡿⣿⡿⣟⣿⣽⣾⣿⢿⣻⣿⣻⣟⣯⣷⣿⣽⢞⢯⢫⢣⢱⣕⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡿⣯⣟⢮⡳⡝⣷⢐⠌⢌⠢⠣⡑⡕⢍⠏⡿⡽⣞⡷⣻⣺⢾⣺⣗⣿⡽⣟⣿⣻⣿⣻⣿⣻⡿⣯⣿⢿⣻⣿⣻⣿⣻⡿⣟⣿⣽⢾⣻⡽⡾⡽⡽⢝⢳⢙⢎⢕⢡⢱⢬⢾⣞⣯⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣿⣿⣽⢯⣗⡕⣝⢮⢮⣂⢅⣇⢪⠨⡐⢌⢐⠸⡘⡺⢽⣺⢯⡳⢕⢗⡿⡯⡯⡻⡺⡽⡾⣯⢿⢝⢞⢟⡯⣿⡽⡾⡝⣟⣯⢷⡫⡯⡷⡫⡹⡈⢆⢕⣕⢕⣵⢞⢼⡾⣫⢿⣵⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⣾⣿⡷⣯⣞⣧⡻⣯⢷⡟⣷⡣⡪⡐⢄⢑⠌⡌⢎⣯⢳⠨⡂⢇⢿⠹⡨⢘⠌⡪⡪⣗⠣⡃⠣⡑⢍⢾⢹⢘⠜⡸⢜⢕⢕⢽⢱⡑⣼⡸⡸⣼⡷⡽⡣⣱⢱⢯⣺⣽⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣾⣗⡿⣮⢺⣝⣞⢷⢟⣮⢦⢧⡱⣳⢵⡱⡡⢊⠌⢜⠜⡌⠔⡁⡂⡢⢪⡻⡐⠨⠨⡐⡁⡪⡂⢕⠨⡸⡸⡨⡪⡪⣣⣳⣟⡷⡹⣽⢇⢿⡸⣜⣽⣳⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣟⣯⡷⣜⣾⣪⠸⣕⢍⠝⡺⡾⣝⣮⣢⡑⡌⢆⢇⠢⢑⠨⡐⡐⠔⢝⠠⡑⠡⢂⢂⠪⡨⢢⢑⢌⣮⢾⣜⢜⣎⢞⣽⢝⡽⣪⣗⣯⢾⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣿⣿⣻⣯⣿⣽⡾⣗⣧⢪⢲⢑⢼⢽⣺⣾⣷⢷⢵⡧⡱⡈⡢⢑⢐⠌⢜⠔⢅⢊⠌⢔⢐⠅⣗⣷⢷⡻⡾⡿⣞⢷⣝⣷⢱⣱⠱⣕⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⢿⣽⣎⢎⢎⢬⡫⣯⣿⢯⡏⡗⣿⡸⡰⢬⡢⣗⢗⢗⢷⡱⡐⡅⡕⣔⢕⠮⡗⡇⢇⢏⢿⢕⡝⣞⣞⣗⣮⣳⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣻⣾⣗⣯⡾⡪⣳⢿⢝⢜⢸⢜⢜⠌⢆⢪⢣⢑⢅⢝⢕⠡⠪⡘⡜⡔⢍⡗⠜⢌⢪⢪⣗⢕⡳⣽⣺⣳⡿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣯⣯⣳⢵⡻⡕⡕⡵⡽⡸⠨⡂⣇⢧⢑⠔⡱⡡⡑⡑⢜⡜⡌⢎⢯⢪⢪⢪⡪⣾⢵⣕⣗⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣟⣯⣯⣺⢼⡯⣿⡸⣑⢜⣞⣧⡣⣪⢾⣪⢸⢸⢼⣟⣮⣳⣟⣧⣳⢵⣻⣾⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⡷⣟⣯⣿⢷⣻⣮⣯⣿⢾⣯⣿⢿⣺⣵⣯⣿⣯⣿⣷⣿⣿⣾⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣷⣿⣿⣿⣿⣽⣿⣿⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣾⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
            // ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿

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
                        // player.skills[0] = new Skill("Agi", "Mild fire damage to 1 foe", [])
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
                constructor() {
                    this.soldiers = [];
                    this.inactiveSoldiers = [];
                    // new Soldier('Skull Servant', 10, 1, 1, 'Resources/DemonIcon.png', 1, 0)
                    // this.guard = this.soldiers[0].guard || 0;
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
                        return total + Number(soldier.units);
                    }, 0);
                }


                takeDamage(iDamage) {
                    if (this.soldiers.length <= 0) {
                        return iDamage;
                    }

                    // Calculate damage reduction from frontliner’s guard
                    let frontLiner = this.soldiers[0];
                    let guardReduction = frontLiner.guard / 100;
                    let armyDamage = Math.ceil(iDamage * guardReduction);
                    let returningDamage = Math.max(1, iDamage - armyDamage);

                    // /damage 100
                    while (armyDamage > 0 && this.soldiers.length > 0) {

                        if (armyDamage >= (this.soldiers[0].hp+this.soldiers[0].endurance)) {
                            // Remove soldier entirely
                            this.soldiers[0].units -= 1
                            armyDamage -= Math.max(1, (this.soldiers[0].hp+this.soldiers[0].endurance));
                            this.soldiers[0].hp = this.soldiers[0].maxHp;
                            if (this.soldiers[0].units < 1) { this.soldiers.splice(0, 1) }
                            // Don't increment index — next soldier now in current spot
                        } else {

                            // Apply damage across this soldier’s units
                            this.soldiers[0].hp -= (armyDamage-this.soldiers[0].endurance);
                            armyDamage = 0;
                        }
                    }

                    returningDamage += armyDamage;

                    // If any damage is left, return it to apply to the demon
                    return Math.ceil(returningDamage);
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



            // Demon class definition

            class Skill {
                constructor(iName, iDescription, iRollnames, iRolls) {
                    this.name = iName;
                    this.description = iDescription;
                    this.rollNames = iRollnames;
                    this.rolls = iRolls || [];
                    this.skillType = 0;
                    this.aoe = [
                        [0, 0, 1, 0, 0],
                        [0, 1, 1, 1, 0],
                        [1, 1, 1, 1, 1],
                        [0, 1, 1, 1, 0],
                        [0, 0, 1, 0, 0]
                    ]
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
                    this.bulwark = 0;
                    this.mp = this.maxMp // Current MP
                    this.exp = 0; // Current Experience Points
                    this.maxExp = 43; // Maximum Experience Points for level up
                    this.affinities = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]; // Array of affinities (resistances)
                    this.ailmentResistances = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
                    this.skillPotential = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.profile = [];
                    this.skills = []; // Array of skills
                    
                    this.buffs = [0, 0, 0]; // Buffs for St, Ma, Vi, Ag, Lu
                    this.weapon = new Skill('Bare Hands', 'An unarmed strike, inflicting weak strike damage to one foe', ['Aim', 'Damage', 'Crit Rate', 'Damage (Crit)'], ['/roll (1d100-5+ag+lu/4)*(stkaim)*(0.2*S+1)_floor', '/roll (C*(stkpwr*(1+T*0.2)*(6+6*(st/20))))d6', '/math 96-(lu/4+ag/10+cb)*(1+S*0.2)_ceil', '/roll (C*(stkpwr*(1+T*0.2)*1.5*(6+6*(st/20))))d6']); // Array of weapons
                    this.armor = ['Clothes', 1, 2,]; // Array of armor
                    this.accessories = [['Watch', 'Tells the Time'], ['', ''], ['', '']]; // Array of accessories
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
                    this.armorBooster = [0,0];
                    this.critBooster = 0;
                    this.willPower = 1.0;

                    // 
                    this.ailmentBooster = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];

                    // 0 = phys, 1 = elemental, 2 = mystic, 3 = magic, 4 = all
                    this.affinitiesGenusReducer = [1.0, 1.0, 1.0, 1.0, 1.0];
                    this.affinitiesGenusEvasion = [1.0, 1.0, 1.0, 1.0, 1.0];
                    this.damageGenusBooster = [1.0, 1.0, 1.0, 1.0, 1.0];
                    this.aimGenusBooster = [1.0, 1.0, 1.0, 1.0, 1.0];


                    this.coefficient = 1;

                    // 
                    this.coeffs = [];

                    for (let i = 0; i < 8; i++) {
                        this.skills.push(new Skill("", "", [], []));
                    }

                }

                recalculateVitals() {
                    let oldHP = this.maxHp;
                    this.maxHp = Math.floor(50 + (this.stats[2] + this.statsBooster[2] + this.level + ( (this.stats[4] + this.statsBooster[4]) / 10)) * 7); // Maximum HP
                    this.hp += (this.maxHp - oldHP);
                    
                    let oldMP = this.maxMp;
                    this.maxMp = Math.floor(32 + (((this.stats[1] + this.statsBooster[1]) * 8) + this.level + ( (this.stats[4] + this.statsBooster[4] ) / 4))); // Maximum MP
                    this.mp += (this.maxMp - oldMP);

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

                getVariables() {
                    this.recalculateVitals();
                    this.statsBooster = [0, 0, 0, 0, 0];
                    this.hpBooster = 0;
                    this.mpBooster = 0;
                    this.affinitiesReducer = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
                    this.affinitiesEvasion = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
                    this.skillPotentialBoost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.damageBooster = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
                    this.aimBooster = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
                    this.affinitiesGenusReducer = [1.0, 1.0, 1.0, 1.0, 1.0];
                    this.affinitiesGenusEvasion = [1.0, 1.0, 1.0, 1.0, 1.0];
                    this.damageGenusBooster = [1.0, 1.0, 1.0, 1.0, 1.0];
                    this.aimGenusBooster = [1.0, 1.0, 1.0, 1.0, 1.0];
                    this.armorBooster = [0,0];
                    this.critBooster = 0;
                    this.checkBoxes = [];
                    this.willPower = 1;


                    this.accessories.forEach(accessory => {
                        this.checkBoxes.push(accessory[1]);
                    });
                    this.weapon.rolls.forEach(roll => {
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
                                let valueBoost = parseFloat(checkBox.split(' ')[0]);
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

                                    // Damage Boosters
                                    case ("strikepower"): case ("stkpwr"): this.damageBooster[0] += valueBoost*0.01; break;
                                    case ("slashpower"): case ("slhpwr"): this.damageBooster[1] += valueBoost*0.01; break;
                                    case ("piercepower"): case ("prcpwr"): this.damageBooster[2] += valueBoost*0.01; break;
                                    case ("firepower"): case ("firpwr"): this.damageBooster[3] += valueBoost*0.01; break;
                                    case ("icepower"): case ("icepwr"): this.damageBooster[4] += valueBoost*0.01; break;
                                    case ("elecpower"): case ("elcpwr"): this.damageBooster[5] += valueBoost*0.01; break;
                                    case ("forcepower"): case ("frcpwr"): this.damageBooster[6] += valueBoost*0.01; break;
                                    case ("toxicpower"): case ("toxpwr"): this.damageBooster[7] += valueBoost*0.01; break;
                                    case ("psychicpower"): case ("psypwr"): this.damageBooster[8] += valueBoost*0.01; break;
                                    case ("lightpower"): case ("lgtpwr"): this.damageBooster[9] += valueBoost*0.01; break;
                                    case ("gloompower"): case ("glmpwr"): this.damageBooster[10] += valueBoost*0.01; break;
                                    case ("almightypower"): case ("almpwr"): this.damageBooster[11] += valueBoost*0.01; break;
                                    case ("ailmentpower"): case ("ailpwr"): this.damageBooster[12] += valueBoost*0.01; break;
                                    case ("healingpower"): case ("hlgpwr"): this.damageBooster[13] += valueBoost*0.01; break;
                                    // case ("tacticalpower"): case ("tacpwr"): this.damageBooster[14] += valueBoost*0.01; break;

                                    // Aim Boosters
                                    case ("strikeaim"):  case ("stkaim"): this.aimBooster[0] += valueBoost * 0.01; break;
                                    case ("slashaIm"):   case ("slhaim"): this.aimBooster[1] += valueBoost * 0.01; break;
                                    case ("pierceaim"):  case ("prcaim"): this.aimBooster[2] += valueBoost * 0.01; break;
                                    case ("fireaim"):    case ("firaim"): this.aimBooster[3] += valueBoost * 0.01; break;
                                    case ("iceaim"):     case ("iceaim"): this.aimBooster[4] += valueBoost * 0.01; break;
                                    case ("elecaim"):    case ("elcaim"): this.aimBooster[5] += valueBoost * 0.01; break;
                                    case ("forceaim"):   case ("frcaim"): this.aimBooster[6] += valueBoost * 0.01; break;
                                    case ("toxicaim"):   case ("toxim"):  this.aimBooster[7] += valueBoost * 0.01; break;
                                    case ("psychicaim"): case ("psyaim"): this.aimBooster[8] += valueBoost * 0.01; break;
                                    case ("lightaim"):   case ("lgtaim"): this.aimBooster[9] += valueBoost * 0.01; break;
                                    case ("gloomaim"):   case ("glmaim"): this.aimBooster[10] += valueBoost * 0.01; break;
                                    case ("almightyaim"):case ("almaim"): this.aimBooster[11] += valueBoost * 0.01; break;


                                    case ("physpower"): case ("physpwr"): this.damageGenusBooster[0] += valueBoost*0.01; break;
                                    case ("elmtpower"): case ("elmtpwr"): this.damageGenusBooster[1] += valueBoost*0.01; break;
                                    case ("mystpower"): case ("mystpwr"): this.damageGenusBooster[2] += valueBoost*0.01; break;
                                    case ("magpower"): case ("magpwr"): this.damageGenusBooster[3] += valueBoost*0.01; break;
                                    case ("allpower"): case ("allpwr"): this.damageGenusBooster[4] += valueBoost*0.01; break;

                                    case ("physaim"): case ("physaim"): this.aimGenusBooster[0] += valueBoost*0.01; break;
                                    case ("elmtaim"): case ("elmtaim"): this.aimGenusBooster[1] += valueBoost*0.01; break;
                                    case ("mystaim"): case ("mystaim"): this.aimGenusBooster[2] += valueBoost*0.01; break;
                                    case ("magaim"): case ("magaim"): this.aimGenusBooster[3] += valueBoost*0.01; break;
                                    case ("allaim"): case ("allaim"): this.aimGenusBooster[4] += valueBoost*0.01; break;


                                    // Damage Boosters
                                    case ("burnailment"): case ("brnail"): this.ailmentBooster[0] += valueBoost*0.01; break;
                                    case ("freezeailment"): case ("frzail"): this.ailmentBooster[1] += valueBoost*0.01; break;
                                    case ("shockailment"): case ("shkail"): this.ailmentBooster[2] += valueBoost*0.01; break;
                                    case ("mirageailment"): case ("mrgail"): this.ailmentBooster[3] += valueBoost*0.01; break;
                                    case ("poisonailment"): case ("psnail"): this.ailmentBooster[4] += valueBoost*0.01; break;
                                    case ("confusionailment"): case ("cfnail"): this.ailmentBooster[5] += valueBoost*0.01; break;
                                    case ("muteailment"): case ("mutail"): this.ailmentBooster[6] += valueBoost*0.01; break;
                                    case ("curseailment"): case ("crsail"): this.ailmentBooster[7] += valueBoost*0.01; break;
                                    case ("stunalment"): case ("stnail"): case ("binail"): this.ailmentBooster[8] += valueBoost*0.01; break;
                                    case ("charmailment"): case ("crmail"): this.ailmentBooster[9] += valueBoost*0.01; break;
                                    case ("fearailment"): case ("ferail"): this.ailmentBooster[10] += valueBoost*0.01; break;
                                    case ("sleepailment"): case ("slpail"): this.ailmentBooster[11] += valueBoost*0.01; break;
                                    case ("rageailment"): case ("rgeail"): this.ailmentBooster[12] += valueBoost*0.01; break;
                                    case ("exhaustionailment"): case ("exhail"): this.ailmentBooster[13] += valueBoost*0.01; break;
                                    case ("enervationailment"): case ("evtail"): this.ailmentBooster[14] += valueBoost*0.01; break;
                                    case ("bleedingailment"): case ("bldail"): this.ailmentBooster[15] += valueBoost*0.01; break;
                                    case ("mortalailment"): case ("mrlail"): this.ailmentBooster[16] += valueBoost*0.01; break;


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
                                    case ("almightypotential"): case ("almpot"): this.skillPotentialBoost[11] += valueBoost*0.01; break;
                                    case ("ailmentpotential"): case ("ailpot"): this.skillPotentialBoost[12] += valueBoost*0.01; break;
                                    case ("healingpotential"): case ("hlgpot"): this.skillPotentialBoost[13] += valueBoost*0.01; break;
                                    case ("tacticalpotential"): case ("tacpot"): this.skillPotentialBoost[14] += valueBoost*0.01; break;

                                    // Affinities Reducers
                                    case ("strikeresistance"): case ("stkres"): this.affinitiesReducer[0] *= (100-valueBoost)/100; break;
                                    case ("slashresistance"): case ("slhres"): this.affinitiesReducer[1] *= (100-valueBoost)/100; break;
                                    case ("pierceresistance"): case ("prcres"): this.affinitiesReducer[2] *= (100-valueBoost)/100; break;
                                    case ("fireresistance"): case ("firres"): this.affinitiesReducer[3] *= (100-valueBoost)/100; break;
                                    case ("iceresistance"): case ("iceres"): this.affinitiesReducer[4] *= (100-valueBoost)/100; break;
                                    case ("elecresistance"): case ("elcres"): this.affinitiesReducer[5] *= (100-valueBoost)/100; break;
                                    case ("forceresistance"): case ("frcres"): this.affinitiesReducer[6] *= (100-valueBoost)/100; break;
                                    case ("toxicresistance"): case ("toxres"): this.affinitiesReducer[7] *= (100-valueBoost)/100; break;
                                    case ("psychicresistance"): case ("psyres"): this.affinitiesReducer[8] *= (100-valueBoost)/100; break;
                                    case ("lightresistance"): case ("lgtres"): this.affinitiesReducer[9] *= (100-valueBoost)/100; break;
                                    case ("gloomresistance"): case ("glmres"): this.affinitiesReducer[10] *= (100-valueBoost)/100; break;

                                    // Affinities Evasion
                                    case ("strikeevasion"): case ("stkeva"): this.affinitiesEvasion[0] *= (100+valueBoost)/100; break;
                                    case ("slashevasion"): case ("slheva"): this.affinitiesEvasion[1] *= (100+valueBoost)/100; break;
                                    case ("pierceevasion"): case ("prceva"): this.affinitiesEvasion[2] *= (100+valueBoost)/100; break;
                                    case ("fireevasion"): case ("fireva"): this.affinitiesEvasion[3] *= (100+valueBoost)/100; break;
                                    case ("iceevasion"): case ("iceeva"): this.affinitiesEvasion[4] *= (100+valueBoost)/100; break;
                                    case ("elecevasion"): case ("elceva"): this.affinitiesEvasion[5] *= (100+valueBoost)/100; break;
                                    case ("forceevasion"): case ("frceva"): this.affinitiesEvasion[6] *= (100+valueBoost)/100; break;
                                    case ("toxicevasion"): case ("toxeva"): this.affinitiesEvasion[7] *= (100+valueBoost)/100; break;
                                    case ("psychicevasion"): case ("psyeva"): this.affinitiesEvasion[8] *= (100+valueBoost)/100; break;
                                    case ("lightevasion"): case ("lgteva"): this.affinitiesEvasion[9] *= (100+valueBoost)/100; break;
                                    case ("gloomevasion"): case ("glmeva"): this.affinitiesEvasion[10] *= (100+valueBoost)/100; break;

                                    // Affinities Genus Reducers
                                    case ("physresistance"): case ("physres"): this.affinitiesGenusReducer[0] *= (100-valueBoost)/100; break;
                                    case ("elemresistance"): case ("elmtres"): this.affinitiesGenusReducer[1] *= (100-valueBoost)/100; break;
                                    case ("mystresistance"): case ("mystres"): this.affinitiesGenusReducer[2] *= (100-valueBoost)/100; break;
                                    case ("magicresistance"): case ("magres"): this.affinitiesGenusReducer[3] *= (100-valueBoost)/100; break;
                                    case ("allresistance"): case ("allres"): this.affinitiesGenusReducer[4] *= (100-valueBoost)/100; break;


                                    // Affinities Genus Reducers
                                    case ("physevasion"): case ("physeva"): this.affinitiesGenusEvasion[0] *= 1+(valueBoost/100); break;
                                    case ("elemevasion"): case ("elmteva"): this.affinitiesGenusEvasion[1] *= 1+(valueBoost/100); break;
                                    case ("mystevasion"): case ("mysteva"): this.affinitiesGenusEvasion[2] *= 1+(valueBoost/100); break;
                                    case ("magicevasion"): case ("mageva"): this.affinitiesGenusEvasion[3] *= 1+(valueBoost/100); break;
                                    case ("allevasion"): case ("alleva"): this.affinitiesGenusEvasion[4] *= 1+(valueBoost/100); break;

                                    // Armor Boosters
                                    case ("ares"): case("armorresistance"): case ("aresist"): case("armorresist"): if (percentage) {percentageBoost = this.armor[1] / 100 }; this.armorBooster[0] += valueBoost * percentageBoost; break;
                                    case ("aeva"): case("armorevasion"): case ("aevasion"): case("armoreva"): if (percentage) {percentageBoost = this.armor[2] / 100 }; this.armorBooster[1] += valueBoost * percentageBoost; break;

                                    // Evasion and Resistance Boosters
                                    case ("res"): case("resistance"): if (percentage) { percentageBoost = this.armor[1] / 100 }; this.armorBooster[0] += valueBoost * percentageBoost; break;
                                    case ("eva"): case("evasion"): if (percentage) { percentageBoost = this.armor[2] / 100 }; this.armorBooster[1] += valueBoost * percentageBoost; break;


                                    case ("willpower"): case ("wilpwr"): this.willPower += valueBoost*0.01; break;
                                }
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
                    this.description = "";
                    this.pickedSkill = 0;
                    this.assaults = [new Skill('Skirmish', '(1) Weak Strike damage to all foes', [10], ['/roll (6+6*(armypower/20))d6']), new Skill('', '', [], [],), new Skill('', '', [], [],), new Skill('', '', [], [],) ];
                    this.editing = false;
                }
            }

            let army = ref(new Army());
            // army.value.soldiers.push(new Soldier('Placeholder', 500000, 0, 0, 'Resources/DemonIcon.png', 1, 0));

            // Create a new Demon instance
            let player = new Demon("Adam");
            // player.skills[0] = new Skill("Agilao", "Medium Fire damage to 1 foe", ['Cost', 'Aim', 'Damage'], ['/cost 20*(1-0.1*firpot)', '/roll (1d100-2+ma)*(0.2*S+1)', '/roll (c*(firpwr*(1+T*0.2)*(16+16*(ma/20))))d6'])
            // player.skills[0].skillType = 4;
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

                      const searchTerms = [
                        "https://www.google.com/search?q=¿Dios%20siquiera%20recuerda%20tu%20nombre?",
                        "https://www.google.com/search?q=dolordolordolordolordolordolordolordolordolordolordolordolordolordolordolordolordolordolordolordolordolor",
                        "https://www.google.com/search?q=¿Estamos%20conectados?",
                        // "https://www.google.com/search?q=Te%20estoy%20observando",
                        "https://www.google.com/maps/place/47%C2%B009'00.0%22S+126%C2%B043'00.0%22W/@-46.1567985,-133.018161,5.79z/data=!4m4!3m3!8m2!3d-47.15!4d-126.7166667?entry=ttu&g_ep=EgoyMDI1MTAwMS4wIKXMDSoASAFQAw%3D%3D",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgETXxXUmEfU6ymhAXQag5Tuxkj0Vi2u6KjNlze4QgmFConPoqzm_pRAu3&s",
                        'https://yt3.googleusercontent.com/i7dqJ4KIE6kiBpK4gHqimvjV3qjYuvD6pYCXFtnkKaNF5WsMOgtub6otTiFBwOqFlqKY9_S0=s900-c-k-c0x00ffffff-no-rj'
                    ];
                    let sanityChance = RollDice(1, 66);
                    let url = searchTerms[RollDice(1,searchTerms.length)];
                    if (demonList.value[0].name.startsWith('Guillermo Wood') && sanityChance == 66){
                        window.open(url, '_blank');
                    }

                    // Check if the message starts with "/roll" 
                    if (lowercaseMessage.startsWith('/roll') || lowercaseMessage.startsWith('/math')) {

                        // Extract the dice notation (e.g., "3d6 + 2d10 + (4 * 5)")
                        let calculation = lowercaseMessage.slice(5).trim();
                        let comment = "";
                        if (calculation.includes('-m')){ 
                            comment = calculation.split('-m')[1].trim();
                            let caplet = comment.charAt(0).toUpperCase();
                            let tempComment = comment.slice(1);
                            comment = "C" + tempComment;

                            // comment = ", " + calculation.split('-m')[1].trim();
                            comment = ", " + caplet + tempComment;
                            // console.log("Comment: " + comment);
                            calculation = calculation.split('-m')[0].trim();
                        } 
                        let floor = false;
                        let ceiling = false;
                        console.log(calculation);
                        if (calculation.includes('_floor')){ floor = true; calculation.replace('_floor', ''); }
                        if (calculation.includes('_ceiling') || calculation.includes('_ceil')){ ceiling = true; calculation.replace('_ceiling', ''); }
                        calculation.replace(' ', '');
                        let total = 0;
                        rolledDice = [];

                        // Now call your dMDAS function to evaluate the expression (without parentheses)
                        total = dMDAS(calculation);

                        if (floor) { total = Math.floor(total); }
                        if (ceiling) { total = Math.ceil(total); }

                        // Log the result
                        log.value.push(rolledDice + 'Total: ' + total + comment);
                    } else if (lowercaseMessage.startsWith('/xpall') || lowercaseMessage.startsWith('/expall')) {



                        //Add XP
                        let xpAmount = 0;
                        let defeatedLevel = 0;
                        let defeatedCount = 0;
                        let expString = messageInput.value.trim().toLowerCase().replace('/expall', '').replace('/xpall', '').trim();

                        if (expString.includes('l')){
                            defeatedLevel = expString.split('l')[1];
                            defeatedCount = parseInt(expString.split('l')[0]) || 1;
                            xpAmount = Math.floor((defeatedLevel**1.75)+(defeatedLevel*1.8*10)/2)*defeatedCount;
                        } else {
                            xpAmount = parseInt(expString);
                        }



                        // console.log("EXP AMOUNT: " + xpAmount);




                        ///Validate Data
                        if (isNaN(xpAmount) || xpAmount <= 0) {
                            messageInput.value = "";
                            log.value.push('Invalid experience amount. Use format: /xp <amount>');
                            return;
                        }

                        let levelUpMessage = "Base EXP: " + xpAmount;

                        demonList.value.forEach( demon => {
                        
                        let personalizedEXP = xpAmount;
                        
                        if (defeatedLevel != 0){
                            personalizedEXP = Math.floor((xpAmount * Math.max(0.1, (1+((defeatedLevel-demon.level)/10))))/1);
                        }
                        
                        // console.log("PERSONALIZED EXP AMOUNT: " + personalizedEXP);
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

                            levelUpMessage += '\n' + demon.name + " leveled up! (" + (demon.level-1) + " -> " + demon.level + ")";

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

                            ///Cut XP, increase max XP, HP, and MP
                            demon.exp -= demon.maxExp;
                            demon.maxExp = Math.floor(demon.maxExp * 1.1 + 50); // Increase maxExp by 20% each level
                            // activeDemon.value.maxHp = Math.floor(50 + (activeDemon.value.stats[2] + activeDemon.value.level + (activeDemon.value.stats[4] / 10)) * 7);
                            let oldHP = demon.maxHp;
                            demon.maxHp = Math.floor(50 + (demon.stats[2] + demon.level + (demon.stats[4] / 10)) * 7);
                            demon.hp += (demon.maxHp - oldHP);
                            let oldMP = demon.maxMp;
                            demon.maxMp = Math.floor(32 + ((demon.stats[1] * 8) + (demon.level) + (demon.stats[4] / 4)));
                            demon.mp += (demon.maxMp - oldMP);
                            demon.getVariables();
                        }
                        })
                        
                        log.value.push(levelUpMessage)
                        // log.value.push(`Command executed: ${lowercaseMessage.trim()}`);
                    } else if (lowercaseMessage.startsWith('/coeff')) {
                        let formattedString = lowercaseMessage.slice(6).trim();

                        // match all {...} groups
                        let matches = [...formattedString.matchAll(/\{([^}]*)\}/g)];

                        let newCoeffName = matches[0]?.[1] || "New Coeff";
                        let newCoeffBox  = matches[1]?.[1] || "";

                        activeDemon.value.coeffs.push([newCoeffName, newCoeffBox]);
                        dataMaster.value.autoSave();
                    } else if (lowercaseMessage.startsWith('/search')) {
                    
                    } else if (lowercaseMessage.startsWith('/search')) {
                        const url = `https://www.google.com/search?q=test`;
                        window.open(url, '_blank');
                    } else if (lowercaseMessage.startsWith('/xp') || lowercaseMessage.startsWith('/exp')) {

                        //Add XP
                        let xpAmount = parseInt(messageInput.value.trim().match(/^\/(?:xp|exp)\s+(\d+)/i)?.[1] || 0);
                        activeDemon.value.exp += xpAmount;


                        ///Validate Data
                        if (isNaN(xpAmount) || xpAmount <= 0) {
                            messageInput.value = "";
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
                            activeDemon.value.getVariables();
                        }

                        log.value.push(`Command executed: ${lowercaseMessage.trim()}`);
                    } else if (lowercaseMessage.startsWith('/hp') || lowercaseMessage.startsWith('/heal')) {


                        //include damage and healing
                        let calculation = "";
                        if (lowercaseMessage.startsWith('/hp')){
                            calculation = lowercaseMessage.slice(3).trim();
                        } else if (lowercaseMessage.startsWith('/heal')){
                            calculation = lowercaseMessage.slice(5).trim();
                        }
                        calculation.replace(' ', '');
                        let healthAmount = parseInt( dMDAS( calculation ));
                        //include damage and healing
                        // let healthAmount = parseInt(messageInput.value.trim().match(/^\/(?:hp)\s+(-?\d+)/i)?.[1] || 0);


                        if (isNaN(healthAmount)) {
                            log.value.push('Invalid health amount. Use format: /hp <amount>');
                            return;
                        }



                        activeDemon.value.hp += healthAmount;
                        if (activeDemon.value.hp > activeDemon.value.maxHp + activeDemon.value.hpBooster) {
                            activeDemon.value.hp = activeDemon.value.maxHp + activeDemon.value.hpBooster; // Cap the healing to max HP
                        }

                        // if (activeDemon.value.hp < -activeDemon.value.maxHp + activeDemon.value.hpBooster) {
                        //     activeDemon.value.hp = -activeDemon.value.maxHp + activeDemon.value.hpBooster; // Prevent negative HP
                        // }
                        
                        if (activeDemon.value.hp < 0) {
                            activeDemon.value.hp = 0; // Prevent negative HP
                        }




                        log.value.push(`Command executed: ${lowercaseMessage.trim()}`);
                    } else if (lowercaseMessage.startsWith('/mp')) {

                        //include damage and healing
                        let calculation = lowercaseMessage.slice(3).trim();
                        calculation.replace(' ', '');
                        let manaAmount = parseInt( dMDAS( calculation ));


                        if (isNaN(manaAmount)) {
                            log.value.push('Invalid mana amount. Use format: /mp <amount>');
                            messageInput.value = "";
                            return;
                        }

                        activeDemon.value.mp += manaAmount;
                        if (activeDemon.value.mp > activeDemon.value.maxMp + activeDemon.value.mpBooster) {
                            activeDemon.value.mp = activeDemon.value.maxMp + activeDemon.value.mpBooster; // Cap the healing to max MP
                        }

                        if (activeDemon.value.mp < 0) {
                            activeDemon.value.mp = 0; // Prevent negative MP
                        }




                        log.value.push(`Command executed: ${lowercaseMessage.trim()}`);
                    } else if (lowercaseMessage.startsWith('/bulwark')) {


                        //include damage and healing
                        let calculation = lowercaseMessage.slice(8).trim();
                        calculation.replace(' ', '');
                        let bulwarkAmount = parseInt( dMDAS( calculation ));

                        


                        if (isNaN(bulwarkAmount)) {
                            log.value.push('Invalid health amount. Use format: /bulwark <amount>');
                            return;
                        }



                        activeDemon.value.bulwark += bulwarkAmount;
                        if (activeDemon.value.bulwark > activeDemon.value.maxHp + activeDemon.value.hpBooster) {
                            activeDemon.value.bulwark = activeDemon.value.maxHp + activeDemon.value.hpBooster; // Cap the healing to max HP
                        }

                        if (activeDemon.value.hp < 0) {
                            activeDemon.value.hp = 0; // Prevent negative HP
                        }




                        log.value.push(`Command executed: ${lowercaseMessage.trim()}`);
                    } else if (lowercaseMessage.startsWith('/cost')) {

                        // console.log('Processing /cost command');

                        //include damage and healing
                        let calculation = lowercaseMessage.slice(5).trim();
                        let hpCost = false;
                        let mpCost = true;
                        if (calculation.endsWith('hp')) {
                            hpCost = true;
                            mpCost = false;
                            calculation = calculation.slice(0, -2).trim();
                        }
                        //  else if (calculation.endsWith('mp')) {
                        //     mpCost = true;
                        //     calculation = calculation.slice(0, -2).trim();
                        // }

                        console.log('Cost calculation:', calculation, 'HP cost:', hpCost, 'MP cost:', mpCost);

                        calculation.replace(' ', '');
                        let cost = parseInt( dMDAS( calculation ));
                        cost = Math.ceil(cost); // Ensure cost is an integer

                        if (isNaN(cost)) {
                            log.value.push('Invalid cost amount. Use format: /cost <amount> [hp/mp]');
                            messageInput.value = "";
                            return;
                        }

                        if (hpCost && activeDemon.value.hp >= cost) {
                            activeDemon.value.hp -= cost;
                            log.value.push('/skill cost applied: ' + cost + ' HP');
                            messageInput.value = "";
                            return;
                        } else if (mpCost && activeDemon.value.mp >= cost) {
                            activeDemon.value.mp -= cost;
                            log.value.push('/skill cost applied: ' + cost + ' MP');
                            messageInput.value = "";
                            return;
                        }
                        if (hpCost && activeDemon.value.hp < cost) {
                            log.value.push('Not enough HP to cover the cost of ' + cost + ' HP');
                            messageInput.value = "";
                            return;
                        } else if (mpCost && activeDemon.value.mp < cost) {
                            log.value.push('Not enough MP to cover the cost of ' + cost + ' MP');
                            messageInput.value = "";
                            return;
                        }




                        log.value.push(`Command executed: ${lowercaseMessage.trim()}, but there was an unexpected error.`);
                    } else if (messageInput.value.startsWith('/speed')){
                        
                        let battleSpeed = dMDAS("1d100+ag+(lu/2)");
                        

                        log.value.push("Calculated battlespeed equals " + Math.floor(battleSpeed));
                        
                    } else if (messageInput.value.startsWith('/will')){

                        // Calculate for reducing eahc ailment

                        // Check whether it's getting a will roll, reducing a specific ailment, or all ailments
                        let willTarget = messageInput.value.toLowerCase().slice(5).trim();
                        let willMessage = "";

                        // If will is all
                        if (willTarget == "all"){
                            
                            activeDemon.value.ailments.forEach(ailment => {
                                if (!ailment[2].isNaN){
                                    
                                    // Get will reduction Math
                                    let willReduction = dMDAS("1d100");
                                    if (willReduction > 95){ willReduction *= 2; }
                                    willReduction += Math.floor(dMDAS("(lu+(vi/2))*wilpwr"));

                                    willMessage += '\n' + ailment[0] + ": " + ailment[2] + " -> "
                                    ailment[2] -= willReduction;
                                    willMessage += Math.max(ailment[2], 0);
                                    if (ailment[2] <= 0){
                                        willMessage += ' (Cured)';
                                    }
                                    
                                }
                            })
                        }

                        let willTargetNumber = parseInt(willTarget) || 0;
                        if (willTargetNumber > 0 && willTargetNumber <= activeDemon.value.ailments.length){

                            // Get will reduction Math
                            let willReduction = dMDAS("1d100");
                            if (willReduction > 95){ willReduction *= 2; }
                            willReduction += Math.floor(dMDAS("lu+(vi/2)"));
                            
                            willMessage += '\n' + activeDemon.value.ailments[willTarget-1][0] + ": " + activeDemon.value.ailments[willTarget-1][1] + " -> "
                            activeDemon.value.ailments[willTarget-1][1] -= willReduction;
                            willMessage += Math.max(activeDemon.value.ailments[willTarget-1][1], 0);

                        }
                        if (willTarget == ''){
                            // Get will reduction Math
                            let willReduction = dMDAS("1d100");
                            let gotCrit = "";
                            if (willReduction > 95){ willReduction *= 2; gotCrit = " CRITICAL WILL"}

                            let willBoost = Math.floor(dMDAS("lu+(vi/2)"));
                            willMessage = "1d100+(lu+vi/2)*wilpwr (" + willReduction + gotCrit +"), Total: " + (willReduction+willBoost*activeDemon.value.willPower);
                        }
                        
                        // Cleanup Ailments
                        activeDemon.value.ailments = activeDemon.value.ailments.filter(a => a[2] > 0);

                        // Log it
                        log.value.push("Will: " + willMessage);
                        
                    } else if (messageInput.value.startsWith('/inflict')){
                        let input = messageInput.value.toLowerCase().slice(8).trim().split(" ");
                        let willPower = dMDAS("1d100+(lu+vi/2)*wilpwr");
                        let potency = dMDAS(input[1]);
                        if (willPower > potency){
                            log.value.push("Overcame potency!");
                        } else{
                            potency *=2;
                            switch (input[0]){
                                case "burn": activeDemon.value.ailments.push(['Burning', 1, potency, 'Take fire damage at the start of each turn']); log.value.push("Inflicted " + input[0]); break;
                                case "freeze": activeDemon.value.ailments.push(['Frozen', 2, potency, '-999 eva | -5% elmtres']); log.value.push("Inflicted " + input[0]); break;
                                case "shock": activeDemon.value.ailments.push(['Shock', 3, potency, 'Next hit with a crit chance crits']); log.value.push("Inflicted " + input[0]); break;
                                case "mirage": activeDemon.value.ailments.push(['Mirage', 4, potency, '-40% allaim | Cannot pick targets']); log.value.push("Inflicted " + input[0]); break;
                                case "poison": activeDemon.value.ailments.push(['Poison', 5, potency, 'Take toxic damage at the end of each turn']); log.value.push("Inflicted " + input[0]); break;
                                case "confusion": activeDemon.value.ailments.push(['Confused', 6, potency, 'Will or skip turn, hit ally if high fail']); log.value.push("Inflicted " + input[0]); break;
                                case "seal": activeDemon.value.ailments.push(['Sealed', 7, potency, 'Cannot use skills']); log.value.push("Inflicted " + input[0]); break;
                                case "curse": activeDemon.value.ailments.push(['Cursed', 8, potency, 'Cannot recover HP/MP']); log.value.push("Inflicted " + input[0]); break;
                                case "bind": activeDemon.value.ailments.push(['Bind', 9, potency, 'Turn is skipped | -999 eva']); log.value.push("Inflicted " + input[0]); break;
                                case "charm": activeDemon.value.ailments.push(['Charmed', 10, potency, 'Will or skip, buff/heal source on high fail']); log.value.push("Inflicted " + input[0]); break;
                                case "fear": activeDemon.value.ailments.push(['Afraid', 11, potency, 'Will or skip, cannot crit']); log.value.push("Inflicted " + input[0]); break;
                                case "sleep": activeDemon.value.ailments.push(['Sleeping', 12, potency, '-999 eva | turn skipped. Cured if hit']); log.value.push("Inflicted " + input[0]); break;
                                case "rage": activeDemon.value.ailments.push(['Enraged', 13, potency, 'Always weapon attacks source of rage | -100% allres | +100% physpwr']); log.value.push("Inflicted " + input[0]); break;
                                case "exhaustion": activeDemon.value.ailments.push(['Exhaustion', 14, potency, 'Start Eeach turn: /mp -mmp/10 | -50% allres']); log.value.push("Inflicted " + input[0]); break;
                                case "enervation": activeDemon.value.ailments.push(['Enervation', 15, potency, 'Will to use skills | -50% St | -50% Ma | -50% Vi']); log.value.push("Inflicted " + input[0]); break;
                                case "bleeding": activeDemon.value.ailments.push(['Bleeding', 16, potency, 'Take damage as you recover potency']); log.value.push("Inflicted " + input[0]); break;
                                case "mortal": activeDemon.value.ailments.push(['Mortal', 17, potency, 'REDUCE HP TO 0 AND CURE']); log.value.push("Inflicted " + input[0]); break;
                            }
                        }
                        // activeDemon.recalculateVitals();

                        dataMaster.value.autoSave();
                        
                        


                    } else if (messageInput.value.startsWith('/damage')) {

                        let input = messageInput.value.toLowerCase();
                        let useArmy = true;
                        let useResistance = true;
                        let useRakukaja = true;

                        if (input.includes("_noarmy")){
                            useArmy = false;
                            input = input.replace("_noarmy", "");
                        }
                        if (input.includes("_nores")){
                            useResistance = false;
                            input = input.replace("_nores", "");
                        }
                        if (input.includes("_noraku")){
                            useRakukaja = false;
                            input = input.replace("_noraku", "");
                        }

                        //get the raw damage
                        let rawDamage = input.slice(7).trim();

                        rawDamage = dMDAS(rawDamage);

                        if (army.value.soldiers.length > 0 && useArmy) {
                            rawDamage = army.value.takeDamage(rawDamage);
                        }

                        if (useRakukaja) {
                            rawDamage *= 1-activeDemon.value.buffs[1]*0.2;
                        }

                        // Apply defense reduction from character stats and armor
                        if (useResistance){
                            rawDamage = Math.floor( rawDamage * ((200 / (200 + (((activeDemon.value.stats[2] + activeDemon.value.statsBooster[2]) + (activeDemon.value.armor[1] + activeDemon.value.armorBooster[0])) * (1 + (((activeDemon.value.stats[2] + activeDemon.value.statsBooster[2]) + (activeDemon.value.armor[1] + activeDemon.value.armorBooster[0])) / 30)))))) );
                        }
                        

                        if (rawDamage < 1) { rawDamage = 1; }
                        // Apply army damage reduction if army exists
                        let finalDamage = parseInt(rawDamage) || 1;


                        if (activeDemon.value.bulwark >= finalDamage)
                            { activeDemon.value.bulwark = Math.max(activeDemon.value.bulwark-finalDamage, 0); finalDamage = 0; }
                        else 
                            { 
                                finalDamage -= activeDemon.value.bulwark
                                activeDemon.value.bulwark = 0;
                            }

                        console.log(activeDemon.value);

                        // Apply remaining damage to player
                        activeDemon.value.hp -= finalDamage;

                        if (activeDemon.value.hp < 0) { activeDemon.value.hp = 0; }

                        // Handle other commands starting with "/"
                        log.value.push(`Command executed: ${lowercaseMessage.trim()} ` + finalDamage + ' damage taken (after army reduction)');

                    } else if (messageInput.value.startsWith('/washskills')) {
                        
                        let washall = false;
                        if (messageInput.value.includes("all")){ washall = true }

                            fetch("Resources/skills.json").then(response => response.json()).then(data => {
                                activeDemon.value.skills.forEach(skill => {
                                    let skillData = data.find(dataSkill => dataSkill.name.toLowerCase() === skill.name.toLowerCase());
                                    Object.assign(skill, skillData);
                                });

                                if (washall){
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
                                // log.value.push('Skill not found: ' + skillName);
                                console.error('Error fetching skill data:', error);
                            });

                        

                        log.value.push('Skills have been washed');
                        
                        
                    } else if (messageInput.value.startsWith('/washall')) {


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
                            
                        })
                        
                        log.value.push('Demon washed and stats recalculated');
                        
                        
                    } else if (messageInput.value.startsWith('/wash')) {
                        // Clean the demon's HP, coefficient, ailments, etc
                        activeDemon.value.getVariables();
                        activeDemon.value.recalculateVitals();
                        activeDemon.value.hp = activeDemon.value.maxHp + activeDemon.value.hpBooster;
                        activeDemon.value.mp = activeDemon.value.maxMp + activeDemon.value.mpBooster;
                        activeDemon.value.buffs = [0, 0, 0]; // Reset buffs
                        activeDemon.value.ailments = []; // Reset ailments
                        activeDemon.value.coefficient = 1; // Reset coefficient
                        activeDemon.value.bulwark = 0;
                        log.value.push('Demon washed and stats recalculated');
                        
                        
                    } else if (messageInput.value.startsWith('/fairy')) {
                        // Clean the demon's HP, coefficient, ailments, etc
                        activeDemon.value.getVariables();
                        activeDemon.value.recalculateVitals();
                        activeDemon.value.hp = activeDemon.value.maxHp + activeDemon.value.hpBooster;
                        activeDemon.value.mp += Math.ceil((activeDemon.value.maxMp + activeDemon.value.mpBooster)/10);
                        activeDemon.value.mp = Math.min(activeDemon.value.mp, activeDemon.value.maxMp);
                        activeDemon.value.buffs = activeDemon.value.buffs.map(b => Math.max(b, 0)); // Ckear debuffs 
                        activeDemon.value.ailments = []; // Reset ailments
                        log.value.push('Demon washed and stats recalculated');
                        
                    } else if (messageInput.value.startsWith('/powerlevel')) {
                        // Clean the demon's HP, coefficient, ailments, etc
                        activeDemon.value.getVariables();
                        activeDemon.value.recalculateVitals();


                        log.value.push(
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

                            'Armor Boosters:' + '\n' +
                            'Armor Resistance Boost: ' + activeDemon.value.armorBooster[0] + '\n' +
                            'Armor Evasion Boost: ' + activeDemon.value.armorBooster[1] + '\n' + '\n' +

                            'Willpower: ' + activeDemon.value.willPower

                        );
                        
                        
                    } else if (messageInput.value.startsWith('/display')) {
                        
                        
                        let importData = messageInput.value.trim().toLowerCase().slice(8).trim();
                        // Get the skill data from TheRiseOfTheNewWorld/Resources/skills.json 

                            let skillName = importData;

                            fetch("Resources/skills.json").then(response => response.json()).then(data => {
                                let skillsCount = activeDemon.value.skills.filter(skill => skill.name !== "").length;
                                let gotSkill = false;
                                let skillData = data.find(skill => skill.name.toLowerCase().replace(/[\s']/g, '') === skillName.toLowerCase());

                                
                                
                                if (skillData.name != ""){
                                    selectedSkill.value = skillData || new Skill("", "", [], []);
                                    displaySkill.value = true;
                                    log.value.push("Displayed skill: " + skillName + '\n' + " Skilldata: " + skillData);
                                    console.log(skillData)
                                    gotSkill = true;
                                    messageInput.value = '';
                                    activeDemon.value.getVariables();
                                    activeDemon.value.recalculateVitals();
                                }
                                    



                                if (!gotSkill) {
                                    log.value.push("Could not find a skill Display");
                                    displaySkill.value = false;
                                }
                                
                            }).catch(error => {
                                log.value.push('Skill not found: ' + skillName);
                                console.error('Error fetching skill data:', error);
                            }
                            );

                        dataMaster.value.autoSave();
                        
                        
                    } else if (messageInput.value.startsWith('/learn')) {
                        
                        
                        let importData = messageInput.value.trim().toLowerCase().slice(6).trim().split(' ');
                        // Get the skill data from TheRiseOfTheNewWorld/Resources/skills.json 

                            let skillName = importData[0];

                            fetch("Resources/skills.json").then(response => response.json()).then(data => {
                                let skillsCount = activeDemon.value.skills.filter(skill => skill.name !== "").length;
                                let gotSkill = false;
                                let skillData = data.find(skill => skill.name.toLowerCase().replace(/[\s']/g, '') === skillName.toLowerCase());
                                const skillSlot = parseInt(importData[1]) || -1;
                                if (skillsCount > 7 && skillSlot == -1) { 
                                    log.value.push("All 8 skill slots are full, please specifiy a specific slot");
                                    return;
                                }
                                if (importData.length == 1) {
                                    activeDemon.value.skills[skillsCount] = skillData || new Skill("", "", [], []);
                                    log.value.push("Imported skill: " + skillName + " to slot " + (skillsCount+1));
                                    gotSkill = true;
                                };
                                
                                if (skillSlot >= 0 && skillSlot <= 8) {
                                    activeDemon.value.skills[skillSlot-1] = skillData || new Skill("", "", [], []);
                                    log.value.push("Imported skill: " + skillName + " to slot " + (skillsCount));
                                    gotSkill = true;
                                    messageInput.value = '';
                                }
                                activeDemon.value.getVariables();
                                activeDemon.value.recalculateVitals();
                                if (!gotSkill) {
                                    log.value.push("Could not find a skill slot to import to. Use /import skill <name> [slot]");
                                }
                                
                            }).catch(error => {
                                log.value.push('Skill not found: ' + skillName);
                                console.error('Error fetching skill data:', error);
                            }
                            );

                        dataMaster.value.autoSave();
                        
                        
                    } else if (messageInput.value.startsWith('/import')) {
                        
                        if (messageInput.value.trim() === '/import') {
                            modal.value = true; // Open the import modal
                            modalTab.value = 'import';
                            log.value.push('Import menu opened');
                            messageInput.value = '';
                            return;
                        }

                        let importData = messageInput.value.trim().toLowerCase().slice(7).trim().split(' ');
                        // Get the skill data from TheRiseOfTheNewWorld/Resources/skills.json 
                        

                        

                        if (importData[0] === 'skill') {

                            let skillName = importData[1];

                            fetch("Resources/skills.json").then(response => response.json()).then(data => {
                                let skillsCount = activeDemon.value.skills.filter(skill => skill.name !== "").length;
                                let gotSkill = false;
                                let skillData = data.find(skill => skill.name.toLowerCase().replace(/[\s']/g, '') === skillName.toLowerCase());
                                const skillSlot = parseInt(importData[2]) || -1;
                                if (skillsCount > 7 && skillSlot == -1) { 
                                    log.value.push("All 8 skill slots are full, please specifiy a specific slot");
                                    return;
                                }
                                if (importData.length == 2) {
                                    activeDemon.value.skills[skillsCount] = skillData || new Skill("", "", [], []);
                                    log.value.push("Imported skill: " + skillName + " to slot " + (skillsCount+1));
                                    gotSkill = true;
                                };
                                
                                if (skillSlot >= 0 && skillSlot <= 8) {
                                    activeDemon.value.skills[skillSlot-1] = skillData || new Skill("", "", [], []);
                                    log.value.push("Imported skill: " + skillName + " to slot " + (skillsCount));
                                    gotSkill = true;
                                    messageInput.value = '';
                                }
                                activeDemon.value.getVariables();
                                activeDemon.value.recalculateVitals();
                                if (!gotSkill) {
                                    log.value.push("Could not find a skill slot to import to. Use /import skill <name> [slot]");
                                }
                                
                            }).catch(error => {
                                log.value.push('Skill not found: ' + skillName);
                                console.error('Error fetching skill data:', error);
                            }
                            );
                        }
                        dataMaster.value.autoSave();
                        
                        
                    } else if (messageInput.value.startsWith('/physskills')) {
                        // Handle other commands starting with "/"
                        fetch("Resources/skills.json")
                        .then(response => response.json())
                        .then(data => {
                            let physSkills = data.filter(skill => [1, 2, 3].includes(skill.skillType));
                            let physSkillList = "List: ";
                            let physSkillType = ["Strike", "Slash", "Pierce"];
                            physSkills.forEach(physSkill => {
                                physSkillList = physSkillList + physSkill.name + "(" + physSkillType[physSkill.skillType] +") , ";
                            })
                            console.log("Physical Skills:", physSkillList); // Debug output, can be removed later

                            activeDemon.value.getVariables();
                            activeDemon.value.recalculateVitals();
                        })
                        .catch(error => {
                            console.error('Error fetching skill data:', error);
                        });

                        
                    } else if (messageInput.value.startsWith('/clear')) {
                        // Handle other commands starting with "/"
                        log.value = [];
                    } else if (messageInput.value.startsWith('/deletelocalstorage') || messageInput.value.startsWith('/clearallsavedata')) {
                        // Handle other commands starting with "/"
                        localStorage.clear();
                        log.value.push("Cleared all saved data");
                    } else if (messageInput.value.startsWith('/deletedemon')) {

                        // Delete Demon

                        if (demonList.value.length === 1) {
                            log.value.push('Cannot delete the last demon!');
                            messageInput.value = '';
                            return;
                        }

                        if (demonList.value.length === 0) {
                            log.value.push('No demons to delete!');
                            messageInput.value = '';
                            return;
                        }

                        if (messageInput.value == '/deletedemon') {
                            demonList.value.forEach((demon, index) => {
                                if (demon === activeDemon.value && demon != demonList.value[0]) {
                                    demonList.value.splice(index, 1); // Remove the demon from the list
                                    activeDemon.value = demonList.value[0];
                                    log.value.push('Demon Deleted');
                                    messageInput.value = '';
                                    return;
                                }
                                if (demon === activeDemon.value && demon == demonList.value[0]) {
                                    // demonList.value.splice(index, 1); // Remove the demon from the list
                                    // activeDemon.value = demonList.value[0];
                                    log.value.push('Cannot delete the first demon');
                                    messageInput.value = '';
                                    return;
                                }
                            });
                            return;
                            
                        }
                        let index = parseInt(lowercaseMessage.slice(12).trim()) || 0;
                        if (index == 0) {
                            messageInput.value = '';
                        }

                        // Ensure you're not deleting the first demon
                        if (index > 0 && !activeDemon.value.main) {
                            demonList.value.splice(index, 1); // Remove the demon from the list
                            activeDemon.value = demonList.value[0];  // Set activeDemon to the new first demon
                            log.value.push('Demon Deleted');
                        } else if (index === 0) {
                            log.value.push('Cannot delete the first demon!');
                        } else {
                            log.value.push('Demon is a main demon and cannot be deleted');
                        }


                    } else if (lowercaseMessage.startsWith('/load')) {
                        if (lowercaseMessage.split(' ').length > 1) {
                            dataMaster.value.saveFile = lowercaseMessage.toUpperCase().split(' ')[1];
                        } else {
                            dataMaster.value.saveFile = "SAVEDATA";
                        }
                        dataMaster.value.loadData();
                        log.value.push("Loaded Data");
                    } else if (lowercaseMessage.startsWith('/save')) {

                        // Check save slot
                        if (lowercaseMessage.split(' ').length > 1) {
                            dataMaster.value.saveFile = lowercaseMessage.toUpperCase().split(' ')[1];
                        } else {
                            dataMaster.value.saveFile = "SAVEDATA";
                        }

                        dataMaster.value.saveData();
                        log.value.push("Saved Data");

                    } else if (lowercaseMessage.startsWith('/print')) {
                        // dataMaster.value.printData();
                        console.log(activeDemon.value)
                        log.value.push("Printed Data to the Browser Console");

                    } else if (lowercaseMessage.startsWith('/delete')) {
                        let trimmedMessage = lowercaseMessage.slice(7).trim().toUpperCase();

                        localStorage.removeItem(trimmedMessage);
                        log.value.push("Deleted Data: " + trimmedMessage);

                    } else if (lowercaseMessage.startsWith('/download')) {
                        let trimmedMessage = lowercaseMessage.slice(9).trim();

                        dataMaster.value.downloadData(trimmedMessage);
                        log.value.push("Downloaded Data");

                    } else if (lowercaseMessage.startsWith('/listofsaves') || lowercaseMessage.startsWith('/listofsaves')) {
                        let listOfSaves = "";
                        for (let i = 0; i < localStorage.length; i++) {
                            listOfSaves += (localStorage.key(i)) + ', ';
                        }

                        // dataMaster.value.downloadData(trimmedMessage);
                        log.value.push("List of saves: " + listOfSaves);

                    } else if (lowercaseMessage.startsWith('/unlock')) {
                        switch (lowercaseMessage.split(' ')[1]){
                            case ('demon'): case ('demons'): unlockedTabs.value[1] = true; break;
                            case ('army'): case ('armies'): unlockedTabs.value[2] = true; break;
                            case ('edit'): case ('editor'): unlockedTabs.value[3] = true; break;
                            case ('all'): case ('everything'): unlockedTabs.value[1] = true; unlockedTabs.value[2] = true; unlockedTabs.value[3] = true; break;
                        }

                    } else if (lowercaseMessage.startsWith('/recalculatevitals')) {
                        activeDemon.value.recalculateVitals()
                        // console.log('recalculateVitals');
                        log.value.push(`Command executed: ${lowercaseMessage.trim()}`);
                    } else if (lowercaseMessage.startsWith('/equip')){
                        ///Check what to equip (Weapon, armor, accessory)
                        let checkMessage = lowercaseMessage.slice(6);

                        if (checkMessage.trim().startsWith('weapon')){
                            
                            // Get Wepaon name and description
                            let weaponString = checkMessage.trim().slice(6);
                            let rawMessage = messageInput.value;
                            


                            // Assign weapon name and description
                            activeDemon.value.weapon.name = toTitleCase(weaponString.split('{')[1].split('}')[0]) || "Barehands";
                            activeDemon.value.weapon.description = rawMessage.split('{')[2].split('}')[0].trim();

                            // Get the new rolls
                            let newRolls = weaponString.split('{').slice(3).map(roll => roll.split('}')[0]).slice(0,8);
                            activeDemon.value.weapon.rollNames = [];
                            activeDemon.value.weapon.rolls = [];
                            newRolls.forEach((roll, index) => {
                                activeDemon.value.weapon.rollNames[index] = toTitleCase(roll.split(':')[0].trim());
                                activeDemon.value.weapon.rolls[index] = roll.split(':')[1].trim()
                            });
                            
                            log.value.push("Equipped '" + activeDemon.value.weapon.name + "'");


                            //     /equip weapon {chainsaw} {This one-sided sword appears glows a weak purple, it's blade is around 4 feet long, and is particularly sharp.} {aim : /roll (1d100-5+ag+lu/4)*(0.2*S+1)_floor} {damage : /roll (c*(slhpwr*(1+T*0.2)*(12+12*(st/30))))d6} {critical chance : /math 96-(lu/4+ag/10+cb)*(1+S*0.2)_ceil}
                            
                        } else if (checkMessage.trim().startsWith('armor')){
                            let  armorString = checkMessage.trim().slice(5).trim();
                            
                            let armorName = toTitleCase(armorString.split('{')[1].split('}')[0]);
                            
                            activeDemon.value.armor[0] = armorName || "Nude";
                            activeDemon.value.armor[1] = parseInt(armorString.split('{')[2].split(']')[0]) || 0;
                            activeDemon.value.armor[2] = parseInt(armorString.split('{')[3].split(']')[0]) || 0;

                            log.value.push("Equipped " + activeDemon.value.armor[0] + ", " + activeDemon.value.armor[2] + " evasion and " + activeDemon.value.armor[1] + " defense")
                        } else if (checkMessage.trim().startsWith('accessory')){
                            
                        }

                        // Check which slot it is

                        // Equip the info in that slot

                        // Log info

                    } else if (lowercaseMessage.startsWith('/help')){
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
                        modal.value = true;
                        modalTab.value = "help";
                        log.value.push("Loaded help menu");
                        
                    } else if (messageInput.value.startsWith('/')) {
                        // Handle other commands starting with "/"
                        log.value.push(`${lowercaseMessage.trim()} is not a valid command`);
                        
                    } else {
                        // Regular message
                        log.value.push(messageInput.value.trim());
                    }
                    // Keep only the latest 100 messages
                    if (log.value.length > 100) {
                        log.value.shift(); // Remove the oldest message
                    }

                    messageInput.value = '';

                    // Scroll to the bottom of the message log
                    setTimeout(() => {
                        const messageLog = document.getElementById('messageLog');
                        messageLog.scrollTop = messageLog.scrollHeight; // Scroll to the bottom of the message log
                    }, 5);

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

            function toTitleCase(str) {
            return str
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            }



            function downloadFutharkFile(inputText, filename = "ᚠᚢᛏᚺᚨᚱᚴᛟᚢᛏᛈᚢᛏ.ᛏᛪᛏ") {
                const transliterated = transliterateToFuthark(inputText);
                const blob = new Blob([transliterated], { type: "text/plain;charset=utf-8" });

                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }


            class DataMaster {
                constructor() {
                    // Initialize the fileData as an empty object
                    this.fileData = {};
                    this.saveFile = "SAVEDATA";
                    this.modalstring = "";
                    this.skillSlot = 1;

                    // Initialize fileData with the current data
                    this.uploadFromFile = (file) => {
                        const selectedFile = file.target.files[0];
                        this.modalstring = "Successful upload";
                        if (!selectedFile) {
                            console.log("No file selected");
                            return;
                        }

                        console.log("File uploaded:", selectedFile);

                        // Create a new FileReader
                        const reader = new FileReader();

                        reader.onload = (event) => {
                            try {
                                // Parse the file contents as JSON
                                const data = JSON.parse(event.target.result);
                                modal.value = false;
                                this.modalstring = JSON.stringify(data, null, 2); // Pretty print the JSON
                                modal.value = true; 
                                console.log("Data loaded successfully:", data);
                            } catch (error) {
                                console.error("Error loading data:", error);
                                this.modalstring = "Error loading JSON data.";
                            }
                        };

                        reader.readAsText(selectedFile); // Read the file as text
                    };

                    this.parseFromModal = (iType) => {
                        // console.log("Got Here");
                        try {
                            switch (iType) {
                                case ("demon"):
                                    let demonData = JSON.parse(this.modalstring);
                                    let demon = new Demon();  // Create a new Demon instance
                                    Object.assign(demon, demonData);  // Copy saved data into the demon instance
                                    demon.recalculateVitals();  // Optionally recalculate stats or do any necessary setup
                                    demonList.value.push(demon);
                                    activeDemon.value = demonList.value[demonList.value.length - 1]; // Set the newly created demon as active
                                    this.modalstring = "";
                                    modal.value = false;
                                    break;
                                case ("skill"):
                                    let skillData = JSON.parse(this.modalstring);
                                    let skill = new Skill();  // Create a new Skill instance
                                    Object.assign(skill, skillData);  // Copy saved data into the skill instance
                                    activeDemon.value.skills[this.skillSlot - 1] = skill; // Assign the skill to the active demon's skill slot
                                    activeDemon.value.getVariables();
                                    activeDemon.value.recalculateVitals(); // Recalculate the demon's stats
                                    this.modalstring = "";
                                    modal.value = false;
                                    break;
                                case ("army"):
                                    let armyData = JSON.parse(this.modalstring);
                                    let newArmy = new Army();  // Create a new Skill instance
                                    Object.assign(newArmy, armyData);  // Copy saved data into the skill instance
                                    army.value = newArmy; // Assign the skill to the active demon's skill slot
                                    this.modalstring = "";
                                    modal.value = false;
                                    break;
                                case ("soldier"):
                                    let soldierData = JSON.parse(this.modalstring);
                                    let newSoldier = new Army();  // Create a new Skill instance
                                    Object.assign(newSoldier, soldierData);  // Copy saved data into the skill instance
                                    army.value.soldiers.push(newSoldier); // Assign the skill to the active demon's skill slot
                                    this.modalstring = "";
                                    modal.value = false;
                                    break;
                                case ("save"): 

                                    // Parse JSON 
                                    let iSaveData = JSON.parse(this.modalstring);

                                    console.log("iSaveData: ",iSaveData);

                                    // Demons
                                    demonList.value = [];
                                    iSaveData.demons.forEach(demon => {
                                        let loopDemon = new Demon();
                                        Object.assign(loopDemon, demon);
                                        demonList.value.push(loopDemon)
                                    });
                                    activeDemon.value = demonList.value[0];

                                    // Soldiers
                                    army.value.soldiers = [];
                                    iSaveData.army.soldiers.forEach(soldier => {
                                        let loopSoldier = new Soldier();
                                        Object.assign(loopSoldier, soldier);
                                        army.value.soldiers.push(loopSoldier)
                                    });

                                    // InactiveSoldiers
                                    army.value.inactiveSoldiers = [];
                                    iSaveData.army.inactiveSoldiers.forEach(inactiveSoldier => {
                                        let loopInactiveSoldier = new Soldier();
                                        Object.assign(loopInactiveSoldier, inactiveSoldier);
                                        army.value.inactiveSoldiers.push(loopInactiveSoldier)
                                    });

                                    // Close Modal
                                    
                                    this.modalstring = "";
                                    modal.value = false;
                                    
                                    break;
                                }

                        
                                    
                        } catch (error) {
                            modal.value = false;
                            log.value.push("Error parsing data: " + error.message);
                            // console.error("Error parsing data:", error);
                        }
                    }

                    // Update fileData based on the current state of the game
                    this.updateFileData = () => {
                        this.fileData = {
                            // favoriteThing: "boobs",
                            demons: demonList.value,
                            army: army.value
                        };
                    }

                    // Print the current fileData to the console nicely formatted
                    this.printData = () => {
                        this.updateFileData();
                        // console.log(JSON.stringify(this.fileData));
                    }

                    this.downloadData = (iType) => {

                        let skillSlot = 0;
                        let fileName = "saveddata";
                        let fileExtension = "json";
                        if (iType.startsWith("skill") || iType.startsWith("soldier") || iType.startsWith("inactivesoldier")){
                            skillSlot = parseInt(iType.charAt(iType.length - 1)) || 0;
                            iType = iType.slice(0, -1);
                        }

                        if (
                            iType !== "demon" &&
                            iType !== "skill" &&
                            iType !== "army" &&
                            iType !== "soldier" &&
                            iType !== "inactivesoldier" &&
                            iType !== "save"
                        ) {
                        log.value.push("Invalid type for download. Use 'demon', 'skill', 'army', 'soldier', 'inactivesoldier' or 'save'.");
                        return;
                        }


                        if (iType == "skill" && (skillSlot > 8 || skillSlot < 1)){
                            return;
                        }

                        if (iType == "soldier" && (skillSlot > army.value.soldiers.length || skillSlot < 1)){
                            return;
                        }

                        if (iType == "inactivesoldier" && (skillSlot > army.value.inactiveSoldiers.length || skillSlot < 1)){
                            return;
                        }
                        
                        // console.log(/);
                        this.updateFileData();
                        let dataStr = "";
                        switch (iType) {
                            case ("demon"): dataStr = JSON.stringify(activeDemon.value, null, 2); fileExtension = "dmn"; fileName = activeDemon.value.name; break;
                            case ("save"): dataStr = JSON.stringify(this.fileData, null, 2); fileExtension = "rnw"; fileName = "SaveData"; break;
                            case ("skill"): dataStr = JSON.stringify(activeDemon.value.skills[skillSlot-1], null, 2); fileExtension = "skl"; fileName = activeDemon.value.skills[skillSlot-1].name; break;
                            case ("army"): dataStr = JSON.stringify(army.value, null, 2); fileExtension = "amy"; fileName = "Army"; break;
                            case ("soldier"): dataStr = JSON.stringify(army.value.soldiers[skillSlot-1], null, 2); fileExtension = "sdr"; fileName = army.value.soldiers[skillSlot-1].name; break;
                            case ("inactivesoldier"): dataStr = JSON.stringify(army.value.inactiveSoldiers[skillSlot-1], null, 2); fileExtension = "sdr"; fileName = army.value.inactiveSoldiers[skillSlot-1].name; break;
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
                        
                        console.log(savedData.demons);
                        if (savedData) {
                            this.fileData = JSON.parse(savedData);
                            // console.log("savedata: ", this.fileData);
                            if (this.fileData.demons.length < 1) { return; }
                            // console.log("savedata 2: ", this.fileData);
                            // Update the game variables with loaded data
                            console.log(this.fileData.demons);
                            demonList.value = [];
                            let demonsArray = this.fileData.demons;
                            Object.assign(army.value, this.fileData.army);
                            demonsArray.forEach(demonData => {
                                let demon = new Demon();  // Create a new Demon instance
                                Object.assign(demon, demonData);  // Copy saved data into the demon instance
                                

                                // Fix the weapon (assuming it's a Skill too)
                                    if (demon.weapon) {
                                        demon.weapon = new Skill(
                                            demon.weapon.name,
                                            demon.weapon.description,
                                            demon.weapon.rollNames || [],
                                            demon.weapon.rolls || []
                                        );
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

                                demon.recalculateVitals();  // Optionally recalculate stats or do any necessary setup
                                demonList.value.push(demon);  // Add the demon to the list
                            });

                            // Set the active demon
                            activeDemon.value = demonList.value[0];
                        } else {
                            console.warn("No saved data found in localStorage.");
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

            

            let dataMaster = ref(new DataMaster());

            onMounted(() => {
                const savedState = localStorage.getItem('AUTOSAVE');
                if (savedState) {
                    console.log("Autosave data found");
                    dataMaster.value.saveFile = "AUTOSAVE";
                    dataMaster.value.loadData(); // Call now that everything is reactive
                }
            });



            return { activePage, activeTab, tabs, log, messageInput, sendMessage, demonList, activeDemon, player, getBuffShadowStyle, army, modal, started, introTab, readingText, startReading, startingAmbience, characterCreator, modalTab, selectedSkill, displaySkill, unlockedTabs, dataMaster, displayAilments };

        }
    }).mount('#app');
});