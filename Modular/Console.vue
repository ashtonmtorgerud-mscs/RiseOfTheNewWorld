<template>
<div class="h-full w-1/4 p-1">
        <div
            :class="'bg-gray-800 rounded-xl box-shadow ring-2 ring-' + colorScheme[0] + '-500 flex flex-col items-center justify-center h-full w-full text-white font-semibold'">
            <div id="messageLog" class="w-full overflow-y-scroll  rounded-xl" style="height: 90%;">
                <div>
                    <div v-for="(l, index) in prettify.log" :key="index" class="text-white break-all p-1"
                        :class="index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'">
                        <p class="text-lg select-text whitespace-pre-wrap">{{ l }}</p>
                    </div>
                </div>
            </div>
            <div :class="'bg-blue-100 w-full flex flex-row rounded-b-xl border-t-4 border-' + colorScheme[0] + '-500'"
                style="height: 10%;">
                <textarea v-model="prettify.messageInput" @keydown.enter.prevent="if (prettify.messageInput != '') {sendMessage(prettify.messageInput); prettify.messageInput = '';}" maxlength="500"
                    :class="'w-5/6 bg-blue-950 resize-none text-emerald-400 rounded-bl-xl border-r-2 border-' + colorScheme[0] + '-500 px-1'"
                    name="" id="" placeholder="Write /help for a list of commands"></textarea>
                <button @click="if (prettify.messageInput != '') {sendMessage(prettify.messageInput); prettify.messageInput = '';}"
                    :class="'w-1/6 bg-' + colorScheme[0] + '-700 hover:bg-indigo-800 text-4xl text-white font-bold py-2 px-4 rounded-br-xl textOutlineBlackThin'">
                    ➣ </button>
            </div>
        </div>
    </div>
</template>




<script>

    export default {

        inject: ['prettify', 'DataMaster', 'colorScheme'],


        props: {
            sendMessage: Function
        },

        

        emits: ['update:activePage'],

        methods: {
            changePage(newPage) {
                this.$emit('update:activePage', newPage);
            }
        }
    }
    
</script>