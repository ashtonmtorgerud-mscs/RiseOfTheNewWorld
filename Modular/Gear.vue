<template>

  <div :class="'w-4/4 h-[93.333334%] p-2'" v-if="prettify.activePage === 'Gear' || prettify.runkusMode">
    <div
      :class="'h-full bg-gradient-to-r from-' + colorScheme[1] + '-950 to-' + colorScheme[3] + '-800 rounded-2xl ring-2 ring-' + colorScheme[0] + '-500'">


      <!-- Gear Info Tab -->
      <div class="w-4/4 flex flex flex-row gap-2 p-2 h-full">
        <div class="w-full h-full overflow-y-auto">
          <div class="px-5 pt-5 flex flex-col">
            <p
              :class="'text-4xl font-bold text-' + colorScheme[5] + '-400 border-b-2 mb-2 border-' + colorScheme[0] + '-500'">
              Equipped</p>
          </div>




          <div class="flex flex-row gap-2 p-2">


            <!-- Weapon and Armor -->

            <div
              :class="'bg-gray-800 rounded-2xl w-1/2 flex flex-row items-center gap-2 ring-2 ring-' + colorScheme[0] + '-500 p-2'">

              <div class="max-h-48 h-full w-full flex flex-row gap-2 px-2 ">

                <div class="h-full flex flex-col">
                  <div
                    :class="'h-2/3 bg-' + colorScheme[1] + '-950 aspect-square rounded-lg object-cover mb-1 border-2 border-' + colorScheme[0] + '-500 shadow-lg shadow-' + colorScheme[0] + '-500/50 hover:shadow-3xl'">
                    <img class="pulsingFilter object-contain"
                      :src="'./Resources/' + activeDemon.equippedWeapon.icon + 'Icon.png'"
                      v-if="activeDemon.equippedWeapon.icon != ''" />
                    <!-- <img class="pulsingFilter object-contain" v-if="activeDemon.equippedWeapon.default == false" :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->
                  </div>
                  <div class="h-1/3 flex flex-row gap-2 justify-center p-1"
                    v-if="activeDemon.equippedWeapon.default == false">
                    <div @click="prettify.unequipWeapon(activeDemon.equippedWeapon, activeDemon)"
                      :class="'bg-' + colorScheme +  '-500 ring-1 ring w-1/2 aspect-square rounded tooltip ring-2 ring-' + colorScheme[0] + '-500 p-1'">
                      <img class="pulsingFilter scale-y-[-1]" :src="'./Resources/TwirlArrowIcon.png'" />
                      <span class="tooltiptext">Unequip</span>
                      <!-- <img class="pulsingFilter scale-y-[-1]" :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->
                    </div>
                    <div
                      @click="prettify.modal = true; prettify.editingEquipment = activeDemon.equippedWeapon; prettify.modalTab='editEquipment';"
                      :class="'bg-' + colorScheme +  '-500 ring-1 ring w-1/2 aspect-square rounded tooltip ring-2 ring-' + colorScheme[0] + '-500 p-1'">
                      <img class="pulsingFilter " :src="'./Resources/EditIcon.png'" />
                      <!-- <img class="pulsingFilter " :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->
                      <span class="tooltiptext">Edit</span>
                    </div>
                  </div>
                </div>



                <div class="w-full flex flex-col gap-2 p-1">
                  <div :class="'bg-' + colorScheme[3] + '-400 p-[1.5px] clippedCorner'">
                    <!-- <label for="IconBox" class="border-b-22 border-indigo-500 font-bold text-white">Weapon Name:</label> -->
                    <p
                      :class="'clippedCorner bg-' + colorScheme[1] + '-950 w-full text-white font-bold text-2xl p-1 turncate'">
                      {{activeDemon.equippedWeapon.name}} </p>
                  </div>


                  <div
                    :class="'flex flex-col h-32 overflow-y-auto overscroll-contain clippedCorner p-[1.5px] bg-' + colorScheme[5] + '-400'">
                    <!-- <label for="IconBox" class="border-b-22 border-indigo-500 font-bold text-white">Description:</label> -->
                    <p
                      :class="'h-full bg-' + colorScheme[1] + '-950 text-white p-1 rounded clippedCorner ring-1  overflow-y-auto'">
                      {{activeDemon.equippedWeapon.description}}
                    </p>

                  </div>
                </div>
              </div>
            </div>





            <!-- Armor -->
            <div :class="'bg-gray-800 rounded-2xl w-1/2  ring-2 ring-' + colorScheme[0] + '-500 p-2'">

              <div class="flex flex-row items-center gap-2 h-full">

                <!-- Armor Icon -->
                <div class="h-48 flex flex-col">
                  <div
                    :class="'h-2/3 bg-' + colorScheme[1] + '-950 aspect-square rounded-lg object-cover mb-1 border-2 border-' + colorScheme[0] + '-500 shadow-lg shadow-' + colorScheme[0] + '-500/50 hover:shadow-3xl'">
                    <img v-if="activeDemon.equippedArmor.default == false" class="pulsingFilter object-contain"
                      :src="'./Resources/ArmorIcon.png'" />
                    <!-- <img class="pulsingFilter object-contain" :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->
                  </div>
                  <div class="h-1/3 flex flex-row gap-2 justify-center p-1"
                    v-if="activeDemon.equippedArmor.default == false">
                    <div @click="prettify.unequipArmor(activeDemon.equippedArmor, activeDemon)"
                      :class="'tooltip bg-' + colorScheme +  '-500 ring-1 ring w-1/2 aspect-square rounded ring-2 ring-' + colorScheme[0] + '-500 p-1'">
                      <img class=" pulsingFilter scale-y-[-1]" :src="'./Resources/TwirlArrowIcon.png'" />
                      <!-- <img class="pulsingFilter scale-y-[-1]" :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->
                      <span class="tooltiptext">Unequip</span>
                    </div>
                    <div
                      @click="prettify.modal = true; prettify.editingEquipment = activeDemon.equippedArmor; prettify.modalTab='editEquipment';"
                      :class="'bg-' + colorScheme +  '-500 ring-1 ring w-1/2 aspect-square rounded tooltip ring-2 ring-' + colorScheme[0] + '-500 p-1'">
                      <img class="tooltip pulsingFilter " :src="'./Resources/EditIcon.png'" />
                      <!-- <img class="pulsingFilter " :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->

                      <!-- https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg -->
                      <span class="tooltiptext">Edit</span>
                    </div>
                  </div>
                </div>

                <div class="h-full w-full flex flex-col gap-2 p-1">
                  <div :class="'bg-' + colorScheme[3] + '-400 p-[1.5px] clippedCorner'">
                    <p :class="'clippedCorner bg-' + colorScheme[1] + '-950 w-full text-white font-bold text-2xl p-1 '">
                      {{activeDemon.equippedArmor.name}} </p>
                  </div>


                  <div
                    :class="'flex flex-col h-32 overflow-y-auto overscroll-contain clippedCorner p-[1.5px] bg-' + colorScheme[5] + '-400 '">
                    <div
                      :class="'h-full bg-' + colorScheme[1] + '-950 text-white p-1 rounded clippedCorner ring-1  overflow-y-auto'">
                      <p> {{activeDemon.equippedArmor.description}} </p>
                      <!-- <p> {{activeDemon.equippedArmor}} </p> -->

                      <div :class="'bg-' + colorScheme[5] + '-500 my-4 h-[2px] rounded-full'">
                      </div>

                      <div
                        class="w-full flex flex-row gap-2 justify-center align-center text-2xl font-bold mb-3 mx-auto">
                        <div
                          class="w-full flex flex-row gap-4 justify-center items-center text-3xl font-bold mb-3 mx-auto">
                          <div class=""> DEF: <span
                              class="ring px-3 rounded-full">{{activeDemon.equippedArmor.resistance}}</span>
                          </div>

                        </div>
                        <div
                          class="w-full flex flex-row gap-4 justify-center items-center text-3xl font-bold mb-3 mx-auto">
                          <div class=""> EVA: <span
                              class="ring px-3 rounded-full">{{activeDemon.equippedArmor.evasion}}</span>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          <!-- Equipped Accessories  -->
          <div class="flex flex-row gap-2 w-full p-2">
            <div
              :class="'bg-gray-800 rounded-2xl flex flex-row items-center gap-2 ring-2 ring-' + colorScheme[0] + '-500 p-2'"
              style="width: 33%;" v-for="(accessory, index) in activeDemon.accessories">

              <!-- Accessory Icon -->
              <div class="w-1/4 flex flex-col">
                <div
                  :class="'h-2/3 bg-' + colorScheme[1] + '-950 aspect-square rounded-lg object-cover mb-1 border-2 border-' + colorScheme[0] + '-500 shadow-lg shadow-' + colorScheme[0] + '-500/50 hover:shadow-3xl'">
                  <img v-if="accessory.name" class="pulsingFilter object-contain"
                    :src="'./Resources/AccessoryIcon.png'" />
                  <!-- <img class="pulsingFilter object-contain" :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->
                </div>
                <div class="h-1/3 flex flex-row gap-2 justify-center p-1" v-if="accessory.name">
                  <div @click="prettify.unequipAccessory(index, activeDemon); DataMaster.autoSave();"
                    :class="'bg-' + colorScheme +  '-500 ring-1 ring w-1/2 aspect-square rounded tooltip ring-2 ring-' + colorScheme[0] + '-500 p-1'">
                    <img class="pulsingFilter scale-y-[-1]" :src="'./Resources/TwirlArrowIcon.png'" />
                    <!-- <img class="pulsingFilter scale-y-[-1]" :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->
                    <span class="tooltiptext">Unequip</span>
                  </div>
                  <div
                    @click="prettify.modal = true; prettify.editingEquipment = accessory; prettify.modalTab='editEquipment';"
                    :class="'bg-' + colorScheme +  '-500 ring-1 ring w-1/2 aspect-square rounded tooltip ring-2 ring-' + colorScheme[0] + '-500 p-1'">
                    <img class="pulsingFilter " :src="'./Resources/EditIcon.png'" />
                    <!-- <img class="pulsingFilter " :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->
                    <span class="tooltiptext">Edit</span>
                  </div>
                </div>
              </div>

              <!-- Accessory Info -->
              <div class="flex flex-col gap-2 p-1 h-full overflow-hidden w-3/4">
                <div :class="'bg-' + colorScheme[3] + '-400 p-[1.5px] clippedCorner'">
                  <p
                    :class="'clippedCorner bg-' + colorScheme[1] + '-950 flex-1  h-8 text-white font-bold text-lg p-[1px] truncate'">
                    {{activeDemon.accessories[index].name}}
                  </p>
                </div>



                <div
                  :class="'flex flex-col h-32 overflow-y-auto overscroll-contain clippedCorner p-[1.5px] bg-' + colorScheme[5] + '-400'">
                  <!-- <label for="IconBox" class="border-b-22 border-indigo-500 font-bold text-white">Description:</label> -->
                  <div
                    :class="'h-full bg-' + colorScheme[1] + '-950 text-white p-1 rounded clippedCorner ring-1  overflow-y-auto'">
                    <p v-if="activeDemon.accessories[index].description"
                      class="font-bold w-full border-b border-white text-center">Description</p>
                    <p v-if="activeDemon.accessories[index].description"> {{activeDemon.accessories[index].description}}
                    </p>
                    <div v-if="activeDemon.accessories[index].boxes">
                      <p v-if="activeDemon.accessories[index].boxes.length > 0"
                        class="font-bold w-full border-b border-white text-center mb-1"> Effects </span> </p>
                      <p v-if="activeDemon.accessories[index].boxes.length > 0"
                        :class="'font-bold rounded-full bg-' + colorScheme[1] + '-950 my-1 ring-1 ring-' + colorScheme[0] + '-800'"
                        v-for="box in activeDemon.accessories[index].boxes"> {{box}} </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>


          <div class="w-full flex px-5">
            <!-- <p :class="'rounded-full py-1 px-3 ml-auto text-right text-white text-2xl textOutlineBlackThin bg-' + colorScheme[0] + '-950 border-2 border-' + colorScheme[0] + '-500'"> {{activeDemon.equippedWeapon.weight + activeDemon.equippedArmor.weight + activeDemon.accessories.reduce((sum, acc) => sum + (acc.weight ?? 0), 0)}} / {{Math.floor((25+(activeDemon.stats[0]+activeDemon.statsBooster[0])*5+((activeDemon.stats[0]+activeDemon.statsBooster[0])**2)/20)*activeDemon.carry)}} </p> -->
            <p
              :class="'rounded-full py-1 px-3 ml-auto text-right text-white text-2xl textOutlineBlackThin bg-' + colorScheme[0] + '-950 border-2 border-' + colorScheme[0] + '-500'">
              {{activeDemon.equippedWeapon.weight + activeDemon.equippedArmor.weight +
              activeDemon.accessories.reduce((sum, acc) => sum + (acc.weight ?? 0), 0)}} /
              {{Math.floor((20+(activeDemon.stats[0]+activeDemon.statsBooster[0])*5)*((activeDemon.carry+activeDemon.carryBoost)/100))}} </p>
          </div>

          <div
            :class="'mt-4 mx-2 text-4xl font-bold flex justify-between items-center text-' + colorScheme[5] + '-400 border-b-2 mb-2 border-' + colorScheme[0] + '-500'">
            <p>Equipment</p>



            <div
              :class="'font-normal rounded-full py-1 px-3 ml-auto text-right flex flex-row gap-2 text-white text-2xl textOutlineBlackThin bg-' + colorScheme[2] + '-900 border-2 border-' + colorScheme[2] + '-500'">


              <div class="flex items-center">
                <input v-model="prettify.showWeapons" id="filterWeapon" type="checkbox" @change="prettify.filterEquipmentPage = Math.min(prettify.filterEquipmentPage, Math.ceil(prettify.filterEquipment(equipmentList).length/15)-1);"
                  class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
                <label for="filterWeapon" class="select-none ms-2 text-sm font-medium text-heading">Weapons</label>
              </div>
              <div class="flex items-center">
                <input v-model="prettify.showArmor" id="filterArmor" type="checkbox" @change="prettify.filterEquipmentPage = Math.min(prettify.filterEquipmentPage, Math.ceil(prettify.filterEquipment(equipmentList).length/15)-1);"
                  class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
                <label for="filterArmor" class="select-none ms-2 text-sm font-medium text-heading">Armors</label>
              </div>
              <div class="flex items-center">
                <input v-model="prettify.showAccessories" id="filterAcc" type="checkbox" @change="prettify.filterEquipmentPage = Math.min(prettify.filterEquipmentPage, Math.ceil(prettify.filterEquipment(equipmentList).length/15)-1);"
                  class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
                <label for="filterAcc" class="select-none ms-2 text-sm font-medium text-heading">Accessories</label>
              </div>
              <div class="flex items-center">
                <input v-model="prettify.showEquipped" id="filterEquiped" type="checkbox" @change="prettify.filterEquipmentPage = Math.min(prettify.filterEquipmentPage, Math.ceil(prettify.filterEquipment(equipmentList).length/15));"
                  class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
                <label for="filterEquiped" class="select-none ms-2 text-sm font-medium text-heading">Equipped</label>
              </div>

              <select :id="affinity" v-model="prettify.sortEquipmentBy" value=@change="DataMaster.autoSave()" :class="'w- text-sm rounded-2xl h-1/4 text-center font-bold bg-' + colorScheme[1] + '-950 border-2 border-' + colorScheme[0] + '-500'">
                  <option value="oldest">Oldest</option>  
                  <option value="newest">Newest</option>
                  <option value="rarity">Grade</option>
                  <option value="inverserarity">Grade⇵</option>
                  <option value="alphabetically">A-Z</option>
                  <option value="inversealphabetically">Z-A</option>
                </select>

            </div>
          </div>


          <div class="text-white flex flex-col gap-2 w-full p-2 overflow-clip">


            <!-- Skill Pages -->
            <div class="flex flex-row flex-wrap w-full">

              <div class="w-1/4 relative overflow-hidden p-1"
                v-for="(item, index) in prettify.filterEquipment(equipmentList).slice(prettify.filterEquipmentPage*15, Math.min((prettify.filterEquipmentPage*15)+15, equipmentList.length))">
                <div
                  :class="'relative bg-gray-800 p-2 rounded-2xl flex flex-row items-center gap-2 ring-2 ring-' + colorScheme[0] + '-500'">



                  <!-- Equipment Icon -->
                  <div class="w-1/3 flex flex-col flex-1">

                    <div
                      :class="'h-2/3 bg-' + colorScheme[1] + '-950 aspect-square rounded-lg object-cover mb-1 border-2 border-' + colorScheme[0] + '-500 shadow-lg shadow-' + colorScheme[0] + '-500/50 hover:shadow-3xl'">

                      <img v-if="item.itemType == 'Accessory'" class="pulsingFilter object-contain"
                        :src="'./Resources/AccessoryIcon.png'" />
                      <img v-if="item.itemType == 'Armor'" class="pulsingFilter object-contain"
                        :src="'./Resources/ArmorIcon.png'" />
                      <img v-if="item.itemType == 'Weapon'" class="pulsingFilter object-contain"
                        :src="'./Resources/' + item.icon + 'Icon.png'" />

                      <!-- <img class="pulsingFilter object-contain" :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->
                    </div>
                    <div class="h-1/3 flex flex-row gap-2 justify-center p-1">
                      <div @click="equip(item, activeDemon); DataMaster.autoSave();"
                        :class="'bg-' + colorScheme[0] +  '-900 ring-1 ring w-1/2 aspect-square rounded ring-2 ring-' + colorScheme[0] + '-500'">
                        <img class="pulsingFilter" :src="'./Resources/TwirlArrowIcon.png'" />
                        <!-- <img class="pulsingFilter" :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->
                      </div>
                      <div
                        @click="prettify.modal = true; prettify.editingEquipment = item; prettify.modalTab='editEquipment';"
                        :class="'bg-' + colorScheme[0] +  '-900 ring-1 ring w-1/2 aspect-square rounded tooltip ring-2 ring-' + colorScheme[0] + '-500'">
                        <img class="pulsingFilter " :src="'./Resources/EditIcon.png'" />
                        <!-- <img class="pulsingFilter " :src="'https://rokthereaper.com/wp-content/uploads/2016/05/chie_satonaka_sketch_by_kr0npr1nz-d7t1wby.jpg'" /> -->
                        <span class="tooltiptext">Edit</span>
                      </div>
                    </div>
                  </div>

                  <!-- Info -->
                  <div class="flex flex-col gap-2 p-1 h-32 overflow-hidden w-2/3">
                    <div :class="'bg-' + colorScheme[3] + '-400 p-[1.5px] clippedCorner'">
                      <p
                        :class="'clippedCorner bg-' + colorScheme[1] + '-950 flex-1 text-white font-bold text-lg p-[1px] truncate h-8'">
                        {{item.name + ' (' + item.grade + ')' }}
                      </p>
                    </div>


                    <div
                      :class="'flex flex-col h-32 overflow-y-auto overscroll-contain clippedCorner p-[1.5px] bg-' + colorScheme[5] + '-400'">
                      <!-- <label for="IconBox" class="border-b-22 border-indigo-500 font-bold text-white">Description:</label> -->
                      <p
                        :class="'h-full bg-' + colorScheme[1] + '-950 text-white p-1 rounded clippedCorner ring-1  overflow-y-auto'">
                        {{item.description}}
                      </p>
                    </div>
                  </div>

                  <div v-if="item.equipped"
                    class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                    <span class="text-yellow-300 text-xl font-bold textOutlineBlack text-center w-full px-2 italic">
                      Equipped by {{ item.equipper }}
                    </span>
                  </div>


                </div>

              </div>

              <div class="w-1/4 p-2">
                <div @click="prettify.editingEquipment = null; prettify.modal = true; prettify.modalTab='newEquipment';" :class="'h-full w-full relative bg-gray-900 rounded-2xl flex overflow-hidden flex-row items-center gap-4 ring-2 ring-' + colorScheme[0] + '-500 p-2 justify-center'">
                  <p class="text-xl font-bold bg-gray-800 p-2 rounded-full ring-1">New Equipment</p>
                </div>
              </div>

            </div>
            <div class=" w-3/4 mx-auto h-full flex flex-row items-center justify-center">

              <!-- Back Arrow -->
              <div
                @click="prettify.filterEquipmentPage--; prettify.filterEquipmentPage=Math.max(0, prettify.filterEquipmentPage)"
                v-if="prettify.filterEquipment(equipmentList).length > 15"
                class="h-full w-1/4 flex p-1 items-center justify-center rounded-xl text-white rotate-180"
                :class="prettify.filterEquipmentPage > 0 ? 'bg-' + colorScheme[0] + '-900 hover:bg-' + colorScheme[0] + '-500' : 'bg-gray-500/50'">
                ➤ </div>



              <p class="text-3xl w-1/4 text-center mx-5 my-2 p-2"
                :class="'bg-gray-900 rounded-2xl ring-2 ring-' + colorScheme[0] + '-500'"
                v-if="prettify.filterEquipment(equipmentList).length > 15">
                {{prettify.filterEquipmentPage+1}}/{{Math.ceil(prettify.filterEquipment(equipmentList).length/15)}}</p>

              <!-- Forward Arrow -->
              <div
                @click="prettify.filterEquipmentPage++; prettify.filterEquipmentPage = Math.min(prettify.filterEquipmentPage, Math.ceil(prettify.filterEquipment(equipmentList).length/15)-1);"
                v-if="prettify.filterEquipment(equipmentList).length > 15"
                class="h-full w-1/4 flex p-1 items-center justify-center rounded-xl text-white"
                :class="prettify.filterEquipmentPage < Math.ceil(prettify.filterEquipment(equipmentList).length/15)-1 ? 'bg-' + colorScheme[0] + '-900 hover:bg-' + colorScheme[0] + '-500' : 'bg-gray-500/50' ">
                ➤</div>
            </div>



          </div>
        </div>
      </div>
    </div>
  </div>

</template>




<script>
  // import { activeDemon, demonList } from "./composables/Data.js";
  // import { getAD } from "../composables/Data.js";

  export default {
    inject: ['activeDemon', 'prettify', 'DataMaster', 'colorScheme'],
    props: {
      equipmentList: Array,
      equip: Function
    },

  }

</script>