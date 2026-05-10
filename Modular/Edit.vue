<template>
  <div class="w-4/4 h-[93.333334%] flex-col gap-2" v-if="prettify.activePage === 'Editor' || prettify.runkusMode">
    
                <div class="h-full w-full">

                    <div class="w-full flex flex-row gap-2 p-2 h-full">
                        <div
                            :class="'bg-gradient-to-r from-' + colorScheme[1] + '-950 to-' + colorScheme[3] + '-800 w-full h-full rounded-2xl ring-2 ring-' + colorScheme[0] + '-500 flex flex-col overflow-y-scroll pt-5 px-3 pb-3'">

                            <div class="px-3">
                                <p
                                    :class="'text-4xl font-bold text-' + colorScheme[5] + '-400 border-b-2 mb-2 border-' + colorScheme[0] + '-500'">
                                    Identity
                                </p>
                            </div>


                            <div class="flex flex-row h-1/4">

                                <div class="p-4 h-full aspect-square">
                                    <img :src="activeDemon.icon"
                                        class="h-full aspect-square object-cover rounded-full ring-4 totalBackground ring-slate-500 pixel-art"
                                        alt="">
                                </div>
                                <div class="flex flex-col px-3 gap-2 flex-wrap w-full">

                                    <!-- Name -->
                                    <label for="nameBox"
                                        :class="'border-b-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Name:</label>
                                    <input type="text" v-model="activeDemon.name" name="" id="nameBox"
                                        @change="activeDemon.accessories.forEach(acc => { if (acc.equipper){acc.equipper=activeDemon.name }}); DataMaster.autoSave()"
                                        :class="' h-1/4 bg-' + colorScheme[1] + '-950 text-white p-2 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">

                                    <!-- Race -->
                                    <label for="raceBox"
                                        :class="'border-b-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Race:</label>
                                    <input type="text" v-model="activeDemon.race" name="" id="raceBox"
                                        @change="console.log(DataMaster); console.log(DataMaster.autoSave())"
                                        :class="' h-1/4 bg-' + colorScheme[1] + '-950 text-white p-2 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">

                                    <!-- Icon URL -->
                                    <label for="IconBox"
                                        :class="'border-b-2 border-' + colorScheme[0] + '-500 font-bold text-white'">IconURL:</label>
                                    <input type="text" v-model="activeDemon.icon" name="" id="IconBox"
                                        @change="DataMaster.autoSave()"
                                        :class="' h-1/4 bg-' + colorScheme[1] + '-950 text-white p-2 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">

                                    <!-- Alignment -->
                                    <label for="alignmentBox"
                                        :class="'border-b-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Alignment:</label>
                                    <input type="text" v-model="activeDemon.alignment" name="" id="alignmentBox"
                                        @change="DataMaster.autoSave()"
                                        :class="' h-1/4 bg-' + colorScheme[1] + '-950 text-white p-2 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">

                                </div>

                            </div>

                            <!-- Description -->
                            <div class="flex flex-row gap-2 min-h-64 px-3 mb-1">
                                <div class="w-1/3 flex flex-col gap-1 h-full">
                                    <label for="descriptionBox"
                                        :class="'border-b-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Description:</label>
                                    <textarea type="text" v-model="activeDemon.description" name="" id="descriptionBox"
                                        @change="DataMaster.autoSave()" placeholder="Lore about this demon..."
                                        :class="'h-full bg-' + colorScheme[1] + '-950 text-white p-2 rounded-3xl ring-1 ring-' + colorScheme[2] + '-400 resize-none'"> </textarea>
                                </div>
                                <div class="w-1/3 flex flex-col gap-1 h-full">
                                    <label for="descriptionBox"
                                        :class="'border-b-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Birthrights:</label>
                                    <div
                                        :class="'flex flex-row flex-wrap bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[2] + '-400 overflow-y-auto h-full'">
                                        <div class="flex flex-col p-1 w-1/2"
                                            v-for="(birthright, index) in activeDemon.birthrights">
                                            <!-- <input for="" class="border-b-2 mb-2 border-indigo-500 font-bold text-white bg-transparent" placeholder="Roll Name" @change="activeDemon.getVariables();DataMaster.autoSave()"> -->
                                            <input type="text" v-model="activeDemon.birthrights[index]" name=""
                                                :class="'h-1/4 bg-' + colorScheme[0] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'"
                                                placeholder="+"
                                                @change="() => { activeDemon.getVariables(); DataMaster.autoSave(); if (activeDemon.birthrights[index] === '') activeDemon.birthrights.splice(index, 1); }">
                                        </div>
                                        <div class="w-1/2 min-h-16 p-2 font-semibold"
                                            v-if="activeDemon.birthrights.length < 10"
                                            @click="activeDemon.birthrights.push('+');">
                                            <div
                                                :class="'text-white rounded-lg bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 max-h-full w-full ring-1 ring-white p-2'">
                                                +New Birthright
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-1/3 flex flex-col gap-1 h-full">
                                    <label for="descriptionBox"
                                        :class="'border-b-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Tags:</label>
                                    <div
                                        :class="'overflow-y-auto h-full bg-' + colorScheme[1] + '-950 text-white p-2 rounded-3xl ring-1 ring-' + colorScheme[2] + '-400'">
                                        <div class="flex flex-wrap gap-2 ">
                                            <input type="text" v-model="activeDemon.newTag"
                                                :class="'w-full text-white text-lg font-thin rounded-2xl bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 px-2 mb-1 ring-1 ring-' + colorScheme[0] + '-500'"
                                                placeholder="Add Tag..."
                                                @change="() => {if (activeDemon.newTag != '') { activeDemon.keywords.push(activeDemon.newTag); activeDemon.newTag = ''; DataMaster.autoSave(); }}">
                                            <p v-for="(keyword, index) in activeDemon.keywords"
                                                @click="activeDemon.keywords.splice(index, 1); DataMaster.autoSave()"
                                                :key="index"
                                                :class="'text-white text-lg font-thin rounded-2xl bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 px-2 ring-1 hover:ring-2 ring-' + colorScheme[0] + '-500 hover:ring-red-500 min-h-1'">
                                                {{ keyword }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>





                            <div class="px-5 pt-5">
                                <p :class="'text-4xl font-bold text-' + colorScheme[5] + '-400 border-b-2 mb-2 border-' + colorScheme[0] + '-500'"> Stats </p>
                            </div>


                            <div class="flex flex-row h-1/4">
                                <div class="flex flex-row flex-wrap px-5 flex-wrap w-full items-center justify-center">

                                    <!-- HP -->
                                    <div class="flex flex-col" style="width: 24%;">
                                        <label for="hpBox"
                                            :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">HP:</label>
                                        <input type="text" v-model.number="activeDemon.hp" name="" id="hpBox"
                                            @change="DataMaster.autoSave()"
                                            :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                    </div>

                                    <!-- Max HP -->
                                    <div class="flex flex-col" style="width: 24%;">
                                        <label for="maxHpBox"
                                            :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Max
                                            HP:</label>
                                        <input type="text" v-model.number="activeDemon.maxHp" name="" id="maxHpBox"
                                            @change="DataMaster.autoSave()"
                                            :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                    </div>

                                    <!-- MP -->
                                    <div class="flex flex-col" style="width: 24%;">
                                        <label for="mpBox"
                                            :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">MP:</label>
                                        <input type="text" v-model.number="activeDemon.mp" name="" id="mpBox"
                                            @change="DataMaster.autoSave()"
                                            :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                    </div>

                                    <!-- Max HP -->
                                    <div class="flex flex-col" style="width: 24%;">
                                        <label for="maxMpBox"
                                            :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Max
                                            MP:</label>
                                        <input type="text" v-model.number="activeDemon.maxMp" name="" id="maxMpBox"
                                            @change="DataMaster.autoSave()"
                                            :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                    </div>

                                </div>
                            </div>

                            <!-- Stats -->
                            <div class="flex flex-row h-1/4 mt-5">
                                <div class="flex flex-row gap-2 flex-wrap px-5 flex-wrap w-full items-center justify-center">

                                    <!-- Stats for -->
                                    <div class="flex flex-col " style="width: 19%;"
                                        v-for="(stat, index) in activeDemon.stats">
                                        <label for="statBox"
                                            :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">
                                            {{["Stength", "Magic", "Vitality", "Agility", "Luck"][index]}} </label>
                                        <input type="text" v-model.number="activeDemon.stats[index]"
                                            @change="activeDemon.recalculateVitals(); DataMaster.autoSave()" name=""
                                            id="statBox"
                                            :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                    </div>


                                </div>
                            </div>

                            <!-- Stats Growth Rate-->
                            <div class="flex flex-row h-1/4 mt-5">
                                <div class="flex flex-row gap-2 flex-wrap px-5 flex-wrap w-full items-center justify-center">

                                    <!-- Stats for -->
                                    <div class="flex flex-col" style="width: 19%;"
                                        v-for="(growthRate, index) in activeDemon.growthRates">
                                        <label for="hpBox"
                                            :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">
                                            {{["Stength", "Magic", "Vitality", "Agility", "Luck"][index]}} Growth Rate
                                        </label>
                                        <input type="text" v-model.number="activeDemon.growthRates[index]" name=""
                                            id="hpBox" @change="DataMaster.autoSave()"
                                            :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                    </div>


                                </div>
                            </div>


                            <div class="px-5 pt-5">
                                <p :class="'text-4xl font-bold text-' + colorScheme[5] + '-400 border-b-2 mb-2 border-' + colorScheme[0] + '-500'"> Talents </p>
                            </div>

                            <div class="flex flex-col">

                                <p :class="'w-full italic border-b border-' + colorScheme[3] + '-600 rounded-xl px-2  text-white text-center font-bold text-2xl font-semibold mb-2 mt-5'"> Senses</p>
                                <div class="flex flex-row w-full px-5">
                                    <!-- Stats for -->
                                        <div class="flex flex-col w-1/6 px-1"
                                            v-for="(value, key) in activeDemon.senses" :key="key">
                                            <label for="" :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">  {{ key.charAt(0).toUpperCase() + key.slice(1) }} </label>
                                            <input type="text" v-model.number="activeDemon.senses[key]" name="" id="" :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                        </div>
                                </div>


                                <p :class="'w-full italic border-b border-' + colorScheme[3] + '-600 rounded-xl px-2  text-white text-center font-bold text-2xl font-semibold mb-2 mt-5'"> Social </p>
                                <div class="flex flex-row w-full px-5">
                                    <!-- Stats for -->
                                        <div class="flex flex-col mx-auto px-1 w-1/5"
                                            v-for="(value, key) in activeDemon.social" :key="key">
                                            <label for="hpBox"
                                                :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">
                                                {{ key.charAt(0).toUpperCase() + key.slice(1) }}
                                            </label>
                                            <input type="text" v-model.number="activeDemon.social[key]" name=""
                                                id="hpBox" d
                                                :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                        </div>
                                </div>

                                <p :class="'w-full italic border-b border-' + colorScheme[3] + '-600 rounded-xl px-2  text-white text-center font-bold text-2xl font-semibold mb-2 mt-3'"> Academia </p>

                                <div class="flex flex-row w-full px-5">
                                    <!-- Stats for -->
                                        <div class="flex flex-col mx-auto px-1" style="width: 14.25%"
                                            v-for="(value, key) in activeDemon.academia" :key="key">
                                            <label for="hpBox"
                                                :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">
                                                {{ key.charAt(0).toUpperCase() + key.slice(1) }}
                                            </label>
                                            <input type="text" v-model.number="activeDemon.academia[key]" name=""
                                                id="hpBox" d
                                                :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                        </div>
                                </div>

                                <p :class="'w-full italic border-b border-' + colorScheme[3] + '-600 rounded-xl px-2  text-white text-center font-bold text-2xl font-semibold mb-2 mt-5'"> Prowess</p>

                                <div class="flex flex-row w-full px-5 mx-auto overflow-x-hidden">
                                    <!-- Stats for -->
                                        <div class="flex flex-col mx-auto" style="width: 20%">
                                            <label for="" :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'"> IQ: </label>
                                            <input type="text" v-model.number="activeDemon.iq" name="" id="" :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                        </div>
                                        <div class="flex flex-col mx-auto" style="width: 20%">
                                            <label for="" :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'"> Carry: </label>
                                            <input type="text" v-model.number="activeDemon.carry" name="" id="" :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                        </div>
                                        <div class="flex flex-col mx-auto" style="width: 20%">
                                            <label for="" :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'"> Speed: </label>
                                            <input type="text" v-model.number="activeDemon.speed" name="" id="" :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                        </div>
                                        <div class="flex flex-col mx-auto" style="width: 20%">
                                            <label for="" :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'"> Willpower: </label>
                                            <input type="text" v-model.number="activeDemon.willPower" name="" id="" :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                        </div>
                                        <div class="flex flex-col mx-auto ml-5" style="width: 15%">
                                            <label for="" :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'"> Skill Count: </label>
                                            <input type="text" v-model.number="activeDemon.skillCount" name="" id="" :class="' h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'" @input="activeDemon.skillCount = Math.max(Math.min(activeDemon.skillCount, 32), 0);" @change="prettify.fixDemonSkillCount(activeDemon); DataMaster.autoSave();">
                                        </div>
                                </div>
                            </div>


                            <div class="px-5 pt-5">
                                <p :class="'text-4xl font-bold text-' + colorScheme[5] + '-400 border-b-2 mb-2 border-' + colorScheme[0] + '-500'"> Default Weapon and Armor</p>
                            </div>

                            <div class="px-5 max-h-200">
                                <div class="min-w-full max-w-full p-2 gap-2 p-3 flex flex-row"
                                    style="height: calc(50vh);">
                                    <div class=" text-white p-3 rounded-xl ring-2  max-h-64 overflow-y-scroll min-h-full w-1/2"
                                        :class="'bg-' + colorScheme[1] + '-950 ring-' + colorScheme[3] + '-300'">


                                        <div class="flex flex-col my-3">
                                            <label for="" :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Weapon Name:</label>

                                            <div class="flex flex-row items-center h-full gap-2">

                                                <div
                                                    :class="'aspect-square w-1/6 ring-1 ring-' + colorScheme[0] + '-500 rounded-2xl'">
                                                    <img :src="'./Resources/' + (activeDemon.defaultWeapon.icon) + 'Icon.png'"
                                                        class="pulsingFilter" v-if="activeDemon.defaultWeapon.icon" />
                                                </div>

                                                <input type="text" v-model="activeDemon.defaultWeapon.name"
                                                    :class="'w-1/2 h-full bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'"
                                                    @change="DataMaster.autoSave()">

                                                <select type="text" v-model="activeDemon.defaultWeapon.icon" name=""
                                                    :class="'w-1/3 h-full bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'"
                                                    @change="DataMaster.autoSave()">
                                                    <!-- <option value="0">No Icon</option> -->
                                                    <option :value="icon"
                                                        v-for="(icon, index) in ['Weapons/Fist', 'Weapon', 'Weapons/Spear', 'Weapons/Axe', 'Weapons/Bow', 'Weapons/Pistol']">
                                                        {{['Fist', 'Sword', 'Spear', 'Axe', 'Bow', 'Pistol'][index]}}</option>
                                                </select>

                                            </div>

                                        </div>

                                        <div class="flex flex-col my-3">
                                            <label for=""
                                                :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Weapon Description:</label>
                                            <textarea v-model.number="activeDemon.defaultWeapon.description"
                                                @change="activeDemon.recalculateVitals(); DataMaster.autoSave()" name=""
                                                :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-100 max-h-32'"> </textarea>
                                        </div>

                                        <div class="flex flex-row flex-wrap">
                                            <div class="flex flex-col w-1/2" v-for="(roll, index) in activeDemon.defaultWeapon.rolls">
                                                <input for=""
                                                    :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white bg-transparent'"
                                                    v-model="activeDemon.defaultWeapon.rollNames[index]" placeholder="Roll Name"
                                                    @change="activeDemon.defaultWeapon.checkRolls(); activeDemon.getVariables(); DataMaster.autoSave()">
                                                <input type="text" v-model="activeDemon.defaultWeapon.rolls[index]" name=""
                                                    :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'"
                                                    placeholder="Roll"
                                                    @change="activeDemon.defaultWeapon.checkRolls(); activeDemon.getVariables(); DataMaster.autoSave()">
                                            </div>
                                            <div class="w-1/2 min-h-16 p-2 font-semibold" v-if="activeDemon.defaultWeapon.rolls.length < 16"
                                                @click="activeDemon.defaultWeapon.rolls.push('/'); activeDemon.defaultWeapon.rollNames.push('');">
                                                <div
                                                    :class="'rounded-lg bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 h-full w-full ring-1 ring-white p-2'">
                                                    +New Roll
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <div class=" text-white p-3 rounded-xl ring-2  max-h-64 overflow-y-scroll min-h-full w-1/2" :class="'bg-' + colorScheme[1] + '-950 ring-' + colorScheme[3] + '-300'">
                                        <div class="flex flex-col my-3">
                                            <label for="" :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Armor Name:</label>

                                            <div class="flex flex-row items-center h-full gap-2">

                                                <div
                                                    :class="'aspect-square w-1/6 ring-1 ring-' + colorScheme[0] + '-500 rounded-2xl'">
                                                    <img :src="'./Resources/ArmorIcon.png'"
                                                        class="pulsingFilter" />
                                                </div>

                                                <input type="text" v-model="activeDemon.defaultArmor.name"
                                                    :class="'w-5/6 h-full bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'"
                                                    @change="DataMaster.autoSave()">

                                            </div>

                                        </div>

                                        <div class="flex flex-col my-3">
                                            <label for=""
                                                :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Armor Description:</label>
                                            <textarea v-model.number="activeDemon.defaultArmor.description"
                                                @change="activeDemon.recalculateVitals(); DataMaster.autoSave()" name=""
                                                :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-100 max-h-32'"> </textarea>
                                        </div>


                                        <!-- Default Armor Resistance and Evasion -->
                                        <div class="flex flex-row">
                                            <div class="flex flex-col w-1/2">
                                                <label :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Resistance:</label>
                                                <input type="text" v-model.number="activeDemon.defaultArmor.resistance" name=""
                                                    :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'"
                                                    placeholder="0"
                                                    @change="DataMaster.autoSave();activeDemon.getVariables(); DataMaster.autoSave()">
                                            </div>
                                            <div class="flex flex-col w-1/2">
                                                <label :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Evasion:</label>
                                                <input type="text" v-model.number="activeDemon.defaultArmor.evasion" name=""
                                                    :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'"
                                                    placeholder="0"
                                                    @change="DataMaster.autoSave();activeDemon.getVariables(); DataMaster.autoSave()">
                                            </div>
                                        </div>

                                        <div class="flex flex-row flex-wrap">
                                            <div class="flex flex-col w-1/2" v-for="(box, index) in activeDemon.defaultArmor.boxes">
                                                <label :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Effect #{{1+index}}:</label>
                                                <input type="text" v-model="activeDemon.defaultArmor.boxes[index]" name=""
                                                    :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'"
                                                    placeholder="Roll"
                                                    @change="if (activeDemon.defaultArmor.boxes[index] === ''){ activeDemon.defaultArmor.boxes.splice(index, 1); }; DataMaster.autoSave();activeDemon.getVariables(); DataMaster.autoSave()">
                                            </div>
                                            <div class="w-1/2 min-h-16 p-2 font-semibold" v-if="activeDemon.defaultArmor.boxes.length < 16"
                                                @click="activeDemon.defaultArmor.boxes.push('+');">
                                                <div
                                                    :class="'rounded-lg bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 h-full w-full ring-1 ring-white p-2'">
                                                    +New Effect
                                                </div>

                                            </div>

                                        </div>


                                    </div>
                                </div>
                            </div>



                            <div class="px-5 pt-5">
                                <p :class="'text-4xl font-bold text-' + colorScheme[5] + '-400 border-b-2 mb-2 border-' + colorScheme[0] + '-500'"> Skills</p>
                            </div>

                            <div class="px-5 max-h-200" v-if="!prettify.runkusMode">
                                <div class="min-w-full max-w-full p-2 gap-2 p-3 flex flex-row"
                                    style="height: calc(50vh);">
                                    <div class=" text-white p-3 rounded-xl ring-2  max-h-64 overflow-y-scroll min-h-full w-1/2"
                                        :class="'bg-' + colorScheme[1] + '-950 ring-' + colorScheme[3] + '-300'">


                                        <div class="flex flex-col my-3" v-if="prettify.esi <= activeDemon.skillCount">
                                            <label for="" :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Skill Name:</label>

                                            <div class="flex flex-row items-center h-full gap-2">

                                                <div
                                                    :class="'aspect-square w-1/6 ring-1 ring-' + colorScheme[0] + '-500 rounded-2xl'">
                                                    <img :src="'./Resources/AffinityIcon' + (activeDemon.skills[prettify.esi].skillType) + '.png'"
                                                        class="pulsingFilter" v-if="activeDemon.skills[prettify.esi].skillType" />
                                                </div>

                                                <input type="text" v-model="activeDemon.skills[prettify.esi].name"
                                                    :class="'w-1/2 h-full bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'"
                                                    @change="DataMaster.autoSave()">

                                                <select type="text" v-model.number="activeDemon.skills[prettify.esi].skillType" name=""
                                                    :class="'w-1/3 h-full bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'"
                                                    @change="DataMaster.autoSave()">
                                                    <option value="0">No Icon</option>
                                                    <option :value="index+1"
                                                        v-for="(affinity, index) in ['Strike', 'Slash', 'Pierce', 'Fire', 'Ice', 'Electricity', 'Force', 'Toxic', 'Psionic', 'Light', 'Gloom', 'Almighty', 'Ailment', 'Healing', 'Tactical']">
                                                        {{affinity}}</option>
                                                </select>

                                            </div>

                                        </div>

                                        <div class="flex flex-col my-3" v-if="prettify.esi <= activeDemon.skillCount">
                                            <label for=""
                                                :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Skill Description:</label>
                                            <textarea v-model.number="activeDemon.skills[prettify.esi].description"
                                                @change="activeDemon.recalculateVitals(); DataMaster.autoSave()" name=""
                                                :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-100 max-h-32'"> </textarea>
                                        </div>

                                        <div class="flex flex-row flex-wrap" v-if="prettify.esi <= activeDemon.skillCount">
                                            <div class="flex flex-col w-1/2" v-for="(roll, index) in activeDemon.skills[prettify.esi].rolls">
                                                <input for=""
                                                    :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white bg-transparent'"
                                                    v-model="activeDemon.skills[prettify.esi].rollNames[index]" placeholder="Roll Name"
                                                    @change="activeDemon.skills[prettify.esi].checkRolls(); activeDemon.getVariables();DataMaster.autoSave()">
                                                <input type="text" v-model="activeDemon.skills[prettify.esi].rolls[index]" name=""
                                                    :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'"
                                                    placeholder="Roll"
                                                    @change="activeDemon.skills[prettify.esi].checkRolls(); activeDemon.getVariables(); DataMaster.autoSave()">
                                            </div>
                                            <div class="w-1/2 min-h-16 p-2 font-semibold" v-if="activeDemon.skills[prettify.esi].rolls.length < 16"
                                                @click="activeDemon.skills[prettify.esi].rolls.push('/'); activeDemon.skills[prettify.esi].rollNames.push('');">
                                                <div
                                                    :class="'rounded-lg bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 h-full w-full ring-1 ring-white p-2'">
                                                    +New Roll
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <div class="h-full w-1/2 flex items-center justify-center">
            
                                        <div @click="prettify.skillPage--; prettify.skillPage=Math.max(0, prettify.skillPage)"
                                        v-if="activeDemon.skillCount > 8 && !prettify.displaySkill" class="h-full flex p-1 items-center justify-center rounded-xl text-white rotate-180"
                                        :class="prettify.skillPage > 0 ? 'bg-' + colorScheme[0] + '-900 hover:bg-' + colorScheme[0] + '-500' : 'bg-gray-500/50'">
                                        ➤
                                        </div>
                                        
                                        <div class="h-full w-full flex flex-col">
                                        <div :class="activeDemon.skillCount>8 ? 'h-[90%]' : 'h-full'" class="grid grid-cols-2 grid-rows-4 grid-flow-col gap-2 w-full p-1">
                                        
                                            <div v-for="(skill, index) in activeDemon.skills.slice(prettify.skillPage*8, Math.min(prettify.skillPage*8+8,  activeDemon.skillCount) )"
                                            @click="prettify.esi = index" :class="prettify.esi == index ? 'bg-' + colorScheme[1] + '-950 ring-' + colorScheme[3] + '-500' : 'bg-' + colorScheme[1] + '-950 ring-' + colorScheme[0] + '-500 hover:ring-' + colorScheme[1] + '-400'"
                                            :class="'overflow-x-clip bg-gray-800 rounded-2xl flex items-center justify-center text-white font-semibold ring-2 hoverPop chaos ring-' + colorScheme[0] + '-500'">
                                            <div class="h-2/3 aspect-square object-cover p-2" v-if="skill.skillType > 0 && skill.skillType < 16">
                                                <img :src="'./Resources/AffinityIcon' + (skill.skillType) + '.png'" class="pulsingFilter" />
                                            </div>
                                            <p class="text-xl">{{ skill.name || "" }}</p>
                                            </div>

                                        </div>
                                        <div :class="activeDemon.skillCount>8 ? 'h-[10%]' : ''" class="text-white flex justify-center items-center text-4xl gap-2 " v-if="!prettify.displaySkill && activeDemon.skillCount > 8">
                                            <div v-for="n in Math.ceil(activeDemon.skillCount/8)">
                                            <p :class="n == prettify.skillPage+1 ? 'text-' + colorScheme[0] + '-400' : ''" >•</p>
                                            </div>
                                        </div>

                                        
                                    </div>

                                    <div @click="prettify.skillPage++; prettify.skillPage = Math.min(prettify.skillPage, Math.ceil(activeDemon.skillCount/8-1));"
                                        v-if="activeDemon.skillCount > 8 && !prettify.displaySkill" class="h-full flex p-1 items-center justify-center rounded-xl text-white"
                                        :class="prettify.skillPage < Math.ceil(activeDemon.skillCount/8)-1 ? 'bg-' + colorScheme[0] + '-900 hover:bg-' + colorScheme[0] + '-500' : 'bg-gray-500/50' ">
                                        ➤
                                        </div> 


                                    <!-- <div class="h-full w-1/2 bg--500 flex flex-wrap flex-row overflow-y-auto">
                                        <template v-for="(skill, index) in activeDemon.skills" :key="index" >
                                            <div v-if="index < activeDemon.skillCount" class="w-1/2 h-1/4 p-1">
                                                <div class=" text-white font-bold h-full w-full rounded-xl ring-2" :class="prettify.esi == index ? 'bg-' + colorScheme[1] + '-950 ring-' + colorScheme[3] + '-500' : 'bg-' + colorScheme[1] + '-950 ring-' + colorScheme[0] + '-500 hover:ring-' + colorScheme[1] + '-400'" @click="prettify.esi = index">
                                                    {{ activeDemon.skills[index].name }} <br>
                                                    {{ activeDemon.skills[index].description }}
                                                    {{index}} {{prettify.editingSkillIndex}}
                                                </div>
                                            </div>
                                        </template>
                                    </div> -->

                                    </div>

                                </div>
                            </div>

                            <div class="px-5 max-h-200" v-if="prettify.runkusMode">
                                <div class="overflow-x-scroll h-full p-2 gap-2 p-3 flex flex-row" style="height: calc(50vh);" >
                                    <div class="bg-blue-950 text-white p-3 rounded-xl ring-2 ring-cyan-400 max-h-64 overflow-y-scroll min-h-full min-w-[25vw]"v-for="(skill, index) in [this.activeDemon.weapon, ...this.activeDemon.skills]" :class="index === 0 ? 'ring-yellow-300' : ''">


                                        <div class="" v-if="index === 0">
                                            <p class="text-2xl font-bold text-amber-400 border-b-2 mb-2 border-indigo-500">Weapon</p>

                                        </div>

                                        <div class="flex flex-col my-3">
                                            <label v-if="index === 0" for="" class="border-b-2 mb-2 border-indigo-500 font-bold text-white">Weapon Name:</label>
                                            <label v-if="index != 0" for="" class="border-b-2 mb-2 border-indigo-500 font-bold text-white">Skill Name:</label>
                                            
                                            <div class="flex flex-row items-center h-full gap-2">
                                                
                                                <!-- Extra -->
                                                <div class="aspect-square w-1/6 ring-1 ring-indigo-500 rounded-2xl">
                                                    <img :src="'./Resources/WeaponIcon.png'" class="pulsingFilter" v-if="index === 0" />
                                                    <img :src="'./Resources/AffinityIcon' + (skill.skillType) + '.png'" class="pulsingFilter" v-if="index != 0 && skill.skillType" />
                                                </div>
                                                
                                                
                                                

                                                <!-- Original -->
                                                <!-- <div class="w-1/6 bg-blue-950 aspect-square rounded-lg object-cover mb-1 border-2 border-indigo-500 shadow-lg shadow-indigo-500/50 hover:shadow-3xl hoverPop tooltip"> -->
                                                    
                                                <input type="text" v-model="skill.name" class="w-5/6 h-full bg-blue-950 text-white p-4 rounded-3xl ring-1 ring-cyan-400"  v-if="index === 0"  @change="dataMaster.autoSave()">
                                                <input type="text" v-model="skill.name" class="w-1/2 h-full bg-blue-950 text-white p-4 rounded-3xl ring-1 ring-cyan-400"  v-if="index != 0"  @change="dataMaster.autoSave()">
                                                
                                                <select type="text" v-model.number="skill.skillType" name=""  class="w-1/3 h-full bg-blue-950 text-white p-4 rounded-3xl ring-1 ring-cyan-400" v-if="index != 0"  @change="dataMaster.autoSave()">
                                                    <option value="0">No Icon</option>
                                                    <option :value="index+1" v-for="(affinity, index) in ['Strike', 'Slash', 'Pierce', 'Fire', 'Ice', 'Electricity', 'Force', 'Toxic', 'Psionic', 'Light', 'Gloom', 'Almighty', 'Ailment', 'Healing', 'Tactical']">{{affinity}}</option>
                                                </select>
                                                
                                            </div>
                                                
                                        </div>

                                        <div class="flex flex-col my-3">
                                            <label for="" class="border-b-2 mb-2 border-indigo-500 font-bold text-white">Skill Description:</label>
                                            <textarea v-model.number="skill.description" @change="activeDemon.recalculateVitals(); dataMaster.autoSave()" name=""  class=" h-1/4 bg-blue-950 text-white p-4 rounded-3xl ring-1 ring-cyan-100 max-h-32" > </textarea>
                                        </div>

                                        <div class="flex flex-row flex-wrap">
                                            <div class="flex flex-col w-1/2" v-for="(roll, index) in skill.rolls" >
                                                <input for="" class="border-b-2 mb-2 border-indigo-500 font-bold text-white bg-transparent" v-model="skill.rollNames[index]" placeholder="Roll Name" @change="skill.checkRolls(); activeDemon.getVariables();dataMaster.autoSave()">
                                                <input type="text" v-model="skill.rolls[index]" name=""  class=" h-1/4 bg-blue-950 text-white p-4 rounded-3xl ring-1 ring-cyan-400" placeholder="Roll" @change="skill.checkRolls(); activeDemon.getVariables();dataMaster.autoSave()">
                                            </div>
                                            <div class="w-1/2 min-h-16 p-2 font-semibold" v-if="skill.rolls.length < 10" @click=" skill.rolls.push('/'); skill.rollNames.push('');">
                                                <div class="rounded-lg bg-gradient-to-r from-sky-950 to-blue-900 h-full w-full ring-1 ring-white p-2">
                                                    +New Roll
                                                </div>
                                                
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>


                            <div class="px-5 pt-5">
                                <p
                                    :class="'text-4xl font-bold text-' + colorScheme[5] + '-400 border-b-2 mb-2 border-' + colorScheme[0] + '-500'">
                                    Affinities
                                </p>
                            </div>
                            <div class="flex flex-row gap-2 h-1/4 p-2">
                                <div class="" v-for="(affinity, index) in activeDemon.affinities">
                                    <div
                                        :class="'w-full bg-' + colorScheme[1] + '-950 aspect-square rounded-lg object-cover mb-1 border-2 border-' + colorScheme[0] + '-500 shadow-lg shadow-' + colorScheme[0] + '-500/50 hover:shadow-3xl tooltip'">
                                        <img :src="'./Resources/AffinityIcon' + (index+1) + '.png'"
                                            class="pulsingFilter" />
                                        <span class="tooltiptext">{{['Strike', 'Slash', 'Pierce', 'Fire', 'Ice',
                                            'Electricity', 'Force', 'Toxic', 'Psionic', 'Light',
                                            'Gloom'][index]}}</span>
                                    </div>
                                    <select :id="affinity" v-model="activeDemon.affinities[index]"
                                        @change="DataMaster.autoSave()"
                                        :class="'w-full rounded-2xl h-1/4 text-center text-xl font-bold bg-' + colorScheme[1] + '-950 border-2 border-' + colorScheme[0] + '-500 text-' + colorScheme[5] + '-400 text-xl font-bold'">
                                        <option value="-">-</option>
                                        <option value="Wk">Wk</option>
                                        <option value="Str">Str</option>
                                        <option value="Nul">Nul</option>
                                        <option value="Drn">Drn</option>
                                        <option value="Rpl">Rpl</option>
                                    </select>
                                </div>
                            </div>

                            <div class="flex flex-row gap-2 h-1/4 p-2">
                                <div class="" v-for="(ailment, index) in activeDemon.ailmentResistances">
                                    <div
                                        :class="'w-full bg-' + colorScheme[1] + '-950 aspect-square rounded-lg object-cover mb-1 border-2 border-' + colorScheme[0] + '-500 shadow-lg shadow-' + colorScheme[0] + '-500/50 hover:shadow-3xl tooltip'">
                                        <img :src="'./Resources/AilmentIcon' + (index+1) + '.png'"
                                            class="pulsingFilter" />
                                        <span class="tooltiptext">{{['Burn', 'Freeze', 'Shock', 'Mirage', 'Poison',
                                            'Confusion', 'Seal', 'Curse', 'Bind', 'Charm', 'Fear', 'Sleep', 'Rage',
                                            'Exhaustion', 'Enervation', 'Bleeding', 'Mortal'][index]}}</span>
                                    </div>
                                    <select :id="ailment" v-model="activeDemon.ailmentResistances[index]"
                                        @change="DataMaster.autoSave()"
                                        :class="'w-full rounded-2xl h-1/4 text-center text-xl font-bold bg-' + colorScheme[1] + '-950 border-2 border-' + colorScheme[0] + '-500 text-' + colorScheme[5] + '-400 text-xl font-bold'">
                                        <option value="-">-</option>
                                        <option value="Wk">Wk</option>
                                        <option value="Str">Str</option>
                                        <option value="Nul">Nul</option>
                                    </select>
                                </div>
                            </div>


                            <!-- Skill Potential -->

                            <div class="px-5 pt-5">
                                <p
                                    :class="'text-4xl font-bold text-' + colorScheme[5] + '-400 border-b-2 mb-2 border-' + colorScheme[0] + '-500'">
                                    Skill
                                    Potential</p>
                            </div>
                            <div class="flex flex-row gap-2 h-1/4 p-2">
                                <div class="" v-for="(potential, index) in activeDemon.skillPotential">
                                    <div
                                        :class="'w-full bg-' + colorScheme[1] + '-950 aspect-square rounded-lg object-cover mb-1 border-2 border-' + colorScheme[0] + '-500 shadow-lg shadow-' + colorScheme[0] + '-500/50 hover:shadow-3xl tooltip'">
                                        <img :src="'./Resources/AffinityIcon' + (index+1) + '.png'"
                                            class="pulsingFilter" />
                                        <span class="tooltiptext">{{['Strike', 'Slash', 'Pierce', 'Fire', 'Ice',
                                            'Electricity', 'Force', 'Toxic', 'Psionic', 'Light', 'Gloom', 'Almighty',
                                            'Ailment', 'Healing', 'Tactical'][index]}}</span>
                                    </div>
                                    <input type="number" name="" id=""
                                        v-model.number="activeDemon.skillPotential[index]"
                                        @change="DataMaster.autoSave()"
                                        :class="'w-full rounded-2xl h-1/4 text-center text-xl font-bold bg-' + colorScheme[1] + '-950 border-2 border-' + colorScheme[0] + '-500 text-' + colorScheme[5] + '-400 text-xl font-bold appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'">

                                </div>
                            </div>


                            <div class="px-5 pt-5 w-full ">
                                <p
                                    :class="'text-4xl font-bold text-' + colorScheme[5] + '-400 border-b-2 mb-2 border-' + colorScheme[0] + '-500'">
                                    Demon
                                    Contract</p>
                                <p class="text-md font-semibold text-white mb-2 ">Copies of the contact are kept by both
                                    the player and DM, any edits must be made with the DM's permission to alter both
                                    copies. Player characters do not have contracts</p>
                            </div>


                            <div class="w-full flex flex-col gap-1 px-5 h-full min-h-64">
                                <label for="descriptionBox"
                                    :class="'border-b-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Demon
                                    Contract:</label>
                                <textarea type="text" v-model="activeDemon.contract" name="" id="descriptionBox"
                                    @change="DataMaster.autoSave()"
                                    :class="'h-full bg-' + colorScheme[1] + '-950 text-white p-2 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400 resize-none'"> </textarea>
                            </div>

                            <!-- XP and Levels -->

                            <div class="px-5 pt-5">
                                <p
                                    :class="'text-4xl font-bold text-' + colorScheme[5] + '-400 border-b-2 mb-2 border-' + colorScheme[0] + '-500'">
                                    XP and
                                    Levels</p>
                                <p class="text-md font-semibold text-white mb-2 ">Warning! - this is not the recommended
                                    way to level up. Please use the /exp command and click your stats. Messing here
                                    should only be done under instruction of the game master. Altering these will not
                                    immediately autosave, to prevent errors</p>
                            </div>



                            <div class="flex flex-row h-1/4">
                                <div class="flex flex-row flex-wrap px-5 flex-wrap w-full items-center justify-center">

                                    <!-- HP -->
                                    <div class="flex flex-col w-1/4">
                                        <label for="expBox"
                                            :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">EXP:</label>
                                        <input type="text" v-model.number="activeDemon.exp" name="" id="expBox"
                                            :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                    </div>

                                    <!-- Max HP -->
                                    <div class="flex flex-col w-1/4">
                                        <label for="maxExpBox"
                                            :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Max
                                            EXP:</label>
                                        <input type="text" v-model.number="activeDemon.maxExp" name="" id="maxExpBox"
                                            :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                    </div>

                                    <!-- MP -->
                                    <div class="flex flex-col w-1/4">
                                        <label for="levelBox"
                                            :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Level:</label>
                                        <input type="text" v-model.number="activeDemon.level" name="" id="levelBox"
                                            :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                    </div>

                                    <!-- Max HP -->
                                    <div class="flex flex-col w-1/4">
                                        <label for="availablePointsBox"
                                            :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white'">Available
                                            Points:</label>
                                        <input type="text" v-model.number="activeDemon.availablePoints" name=""
                                            id="availablePointsBox"
                                            :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'">
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

  </div>

</template>




<script>
    
  export default {
    inject: ['activeDemon', 'DataMaster', 'prettify', 'colorScheme'],
    props: {
      equipmentList: Array,
      equip: Function
    },
// mounted() {
//   console.log(this.DataMaster);
//   console.log(this.DataMaster instanceof Object);
//   console.log(this.DataMaster.autoSave);
// },
    emits: ['update:activePage'], 

    methods: {
      changePage(newPage) {
        this.$emit('update:activePage', newPage);
      }
    }
  }
</script>