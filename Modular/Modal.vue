<template>


  <!-- Dark background -->
  <div
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full flex items-center justify-center bg-opacity-30 bg-black"
    style="z-index: 90000;" @click="prettify.modal = false" v-if="prettify.modal">


    <!-- Modal Body -->
    <div
      class="w-2/3 h-2/3 rounded-3xl  bg-gray-800 flex border-2 border-indigo-500 shadow-lg shadow-indigo-500/100 ring-2 ring-indigo-500 p-5"
      style="z-index: 90001;" @click.stop>


      <!-- import menu -->
      <div class="text-white w-full" v-if="prettify.modalTab == 'import'" style="z-index: 90002;">
        <h1 class="border-b-2 border-indigo-500 text-5xl font-bold mb-5 w-full" style="z-index: 90003;">Import
          something...</h1>
        <div class="text-white h-1/2 my-3">
          <!-- /import -->
          <!-- <p class="text-white text-3xl" @click="console.log(prettify); prettify.modalString = 'clicked' ">{{"prettify.modalString: " + prettify.modalString}}</p> <br> -->
          <div class="flex flex-row h-full">

            <textarea name="" id="" v-model="prettify.modalString"
              class="rounded-2xl ring-2 ring-cyan-400 p-3 font-semibold bg-indigo-950 my-5 w-full h-full max-h-full"></textarea>
          </div>
        </div>
        <div class="flex flex-row items-center">
          <div class="w-1/2 flex flex-row gap-2 ">
            <label class="rounded-full p-4 ring-1 ring-cyan-200 font-semibold bg-cyan-500 hover:bg-cyan-700 my-5 ">From
              File<input type="file" @change="DataMaster.uploadFromFile($event)" accept=".txt,.json,.dmn,.skl,.amy,.rnw"
                class="hidden"></label>
            <input type="button" value="Cancel" @click="prettify.modal = false"
              class="rounded-full p-4 ring-1 ring-cyan-200 font-semibold bg-cyan-500 hover:bg-cyan-700 my-5 flex-end">
          </div>

          <!-- Middle Div -->
          <div class="flex flex-col w-1/2">
            <label for="">Skill Slot:</label>
            <div class="flex flex-row">
              <input type="text" v-model="DataMaster.skillSlot" id=""
                class="w-1/2 text-white text-lg font-thin rounded-2xl bg-gradient-to-r from-sky-950 to-blue-900 px-2 mb-1 ring-1 ring-indigo-500">
            </div>
          </div>


          <div class="ml-auto w-1/2 flex items-end justify-end gap-2">

            <input type="button" @click="DataMaster.parseFromModal('save')" value="Save"
              class="rounded-full p-4 ring-1 ring-cyan-200 font-semibold bg-cyan-500 hover:bg-cyan-700 my-5 flex-end">
            <input type="button" @click="DataMaster.parseFromModal('demon')" value="Demon"
              class="rounded-full p-4 ring-1 ring-cyan-200 font-semibold bg-cyan-500 hover:bg-cyan-700 my-5">
            <input type="button" @click="DataMaster.parseFromModal('skill')" value="Skill"
              class="rounded-full p-4 ring-1 ring-cyan-200 font-semibold bg-cyan-500 hover:bg-cyan-700 my-5">
            <input type="button" @click="DataMaster.parseFromModal('equipment')" value="Equipment"
              class="rounded-full p-4 ring-1 ring-cyan-200 font-semibold bg-cyan-500 hover:bg-cyan-700 my-5">
            <input type="button" @click="DataMaster.parseFromModal('item')" value="Item"
              class="rounded-full p-4 ring-1 ring-cyan-200 font-semibold bg-cyan-500 hover:bg-cyan-700 my-5">
            <!-- <input type="button" v-if="unlockedTabs[2]" @click="DataMaster.parseFromModal('army')" value="Army"
              class="rounded-full p-4 ring-1 ring-cyan-200 font-semibold bg-cyan-500 hover:bg-cyan-700 my-5"> -->
            <!-- <input type="button" v-if="true" @click="DataMaster.parseFromModal('soldier')" value="Soldier"
              class="rounded-full p-4 ring-1 ring-cyan-200 font-semibold bg-cyan-500 hover:bg-cyan-700 my-5"> -->
          </div>
        </div>
      </div>


      <!-- help menu -->
      <div class="w-full max-h-[80vh] overflow-y-auto text-white font-semibold" v-if="prettify.modalTab=='help'">

        <h2 class="text-2xl mb-4 border-b border-indigo-500 pb-2">List of Commands:</h2>
        <div class="space-y-3 text-lg">
          <div>
            <span class="text-indigo-400 font-bold">/roll & /math</span>
            <span class="font-thin"> - Roll dice or evaluate math expressions (supports complex notation)</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/xp & /exp</span>
            <span class="font-thin"> - Add experience points to your demon</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/hp</span>
            <span class="font-thin"> - Adjust your demon’s HP (healing or damage)</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/mp</span>
            <span class="font-thin"> - Adjust your demon’s MP (healing or cost)</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/bulwark</span>
            <span class="font-thin"> - Adjust bulwark (shield) value</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/cost</span>
            <span class="font-thin"> - Deduct HP or MP cost for a skill</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/damage</span>
            <span class="font-thin"> - Apply damage to demon, with options to ignore army, resistance, or
              Rakukaja</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/wash</span>
            <span class="font-thin"> - Reset demon buffs, ailments, and fully restore HP and MP</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/import skill &lt;name&gt; [slot]</span>
            <span class="font-thin"> - Import a skill by name into a slot</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/clear</span>
            <span class="font-thin"> - Clear message log</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/deletedemon [index]</span>
            <span class="font-thin"> - Delete a demon by index (cannot delete last or main demon)</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/load [slot]</span>
            <span class="font-thin"> - Load saved data slot</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/save [slot]</span>
            <span class="font-thin"> - Save data to slot</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/print</span>
            <span class="font-thin"> - Print data to browser console</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/delete &lt;key&gt;</span>
            <span class="font-thin"> - Delete a saved key from localStorage</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/download &lt;filename&gt;</span>
            <span class="font-thin"> - Download save data as file</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/listofsaves</span>
            <span class="font-thin"> - List all saved data keys</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/unlock &lt;demon/army/edit/all&gt;</span>
            <span class="font-thin"> - Unlock tabs/features</span>
          </div>
          <div>
            <span class="text-indigo-400 font-bold">/recalculatevitals</span>
            <span class="font-thin"> - Recalculate demon vitals</span>
          </div>
        </div>

      </div>



      <!-- Equipment -->

      <div class="w-full max-h-[80vh] text-white font-semibold" v-if="prettify.modalTab=='newEquipment'">
        <h2 class="h-[10%] text-4xl mb-4 border-b border-indigo-500 pb-2">Select Equipment to Make</h2>

        <div class="flex flex-row h-[90%]">
          <div :class="'h-full border-r-2 w-1/6 border-' + colorScheme[0] + '-500 gap-4 p-1 justify-between'">
            <!-- <p class="h-[5%] text-center bg-red-900 w-full text-3xl textOutlineBlackThin">Create</p> <br> -->
            <div class="h-[95%] w-full ">
              <div class=" h-1/3" v-for="(type, index) in ['Weapon', 'Armor','Accessory']"
                @click="prettify.editingEqiupment = prettify.newItem(type)">
                <img
                  :class="'mx-auto h-2/3 rounded-xl ring bg-' + colorScheme[0] + '-950 ring-' + colorScheme[0] + '-400 aspect-square'"
                  :src="'./Resources/' + type + 'Icon.png'" alt="">
                <p class="h-1/3 text-center w-full text-xl textOutlineBlackThin">{{type}}</p>
              </div>
            </div>
            <!-- <div class="h-1/3 w-3/3" @click="">
              <img :class="'rounded-xl ring bg-' + colorScheme[0] + '-950 ring-' + colorScheme[0] + '-400 aspect-square'" :src="'./Resources/WeaponIcon.png'" alt="">
              <p class="text-center w-full text-xl textOutlineBlackThin">New Weapon</p>
            </div>
            <div class="h-1/3 w-3/3" @click="">
              <img :class="'rounded-xl ring bg-' + colorScheme[0] + '-950 ring-' + colorScheme[0] + '-400 aspect-square'" :src="'./Resources/ArmorIcon.png'" alt="">
              <p class="text-center w-full text-xl textOutlineBlackThin">New Armor</p>
            </div>
            <div class="h-1/3 w-3/3" @click="prettify.editingEqiupment = prettify.newItem('Accessory')">
              <img :class="'rounded-xl ring bg-' + colorScheme[0] + '-950 ring-' + colorScheme[0] + '-400 aspect-square'" :src="'./Resources/AccessoryIcon.png'" alt="">
              <p class="text-center w-full text-xl textOutlineBlackThin">New Accessory</p>
            </div> -->
          </div>



          <div class="h-full flex flex-col w-full overflow-y-auto" v-if="prettify.editingEqiupment">
            <div class="p-3">
              <label for="equipmentNameBox" class="text-xl">Name:</label>
              <input id="equipmentNameBox" type="text" placeholder="Equipment Name"
                v-model="prettify.editingEqiupment.name"
                :class="'mb-3 w-full h-full text-xl bg-' + colorScheme[1] + '-950 text-white p-2 rounded-full ring-2 ring-' + colorScheme[3] + '-400'"
                @change="DataMaster.autoSave()">
            </div>
            <div class="p-3 my-5">
              <label for="equipmentDescriptionBox" class="text-xl">Description:</label>
              <textarea id="equipmentDescriptionBox" type="text" v-model="prettify.editingEqiupment.description"
                :class="'w-full max-h-96 h-full bg-' + colorScheme[1] + '-950 text-white p-2 rounded-3xl ring-2 ring-' + colorScheme[3] + '-400'"
                @change="DataMaster.autoSave()"></textarea>
            </div>

            <div class="p-3 my-5 flex flex-row gap-3">
              <div class="flex flex-col" v-if="prettify.editingEqiupment.itemType == 'Armor'">
                <label for="equipmentWeightBox" class="text-xl">Resistance:</label>
                <input id="equipmentWeightBox" type="number" placeholder="Weight"
                  v-model.number="prettify.editingEqiupment.resistance"
                  :class="'mb-3 w-full h-full text-xl bg-' + colorScheme[1] + '-950 text-white p-2 rounded-full ring-2 ring-' + colorScheme[3] + '-400'"
                  @change="DataMaster.autoSave()">
              </div>

              <div class="flex flex-col" v-if="prettify.editingEqiupment.itemType == 'Armor'">
                <label for="equipmentWeightBox" class="text-xl">Evasion:</label>
                <input id="equipmentWeightBox" type="number" placeholder="Weight"
                  v-model.number="prettify.editingEqiupment.evasion"
                  :class="'mb-3 w-full h-full text-xl bg-' + colorScheme[1] + '-950 text-white p-2 rounded-full ring-2 ring-' + colorScheme[3] + '-400'"
                  @change="DataMaster.autoSave()">
              </div>

              <div class="flex flex-col" :class="prettify.editingEqiupment.itemType == 'Armor' ? 'w-1/3' : 'w-full'">
                <label for="equipmentWeightBox" class="text-xl">Weight:</label>
                <input id="equipmentWeightBox" type="number" placeholder="Weight"
                  v-model.number="prettify.editingEqiupment.weight"
                  :class="'mb-3 w-full h-full text-xl bg-' + colorScheme[1] + '-950 text-white p-2 rounded-full ring-2 ring-' + colorScheme[3] + '-400'"
                  @change="DataMaster.autoSave()">
              </div>
            </div>



            <div class="px-3">
              <label for="px-3" class="text-xl" v-if="prettify.editingEqiupment.itemType == 'Weapon'">Icon:</label>
              <div class="flex flex-row p-2 gap-2 mb-3 px-3" v-if="prettify.editingEqiupment.itemType == 'Weapon'">

                <div :class="' rounded-xl ring-1 ring-' + colorScheme[3] + '-400'"
                  v-for="dirStr in ['Weapons/Fist', 'Weapon', 'Weapons/Spear', 'Weapons/Axe', 'Weapons/Bow', 'Weapons/Pistol']">
                  <!-- words here for proof -->
                  <img :class="dirStr == prettify.editingEqiupment.icon ? 'pulsingFilter' : ''"
                    :src="'./Resources/' + dirStr + 'Icon.png'" alt="" @click="prettify.editingEqiupment.icon = dirStr">

                </div>
              </div>
            </div>




            <label for="" class="text-xl px-3">Rolls:</label>
            <div class="flex flex-row flex-wrap px-2" v-if="prettify.editingEqiupment.itemType == 'Weapon'">

              <div class="flex flex-col p-2 w-1/2" v-for="(roll, index) in prettify.editingEqiupment.rolls">
                <input for=""
                  :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white bg-transparent'"
                  v-model="prettify.editingEqiupment.rollNames[index]" placeholder="Roll Name"
                  @change="prettify.editingEqiupment.checkRolls(); activeDemon.getVariables(); DataMaster.autoSave()">
                <input type="text" v-model="prettify.editingEqiupment.rolls[index]" name=""
                  :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'"
                  placeholder="Roll"
                  @change="prettify.editingEqiupment.checkRolls(); activeDemon.getVariables();DataMaster.autoSave()">
              </div>
              <div class="w-1/2 min-h-16 p-2 font-semibold" v-if="prettify.editingEqiupment.rolls.length < 16"
                @click=" prettify.editingEqiupment.rolls.push('/'); prettify.editingEqiupment.rollNames.push('');">
                <div
                  :class="'rounded-lg bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 h-full w-full ring-1 ring-white p-2'">
                  +New Roll
                </div>

              </div>

            </div>




            <div class="grid grid-cols-3 grid-rows-2 grid-flow-row gap-2 w-full p-3 my-5"
              v-if="prettify.editingEqiupment.boxes">
              <div v-for="(checkBox, index) in prettify.editingEqiupment.boxes">
                <div class="flex flex-col gap-2">
                  <label for="equipmentNameBox" class="text-xl">Effect {{index+1}}:</label>
                  <input id="equipmentNameBox" type="text" placeholder="Effect"
                    v-model="prettify.editingEqiupment.boxes[index]"
                    :class="'mb-3 w-full h-full text-xl bg-' + colorScheme[1] + '-950 text-white p-2 rounded-full ring-2 ring-' + colorScheme[3] + '-400'"
                    @change="if (prettify.editingEqiupment.boxes[index] === ''){ prettify.editingEqiupment.boxes.splice(index, 1); }; DataMaster.autoSave();">
                </div>
              </div>
              <div class="w-full min-h-16 p-2 font-semibold" v-if="prettify.editingEqiupment.boxes.length < 6"
                @click="prettify.editingEqiupment.boxes.push(['+']);">
                <div
                  :class="'text-white rounded-lg bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 max-h-full w-full ring-1 ring-white p-2'">
                  +New Effect
                </div>
              </div>
            </div>


            <div class="flex p-3 font-bold text-3xl">
              <input
                :class="'ml-auto rounded-full bg-gradient-to-r from-' + colorScheme[5] + '-950 to-' + colorScheme[4] + '-900 h-full w-1/6 ring-1 ring-white p-2'"
                type="button" value="Save"
                @click="prettify.findItem(prettify.editingEqiupment); prettify.editingEqiupment = null; prettify.modal = false;">
            </div>

          </div>

        </div>


      </div>


      <div class="w-full max-h-[80vh] overflow-y-auto text-white font-semibold"
        v-if="prettify.modalTab=='editEquipment'">
        <div class="p-2" v-if="prettify.editingEqiupment">
          <div class="h-full flex flex-col w-full overflow-y-auto" v-if="prettify.editingEqiupment">
            <div class="p-3">
              <label for="equipmentNameBox" class="text-xl">Name:</label>
              <input id="equipmentNameBox" type="text" placeholder="Equipment Name"
                v-model="prettify.editingEqiupment.name"
                :class="'mb-3 w-full h-full text-xl bg-' + colorScheme[1] + '-950 text-white p-2 rounded-full ring-2 ring-' + colorScheme[3] + '-400'"
                @change="DataMaster.autoSave()">
            </div>
            <div class="p-3 my-5">
              <label for="equipmentDescriptionBox" class="text-xl">Description:</label>
              <textarea id="equipmentDescriptionBox" type="text" v-model="prettify.editingEqiupment.description"
                :class="'w-full max-h-96 h-full bg-' + colorScheme[1] + '-950 text-white p-2 rounded-3xl ring-2 ring-' + colorScheme[3] + '-400'"
                @change="DataMaster.autoSave()"></textarea>
            </div>

            <div class="p-3 my-5 flex flex-row gap-3 w-ful">

              
              <div class="flex flex-col" v-if="prettify.editingEqiupment.itemType == 'Armor'">
                <label for="equipmentWeightBox" class="text-xl">Resistance:</label>
                <input id="equipmentWeightBox" type="number" placeholder="Weight"
                  v-model.number="prettify.editingEqiupment.resistance"
                  :class="'mb-3 w-full h-full text-xl bg-' + colorScheme[1] + '-950 text-white p-2 rounded-full ring-2 ring-' + colorScheme[3] + '-400'"
                  @change="DataMaster.autoSave()">
              </div>
              
              <div class="flex flex-col" v-if="prettify.editingEqiupment.itemType == 'Armor'">
                <label for="equipmentWeightBox" class="text-xl">Evasion:</label>
                <input id="equipmentWeightBox" type="number" placeholder="Weight"
                  v-model.number="prettify.editingEqiupment.evasion"
                  :class="'mb-3 w-full h-full text-xl bg-' + colorScheme[1] + '-950 text-white p-2 rounded-full ring-2 ring-' + colorScheme[3] + '-400'"
                  @change="DataMaster.autoSave()">
              </div>

              <div class="flex flex-col" :class="prettify.editingEqiupment.itemType == 'Armor' ? 'w-1/3' : 'w-full'">
                <label for="equipmentWeightBox" class="text-xl">Weight:</label>
                <input id="equipmentWeightBox" type="number" placeholder="Weight"
                  v-model.number="prettify.editingEqiupment.weight"
                  :class="'mb-3 w-full h-full text-xl bg-' + colorScheme[1] + '-950 text-white p-2 rounded-full ring-2 ring-' + colorScheme[3] + '-400'"
                  @change="DataMaster.autoSave()">
              </div>
            </div>

            <label for="" class="text-xl" v-if="prettify.editingEqiupment.itemType == 'Weapon'">Icon:</label>
            <div class="flex flex-row p-2 gap-2 mb-3" v-if="prettify.editingEqiupment.itemType == 'Weapon'">

              <div :class="' rounded-xl ring-1 ring-' + colorScheme[3] + '-400'"
                v-for="dirStr in ['Weapons/Fist', 'Weapon', 'Weapons/Spear', 'Weapons/Axe', 'Weapons/Bow', 'Weapons/Pistol']">
                <!-- words here for proof -->
                <img :class="dirStr == prettify.editingEqiupment.icon ? 'pulsingFilter' : ''"
                  :src="'./Resources/' + dirStr + 'Icon.png'" alt="" @click="prettify.editingEqiupment.icon = dirStr">
              </div>
            </div>


            <label for="" class="text-xl px-3" v-if="prettify.editingEqiupment.itemType == 'Weapon'">Rolls:</label>
            <div class="flex flex-row flex-wrap px-2" v-if="prettify.editingEqiupment.itemType == 'Weapon'">

              <div class="flex flex-col p-2 w-1/2" v-for="(roll, index) in prettify.editingEqiupment.rolls">
                <input for=""
                  :class="'border-b-2 mb-2 border-' + colorScheme[0] + '-500 font-bold text-white bg-transparent'"
                  v-model="prettify.editingEqiupment.rollNames[index]" placeholder="Roll Name"
                  @change="prettify.editingEqiupment.checkRolls(); activeDemon.getVariables(); DataMaster.autoSave()">
                <input type="text" v-model="prettify.editingEqiupment.rolls[index]" name=""
                  :class="'h-1/4 bg-' + colorScheme[1] + '-950 text-white p-4 rounded-3xl ring-1 ring-' + colorScheme[3] + '-400'"
                  placeholder="Roll"
                  @change="prettify.editingEqiupment.checkRolls(); activeDemon.getVariables();DataMaster.autoSave()">
              </div>
              <div class="w-1/2 min-h-16 p-2 font-semibold" v-if="prettify.editingEqiupment.rolls.length < 16"
                @click=" prettify.editingEqiupment.rolls.push('/'); prettify.editingEqiupment.rollNames.push('');">
                <div
                  :class="'rounded-lg bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 h-full w-full ring-1 ring-white p-2'">
                  +New Roll
                </div>

              </div>

            </div>



            <label for="" class="text-xl px-3" v-if="prettify.editingEqiupment.boxes">Effects:</label>
            <div class="grid grid-cols-3 grid-rows-2 grid-flow-row gap-2 w-full p-3 my-5"
              v-if="prettify.editingEqiupment.boxes">
              <div v-for="(checkBox, index) in prettify.editingEqiupment.boxes">
                <div class="flex flex-col gap-2">
                  <label for="equipmentNameBox" class="text-xl">Effect {{index+1}}:</label>
                  <input id="equipmentNameBox" type="text" placeholder="Effect"
                    v-model="prettify.editingEqiupment.boxes[index]"
                    :class="'mb-3 w-full h-full text-xl bg-' + colorScheme[1] + '-950 text-white p-2 rounded-full ring-2 ring-' + colorScheme[3] + '-400'"
                    @change="if (prettify.editingEqiupment.boxes[index] === ''){ prettify.editingEqiupment.boxes.splice(index, 1); }; DataMaster.autoSave();">
                </div>
              </div>
              <div class="w-full min-h-16 p-2 font-semibold" v-if="prettify.editingEqiupment.boxes.length < 6"
                @click="prettify.editingEqiupment.boxes.push(['+']);">
                <div
                  :class="'text-white rounded-lg bg-gradient-to-r from-' + colorScheme[2] + '-950 to-' + colorScheme[1] + '-900 max-h-full w-full ring-1 ring-white p-2'">
                  +New Effect
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="flex p-3 font-bold text-xl">
          <input
            :class="'p-3 rounded-full bg-gradient-to-r from-' + colorScheme[7] + '-950 to-' + colorScheme[8] + '-900 h-full ring-1 ring-white p-2'"
            type="button" value="Delete"
            @click="prettify.deleteItem(prettify.editingEqiupment.id); prettify.editingEqiupment = null; prettify.modal = false;">
          <input
            :class="'p-3 ml-auto rounded-full bg-gradient-to-r from-' + colorScheme[5] + '-950 to-' + colorScheme[4] + '-900 h-full  ring-1 ring-white p-2'"
            type="button" value="Save" @click="prettify.editingEqiupment = null; prettify.modal = false;">
        </div>
      </div>


      <div class="w-full max-h-[80vh] overflow-y-auto text-white font-semibold" v-if="prettify.modalTab=='colorSchemeEditor'">


        <p class="text-white text-3xl">Color Scheme Editor:</p> <br>

        <!-- <input type="color" name="" id=""> -->
        <!-- {{prettify.getColors()}} -->
        <div class="grid grid-cols-4 grid-rows-2" v-for="(color, index) in prettify.getColors()">
          <p>Color #{{index}}</p>
          {{color}}
          <select @change="prettify.setColors(index, $event.target.value)" name="" id="" :class="'text-' + color + '-800 bg-' + color + '-100'">
            <option :value="color" :class="'text-' + color + '-800 bg-' + color + '-100'" >Current: {{color}}</option>
            <option v-for="aColor in prettify.allColors()" :value="aColor" :class="'text-' + aColor + '-800 bg-' + aColor + '-100'" >{{aColor}}</option>
          </select>
          <div :class="'bg-' + color + '-500 h-5 aspect-square'"></div>
        </div>

        <div class="flex p-3 font-bold text-xl">
          <input
            :class="'p-3 rounded-full bg-gradient-to-r from-' + colorScheme[7] + '-950 to-' + colorScheme[8] + '-900 h-full ring-1 ring-white p-2'"
            type="button" value="Reset Colors"
            @click="prettify.modal = false; prettify.resetColors()">
          <input
            :class="'p-3 ml-auto rounded-full bg-gradient-to-r from-' + colorScheme[5] + '-950 to-' + colorScheme[4] + '-900 h-full  ring-1 ring-white p-2'"
            type="Save" value="Close" @click="prettify.modal = false;">
        </div>


      </div>







    </div>
  </div>

</template>




<script>
  export default {
    inject: ['activeDemon', 'prettify', 'DataMaster', 'colorScheme'],
    // props: {
    //   colorScheme: Array,
    // },


    // emits: ['update:activePage'],   // ← Add this



    // methods: {
    //   changePage(newPage) {
    //     this.$emit('update:activePage', newPage);   // ← Send the change back up
    //   }
    // }
  }

</script>