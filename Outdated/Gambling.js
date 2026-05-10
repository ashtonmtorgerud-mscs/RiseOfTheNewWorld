const { createApp, ref } = Vue;
document.addEventListener('DOMContentLoaded', () => {
    createApp({
        setup() {

            let page = ref(-1);
            skillsList = ref([]);
            filteredSkills = ref([]);
            selectedSkillNumber = ref(0);
            

            fetch("Resources/skills.json").then(response => response.json()).then(data => {
                    
                // let skillData = data.find();
                    skillsList.value.push(data);
                    filterSkills(0);
                    console.log(data);            
                    }).catch(error => {
                    console.error('Error fetching skill data:', error);
                }
            );


            filterSkills = (num) => {
                console.log("num is " + num)
                filteredSkills.value = skillsList.value[0].filter(skill => skill.skillType == num);
                if (num == 16) {
                    filteredSkills.value = skillsList.value[0].filter(skill => skill.skillType == 0);
                }
                if (num == 0){
                    filteredSkills.value = skillsList.value[0];
                }
                // filteredSkills.value = skillsList.value;
                // console.log("filteredSkills.value: ")
                // console.log(filteredSkills.value)
            }



         return { page, skillsList, filteredSkills, filterSkills, selectedSkillNumber };
        }
    }).mount('#app');
});