export class Equipment {
    constructor(iName, iDescription, iWeight) {
        this.id = crypto.randomUUID(); 
        this.name = iName;
        this.description = iDescription;
        // this.requiredTags = [] || iRequiredTags; iRequiredTags, iExcludedTags,
        // this.excludedTags = [] || iExcludedTags;
        this.weight = iWeight;
        this.equipped = false;
        this.equipper = "";
    }
    
}



export class Weapon extends Equipment {
    constructor(iName, iDescription, iWeight, iRollnames, iRolls, iIcon){
        super(iName, iDescription, iWeight);
        this.rollNames = iRollnames || [];
        this.rolls = iRolls || [];
        this.icon = iIcon;
        this.itemType = "Weapon";
        this.default = false;
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

export class Armor extends Equipment {
    constructor(iName, iDescription, iWeight, iResistance, iEvasion, iBoxes){
        super(iName, iDescription, iWeight);
        this.resistance = iResistance;
        this.evasion = iEvasion;
        this.boxes = iBoxes || [];
        // this.icon = iIcon;
        this.itemType = "Armor";
        this.default = false;
    }
}

// let kevlar = ;

export class Accessory extends Equipment {
    constructor(iName, iDescription, iWeight, iBoxes ){
        super(iName, iDescription, iWeight);
        this.boxes = iBoxes || [];
        this.itemType = "Accessory";

    }
}