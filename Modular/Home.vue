<template>


  <div class="w-4/4 h-[6.666667%]" >
    <div class="w-full h-full flex gap-2 flex-col">
      <div class="w-full h-full">
        <div class="h-full flex gap-2 p-1">
            <!-- href="../Home.html" -->
          <div
            :class="'rounded-xl bg-gray-800 h-full w-2/6 box-shadow ring-2 align-middle flex items-center justify-center chaos ring-' + colorScheme[0] + '-500'">
            <a>
              <p class="text-white font-bold text-center text-2xl align-middle truncate"   >Rise of the New
                World
                <span class="text-xs">v 1.2.6</span>
              </p>
            </a>
          </div>
          <div @click="prettify.activePage = 'Sheet'" 
            :class="'hoverPop rounded-xl bg-gray-800 h-full w-1/6 box-shadow ring-2 align-middle flex items-center justify-center chaos ring-' + colorScheme[0] + '-500'">
            <img :src="'../Resources/SheetIcon.png'" class="h-full aspect-square object-cover p-1 pixel-art" alt="">
            <p class="text-white font-bold text-center text-3xl align-middle">Sheet</p>
          </div>
          <div @click="prettify.activePage = 'Demons'"
            :class="'hoverPop rounded-xl bg-gray-800 h-full w-1/6 box-shadow ring-2 align-middle flex items-center justify-center chaos ring-' + colorScheme[0] + '-500'">
            <img :src="'../Resources/DemonIcon.png'" class="h-full aspect-square object-cover p-2 pixel-art" alt="">
            <p class="text-white font-bold text-center text-3xl align-middle">Demons</p>
          </div>
          <div @click="prettify.activePage = 'Gear'"
            :class="'hoverPop rounded-xl bg-gray-800 h-full w-1/6 box-shadow ring-2 align-middle flex items-center justify-center chaos ring-' + colorScheme[0] + '-500'">
            <img :src="'../Resources/ArmyIcon.png'" class="h-full aspect-square object-cover p-2 pixel-art" alt="">
            <p class="text-white font-bold text-center text-3xl align-middle">Gear</p>
          </div>
          <div @click="prettify.activePage = 'Editor'"
            :class="'hoverPop rounded-xl bg-gray-800 h-full w-1/6 box-shadow ring-2 align-middle flex items-center justify-center chaos ring-' + colorScheme[0] + '-500'">
            <img :src="'../Resources/EditIcon.png'" class="h-full aspect-square object-cover p-2 pixel-art" alt="">
            <p class="text-white font-bold text-center text-3xl align-middle">Edit</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




<script>
export default {

  inject:['prettify', 'colorScheme'],

  props: {
    activePage: String
  },

  emits: ['update:activePage'],

  methods: {
    changePage(newPage) {
      this.$emit('update:activePage', newPage);   // ← Send the change back up
    }
  }
}
</script>