const { createApp, ref } = Vue;
document.addEventListener('DOMContentLoaded', () => {
    createApp({
        setup() {

            let page = ref(5);


         return { page };
        }
    }).mount('#app');
});