const { createApp, ref } = Vue;
document.addEventListener('DOMContentLoaded', () => {
    createApp({
        setup() {


            activePage = ref('Sheet');
            activeTab = ref('profile'); // Reactive variable for active tab
            tabs = ref(['profile', 'combat', 'notes', 'inventory']); // Array of tabs
            modal = ref(false); // Reactive variable for modal visibility
            modalTab = ref('TakeDamage');
            unlockedTabs = ref([true, true, false, true]);

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



                if (calculation.includes("+") || calculation.includes("+") || calculation.includes("*") || calculation.includes("/") || calculation.includes("d")) {

                    // Gather Variables
                    let operands = calculation.split(/[+\-*/d]/)
                    let operators = [...calculation.match(/[+\-*/d]/g)];
                    let parsedOperands = [];





                    console.log("activedemon damage booster", activeDemon.value.damageBooster[0]);
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

                            // Buffs
                            case "t": parsedOperands.push(activeDemon.value.buffs[0]); return;
                            case "r": parsedOperands.push(activeDemon.value.buffs[1]); return;
                            case "s": parsedOperands.push(activeDemon.value.buffs[2]); return;
                            case "c": parsedOperands.push(activeDemon.value.coefficient); return;
                            case "o": parsedOperands.push(activeDemon.value.damageBooster[0]); return;

                            // Damage Boosters (renamed to use 'power' to avoid dice parsing issues)
                            case ("strikepower"): case ("stkpwr"): parsedOperands.push(activeDemon.value.damageBooster[0]); return;
                            case ("slashpower"): case ("slhpwr"): parsedOperands.push(activeDemon.value.damageBooster[1]); return;
                            case ("piercepower"): case ("prcpwr"): parsedOperands.push(activeDemon.value.damageBooster[2]); return;
                            case ("firepower"): case ("firpwr"): parsedOperands.push(activeDemon.value.damageBooster[3]); return;
                            case ("icepower"): case ("icepwr"): parsedOperands.push(activeDemon.value.damageBooster[4]); return;
                            case ("elecpower"): case ("elcpwr"): parsedOperands.push(activeDemon.value.damageBooster[5]); return;
                            case ("forcepower"): case ("frcpwr"): parsedOperands.push(activeDemon.value.damageBooster[6]); return;
                            case ("toxicpower"): case ("toxpwr"): parsedOperands.push(activeDemon.value.damageBooster[7]); return;
                            case ("psychicpower"): case ("psypwr"): parsedOperands.push(activeDemon.value.damageBooster[8]); return;
                            case ("lightpower"): case ("lgtpwr"): parsedOperands.push(activeDemon.value.damageBooster[9]); return;
                            case ("arkpwr"): parsedOperands.push(activeDemon.value.damageBooster[10]); return;
                            case ("almightypower"): case ("almpwr"): parsedOperands.push(activeDemon.value.damageBooster[11]); return;

                            // Skill Potential
                            case ("strikepotential"): case ("stkpot"): parsedOperands.push(activeDemon.value.skillPotential[0] + activeDemon.value.skillPotentialBoost[0]); return;
                            case ("slashpotential"): case ("slhpot"): parsedOperands.push(activeDemon.value.skillPotential[1] + activeDemon.value.skillPotentialBoost[1]); return;
                            case ("piercepotential"): case ("prcpot"): parsedOperands.push(activeDemon.value.skillPotential[2] + activeDemon.value.skillPotentialBoost[2]); return;
                            case ("firepotential"): case ("firpot"): parsedOperands.push(activeDemon.value.skillPotential[3] + activeDemon.value.skillPotentialBoost[3]); return;
                            case ("icepotential"): case ("icepot"): parsedOperands.push(activeDemon.value.skillPotential[4] + activeDemon.value.skillPotentialBoost[4]); return;
                            case ("elecpotential"): case ("elcpot"): parsedOperands.push(activeDemon.value.skillPotential[5] + activeDemon.value.skillPotentialBoost[5]); return;
                            case ("forcepotential"): case ("frcpot"): parsedOperands.push(activeDemon.value.skillPotential[6] + activeDemon.value.skillPotentialBoost[6]); return;
                            case ("toxicpotential"): case ("toxpot"): parsedOperands.push(activeDemon.value.skillPotential[7] + activeDemon.value.skillPotentialBoost[7]); return;
                            case ("psychicpotential"): case ("psypot"): parsedOperands.push(activeDemon.value.skillPotential[8] + activeDemon.value.skillPotentialBoost[8]); return;
                            case ("lightpotential"): case ("lgtpot"): parsedOperands.push(activeDemon.value.skillPotential[9] + activeDemon.value.skillPotentialBoost[9]); return;
                            case ("arkpot"): parsedOperands.push(activeDemon.value.skillPotential[10] + activeDemon.value.skillPotentialBoost[10]); return;
                            case ("almightypotential"): case ("almpot"): parsedOperands.push(activeDemon.value.skillPotential[11] + activeDemon.value.skillPotentialBoost[11]); return;
                            case ("ailmentpotential"): case ("ailpot"): parsedOperands.push(activeDemon.value.skillPotential[12] + activeDemon.value.skillPotentialBoost[12]); return;
                            case ("healingpotential"): case ("hlgpot"): parsedOperands.push(activeDemon.value.skillPotential[13] + activeDemon.value.skillPotentialBoost[13]); return;
                            case ("tacticalpotential"): case ("tacpot"): parsedOperands.push(activeDemon.value.skillPotential[14] + activeDemon.value.skillPotentialBoost[14]); return;

                            // Damage Resistances
                            case ("strikeresistance"): case ("stkres"): parsedOperands.push(activeDemon.value.affinitiesBooster[0]); return;
                            case ("slashresistance"): case ("slhres"): parsedOperands.push(activeDemon.value.affinitiesBooster[1]); return;
                            case ("pierceresistance"): case ("prcres"): parsedOperands.push(activeDemon.value.affinitiesBooster[2]); return;
                            case ("fireresistance"): case ("firres"): parsedOperands.push(activeDemon.value.affinitiesBooster[3]); return;
                            case ("iceresistance"): case ("iceres"): parsedOperands.push(activeDemon.value.affinitiesBooster[4]); return;
                            case ("elecresistance"): case ("elcres"): parsedOperands.push(activeDemon.value.affinitiesBooster[5]); return;
                            case ("forceresistance"): case ("frcres"): parsedOperands.push(activeDemon.value.affinitiesBooster[6]); return;
                            case ("toxicresistance"): case ("toxres"): parsedOperands.push(activeDemon.value.affinitiesBooster[7]); return;
                            case ("psychicresistance"): case ("psyres"): parsedOperands.push(activeDemon.value.affinitiesBooster[8]); return;
                            case ("lightresistance"): case ("lgtres"): parsedOperands.push(activeDemon.value.affinitiesBooster[9]); return;
                            case ("arkres"): parsedOperands.push(activeDemon.value.affinitiesBooster[10]); return;




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

                    // Calculate damage reduction from frontliner’s guard
                    let frontLiner = this.soldiers[0];
                    let guardReduction = frontLiner.guard / 100;
                    let armyDamage = Math.ceil(iDamage * guardReduction);
                    let returningDamage = Math.max(1, iDamage - armyDamage);

                    // /damage 100
                    while (armyDamage > 0 && this.soldiers.length > 0) {

                        if (armyDamage >= this.soldiers[0].hp) {
                            // Remove soldier entirely
                            this.soldiers[0].units -= 1
                            armyDamage -= this.soldiers[0].hp
                            this.soldiers[0].hp = this.soldiers[0].maxHp;
                            if (this.soldiers[0].units < 1) { this.soldiers.splice(0, 1) }
                            // Don't increment index — next soldier now in current spot
                        } else {
                            // Apply damage across this soldier’s units
                            this.soldiers[0].hp -= armyDamage;
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
                    this.editing = false;
                }


            }



            let army = ref(new Army([
                
                new Soldier('Placeholder', 500000, 0, 0, 'Resources/DemonIcon.png', 1, 0)
                // new Soldier('Einherjar ShieldWaller', 50, 2, 20, 'Resources/DemonIcon.png', 20, 7),
                // new Soldier('Angels', 31, 3, 5, 'Resources/DemonIcon.png', 40, 3),
                // new Soldier('Virtues', 40, 5, 4, 'Resources/DemonIcon.png', 20, 5),
                // new Soldier('Zombie', 10, 1, 5, 'Resources/DemonIcon.png', 20, 0),


            ]));
            // army.value.soldiers[1].assaults = [new Assault('Skirmish', 'Physical', 10, 0), new Assault('Humble Blessing', 'Healing', 5, 1), new Assault('Heaven\'s Arrows', 'Light', 7, 3)];



            // Demon class definition

            class Skill {
                constructor(iName, iDescription, iRollnames, iRolls) {
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
                checkRolls() {
                    console.log("Got Here");
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
                    this.skillPotential = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.profile = [];
                    this.skills = []; // Array of skills
                    this.contract = ''; // Contract with a demon
                    this.buffs = [0, 0, 0]; // Buffs for St, Ma, Vi, Ag, Lu
                    this.weapon = new Skill('Bare Hands', 'An unarmed strike, inflicting weak strike damage to one foe', ['Aim', 'Damage'], ['/roll 1d100+ag', '/roll (C*(stkpwr*(1+T*0.2)*(6+6*(st/20))))d6']); // Array of weapons
                    this.armor = ['Clothes', 1, 2,]; // Array of armor
                    this.accessories = [['Watch', 'Tells the Time'], ['', ''], ['', '']]; // Array of accessories
                    this.growthRates = [2, 2, 2, 2, 2];
                    this.icon = 'Resources/DemonIcon.png';
                    this.main = false;
                    this.notes = "Write notes here..."

                    // Boosters
                    this.statsBooster = [0, 0, 0, 0, 0];
                    this.hpBooster = 0;
                    this.mpBooster = 0;
                    this.affinitiesBooster = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.skillPotentialBoost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.damageBooster = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
                    this.coefficient = 1;

                    for (let i = 0; i < 8; i++) {
                        this.skills.push(new Skill("", "", [], []));
                    }

                }

                recalculateVitals() {
                    let oldHP = this.maxHp;
                    this.maxHp = Math.floor(50 + (this.stats[2] + this.level + (this.stats[4] / 10)) * 7); // Maximum HP
                    this.hp += (this.maxHp - oldHP);
                    
                    let oldMP = this.maxMp;
                    this.maxMp = Math.floor(32 + ((this.stats[1] * 8) + (this.level) + (this.stats[4] / 4))); // Maximum MP
                    this.mp += (this.maxMp - oldMP);

                }


                getVariables() {
                    this.statsBooster = [0, 0, 0, 0, 0];
                    this.hpBooster = 0;
                    this.mpBooster = 0;
                    this.affinitiesBooster = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
                    this.skillPotentialBoost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.damageBooster = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
                    this.checkBoxes = [];


                    this.accessories.forEach(accessory => {
                        this.checkBoxes.push(accessory[1]);
                    });
                    this.skills.forEach(skill => {
                        skill.rolls.forEach(roll => {
                            this.checkBoxes.push(roll);
                        });
                    });
                    // this.skills.forEach(skill => {
                    //     skill.rolls.forEach(roll => {
                    //         this.checkBoxes.push(roll);
                    //     })
                    // });


                    this.checkBoxes.forEach(checkBox => {
                        try {
                            if (checkBox.startsWith("+") || checkBox.startsWith("-")) {

                                // Variable Declaration
                                let percentage = false;
                                let percentageBoost = 1;
                                if (checkBox.split(' ')[0].endsWith('%')) { percentage = true; }
                                let valueBoost = parseInt(checkBox.split(' ')[0]);
                                let attributeBoost = checkBox.split(' ')[1].toLowerCase();



                                switch (attributeBoost) {
                                    case ("hp"): if (percentage) { percentageBoost = this.maxHp / 100 }; this.hpBooster += valueBoost * percentageBoost; break;
                                    case ("mp"): if (percentage) { percentageBoost = this.maxMp / 100 }; this.mpBooster += valueBoost * percentageBoost; break;
                                    case ("str"): case ("st"): case ("strength"): if (percentage) { percentageBoost = this.stats[0] / 100 }; this.statsBooster[0] += Math.floor(valueBoost * percentageBoost); break;
                                    case ("mag"): case ("ma"): case ("magic"): if (percentage) { percentageBoost = this.stats[1] / 100 }; this.statsBooster[1] += Math.floor(valueBoost * percentageBoost); break;
                                    case ("vit"): case ("vi"): case ("vitality"): if (percentage) { percentageBoost = this.stats[2] / 100 }; this.statsBooster[2] += Math.floor(valueBoost * percentageBoost); break;
                                    case ("agi"): case ("ag"): case ("agility"): if (percentage) { percentageBoost = this.stats[3] / 100 }; this.statsBooster[3] += Math.floor(valueBoost * percentageBoost); break;
                                    case ("luc"): case ("lu"): case ("luck"): if (percentage) { percentageBoost = this.stats[4] / 100 }; this.statsBooster[4] += Math.floor(valueBoost * percentageBoost); break;
                                    case ("strikepower"): case ("stkpwr"): this.damageBooster[0] += valueBoost; break;
                                    case ("slashpower"): case ("slhpwr"): this.damageBooster[1] += valueBoost; break;
                                    case ("piercepower"): case ("prcpwr"): this.damageBooster[2] += valueBoost; break;
                                    case ("firepower"): case ("firpwr"): this.damageBooster[3] += valueBoost; break;
                                    case ("icepower"): case ("icepwr"): this.damageBooster[4] += valueBoost; break;
                                    case ("elecpower"): case ("elcpwr"): this.damageBooster[5] += valueBoost; break;
                                    case ("forcepower"): case ("frcpwr"): this.damageBooster[6] += valueBoost; break;
                                    case ("toxicpower"): case ("toxpwr"): this.damageBooster[7] += valueBoost; break;
                                    case ("psychicpower"): case ("psypwr"): this.damageBooster[8] += valueBoost; break;
                                    case ("lightpower"): case ("lgtpwr"): this.damageBooster[9] += valueBoost; break;
                                    case ("darkpower"): case ("drkpwr"): this.damageBooster[10] += valueBoost; break;
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
                                    case ("darkpotential"): case ("drkpot"): this.skillPotentialBoost[10] += valueBoost; break;
                                    case ("almightypotential"): case ("almpot"): this.skillPotentialBoost[11] += valueBoost; break;
                                    case ("ailmentpotential"): case ("ailpot"): this.skillPotentialBoost[12] += valueBoost; break;
                                    case ("healingpotential"): case ("hlgpot"): this.skillPotentialBoost[13] += valueBoost; break;
                                    case ("tacticalpotential"): case ("tacpot"): this.skillPotentialBoost[14] += valueBoost; break;
                                    case ("strikeresistance"): case ("stkres"): this.affinitiesBooster[0] += valueBoost; break;
                                    case ("slashresistance"): case ("slhres"): this.affinitiesBooster[1] += valueBoost; break;
                                    case ("pierceresistance"): case ("prcres"): this.affinitiesBooster[2] += valueBoost; break;
                                    case ("fireresistance"): case ("firres"): this.affinitiesBooster[3] += valueBoost; break;
                                    case ("iceresistance"): case ("iceres"): this.affinitiesBooster[4] += valueBoost; break;
                                    case ("elecresistance"): case ("elcres"): this.affinitiesBooster[5] += valueBoost; break;
                                    case ("forceresistance"): case ("frcres"): this.affinitiesBooster[6] += valueBoost; break;
                                    case ("toxicresistance"): case ("toxres"): this.affinitiesBooster[7] += valueBoost; break;
                                    case ("psychicresistance"): case ("psyres"): this.affinitiesBooster[8] += valueBoost; break;
                                    case ("lightresistance"): case ("lgtres"): this.affinitiesBooster[9] += valueBoost; break;
                                    case ("darkresistance"): case ("drkres"): this.affinitiesBooster[10] += valueBoost; break;
                                }

                            }
                            console.log(checkBox);
                        } catch (exception) {
                            console.warn(exception)
                        }
                    });


                    // Floor all booster values to prevent decimals

                    // HP and MP
                    this.hpBooster = Math.floor(this.hpBooster);
                    this.mpBooster = Math.floor(this.mpBooster);

                    // Stats (str, mag, vit, agi, luc)
                    this.statsBooster = this.statsBooster.map(Math.floor);

                    // Affinities (11 elements)
                    this.affinitiesBooster = this.affinitiesBooster.map(Math.floor);

                    // Skill Potentials (15 elements)
                    this.skillPotentialBoost = this.skillPotentialBoost.map(Math.floor);

                    // Damage Boosters (15 elements)
                    this.damageBooster = this.damageBooster.map(Math.floor);

                }


            }


            // Create a new Demon instance
            let player = new Demon("Adam");
            player.skills[0] = new Skill("Agi", "Mild fire damage to 1 foe", ['Cost', 'Aim', 'Damage'], ['/mp (10-1)', '/roll 1d100', '/roll 12d6'])
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
                    if (lowercaseMessage.startsWith('/roll') || lowercaseMessage.startsWith('/math')) {

                        // Extract the dice notation (e.g., "3d6 + 2d10 + (4 * 5)")
                        let calculation = lowercaseMessage.slice(5).trim();
                        calculation.replace(' ', '');
                        let total = 0;

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
                    } else if (lowercaseMessage.startsWith('/hp')) {


                        //include damage and healing
                        let calculation = lowercaseMessage.slice(3).trim();
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

                        if (activeDemon.value.hp < -activeDemon.value.maxHp + activeDemon.value.hpBooster) {
                            activeDemon.value.hp = -activeDemon.value.maxHp + activeDemon.value.hpBooster; // Prevent negative HP
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
                            rawDamage = Math.floor( rawDamage * ((200 / (200 + ((activeDemon.value.stats[2] + activeDemon.value.armor[2]) * (1 + ((activeDemon.value.stats[2] + activeDemon.value.armor[2]) / 30)))))) );
                        }
                        

                        if (rawDamage < 1) { rawDamage = 1; }
                        // Apply army damage reduction if army exists
                        let finalDamage = parseInt(rawDamage) || 1;


                        // Apply remaining damage to player
                        activeDemon.value.hp -= finalDamage;

                        if (activeDemon.value.hp < 0) { activeDemon.value.hp = 0; }

                        // Handle other commands starting with "/"
                        log.value.push(`Command executed: ${lowercaseMessage.trim()} ` + finalDamage + ' damage taken (after army reduction)');

                    } else if (messageInput.value.startsWith('/clear')) {
                        // Handle other commands starting with "/"
                        log.value = [];
                    } else if (messageInput.value.startsWith('/deletelocalstorage')) {
                        // Handle other commands starting with "/"
                        localStorage.clear();
                    } else if (messageInput.value.startsWith('/deletedemon')) {

                        // Delete Demon
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
                        dataMaster.value.loadData();

                    } else if (lowercaseMessage.startsWith('/save')) {
                        dataMaster.value.saveData();

                    } else if (lowercaseMessage.startsWith('/print')) {
                        dataMaster.value.printData();

                    } else if (lowercaseMessage.startsWith('/download')) {
                        dataMaster.value.downloadData();

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



                    // Initialize fileData with the current data


                    // Update fileData based on the current state of the game
                    this.updateFileData = () => {
                        this.fileData = {
                            // favoriteThing: "boobs",
                            demons: demonList.value
                        };
                        console.log(JSON.stringify(this.fileData));

                    }

                    // Print the current fileData to the console nicely formatted
                    this.printData = () => {
                        this.updateFileData();
                        // console.log(JSON.stringify(this.fileData));
                    }

                    this.downloadData = () => {
                        this.updateFileData();
                        const dataStr = JSON.stringify(this.fileData, null, 2);
                        const blob = new Blob([dataStr], { type: "application/json" });
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = "savedata.json"; // Default filename
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }


                    // Load saved data from localStorage and update game state
                    this.loadData = () => {
                        const savedData = localStorage.getItem("SAVEDATA");

                        if (savedData) {
                            this.fileData = JSON.parse(savedData);

                            // Update the game variables with loaded data
                            // demonList.value = this.fileData.demons;
                            console.log(this.fileData.demons);
                            demonList.value = [];
                            let demonsArray = this.fileData.demons;

                            demonsArray.forEach(demon => {
                                // Demon.parse(demon);
                                // console.log(demonsArray);
                                demonList.value.push(demon);
                            });
                            activeDemon.value = demonList.value[0];
                            // console.log("List: ");
                            // console.log(demonList.value);


                        } else {
                            console.warn("No saved data found in localStorage.");
                        }
                    }

                    // Save current game state to localStorage
                    this.saveData = () => {
                        // Update fileData before saving to ensure latest data is stored
                        this.updateFileData();

                        localStorage.setItem("SAVEDATA", JSON.stringify(this.fileData));
                    }
                }
            }



            let dataMaster = ref(new DataMaster());


            return { activePage, activeTab, tabs, log, messageInput, sendMessage, demonList, activeDemon, player, getBuffShadowStyle, army, modal, started, introTab, readingText, startReading, startingAmbience, characterCreator, modalTab, selectedSkill, displaySkill, unlockedTabs, dataMaster };


        }
    }).mount('#app');
});