<template>

  <div v-if="prettify.activePage==='Sheet' || prettify.runkusMode" class="h-full">

    <div class="w-4/4 flex h-[26.6667%] flex flex-row gap-2 p-1">

      <div
        :class="'h-full w-1/6 bg-gray-800 rounded-xl box-shadow ring-2 flex flex-col gap-2 items-center justify-center p-2 chaos ring-' + colorScheme[0] + '-500'">
        <div class="w-full h-full flex flex-row justify-center items-center pt-5">

          <div :class="'rounded-full bg-black h-full aspect-square ring-' + colorScheme[5] + '-300 ring-2 flex p-2'"
            @click="prettify.messageInput = '/exp '">
            <p
              :class="'absolute text-4xl font-bold text-' + colorScheme[1] + '-200 textOutlineBlack drop-shadow-[0_2px_8px_white] drop-shadow-[0_0px_0px_black]'">LV</p>
            <div
              :class="'rounded-full bg-' + colorScheme[1] + '-950 h-full aspect-square ring-' + colorScheme[3] + '-300 ring-4 flex items-center justify-center'">
              <p
                class="h-full w-full flex items-center justify-center text-white drop-shadow-[0_1px_4px_white] drop-shadow-[0_0px_0px_black] font-bold text-7xl textOutlineBlack">
                {{activeDemon.level}}
              </p>
            </div>
          </div>


        </div>

        <div class="w-full h-1/5 flex flex-col items-center justify-center">
          <div class="">
            <p class="text-white italic">Exp to next {{ activeDemon.maxExp - activeDemon.exp }} {{activePage}}
            </p>

          </div>
          <div :class="'w-4/5 flex items-center bg-' + colorScheme[0] + '-950 rounded-full p-2'">
            <div class="w-full bg-gray-600 rounded-full overflow-hidden">
              <div class="h-1 bg-green-400" :style="{ width: (activeDemon.exp / activeDemon.maxExp * 100) + '%' }">
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Vitals Box -->
      <div
        :class="'h-full w-3/6  bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[0] + '-900 rounded-xl box-shadow ring-2 flex items-center justify-center chaos ring-' + colorScheme[0] + '-500'">
        <div class="w-full h-full flex flex-col">
          <div class="h-full w-full flex flex-col rounded-xl py-4 px-3 gap-3">

            <div
              :class="'w-full h-1/5 flex flex-row content-center items-center gap-2 text-3xl border-b-2 border-' + colorScheme[0] + '-500'">

              <p class="w-1/2 h-full textOutlineBlackThin text-teal-300 font-bold align-bottom textOutlineBlack">
                HP</p>
              <!-- Make the text green when full, red when low, and white otherwise -->
              <p :class="{
                                                'text-blue-400': activeDemon.bulwark > 0,
                                                'text-red-500': activeDemon.bulwark === 0 && activeDemon.hp <= ((activeDemon.maxHp + activeDemon.hpBooster) / 10),
                                                'text-teal-300': activeDemon.bulwark === 0 && activeDemon.hp > ((activeDemon.maxHp + activeDemon.hpBooster) / 10),
                                                'text-white': activeDemon.bulwark === 0 && activeDemon.hp > ((activeDemon.maxHp + activeDemon.hpBooster) / 10) && activeDemon.hp < (activeDemon.maxHp + activeDemon.hpBooster)
                                                }" class="w-1/2 textOutlineBlackThin italic font-bold w-full text-end">
                {{
                Math.floor(activeDemon.hp+activeDemon.bulwark)}}/{{Math.floor(activeDemon.maxHp+activeDemon.hpBooster)
                }} </p>
            </div>


            <div
              :class="'w-full h-1/5 flex items-center bg-' + colorScheme[0] + '-950 rounded-full p-2 ring-1 ring-indigo-300'">
              <div class="relative w-full h-full min-h-1 bg-gray-600 rounded-full overflow-hidden">

                <!-- HP Bar (base layer) -->
                <div
                  class="absolute top-0 left-0 h-full min-h-1 bg-gradient-to-r from-yellow-400 to-lime-500 rounded-full"
                  :class="{ 'bg-gradient-to-r from-red-500 to-red-800': activeDemon.hp <= ((activeDemon.maxHp + activeDemon.hpBooster) / 10) }"
                  :style="{ width: (activeDemon.hp / (activeDemon.maxHp + activeDemon.hpBooster) * 100) + '%' }">
                </div>

                <!-- Bulwark Bar (on top of HP) -->
                <div v-if="activeDemon.bulwark > 0"
                  class="absolute top-0 left-0 h-full min-h-1 bg-gradient-to-r from-cyan-400 to-sky-500 opacity-70 rounded-full"
                  :style="{ width: (activeDemon.bulwark / (activeDemon.maxHp + activeDemon.hpBooster) * 100) + '%' }">
                </div>

              </div>
            </div>


            <!-- MP Text -->
            <div
              :class="'w-full h-1/5 flex flex-row content-center items-center gap-2 text-3xl border-b-2 border-' + colorScheme[0] + '-500'">
              <p class="w-1/2 h-full textOutlineBlackThin font-bold text-teal-300 align-bottom textOutlineBlackThin">
                MP</p>
              <p :class="{ 
                                            'text-teal-300': activeDemon.mp == (activeDemon.maxMp+activeDemon.mpBooster), 
                                            'text-white' : activeDemon.mp < activeDemon.maxMp+activeDemon.mpBooster }"
                class="w-1/2 text-teal-300 textOutlineBlackThin italic font-bold w-full text-end">
                {{
                Math.floor(activeDemon.mp)}}/{{Math.floor(activeDemon.maxMp+activeDemon.mpBooster)}}
              </p>
            </div>

            <!-- MP Bar -->
            <div
              :class="'w-full h-1/5 flex items-center bg-' + colorScheme[0] + '-950 rounded-full p-2 ring-1 ring-' + colorScheme[0] + '-300'">
              <div class="w-full h-full bg-gray-600 rounded-full overflow-hidden">
                <div class="h-full min-h-1 bg-gradient-to-r from-cyan-400 to-blue-500"
                  :style="{ width: (activeDemon.mp / (activeDemon.maxMp+activeDemon.mpBooster) * 100) + '%' }">
                </div>
              </div>
            </div>
            <div class="w-full h-1/5 flex flex-row gap-2">
              <div v-if="!activeDemon.guard" @click="prettify.messageInput = '/damage c*'"
                :class="'h-full w-1/2 flex items-center justify-center bg-' + colorScheme[0] + '-950 rounded-full p-2 ring-1 ring-' + colorScheme[0] + '-300'">
                <p
                  :class="'w-full h-full text-xl text-center textOutlineBlackThin font-bold text-' + colorScheme[5] + '-300'">
                  Resistance: {{
                  100 - Math.floor(
                  (100 -
                  ((100)*(activeDemon.buffs[1]*0.16))) *
                  (200/(200+((activeDemon.stats[2]+activeDemon.statsBooster[2]+activeDemon.equippedArmor.resistance+activeDemon.armorBooster[0])*(1+((activeDemon.stats[2]+activeDemon.statsBooster[2]+activeDemon.equippedArmor.resistance+activeDemon.armorBooster[0])/30))))))
                  }}%</p>
              </div>
              <div v-if="activeDemon.guard" @click="prettify.messageInput = '/damage c*'"
                :class="'h-full w-1/2 bg-black  flex items-center justify-center bg-' + colorScheme[6] + '-950 rounded-full p-2 ring-1 ring-' + colorScheme[6] + '-300'">
                <p
                  :class="'w-full h-full text-xl text-center textOutlineBlackThin font-bold text-' + colorScheme[5] + '-300'">
                  Resistance: {{
                  100 - Math.floor(
                  (100 -
                  ((100)*(Math.min(activeDemon.buffs[1]+1, 4)*0.16))) *
                  (200/(200+((activeDemon.stats[2]+activeDemon.statsBooster[2]+(activeDemon.equippedArmor.resistance+activeDemon.armorBooster[0]))*(1+((activeDemon.equippedArmor.resistance
                  + activeDemon.armorBooster[0])/30))))))
                  }}%</p>
              </div>

              <div v-if="!activeDemon.dodge" :class="'h-full w-1/2 bg-blue-950  flex items-center justify-center bg-' + colorScheme[0] + '-950 rounded-full p-2 ring-1 ring-' + colorScheme[0] + '-300'">
                <p 
                  :class="'w-full h-full text-xl text-center textOutlineBlackThin font-bold text-' + colorScheme[5] + '-300'">
                  Evasion:
                  {{Math.max(5,Math.floor((5+activeDemon.stats[3]+activeDemon.statsBooster[3]+activeDemon.equippedArmor.evasion+activeDemon.armorBooster[1])*(1+(.16*activeDemon.buffs[2])))+(activeDemon.buffs[2]*5))}}
                </p>
              </div>
              
              <div v-if="activeDemon.dodge" :class="'h-full w-1/2 bg-blue-950  flex items-center justify-center bg-' + colorScheme[6] + '-950 rounded-full p-2 ring-1 ring-' + colorScheme[6] + '-300'">
                <p 
                  :class="'font-italic w-full h-full text-xl text-center textOutlineBlackThin font-bold text-' + colorScheme[5] + '-300'">
                  Evasion:
                  {{Math.max(5,
                  Math.floor((5+activeDemon.stats[3]+activeDemon.statsBooster[3]+activeDemon.equippedArmor.evasion+activeDemon.armorBooster[1])*(1+(.16*
                  Math.min(activeDemon.buffs[2]+1, 4))))+(Math.min(activeDemon.buffs[2]+1,
                  4)*5))}}
                </p>
              </div>


            </div>
          </div>

        </div>
      </div>


      <!-- Buffs Box -->
      <div
        :class="'h-full w-2/6 bg-gray-800 rounded-xl box-shadow ring-2 flex items-center justify-center chaos ring-' + colorScheme[0] + '-500'">
        <div class="w-full h-full flex flex-col gap-2 items-center justify-center">
          <div
            :class="'w-full h-full bg-' + colorScheme[0] + '-950 rounded-2xl flex flex-row items-center justify-center'">
            <div class="w-1/3 h-full rounded-full flex flex-row items-center"
              v-for="(buff , index) in activeDemon.buffs" :key="index">
              <div class="flex flex-col gap-1 h-full w-full items-center justify-center p-4">
                <p class="h-1/5 w-1/3 text-center text-white textOutlineBlackThin font-semibold text-2xl">
                  {{['ATK', 'DEF', 'HIT'][index]}}</p>
                <button
                  :class="'h-1/5 w-1/2 bg-black bg-' + colorScheme[2] + '-800 pt-0 p-1 ring-1 ring-slate-200 rounded-lg text-white'"
                  @click="activeDemon.buffs[index] < 4 ? activeDemon.buffs[index]++ : null">⮝</button>
                <div :style="prettify.getBuffShadowStyle(activeDemon.buffs[index])"
                  class="rounded-full bg-gray-800 w-2/3 h-2/5 flex items-center justify-center ring-1 ring-slate-200">
                  <img :class="{ 'rotate-180': activeDemon.buffs[index] < 0 }" @click="activeDemon.buffs[index] =0;"
                    :src="'../Resources/BuffIcon' + ( Math.abs(activeDemon.buffs[index])) + '.png'"
                    class="h-2/3 aspect-square object-contain pulsingFilter" alt="">
                </div>
                <button
                  :class="'h-1/5 w-1/2 bg-black bg-' + colorScheme[2] + '-800 pt-0 p-1 ring-1 ring-slate-200 rounded-lg text-white'"
                  @click="activeDemon.buffs[index] > -4 ? activeDemon.buffs[index]-- : null">⮟</button>

              </div>
            </div>
          </div>
        </div>


      </div>




    </div>


    <div class="h-2/3 w-4/4 flex flex-row gap-2 p-1">

      <!-- Affinities and skills -->
      <div class="h-full w-2/3 flex flex-col gap-2">
        <div
          :class="'rounded-xl box-shadow ring-2 items-center justify-center h-full w-full flex flex-col bg-gray-900 chaos ring-' + colorScheme[0] + '-500'">
          <div class="h-2/5 w-full ">


            <div class="flex flex-row gap-2 h-full w-full px-3">

              <div v-for="(affinity, index) in activeDemon.affinities"
                class="flex-1 rounded-lg flex items-center justify-center chaos">
                <div class="">
                  <div class="flex flex-col items-center h-full">
                    <div class="">
                      <div
                        @click="prettify.messageInput = prettify.formatDamageIntake(affinity, index)"
                        :class="prettify.holdingShift ? 'bg-' + colorScheme[8] + '-950 border-' + colorScheme[8] + '-500' : 'bg-' + colorScheme[1] + '-950 border-' + colorScheme[0] + '-500'" class="w-full aspect-square rounded-lg object-cover mb-1 border-2 shadow-lg shadow-indigo-500/50 hover:shadow-3xl hoverPop tooltip ">
                        <img :src="'../Resources/AffinityIcon' + (index+1) + '.png'" class="pulsingFilter" />
                        <span class="tooltiptext">{{['Strike', 'Slash', 'Pierce',
                          'Fire', 'Ice', 'Electricity', 'Force', 'Toxic', 'Psionic',
                          'Light', 'Gloom'][index]}}</span>
                      </div>
                      


                    </div>


                    <div class="p-1 h-full w-full">
                      <div class="tooltip h-full w-full">
                        <div class="rounded-lg bg-gray-700 flex items-center justify-center text-white font-semibold h-full w-full ring-2 text-2xl textOutlineBlack shadow-lg"
                          :class="activeDemon.affinityMutatorColor[index] ? 'text-' + colorScheme[7] + '-300 shadow-' + colorScheme[0] + '-500/50 ring-' + colorScheme[0] + '-500' : 'text-white shadow-' + colorScheme[0] + '-500/50 ring-' + colorScheme[0] + '-500'">
                          <!-- {{ affinity }}  -->
                            {{ activeDemon.getAffinities(index) }}
                        </div>
                        <span class="tooltiptext" v-if="!activeDemon.dodge">{{['Strike', 'Slash', 'Pierce', 'Fire', 'Ice', 'Electricity', 'Force', 'Toxic', 'Psionic', 'Light', 'Gloom'][index]}} Evasion: {{Math.floor((Math.max(5,((5+activeDemon.stats[3]+activeDemon.statsBooster[3]+activeDemon.equippedArmor.evasion+activeDemon.armorBooster[1])*(1+(.16*activeDemon.buffs[2])))+(activeDemon.buffs[2]*5))*activeDemon.affinitiesEvasion[index]*activeDemon.affinitiesGenusEvasion[4]))}}</span>
                        <span class="tooltiptext" v-if="activeDemon.dodge">{{['Strike', 'Slash', 'Pierce', 'Fire', 'Ice', 'Electricity', 'Force', 'Toxic', 'Psionic', 'Light', 'Gloom'][index]}} Evasion: {{Math.floor((Math.max(5,((5+activeDemon.stats[3]+activeDemon.statsBooster[3]+activeDemon.equippedArmor.evasion+activeDemon.armorBooster[1])*(1+(.16*Math.min(activeDemon.buffs[2]+1,4))))+(Math.min(activeDemon.buffs[2]+1,4)*5))*activeDemon.affinitiesEvasion[index]*activeDemon.affinitiesGenusEvasion[4]))}}</span>

                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats Box -->
          <div :class="'h-3/5 w-full flex flex-col border-t-2 rounded-xl border-' + colorScheme[0] + '-500'">

            <div class="w-full h-1/5 flex flex-row content-center items-center gap-2 p-1" v-for="n in 5" :key="n">
              <div class="h-full w-1/5 flex items-center justify-center text-white font-semibold">
                <div class="w-1/2 h-full flex items-center justify-end text-white font-semibold pr-2 ">
                  {{ ['St', 'Ma', 'Vi', 'Ag', 'Lu'][n - 1] }}
                </div>
                <div class="w-1/2 h-full flex items-center justify-center text-white font-semibold">
                  <p class="ring-2 rounded-lg text-center w-3/4 text-white"
                    :class="[
                                            'bg-slate-700 rounded-lg text-center w-3/4 transition-all',
                                            activeDemon.availablePoints > 0 ? 'ring-yellow-500 hoverPop ring-5' : 'ring-' + colorScheme[0] + '-500']" @click="
                                            if (activeDemon.availablePoints > 0) {
                                                let lowestStat = Math.min(...activeDemon.stats);
                                                activeDemon.stats[n - 1]++;
                                                activeDemon.availablePoints--;
                                                activeDemon.recalculateVitals();
                                                activeDemon.getVariables();
                                            } DataMaster.autoSave()">
                    {{activeDemon.stats[n-1]+activeDemon.statsBooster[n-1] }}</p>
                </div>
              </div>
              <div :class="'w-4/5 flex items-center bg-' + colorScheme[0] + '-950 rounded-xl p-2'">
                <div class="w-full h-3 bg-slate-500 rounded-full overflow-hidden">
                  <div class="h-full border-r-2 border-teal-300 statBar"
                    :style="'width:' + (activeDemon.stats[n-1]+activeDemon.statsBooster[n-1]+1) + '%'">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- Skills Box -->
        <div class="rounded-xl box-shadow flex flex-col items-center justify-center h-3/4 w-full overflow-hidden">

          <div class="h-full w-full flex items-center justify-center" v-if="!prettify.displaySkill">
            
            <div @click="prettify.skillPage--; prettify.skillPage=Math.max(0, prettify.skillPage)"
              v-if="activeDemon.skillCount > 8 && !prettify.displaySkill" class="h-full flex p-1 items-center justify-center rounded-xl text-white rotate-180"
              :class="prettify.skillPage > 0 ? 'bg-' + colorScheme[0] + '-900 hover:bg-' + colorScheme[0] + '-500' : 'bg-gray-500/50'">
              ➤
            </div>
            
            <div class="h-full w-full flex flex-col">
              <div :class="activeDemon.skillCount>8 ? 'h-[90%]' : 'h-full'" class="grid grid-cols-2 grid-rows-4 grid-flow-col gap-2 w-full p-1">
              
                <div v-for="skill in activeDemon.skills.slice(prettify.skillPage*8, Math.min(prettify.skillPage*8+8,  activeDemon.skillCount) )"
                  @click="prettify.selectedSkill = skill; prettify.displaySkill = skill.name"
                  :class="'bg-gray-800 rounded-2xl flex items-center justify-center text-white font-semibold ring-2 hoverPop chaos ring-' + colorScheme[0] + '-500'">
                  <div class="h-full aspect-square object-cover p-2" v-if="skill.skillType > 0 && skill.skillType < 16">
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
          
          </div>
          
          
          

          <div class="w-full h-full p-1" v-if="prettify.displaySkill">
            <div
              :class="'h-full w-full ring-2 bg-' + colorScheme[1] + '-950 text-white font-semibold rounded-xl ring-' + colorScheme[0] + '-500'">

              <div class="flex flex-row h-full">
                <div class="flex flex-col overflow-y-scroll"
                  :class="prettify.selectedSkill.rolls.length > 0 ? 'w-1/2' : 'w-[100%]'">
                  <div
                    :class="'font-bold text-' + colorScheme[5] + '-400 border-b-2 border-' + colorScheme[0] + '-500'">
                    <p class="text-3xl px-3 pt-1 hover:bg-gray-600 rounded-t-xl" @click="prettify.displaySkill = false">
                      {{prettify.selectedSkill.name}}</p>
                  </div>
                  <div class="p-3 h-full">
                    <p
                      :class="'rounded-2xl bg-gradient-to-br from-' + colorScheme[1] + '-950 to-' + colorScheme[4] + '-950 p-3 min-h-full ring-1 ring-indigo-100 whitespace-pre-wrap'">
                      {{prettify.selectedSkill.description}}</p>
                  </div>

                </div>



                <div class="grid grid-cols-2 gap-x-2 p-3 w-1/2 h-full overflow-y-auto"
                  v-if="prettify.selectedSkill.rolls.length > 0">
                  <div class="flex flex-col w-full" v-for="(roll, index) in prettify.selectedSkill.rolls">
                    <p v-if="prettify.selectedSkill.rollNames[index] != ''">
                      {{prettify.selectedSkill.rollNames[index]}}:</p>
                    <div
                      :class="'font-thin rounded-3xl  bg-gradient-to-r from-' + colorScheme[1] + '-900 to-' + colorScheme[2] + '-950 ring-1 ring-' + colorScheme[0] + '-500 flex flex-row'"
                      v-if="prettify.selectedSkill.rollNames[index] != ''" @click="prettify.messageInput = prettify.selectedSkill.rolls[index]">
                      <p class="p-2 overflow-hidden whitespace-nowrap text-ellipsis">
                        {{prettify.selectedSkill.rolls[index]}}</p>
                      <div @click.stop @click="prettify.messageInput = prettify.selectedSkill.rolls[index]; sendMessage(prettify.messageInput); prettify.messageInput = '';"
                        :class="'rounded-full ring-2 ring-' + colorScheme[0] + '-500 bg-' + colorScheme[0] + '-700 ml-auto aspect-square h-full py-2'">
                        <p class="text-center overflow-hidden">➤</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>

      <!-- Profile, Notes, etc -->
      <div class="h-full w-1/3" style="max-width: 33%;">
        <div
          :class="'bg-gray-800 rounded-xl box-shadow ring-2 flex items-center justify-center h-full w-full text-white font-semibold flex flex-col ring-' + colorScheme[0] + '-500'">
          <div class=" h-full w-full">

            <div class="w-full bg-slate-950 rounded-t-xl flex items-center justify-center" style="height: 8%;">
              <div class="w-full h-full flex flex-col justify-end">
                <div
                  :class="'flex flex-row justify-center gap-1 md:gap-2 border-b-2 border-' + colorScheme[0] + '-500 overflow-hidden'">
                  <button v-for="tab in prettify.tabs" :key="tab"
                    class="px-4 py-1 h-full w-1/3 rounded-t-lg font-bold text-xs sm:text-sm md:text-md lg:text-lg focus:outline-none"
                    :class="prettify.activeTab === tab ? 'bg-' + colorScheme[0] + '-700 text-white ring-2- ring-' + colorScheme[0] + '-400' : 'bg-gray-700 text-gray-300'"
                    @click="prettify.activeTab = tab">
                    {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
                  </button>
                </div>
              </div>


            </div>

            <div :class="'bg-' + colorScheme[1] + '-950 rounded-b-2xl'" style="height: 92%;">
              <div v-if="prettify.activeTab === 'profile'" class="w-full h-full p-2 overflow-y-auto overflow-x-hidden">
                

                <p :class="'max-w-full turncate flex flex-row w-full text-white text-xl font-semibold rounded-2xl bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 px-2 py-1 ring-1 ring-' + colorScheme[0] + '-500 my-2'">
                  <span :class="'font-normal truncate'">{{ activeDemon.race }}, {{ activeDemon.name }}</span>
                  <span :class="'ml-auto font-thin'">{{ activeDemon.alignment }}</span>
                </p>

                <!-- <p class="text-emerald-400 text-xl font-semibold mb-2"></p> -->
                <p :class="'text-' + colorScheme[5] + '-400 text-xl font-semibold mb-2'"
                  v-if="activeDemon.contract != ''"> Description:</p>
                <div v-if="activeDemon.description != ''"
                  :class="'text-white text-md font-thin rounded-2xl bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 p-2 mb-1 ring-1 ring-' + colorScheme[0] + '-500  max-h-48 overflow-y-auto overflow-x-hidden'">
                  <!-- Display each keyword in a styled paragraph -->
                  <p class="mb-2 break-words whitespace-pre-wrap" v-if="activeDemon.description != ''"> {{
                    activeDemon.description }}</p>

                  <!-- • -->
                  <p class="w-full text-xl font-bold border-b text-xlpx-3 text-center border-white">Birthrights</p>

                  <p class="text-xl font-bold" v-for="birthright in activeDemon.birthrights"> {{ birthright}} </p>
                </div>

                <!-- <p :class="'w-full italic bg-gradient-to-r from-' + colorScheme[5] +  '-950 to-' + colorScheme[2] +  '-900 ring-1 ring-' + colorScheme[3] + '-600 rounded-xl px-2  text-' + colorScheme[5] + '-100 text-center font-bold text-2xl font-semibold mb-2 mt-5'"> Talents:</p> -->
                 <p :class="'w-full italic border-b border-' + colorScheme[3] + '-600 rounded-xl px-2  text-white text-center font-bold text-2xl font-semibold mb-2 mt-5'"> Talents:</p>


                <div :class="'py-3 flex flex-col text-center w-full'">
                  <p :class="prettify.talentTabs[0] ? '' : 'bg-' + colorScheme[0] + '-900'" class="rounded-t-lg w-full border-b text-center border-white text-xl" @click="prettify.talentTabs[0] = !prettify.talentTabs[0]">Senses</p>
                  <div class="flex flex-col text-center w-full w-full">
                    <div :class="'m-1 px-1 font-normal flex flex-row border rounded-full border-' + colorScheme[2] + '-500 bg-' + colorScheme[2] + '-950'" v-for="(value, key) in activeDemon.senses" :key="key" @click="prettify.messageInput= '/roll (1d100+(tal'+key+'-1)*100)*(tal'+key+')_floor'" v-if="prettify.talentTabs[0]">
                      <p class="">{{ key.charAt(0).toUpperCase() + key.slice(1) }}: </p> <p class="ml-auto">{{ (value+activeDemon.sensesBoost[key]).toFixed(2) }}</p>
                    </div>
                    <br>
                    <p :class="prettify.talentTabs[1] ? '' : 'bg-' + colorScheme[0] + '-900'" class="rounded-t-lg w-full border-b text-center border-white text-xl" @click="prettify.talentTabs[1] = !prettify.talentTabs[1]">Social</p>
                    <div :class="'m-1 px-1 font-normal flex flex-row border rounded-full border-' + colorScheme[2] + '-500 bg-' + colorScheme[2] + '-950'" v-for="(value, key) in activeDemon.social" :key="key" @click="prettify.messageInput= '/roll (1d100+(tal'+key+'-1)*100)*(tal'+key+')_floor'" v-if="prettify.talentTabs[1]">
                      <p>{{ key.charAt(0).toUpperCase() + key.slice(1) }}: </p> <p class="ml-auto">{{ (value+activeDemon.socialBoost[key]).toFixed(2) }}</p>
                    </div>
                  </div>
                  <br>
                  <p :class="prettify.talentTabs[2] ? '' : 'bg-' + colorScheme[0] + '-900'" class="rounded-t-lg w-full border-b text-center border-white text-xl" @click="prettify.talentTabs[2] = !prettify.talentTabs[2]">Academia</p>
                  <div class="flex flex-col text-center" >
                    <div :class="'m-1 px-1 font-normal flex flex-row border rounded-full border-' + colorScheme[2] + '-500 bg-' + colorScheme[2] + '-950'" v-for="(value, key) in activeDemon.academia" :key="key" @click="prettify.messageInput= '/roll (1d100+(tal'+key+'-1)*100)*(tal'+key+')_floor'" v-if="prettify.talentTabs[2]">
                      <p>{{ key.charAt(0).toUpperCase() + key.slice(1) }}: </p> <p class="ml-auto">{{ (value+activeDemon.academiaBoost[key]).toFixed(2) }}</p>
                    </div>
                    <br>

                    <p :class="prettify.talentTabs[3] ? '' : 'bg-' + colorScheme[0] + '-900'" class="rounded-t-lg w-full border-b text-center border-white text-xl" @click="prettify.talentTabs[3] = !prettify.talentTabs[3]">Prowess</p>
                    <div :class="'m-1 px-1 font-normal flex flex-row border rounded-full border-' + colorScheme[2] + '-500 bg-' + colorScheme[2] + '-950'" v-if="prettify.talentTabs[3]" @click="prettify.messageInput= '/roll (1d100+iq-100)*(iq/100)_floor'">
                      <p>IQ: </p> <p class="ml-auto">{{ activeDemon.iq+activeDemon.iqBoost }}</p>
                    </div>
                    <div :class="'m-1 px-1 font-normal flex flex-row border rounded-full border-' + colorScheme[2] + '-500 bg-' + colorScheme[2] + '-950'" v-if="prettify.talentTabs[3]" @click="prettify.messageInput= '/roll (1d100+(carry-1)*100)*(carry)_floor'">
                      <p>Carry: </p> <p class="ml-auto">{{ (activeDemon.carry+activeDemon.carryBoost).toFixed(2) }}</p>
                    </div>
                    <div :class="'m-1 px-1 font-normal flex flex-row border rounded-full border-' + colorScheme[2] + '-500 bg-' + colorScheme[2] + '-950'" v-if="prettify.talentTabs[3]" @click="prettify.messageInput= '/roll (1d100+(fast-1)*100)*(fast)_floor'">
                      <p>Speed: </p> <p class="ml-auto">{{ (activeDemon.speed+activeDemon.speedBoost).toFixed(2) }}</p>
                    </div>
                    <div :class="'m-1 px-1 font-normal flex flex-row border rounded-full border-' + colorScheme[2] + '-500 bg-' + colorScheme[2] + '-950'" v-if="prettify.talentTabs[3]" @click="prettify.messageInput= '/roll (1d100+(willpower-1)*100)*(willpower)_floor'">
                      <p>Willpower: </p> <p class="ml-auto">{{ (activeDemon.willPower+activeDemon.willPowerBoost).toFixed(2) }}</p>
                    </div>
                    
                  </div>
                </div>


                <!-- <p :class="'w-full border-b border-' + colorScheme[5] +  '-400 text-center text-' + colorScheme[5] + '-400 text-2xl font-semibold mb-2'"> Tags:</p> -->
                 <p :class="'w-full italic border-b border-' + colorScheme[3] + '-600 rounded-xl px-2  text-white text-center font-bold text-2xl font-semibold mb-2 mt-5'"> Tags:</p>
                <div
                  :class="'flex w-full flex-wrap gap-2 max-h-40 overflow-y-auto rounded-2xl bg-' + colorScheme[0] + '-950 p-2'">
                  <!-- Display each keyword in a styled paragraph -->
                  <p v-for="(keyword, index) in activeDemon.keywords" :key="index"
                    :class="'text-white text-lg font-thin rounded-2xl bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 px-2 mb-1 ring-1 ring-' + colorScheme[0] + '-500'">
                    {{ keyword }}</p>
                </div>

                <p class="text-emerald-400 text-xl font-semibold mb-2" v-if="activeDemon.contract != ''"> Contract:
                </p>
                <div
                  class="text-white text-lg font-thin rounded-2xl bg-gradient-to-r from-sky-950 to-blue-900 p-2 mb-1 ring-1 ring-indigo-500 max-h-48 overflow-y-auto overflow-x-hidden"
                  v-if="activeDemon.contract != ''">
                  <p class="mb-2 break-words whitespace-pre-wrap">
                    {{ activeDemon.contract }}
                  </p>
                </div>


                <!-- <button type="button" class="rounded-2xl bg-emerald-700 text-white p-2" @click="dataMaster.printData" >Print</button>
                                        <button type="button" class="rounded-2xl bg-emerald-700 text-white p-2" @click="dataMaster.updateFileData()" >Update</button>
                                        <button type="button" class="rounded-2xl bg-emerald-700 text-white p-2" @click="dataMaster.saveData" >Save</button>
                                        <button type="button" class="rounded-2xl bg-emerald-700 text-white p-2" @click="dataMaster.loadData" >Load</button> -->

              </div>
              <div v-else-if="prettify.activeTab === 'battle'" class="w-full h-full p-2 overflow-y-scroll">
                <p @click="prettify.selectedSkill = prettify.skillifyWeapon(activeDemon.equippedWeapon); prettify.displaySkill = activeDemon.equippedWeapon.name;"
                  :class="'w-full italic border-b border-' + colorScheme[3] + '-600 rounded-xl px-2  text-white text-center font-bold text-2xl font-semibold mb-2 mt-1'">
                  Combat: </p>
                <div @click="prettify.selectedSkill = prettify.skillifyWeapon(activeDemon.equippedWeapon); prettify.displaySkill = activeDemon.equippedWeapon.name;"
                  class="flex flex-row w-full gap-2 mb-2">
                  <div
                    :class="'w-1/5 bg-' + colorScheme[1] + '-950 aspect-square rounded-lg object-cover mb-1 border-2 border-' + colorScheme[0] + '-500 shadow-lg shadow-indigo-500/50 hover:shadow-3xl'">
                    <img :src="'../Resources/' + activeDemon.equippedWeapon.icon + 'Icon.png'" class="pulsingFilter" />
                  </div>
                  <p
                    :class="'w-4/5 text-white text-lg rounded-2xl bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 p-2 mb-1 ring-1 ring-' + colorScheme[0] + '-500'">
                    {{ activeDemon.equippedWeapon.name }} <br> <span class="block w-full font-thin text-sm truncate">{{
                      activeDemon.equippedWeapon.description }}</span></p>
                </div>
                <div class="flex flex-row gap-2 pb-2">
                  <input type="button" value="Speed" @click="prettify.messageInput = '/speed'; sendMessage(prettify.messageInput); prettify.messageInput = '';"
                    :class="'rounded-full bg-gradient-to-r from-' + colorScheme[7] + '-950 to-' + colorScheme[1] + '-800 w-1/3 ring-1 ring-' + colorScheme[3] + '-100 textOutlineBlackThin text-xl'">
                  <input type="button" value="Will" @click="prettify.messageInput = '/will'; sendMessage(prettify.messageInput); prettify.messageInput = '';"
                    :class="'rounded-full bg-gradient-to-r from-' + colorScheme[7] + '-950 to-' + colorScheme[1] + '-800 w-1/3 ring-1 ring-' + colorScheme[3] + '-100 textOutlineBlackThin text-xl'">
                  <br>
                  <input type="button" value="Guard"
                    @click="activeDemon.guard = !activeDemon.guard; activeDemon.dodge = false;"
                    class="rounded-full textOutlineBlackThin text-xl w-1/3 ring-1"
                    :class="activeDemon.guard ? 'bg-gradient-to-r from-' + colorScheme[7] + '-950 to-' + colorScheme[1] + '-950 ring-' + colorScheme[5] + '-800 text-gray-300' : 'bg-gradient-to-r from-' + colorScheme[7] + '-900 to-' + colorScheme[1] + '-800 ring-' + colorScheme[5] + '-100'">
                  <input type="button" value="Dodge"
                    @click="activeDemon.dodge = !activeDemon.dodge; activeDemon.guard = false;"
                    class="rounded-full textOutlineBlackThin text-xl w-1/3 ring-1"
                    :class="activeDemon.dodge ? 'bg-gradient-to-r from-' + colorScheme[7] + '-950 to-' + colorScheme[1] + '-950 ring-' + colorScheme[5] + '-800 text-gray-300' : 'bg-gradient-to-r from-' + colorScheme[7] + '-900 to-' + colorScheme[1] + '-800 ring-' + colorScheme[5] + '-100'">
                </div>

                <p
                  :class="'w-full italic border-b border-' + colorScheme[3] + '-600 rounded-xl px-2  text-white text-center font-bold text-2xl font-semibold mb-2 mt-5'">
                  Coefficients: </p>
                <!-- Make the coefficient an equation -->
                <input type="text" name="" id="" v-model="activeDemon.coefficient"
                  :class="'w-full text-white text-lg font-thin rounded-2xl bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 px-2 mb-1 ring-1 ring-' + colorScheme[0] + '-500'" />

                <div
                  :class="'flex flex-row w-full gap-2 text-white text-lg font-thin rounded-full my-2 bg-gradient-to-r from-purple-950 to-fuchsia-950 ring-1 ring-' + colorScheme[0] + '-500 items-center pr-2 my-2'"
                  v-for="(coeff, index) in activeDemon.coeffs">
                  <div
                    :class="'w-1/6 bg-blue-950 aspect-square rounded-full object-cover border-2 shadow-lg shadow-indigo-500/50 hover:shadow-3xl border-' + colorScheme[0] + '-500 hover:border-red-500 hoverPop'">
                    <img :src="'./Resources/BuffIcon0.png'" class="pulsingFilter"
                      @click="activeDemon.coeffs.splice(index, 1); DataMaster.autoSave()" />
                  </div>

                  <input type="text"
                    :class="'h-full w-1/2 text-white text-lg font-thin rounded-full bg-gradient-to-r from-green-950 to-blue-950 p-2 ring-1 ring-' + colorScheme[0] + '-500'"
                    v-model="coeff[0]" @change="DataMaster.autoSave()" />
                  <input type="text"
                    :class="'h-full w-1/2 text-white text-lg font-thin rounded-full bg-gradient-to-r from-green-950 to-blue-950 p-2 ring-1 ring-' + colorScheme[0] + '-500'"
                    v-model="coeff[1]" @change="DataMaster.autoSave()" />

                </div>

                <div class="w-full flex flex-row justify-between">
                  <div class="my-2" @click="activeDemon.coeffs.push(['New Coeff', 'Effect'])"
                    v-if="activeDemon.coeffs.length < 10">
                    <p
                      :class="'bg-' + colorScheme[0] + '-950 border border-' + colorScheme[0] + '-500 p-2 rounded-full'">
                      Add Coeff</p>
                  </div>
                  <div class="my-2 mr-2" @click="activeDemon.coeffs = []" v-if="activeDemon.coeffs.length > 0">
                    <p
                      :class="'bg-' + colorScheme[0] + '-950 border border-' + colorScheme[0] + '-500 p-2 rounded-full'">
                      Clear All Coeffs</p>
                  </div>
                </div>


                <p
                  :class="'w-full italic border-b border-' + colorScheme[3] + '-600 rounded-xl px-2  text-white text-center font-bold text-2xl font-semibold mb-2 mt-5'">
                  Counters: </p>

                <div
                  :class="'flex flex-row w-full gap-2 text-white text-lg font-thin rounded-full my-2 bg-gradient-to-r from-purple-950 to-fuchsia-950 ring-1 ring-' + colorScheme[0] + '-500 items-center pr-2 my-2'"
                  v-for="(coeff, index) in activeDemon.counters">
                  <div
                    :class="'w-1/6 bg-blue-950 aspect-square rounded-full object-cover border-2 shadow-lg shadow-indigo-500/50 hover:shadow-3xl border-' + colorScheme[0] + '-500 hover:border-red-500 hoverPop'">
                    <img :src="'./Resources/BuffIcon0.png'" class="pulsingFilter"
                      @click="activeDemon.counters.splice(index, 1); DataMaster.autoSave()" />
                  </div>

                  <input type="text"
                    :class="'h-full w-3/4 text-white text-lg font-thin rounded-full bg-gradient-to-r from-green-950 to-blue-950 p-2 ring-1 ring-' + colorScheme[0] + '-500'"
                    v-model="coeff[0]" @change="DataMaster.autoSave()" />
                  <input type="text"
                    :class="'h-full w-1/4 text-white text-right text-lg font-thin rounded-full bg-gradient-to-r from-green-950 to-blue-950 p-2 ring-1 ring-' + colorScheme[0] + '-500'"
                    v-model.number="coeff[1]" @change="DataMaster.autoSave()" />

                </div>

                <div class="w-full flex flex-row justify-between">
                  <div class="my-2" @click="activeDemon.counters.push(['FreshCounter', 1])"
                    v-if="activeDemon.counters.length < 10">
                    <p
                      :class="'bg-' + colorScheme[0] + '-950 border border-' + colorScheme[0] + '-500 p-2 rounded-full'">
                      Add Counter</p>
                  </div>
                  <div class="my-2 mr-2" @click="activeDemon.coeffs = []" v-if="activeDemon.counters.length > 0">
                    <p
                      :class="'bg-' + colorScheme[0] + '-950 border border-' + colorScheme[0] + '-500 p-2 rounded-full'">
                      Clear All Counters</p>
                  </div>
                </div>
                
                <p
                  :class="'w-full italic border-b border-' + colorScheme[3] + '-600 rounded-xl px-2  text-white text-center font-bold text-2xl font-semibold mb-2 mt-5'">
                  Ailments:</p>

                <div v-if="prettify.displayAilments" class="flex flex-row flex-wrap">
                  <div v-for="(ailment, index) in [...activeDemon.ailmentResistances, 'other']"
                    @click="prettify.displayAilments = false;"
                    :class="'w-1/6 bg-' + colorScheme[1] + '-950 aspect-square rounded-lg object-cover mb-1 border-2 border-' + colorScheme[0] + '-500 shadow-lg shadow-' + colorScheme[0] + '-500/50 hover:shadow-3xl tooltip'">
                    <img v-if="index < 17" :src="'../Resources/AilmentIcon' + (index+1) + '.png'"
                      @click="prettify.displayAilments = false; prettify.messageInput = '/inflict ' + ['Burn', 'Freeze', 'Shock', 'Mirage', 'Poison', 'Confusion', 'Seal', 'Curse', 'Bind', 'Charm', 'Fear', 'Sleep', 'Rage', 'Exhaustion', 'Enervation', 'Bleeding', 'Mortal', 'Other'][index] + ' ' + activeDemon.readAffinity(ailment) + '*'"
                      class="pulsingFilter" /> <img v-if="index == 17" :src="'../Resources/AffinityIcon13.png'"
                      @click="prettify.displayAilments = false; activeDemon.ailments.push(['New Ailment', 18, 100, 'Ailment effect'])"
                      class="pulsingFilter" /> <span class="tooltiptext">{{['Burn',
                      'Freeze', 'Shock', 'Mirage', 'Poison', 'Confusion', 'Seal', 'Curse',
                      'Bind', 'Charm', 'Fear', 'Sleep', 'Rage', 'Exhaustion',
                      'Enervation', 'Bleeding', 'Mortal', 'Other'][index]}}</span>
                  </div>
                </div>


                <div
                  :class="'flex flex-row w-full gap-2 text-white text-lg font-thin rounded-full bg-gradient-to-r from-' + colorScheme[7] + '-950 to-' + colorScheme[8] + '-950 ring-1 ring-' + colorScheme[0] + '-500 items-center pr-2 my-2'"
                  v-for="(ailment, index) in activeDemon.ailments">
                  <div
                    :class="'w-1/5 bg-' + colorScheme[1] + '-950 aspect-square rounded-full object-cover border-2 shadow-lg shadow-' + colorScheme[0] + '-500/50 hover:shadow-3xl border-' + colorScheme[0] + '-500 hover:border-red-500 hoverPop'">
                    <img v-if="ailment[1] <= 17" :src="'../Resources/AilmentIcon' + (ailment[1]) + '.png'"
                      class="pulsingFilter" @click="activeDemon.ailments.splice(index, 1); DataMaster.autoSave();" />
                    <img v-if="ailment[1] == 18" :src="'../Resources/AffinityIcon13.png'" class="pulsingFilter"
                      @click="activeDemon.ailments.splice(index, 1); DataMaster.autoSave();" />
                  </div>

                  <div class="flex flex-col items-center w-5/6 p-2 gap-2">
                    <div class="flex flex-row gap-2">
                      <input type="text"
                        :class="'h-full w-3/4 text-white text-lg font-thin rounded-full bg-gradient-to-r from-' + colorScheme[6] + '-950 to-' + colorScheme[1] + '-950 p-2 ring-1 ring-' + colorScheme[0] + '-500'"
                        v-model="ailment[0]" />
                      <input type="text"
                        :class="'h-full w-1/4 text-white text-base font-thin rounded-full bg-gradient-to-r from-' + colorScheme[6] + '-950 to-' + colorScheme[1] + '-950 p-2 ring-1 ring-' + colorScheme[0] + '-500'"
                        v-model.number="ailment[2]" />
                    </div>
                    <input type="text"
                      :class="'h-full w-5/6 text-white text-lg font-thin rounded-full bg-gradient-to-r from-' + colorScheme[6] + '-950 to-' + colorScheme[1] + '-950 px-2 py-1 ring-1 ring-' + colorScheme[0] + '-500'"
                      v-model="ailment[3]" @change="DataMaster.autoSave()" />
                  </div>

                </div>
                <div class="w-full flex flex-row justify-between">
                  <div class="my-2" v-if="activeDemon.ailments.length < 10">
                    <p @click="prettify.displayAilments = true" v-if="!prettify.displayAilments"
                      :class="'bg-' + colorScheme[0] + '-950 border border-' + colorScheme[0] + '-500 p-2 rounded-full'">
                      Add Ailment</p>
                    <p @click="prettify.displayAilments = false" v-if="prettify.displayAilments"
                      :class="'bg-' + colorScheme[0] + '-950 border border-' + colorScheme[0] + '-500 p-2 rounded-full'">
                      Hide</p>
                  </div>
                  <div class="my-2 mr-2" @click="prettify.messageInput = '/will all'; sendMessage(prettify.messageInput);  prettify.messageInput = '';">
                    <p
                      :class="'bg-' + colorScheme[0] + '-950 border border-' + colorScheme[0] + '-500 p-2 rounded-full'">
                      Will All</p>
                  </div>
                </div>

              </div>
              <div v-else-if="prettify.activeTab === 'notes'" class="w-full h-full flex flex-col items-center justify-center">
                <div class="h-full w-full" id="">
                  <div :class="'h-12 p-3 flex border-b-2 border-' + colorScheme[0] + '-500'" @click="prettify.useUniversalNotes=!prettify.useUniversalNotes">
                      <p v-if="!prettify.useUniversalNotes" :class="'px-2 rounded-full w-1/2 ring-2 ring-' + colorScheme[0] + '-700 bg-' + colorScheme[0] + '-900'">Demon Notes</p>
                      <p v-if="prettify.useUniversalNotes" :class="'ml-auto px-2 rounded-full text-right w-1/2 ring-2 ring-' + colorScheme[2] + '-700 bg-' + colorScheme[2] + '-900'">Universal Notes</p>
                  </div>
                  <textarea v-if="!prettify.useUniversalNotes" :class="'h-full w-full bg-' + colorScheme[0] + '-950 resize-none rounded-b-xl p-2'"
                    v-model="activeDemon.notes" @change="DataMaster.autoSave()" id=""></textarea>
                  <textarea v-if="prettify.useUniversalNotes" :class="'h-full w-full bg-' + colorScheme[2] + '-950 resize-none rounded-b-xl p-2'"
                    v-model="prettify.universalNotes" @change="DataMaster.autoSave()" id=""></textarea>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




<script>
// import { activePage } from '../composables/Prettify.js';

  export default {
    inject: ['activeDemon', 'prettify', 'DataMaster', 'colorScheme'],

    props: {
      sendMessage: Function
    }
  }
</script>