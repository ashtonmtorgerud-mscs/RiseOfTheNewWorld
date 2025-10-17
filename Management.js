const { createApp, ref } = Vue;
document.addEventListener('DOMContentLoaded', () => {
    createApp({
        setup() {

            let mouse = ref({
                x: 0,
                y: 0
            });

            window.addEventListener("mousemove", (e) => {
                mouse.value.x = e.clientX;
                mouse.value.y = e.clientY;
            });
            window.addEventListener("mouseup", (e) => {
                containers.value.map (container => { container.resizing = false; container.moving = false;})
            });


            let page = ref(1);
            let selectedContainer = null;
            let containers = ref([]);
            let camera = ref({
                pos: [0,0],
                zoom: 1

            })

            class Container{
                constructor(iName){
                    this.name = iName;
                    this.packed = false;
                    this.pos = [500,500];
                    this.size = [500, 100];
                    this.posOffset = [0, 0];
                    this.items = [];
                    this.moving = false;
                    this.resizing = false;

                    this.Pickup = () => {
                        this.posOffset[0] = this.pos[0] - mouse.value.x;
                        this.posOffset[1] = this.pos[1] - mouse.value.y;
                        this.moving = true;
                    }

                    this.getX = () => {
                        if (this.moving){
                            this.pos[0] = mouse.value.x+this.posOffset[0];
                            return mouse.value.x+this.posOffset[0];
                        }
                        return (this.pos[0] - window.innerWidth*0.00000055)*camera.value.zoom;
                    }

                    this.getY = () => {
                        if (this.moving){
                            this.pos[1] = mouse.value.y+this.posOffset[1];
                            return mouse.value.y+this.posOffset[1];
                        }
                        return (this.pos[1] + window.innerHeight*0.00000045)*camera.value.zoom;
                    }

                    this.getWidth = () => {
                        if (this.resizing){
                            this.size[0] = mouse.value.x - this.getX() + 15;
                        }
                        return this.size[0];
                    }

                    this.getHeight = () => {
                        if (this.resizing){
                            this.size[1] = mouse.value.y - this.getY() + 15;
                        }
                        return this.size[1];
                    }

                    this.PackItem = () => { 
                        this.items.push(new Item({}));
                    }


                }
            }

            class Item{
                constructor({iName="Name", iCount=1, iDescription="", iWeight=0}){
                    this.name = iName;
                    this.count = iCount;
                    this.description = iDescription;
                    this.weight = iWeight;
                    this.editing = true;
                }
            }

            containers.value.push(new Container("Cont1"));
            containers.value.push(new Container("Cont2"));
            containers.value[0].items.push(new Item({iName: "Boobs"}));
            console.log(containers.value[0])

         return { page, containers, camera, mouse };
        }
    }).mount('#app');
});