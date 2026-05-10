<template>

    <div class="w-4/4 h-[93.333334%] py-2 flex-col gap-2" v-if="prettify.activePage === 'Demons' || prettify.runkusMode">
        <div class="w-full h-1/3 flex gap-2 flex-col p-1">
            <div :class="'h-full bg-gradient-to-r from-' + colorScheme[1] + '-950 to-' + colorScheme[3] + '-800 rounded-2xl ring-2 ring-' + colorScheme[0] + '-500 w-full flex flex-row p-3'">
                <div class="aspect-square h-full rounded-full ring-2 ring-slate-200 bg-black">
                    <img class="rounded-full pixel-art object-cover w-full h-full" :src="activeDemon.icon" />
                    <!-- <img class="rounded-full pixel-art" :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->
                    
                </div>
                <div class="flex flex-row w-full p-2 h-full">
                    <div class="w-2/3 h-full flex flex-col">
                        <div
                            :class="'w-full h-1/5 px-2 pt-1 flex flex-row border-b-2 border-' + colorScheme[0] + '-500 text-2xl gap-2'">
                            <div class="text-white font-bold w-full text-left truncate"><span
                                    class="font-semibold italic">{{activeDemon.race}}</span>,
                                {{activeDemon.name}},
                                LV {{activeDemon.level}}</div>
                        </div>
                        <div class="h-4/5 w-full flex flex-col p-2">
                            <div class="w-full h-1/5 flex content-center items-center gap-2 p-1" v-for="n in 5"
                                :key="n">
                                <div
                                    class="h-full w-1/5 flex flex-row items-center justify-center text-white font-semibold">
                                    <div
                                        class="w-1/2 h-full flex items-center justify-end text-white font-semibold pr-2 ">
                                        {{ ['St', 'Ma', 'Vi', 'Ag', 'Lu'][n - 1] }}
                                    </div>
                                    <div
                                        class="w-1/2 h-full flex-col flex items-center justify-center text-white font-semibold">
                                        <p class="ring-2 bg-slate-700 rounded-lg text-center w-3/4 text-white">
                                            {{activeDemon.stats[n-1]}}</p>
                                    </div>
                                </div>
                                <div :class="'w-4/5 flex items-center bg-' + colorScheme[0] + '-950 rounded-xl p-2'">
                                    <div class="w-full h-3 bg-slate-500 rounded-full overflow-hidden">
                                        <div :class="'h-full border-r-2 border-teal-300 statBar'"
                                            :style="'width:' + (activeDemon.stats[n-1]+1) + '%'"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-1/2 h-full flex flex-col">
                        <div class="flex flex-row w-full h-1/3">
                            <div v-for="(affinity, index) in activeDemon.affinities"
                                class="flex-1 rounded-lg flex items-center justify-center">
                                <div class="">
                                    <div class="flex flex-col items-center h-full">
                                        <div class="">
                                            <div
                                                :class="'w-full bg-' + colorScheme[1] + '-950 aspect-square rounded-lg object-cover mb-1 border-2 border-' + colorScheme[0] + '-500 shadow-lg shadow-' + colorScheme[0] + '-500/50 hover:shadow-3xl tooltip'">
                                                <img :src="'../Resources/AffinityIcon' + (index+1) + '.png'"
                                                    class="pulsingFilter" />
                                                <span class="tooltiptext">{{['Strike', 'Slash', 'Pierce',
                                                    'Fire', 'Ice', 'Electricity', 'Force', 'Toxic', 'Psionic',
                                                    'Light', 'Gloom'][index]}}</span>
                                            </div>

                                        </div>

                                        <div class="p-1 h-full w-full">
                                            <div
                                                :class="'rounded-lg bg-gray-700 flex items-center justify-center text-white font-thin h-full w-full ring-2 ring-' + colorScheme[0] + '-500 text-xs textOutlineBlack shadow-lg shadow-indigo-500/50'">
                                                {{ activeDemon.getAffinities(index) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 grid-rows-4 grid-flow-col gap-2 w-full h-full p-2 h-2/3 w-full">
                            <div v-for="skill in activeDemon.skills.slice(0, 8)" :key="skill.name" v-if="activeDemon.skillCount < 9"
                                :class="'bg-gray-700 rounded-lg flex items-center justify-center text-white font-semibold ring-2 ring-' + colorScheme[0] + '-500'">
                                {{ skill.name }}
                            </div>


                            <div v-for="skill in activeDemon.skills.slice(0, 7)" :key="skill.name" v-if="activeDemon.skillCount > 9"
                                :class="'bg-gray-700 rounded-lg flex items-center justify-center text-white font-semibold ring-2 ring-' + colorScheme[0] + '-500'">
                                {{ skill.name }}
                            </div>
                            <div  :class="'bg-gray-700 rounded-lg flex items-center justify-center text-white font-semibold ring-2 ring-' + colorScheme[0] + '-500'" v-if="activeDemon.skillCount > 9">
                                {{"+" + (activeDemon.skillCount-7) + " more"}}
                            </div>


                        </div>

                    </div>

                </div>
            </div>

        </div>


        <!-- Demons List -->

        <div class="w-full h-2/3 p-2">
            <div
                :class="'w-full h-full bg-gradient-to-r from-' + colorScheme[5] + '-950 to-' + colorScheme[0] + '-900 ring-2 rounded-2xl ring-' + colorScheme[0] + '-500 overflow-y-scroll overflow-hidden'">
                <div class="flex flex-wrap ">

                    <!-- Demon Cards -->
                    <div class="w-1/4 p-2 " v-for="(demon, index) in demonList">
                        <div :class="'w-full aspect-[16/9] ring-2 rounded-2xl bg-' + colorScheme[1] + '-950 overflow-hidden hoverPop'"
                            :class="demon === activeDemon ? 'ring-' + colorScheme[3] + '-200' : 'ring-' + colorScheme[0] + '-600'"
                            @click="activeDemon = demon; displaySkill = false; prettify.skillPage=0;">
                            <div class="w-full flex flex-col">
                                <div
                                    :class="'w-full h-1/5 px-2 pt-1 flex flex-row border-b-2 border-' + colorScheme[0] + '-500'">
                                    <div class="text-white font-bold w-3/4 text-left truncate">{{demon.name}}
                                    </div>
                                    <div class="text-white w-1/4 text-right truncate"> LV {{demon.level}}</div>
                                </div>
                                <div class="w-full flex flex-row items-center mx-auto p-1">
                                    <div class="w-1/4 aspect-square ring-slate-200 rounded-full object-contain p-1">
                                        <img class="h-full aspect-square rounded-full ring-2 ring-slate-200 bg-black pixel-art object-cover" :src="demon.icon" />
                                         <!-- <img class="h-full aspect-square rounded-full ring-2 ring-slate-200 bg-black pixel-art object-cover" :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->
                                    </div>
                                    <div class="w-3/4 gap-2 flex flex-col">
                                        <div class="w-full flex flex-row sm:text-sm">

                                            <div class="flex h-full w-full flex-col">
                                                <div class="flex flex-col gap-1 h-full w-full items-center p-2">
                                                    <div
                                                        :class="'w-full h-1/6 flex flex-row content-center items-center gap-2 border-b-2 border-' + colorScheme[0] + '-500'">
                                                        <p
                                                            class="w-1/2 h-full textOutlineBlackThin text-teal-300 font-bold align-bottom textOutlineBlack">
                                                            HP</p>
                                                        <p :class="{ 'text-red-500': demon.hp <= ((demon.maxHp+demon.hpBooster)/10), 'text-teal-300': demon.hp >= (demon.maxHp+demon.hpBooster), 'text-white' : (demon.hp > ((demon.maxHp+demon.hpBooster)/10) && demon.hp < (demon.maxHp+demon.hpBooster)) }"
                                                            class="w-1/2 textOutlineBlackThin italic font-bold w-full text-end">
                                                            {{demon.hp}}/{{demon.maxHp+demon.hpBooster}} </p>
                                                    </div>
                                                    <div
                                                        :class="'w-full h-1/4 flex items-center bg-' + colorScheme[0] + '-950 rounded-full p-2 ring-1 ring-indigo-300'">
                                                        <div
                                                            class="w-full h-full bg-gray-600 rounded-full overflow-hidden">
                                                            <div class="h-full min-h-1 bg-gradient-to-r from-yellow-400 to-lime-500"
                                                                :class="{ 'bg-gradient-to-r from-red-500 to-red-800': demon.hp <= (demon.maxHp/10) }"
                                                                :style="{ width: (demon.hp / demon.maxHp * 100) + '%' }">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        :class="'w-full h-1/4 flex flex-row content-center items-center gap-2 border-b-2 border-' + colorScheme[0] + '-500'">
                                                        <p
                                                            class="w-1/2 h-full textOutlineBlackThin text-teal-300 font-bold align-bottom textOutlineBlack">
                                                            MP</p>
                                                        <p :class="{ 'text-red-500': demon.mp <= ((demon.maxMp+demon.mpBooster)/10), 'text-teal-300': demon.mp >= (demon.maxMp+demon.mpBooster), 'text-white' : (demon.mp > ((demon.maxMp+demon.mpBooster)/10) && demon.mp < demon.maxMp+demon.mpBooster) }"
                                                            class="w-1/2 textOutlineBlackThin italic font-bold w-full text-end">
                                                            {{demon.mp}}/{{demon.maxMp+demon.mpBooster}} </p>
                                                    </div>
                                                    <div
                                                        class="w-full h-1/4 flex items-center bg-indigo-950 rounded-full p-2 ring-1 ring-indigo-300">
                                                        <div
                                                            class="w-full h-full bg-gray-600 rounded-full overflow-hidden">
                                                            <div class="h-full min-h-1 bg-gradient-to-r from-cyan-400 to-blue-500"
                                                                :class="{ 'bg-gradient-to-r from-red-500 to-red-800': demon.mp <= (demon.maxMp/10) }"
                                                                :style="{ width: (demon.mp / (demon.maxMp+demon.mpBooster) * 100) + '%' }">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="w-1/4 p-2" v-if="demonList.length < 12">
                        <div class="w-full aspect-[16/9] ring-2 rounded-2xl bg-slate-900 ring-slate-500 overflow-hidden p-5 hoverPop"
                            @click="birthDemon('New Demon'); prettify.skillPage=0;">
                            <div class="h-3/4 aspect-square rounded-full mx-auto">
                                <img :src="'../Resources/DemonIcon.png'"
                                    class="w-full h-full object-cover rounded-full ring-2 ring-slate-500 pixel-art"
                                    alt="">
                            </div>
                            <p class="text-center h-1/4 text-white p-1 font-bold">New Demon</p>

                        </div>
                    </div>
                </div>







            </div>
        </div>



    </div>
</template>




<script>
    export default {
        inject: ['activeDemon', 'prettify', 'colorScheme'],

        props: {
            demonList: Array,
            birthDemon: Function
        }
    }

</script>