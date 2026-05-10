export let rolledDice = '';

//because spamming random() would be dumb
export function RollDice(dice, sides) {
    let total = 0;
    for (let i = 0; i < dice; i++) {
        total += Math.floor(Math.random() * sides + 1);
    }
    return total;
}

export function resetRolledDice(){
    rolledDice = '';
}

// The function that makes math math nicely
export function dMDAS(iCalculation, iDemon) {
    
    // The expression to calculate
    // msgRD = '';
    // let rolledDice = "";
    let calculation = iCalculation;


    // let floor = false;
    // let ceiling = false;
    // if (calculation.includes('_floor')) { floor = true; calculation=calculation.replace('_floor', ''); }
    // if (calculation.includes('_ceiling') || calculation.includes('_ceil')) { ceiling = true; calculation=calculation.replace('_ceiling', ''); }
    // console.log(floor);
    // console.log(calculation);


    // Function to handle parentheses by recursively evaluating them
    function evaluateParentheses(expression) {
        // Regex to find the innermost parentheses
        const regex = /\(([^()]+)\)/g;

        // Replace parentheses with evaluated results
        while (regex.test(expression)) {
            expression = expression.replace(regex, (match, subExpr) => {
                // Here, we call dMDAS to evaluate the expression inside the parentheses
                return dMDAS(subExpr, iDemon);
            });
        }

        return expression;
    }



    // /math 0+$a$
    function evaluateCounters(expression) {
        
        let countersFound = [...expression.matchAll(/\$(.*?)\$/g)].map(m => m[1]);
        
        countersFound.forEach(counter => {
            
            try{
                expression = expression.replace('$'+counter+'$', (iDemon.counters.find(demonCounter => demonCounter[0].toLowerCase() === counter)[1]));
            } catch{
                expression = expression.replace('$'+counter+'$', "0")
            }

        });

        return expression;
    }

    // First, process the expression to handle parentheses
    calculation = evaluateParentheses(calculation);

    calculation = evaluateCounters(calculation);

    // console.log(calculation);


    if (calculation.includes("+") || calculation.includes("-") || calculation.includes("*") || calculation.includes("/") || calculation.includes("d")  || calculation.includes("^")  || calculation.includes(">")  || calculation.includes("<")  || calculation.includes("=") ) {

        // Gather Variables
        // let operands = calculation.split(/[+\-*/d]/);
        // let operators = [...calculation.match(/[+\-*/d]/g)];
        let operands = calculation.split(/[+\-*/d^<>=&]/);
        let operators = [...calculation.match(/[+\-*/d^<>=&]/g)];
        let parsedOperands = [];

        // case ("physpower"): case ("physpwr"): this.damageGenusBooster[0] += valueBoost * 0.01; break;
        // case ("elmtpower"): case ("elmtpwr"): this.damageGenusBooster[1] += valueBoost * 0.01; break;
        // case ("mystpower"): case ("mystpwr"): this.damageGenusBooster[2] += valueBoost * 0.01; break;
        // case ("magpower"): case ("magpwr"): this.damageGenusBooster[3] += valueBoost * 0.01; break;
        // case ("allpower"): case ("allpwr"): this.damageGenusBooster[4] += valueBoost * 0.01; break;


        // Power Genus Calc
        let physP = iDemon.damageGenusBooster[0] * iDemon.damageGenusBooster[4];
        let elmtP = iDemon.damageGenusBooster[1] * iDemon.damageGenusBooster[3] * iDemon.damageGenusBooster[4];
        let mystP = iDemon.damageGenusBooster[2] * iDemon.damageGenusBooster[3] * iDemon.damageGenusBooster[4];
        let magiP = iDemon.damageGenusBooster[3] * iDemon.damageGenusBooster[4];
        let allP = iDemon.damageGenusBooster[4];

        // Resist Genus Calc
        let physR = iDemon.affinitiesGenusReducer[0] * iDemon.affinitiesGenusReducer[4];
        let elmtR = iDemon.affinitiesGenusReducer[1] * iDemon.affinitiesGenusReducer[3] * iDemon.affinitiesGenusReducer[4];
        let mystR = iDemon.affinitiesGenusReducer[2] * iDemon.affinitiesGenusReducer[3] * iDemon.affinitiesGenusReducer[4];
        let magiR = iDemon.affinitiesGenusReducer[2] * iDemon.affinitiesGenusReducer[4];
        let allR = iDemon.affinitiesGenusReducer[4];

        // Evasion Genus Calc
        let allEva = iDemon.affinitiesGenusEvasion[4];
        let physEva = iDemon.affinitiesGenusEvasion[0] * iDemon.affinitiesGenusEvasion[4];
        let elmtEva = iDemon.affinitiesGenusEvasion[1] * iDemon.affinitiesGenusEvasion[3] * iDemon.affinitiesGenusEvasion[4];
        let mystEva = iDemon.affinitiesGenusEvasion[2] * iDemon.affinitiesGenusEvasion[3] * iDemon.affinitiesGenusEvasion[4];
        let magEva = iDemon.affinitiesGenusEvasion[3] * iDemon.affinitiesGenusEvasion[4];

        // Aim Genus Calc
        let physAim = iDemon.aimGenusBooster[0] * iDemon.aimGenusBooster[4];
        let elmtAim = iDemon.aimGenusBooster[1] * iDemon.aimGenusBooster[3] * iDemon.aimGenusBooster[4];
        let mystAim = iDemon.aimGenusBooster[2] * iDemon.aimGenusBooster[3] * iDemon.aimGenusBooster[4];
        let magAim = iDemon.aimGenusBooster[3] * iDemon.aimGenusBooster[4];
        let allAim = iDemon.aimGenusBooster[4];

        // let elmtEva = 100;
        // console.log("allEva", allEva)
        
        let guardMuch = 0;
        let dodgeMuch = 0;
        if (iDemon.guard) { guardMuch = 1; }
        if (iDemon.dodge) { dodgeMuch = 1; }

        // console.log(calculation);



        // Parse Opperands
        operands.forEach(operand => {
            operand = operand.trim().toLowerCase();

            // Match known keywords
            switch (operand) {

                // Stats
                case "level": case "lvl": case "lv": parsedOperands.push(iDemon.level); return;
                case "str": case "st": parsedOperands.push(iDemon.stats[0] + iDemon.statsBooster[0]); return;
                case "mag": case "ma": parsedOperands.push(iDemon.stats[1] + iDemon.statsBooster[1]); return;
                case "vit": case "vi": parsedOperands.push(iDemon.stats[2] + iDemon.statsBooster[2]); return;
                case "agi": case "ag": parsedOperands.push(iDemon.stats[3] + iDemon.statsBooster[3]); return;
                case "luc": case "lu": parsedOperands.push(iDemon.stats[4] + iDemon.statsBooster[4]); return;
                case "hp": parsedOperands.push(iDemon.hp); return;
                case "mhp": parsedOperands.push(iDemon.maxHp + iDemon.hpBooster); return;
                case "mp": parsedOperands.push(iDemon.mp); return;
                case "mmp": parsedOperands.push(iDemon.maxMp + iDemon.mpBooster); return;
                case "bw": parsedOperands.push(iDemon.bulwark); return;
                case "critbooster": case "cb": parsedOperands.push(iDemon.critBooster); return;
                case "critMultiplier": case "cm": parsedOperands.push(iDemon.critMultiplier); return;

                case ("physicalcost"): case ("physcost"): parsedOperands.push(iDemon.physCost*iDemon.allCost); break;
                case ("magicalcost"): case ("magcost"): parsedOperands.push(iDemon.magCost*iDemon.allCost); break;
                case ("allcost"): parsedOperands.push(iDemon.allCost); break;


                // Buffs
                case "t": parsedOperands.push(iDemon.buffs[0]); return;
                case "r": parsedOperands.push(Math.min(4, iDemon.buffs[1] + guardMuch)); return;
                case "s": parsedOperands.push(Math.min(4, iDemon.buffs[2] + dodgeMuch)); return;
                case "c": parsedOperands.push(dMDAS(iDemon.coefficient + "+0", iDemon)); return;
                



                // Talents

                // Sense
                case "talsee": case "talsight": parsedOperands.push(iDemon.senses.see+iDemon.sensesBoost.see); return;
                case "talher": case "talhear": parsedOperands.push(iDemon.senses.hear+iDemon.sensesBoost.hear); return;
                case "talsml": case "talsmell": parsedOperands.push(iDemon.senses.smell+iDemon.sensesBoost.smell); return;
                case "talfel": case "talfeel": parsedOperands.push(iDemon.senses.feel+iDemon.sensesBoost.feel); return;
                case "taltst": case "taltaste": parsedOperands.push(iDemon.senses.taste+iDemon.sensesBoost.taste); return;
                case "talsxt": case "talsixth": parsedOperands.push(iDemon.senses.sixth+iDemon.sensesBoost.sixth); return;
                
                // Academia
                case "talatp": case "talanthropology": parsedOperands.push(iDemon.academia.anthropology+iDemon.academiaBoost.anthropology); return;                
                case "talart": case "talartisanship": case "talartisan": parsedOperands.push(iDemon.academia.artisanship+iDemon.academiaBoost.artisanship); return;                
                case "talbio": case "talbiology": parsedOperands.push(iDemon.academia.biology+iDemon.academiaBoost.biology); return;                
                case "taleng": case "talengineer": case "talengineering": parsedOperands.push(iDemon.academia.engineering+iDemon.academiaBoost.engineering); return;                
                case "talmat": case "talmath": case "talmathematics": parsedOperands.push(iDemon.academia.mathematics+iDemon.academiaBoost.mathematics); return;                
                case "taloct": case "taloccult": case "taloccultism": parsedOperands.push(iDemon.academia.occultism+iDemon.academiaBoost.occultism); return;                
                case "talphi": case "talphilosophy": parsedOperands.push(iDemon.academia.philosophy+iDemon.academiaBoost.philosophy); return;                
                
                // Social
                case "talaut": case "talauthority": parsedOperands.push(iDemon.social.authority+iDemon.socialBoost.authority); return;                
                case "talcrg": case "talcourage": parsedOperands.push(iDemon.social.courage+iDemon.socialBoost.courage); return;
                case "talcrm": case "talcharm": parsedOperands.push(iDemon.social.charm+iDemon.socialBoost.charm); return;
                case "talact": case "talacting": parsedOperands.push(iDemon.social.acting+iDemon.socialBoost.acting); return;
                case "taldcm": case "taldiscernment": parsedOperands.push(iDemon.social.discernment+iDemon.socialBoost.discernment); return;

                // Prowess
                case "iq": parsedOperands.push(iDemon.iq+iDemon.iqBoost); return;
                case "wilpwr": case "willpower": parsedOperands.push(iDemon.willPower+iDemon.willPowerBoost); return;
                case "sp": case "spe": case "fast": parsedOperands.push(iDemon.speed+iDemon.speedBoost); return;
                case "carry": case "carry": case "carry": parsedOperands.push(iDemon.carry+iDemon.carryBoost); return;






                // 0 = phys, 1 = elemental, 2 = mystic, 3 = magic, 4 = all


                // Damage Boosters (renamed to use 'power' to avoid dice parsing issues)
                case ("strikepower"): case ("stkpwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[0] * physP)); return;
                case ("slashpower"): case ("slhpwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[1] * physP)); return;
                case ("piercepower"): case ("prcpwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[2] * physP)); return;
                case ("firepower"): case ("firpwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[3] * elmtP)); return;
                case ("icepower"): case ("icepwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[4] * elmtP)); return;
                case ("elecpower"): case ("elcpwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[5] * elmtP)); return;
                case ("forcepower"): case ("frcpwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[6] * elmtP)); return;
                case ("toxicpower"): case ("toxpwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[7] * elmtP)); return;
                case ("psionicpower"): case ("psipwr"): case ("psychicpower"): case ("psypwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[8] * elmtP)); return;
                case ("lightpower"): case ("lgtpwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[9] * mystP)); return;
                case ("gloompower"): case ("glmpwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[10] * mystP)); return;
                case ("almightypower"): case ("almpwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[11] * mystP)); return;
                case ("ailmentpower"): case ("ailpwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[12] * mystP)); return;
                case ("healingpower"): case ("hlgpwr"): parsedOperands.push( Math.max(0.01,  iDemon.damageBooster[13 * mystP])); return;

                case ("physicalpower"): case ("physpwr"): parsedOperands.push( Math.max(0.01, physP )); return;
                case ("elementalpower"): case ("elmtpwr"): parsedOperands.push( Math.max(0.01, elmtP )); return;
                case ("magicalpower"): case ("magpwr"): case ("magicpower"): case ("magicpwr"): case ("magipwr"): parsedOperands.push( Math.max(0.01, magiP )); return;
                case ("mysticalpower"): case ("mystpwr"): case ("mysticpower"): case ("mysticpwr"): parsedOperands.push( Math.max(0.01, mystP )); return;
                case ("allpower"): case ("allpwr"): parsedOperands.push( Math.max(0.01, allP )); return;


                // Aim Boosters
                case ("strikeaim"): case ("stkaim"): parsedOperands.push( Math.max(0.01,  iDemon.aimBooster[0] * physAim)); return;
                case ("slashaim"): case ("slhaim"): parsedOperands.push( Math.max(0.01,  iDemon.aimBooster[1] * physAim)); return;
                case ("pierceaim"): case ("prcaim"): parsedOperands.push( Math.max(0.01,  iDemon.aimBooster[2] * physAim)); return;
                case ("fireaim"): case ("firaim"): parsedOperands.push( Math.max(0.01,  iDemon.aimBooster[3] * elmtAim)); return;
                case ("iceaim"): case ("iceaim"): parsedOperands.push( Math.max(0.01,  iDemon.aimBooster[4] * elmtAim)); return;
                case ("elecaim"): case ("elcaim"): parsedOperands.push( Math.max(0.01,  iDemon.aimBooster[5] * elmtAim)); return;
                case ("forceaim"): case ("frcaim"): parsedOperands.push( Math.max(0.01,  iDemon.aimBooster[6] * elmtAim)); return;
                case ("toxicaim"): case ("toxaim"): parsedOperands.push( Math.max(0.01,  iDemon.aimBooster[7] * elmtAim)); return;
                case ("psionicaim"): case ("psiaim"): case ("psychicaim"): case ("psyaim"): parsedOperands.push( Math.max(0.01,  iDemon.aimBooster[8] * elmtAim)); return;
                case ("lightaim"): case ("lgtaim"): parsedOperands.push( Math.max(0.01,  iDemon.aimBooster[9] * mystAim)); return;
                case ("gloomaim"): case ("glmaim"): parsedOperands.push( Math.max(0.01,  iDemon.aimBooster[10] * mystAim)); return;
                case ("almightyaim"): case ("almaim"): parsedOperands.push( Math.max(0.01,  iDemon.aimBooster[11] * mystAim)); return;

                case ("physicalaim"): case ("physaim"): parsedOperands.push( Math.max(0.01, physAim )); return;
                case ("elementalaim"): case ("elmtaim"): parsedOperands.push( Math.max(0.01, elmtAim )); return;
                case ("mysticalaim"): case ("mystaim"): case ("mysticaim"): case ("mystiaim"): parsedOperands.push( Math.max(0.01, mystAim )); return;
                case ("magicalaim"): case ("magaim"): case ("magicaim"): case ("magicaim"): case ("magiaim"): parsedOperands.push( Math.max(0.01, magAim )); return;
                case ("allaim"): parsedOperands.push( Math.max(0.01, allAim )); return;

                // Skill Potential
                case ("strikepotential"): case ("stkpot"): parsedOperands.push(iDemon.skillPotential[0] + iDemon.skillPotentialBoost[0]); return;
                case ("slashpotential"): case ("slhpot"): parsedOperands.push(iDemon.skillPotential[1] + iDemon.skillPotentialBoost[1]); return;
                case ("piercepotential"): case ("prcpot"): parsedOperands.push(iDemon.skillPotential[2] + iDemon.skillPotentialBoost[2]); return;
                case ("firepotential"): case ("firpot"): parsedOperands.push(iDemon.skillPotential[3] + iDemon.skillPotentialBoost[3]); return;
                case ("icepotential"): case ("icepot"): parsedOperands.push(iDemon.skillPotential[4] + iDemon.skillPotentialBoost[4]); return;
                case ("elecpotential"): case ("elcpot"): parsedOperands.push(iDemon.skillPotential[5] + iDemon.skillPotentialBoost[5]); return;
                case ("forcepotential"): case ("frcpot"): parsedOperands.push(iDemon.skillPotential[6] + iDemon.skillPotentialBoost[6]); return;
                case ("toxicpotential"): case ("toxpot"): parsedOperands.push(iDemon.skillPotential[7] + iDemon.skillPotentialBoost[7]); return;
                case ("psionicpotential"): case ("psipot"): case ("psychicpotential"): case ("psypot"): parsedOperands.push(iDemon.skillPotential[8] + iDemon.skillPotentialBoost[8]); return;
                case ("lightpotential"): case ("lgtpot"): parsedOperands.push(iDemon.skillPotential[9] + iDemon.skillPotentialBoost[9]); return;
                case ("gloompotential"): case ("glmpot"): parsedOperands.push(iDemon.skillPotential[10] + iDemon.skillPotentialBoost[10]); return;
                case ("almightypotential"): case ("almpot"): parsedOperands.push(iDemon.skillPotential[11] + iDemon.skillPotentialBoost[11]); return;
                case ("ailmentpotential"): case ("ailpot"): parsedOperands.push(iDemon.skillPotential[12] + iDemon.skillPotentialBoost[12]); return;
                case ("healingpotential"): case ("hlgpot"): parsedOperands.push(iDemon.skillPotential[13] + iDemon.skillPotentialBoost[13]); return;
                case ("tacticalpotential"): case ("tacpot"): parsedOperands.push(iDemon.skillPotential[14] + iDemon.skillPotentialBoost[14]); return;

                // Damage Resistances
                case ("strikeresistance"): case ("stkres"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesReducer[0] * physR)); return;
                case ("slashresistance"): case ("slhres"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesReducer[1] * physR)); return;
                case ("pierceresistance"): case ("prcres"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesReducer[2] * physR)); return;
                case ("fireresistance"): case ("firres"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesReducer[3] * elmtR)); return;
                case ("iceresistance"): case ("iceres"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesReducer[4] * elmtR)); return;
                case ("elecresistance"): case ("elcres"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesReducer[5] * elmtR)); return;
                case ("forceresistance"): case ("frcres"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesReducer[6] * elmtR)); return;
                case ("toxicresistance"): case ("toxres"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesReducer[7] * elmtR)); return;
                case ("psionicresistance"): case ("psires"): case ("psychicresistance"): case ("psyres"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesReducer[8] * elmtR)); return;
                case ("lightresistance"): case ("lgtres"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesReducer[9] * mystR)); return;
                case ("gloomresistance"): case ("glmres"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesReducer[10] * mystR)); return;
                case ("allresistance"): case ("allres"): parsedOperands.push( Math.max(0.01,  allR)); return;

                case ("physicalresistance"): case ("physres"): parsedOperands.push( Math.max(0.01, physR )); return;
                case ("elementalresistance"): case ("emltres"): parsedOperands.push( Math.max(0.01, elmtR )); return;
                case ("mysticalresistance"): case ("mystres"): case ("mysticresistance"): case ("mysticres"): parsedOperands.push( Math.max(0.01, mystR )); return;
                case ("magicalresistance"): case ("magicres"): case ("magires"): case ("magres"): parsedOperands.push( Math.max(0.01, magres )); return;
                case ("allres"): parsedOperands.push( Math.max(0.01, allR )); return;

                // Damage Evasion
                case ("strikeevasion"): case ("stkeva"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesEvasion[0] * physEva)); return;
                case ("slashevasion"): case ("slheva"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesEvasion[1] * physEva)); return;
                case ("pierceevasion"): case ("prceva"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesEvasion[2] * physEva)); return;
                case ("fireevasion"): case ("fireva"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesEvasion[3] * elmtEva)); return;
                case ("iceevasion"): case ("iceeva"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesEvasion[4] * elmtEva)); return;
                case ("elecevasion"): case ("elceva"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesEvasion[5] * elmtEva)); return;
                case ("forceevasion"): case ("frceva"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesEvasion[6] * elmtEva)); return;
                case ("toxicevasion"): case ("toxeva"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesEvasion[7] * elmtEva)); return;
                case ("psionicevasion"): case ("psieva"): case ("psychicevasion"): case ("psyeva"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesEvasion[8] * elmtEva)); return;
                case ("lightevasion"): case ("lgteva"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesEvasion[9] * mystEva)); return;
                case ("gloomevasion"): case ("glmeva"): parsedOperands.push( Math.max(0.01,  iDemon.affinitiesEvasion[10] * mystEva)); return;

                case ("physicalevasion"): case ("physeva"): parsedOperands.push( Math.max(0.01,  physEva)); return;
                case ("elementalevasion"): case ("elmeva"): parsedOperands.push( Math.max(0.01,  elmtEva)); return;
                case ("mysticevasion"): case ("mysteva"): parsedOperands.push( Math.max(0.01,  mystEva)); return;
                case ("magicalevasion"): case ("magiceva"): case ("magieva"): case ("mageva"): parsedOperands.push( Math.max(0.01, magEva)); return;
                case ("allevasion"): case ("alleva"): parsedOperands.push( Math.max(0.01,  allEva)); return;

                // Ailment Power
                case ("burnailment"): case ("brnail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[0])); return;
                case ("freezeailment"): case ("frzail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[1])); return;
                case ("shockailment"): case ("shkail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[2])); return;
                case ("mirageailment"): case ("mrgail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[3])); return;
                case ("poisonailment"): case ("psnail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[4])); return;
                case ("confusionailment"): case ("cfnail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[5])); return;
                case ("muteailment"): case ("mutail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[6])); return;
                case ("curseailment"): case ("crsail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[7])); return;
                case ("stunalment"): case ("stnail"): case ("binail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[8])); return;
                case ("charmailment"): case ("crmail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[9])); return;
                case ("fearailment"): case ("ferail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[10])); return;
                case ("sleepailment"): case ("slpail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[11])); return;
                case ("rageailment"): case ("rgeail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[12])); return;
                case ("exhaustionailment"): case ("exhail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[13])); return;
                case ("enervationailment"): case ("evtail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[14])); return;
                case ("bleeingailment"): case ("bleail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[15])); return;
                case ("mortalailment"): case ("mrlail"): case ("ftlail"): parsedOperands.push(Math.max(0.01,  iDemon.ailmentBooster[16])); return;

                // Armor Defense and Evasion
                case ("adefense"): case ("adef"): case ("ares"): case ("armorresistance"): case ("aresistance"): case ("armorres"): parsedOperands.push(iDemon.armorBooster[0]); return;
                case ("aeva"): case ("armorevasion"): case ("aevasion"): case ("armoreva"): parsedOperands.push(iDemon.armorBooster[1]); return;

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

                // msgRD = "Rolled " + rolledDice + " (" + parsedOperands[i] + "), ";
                rolledDice = "Rolled " + rolledDice + " (" + parsedOperands[i] + "), ";

                // Remove the next operand since it has been used
                parsedOperands.splice(i + 1, 1);
                operators.splice(i, 1);  // Remove the operator as well
                i--;  // Adjust index because we've shifted elements
            }
        }

        // Calculate for raising to the power of
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === '^') {
                console.log("got to ^");
                parsedOperands[i] **= parsedOperands[i + 1];
                parsedOperands.splice(i + 1, 1);
                operators.splice(i, 1);
                i--; 
            }
            
        }


        // Calculate for Multiplication and Division
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


        // Calculate for Addition and Subtraction
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === '+' || operators[i] === '-') {
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
        }



        // Check for > or <
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === '>' || operators[i] === '<' || operators[i] === '=') {
                // Perform the operation
                if (operators[i] === '>') {
                    if (parsedOperands[i] > parsedOperands[i + 1]){
                        parsedOperands[i] = 1;
                    } else{
                        parsedOperands[i] = 0;
                    }
                } else if (operators[i] === '<') {
                    if (parsedOperands[i] < parsedOperands[i + 1]){
                        parsedOperands[i] = 1;
                    } else{
                        parsedOperands[i] = 0;
                    }
                } else if (operators[i] === '=') {
                    if (parsedOperands[i] == parsedOperands[i + 1]){
                        parsedOperands[i] = 1;
                    } else{
                        parsedOperands[i] = 0;
                    }
                }

                // Remove the next operand since it has been used
                parsedOperands.splice(i + 1, 1);
                operators.splice(i, 1);  // Remove the operator as well
                i--;  // Adjust index because we've shifted elements
            }
        }

        calculation = parsedOperands[0];

    }

    // return calculation;
    return calculation;

}