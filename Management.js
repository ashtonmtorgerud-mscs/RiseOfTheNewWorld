const { createApp, ref } = Vue;
document.addEventListener('DOMContentLoaded', () => {
    createApp({
        setup() {
            const mouse = ref({ x: 0, y: 0 });
            const camera = ref({ pos: [0,0], zoom: 1 });
            const containers = ref([]);
            const page = ref(1);
            const selectedContainer = ref(null);
            let selectedIndex = ref(-1);

            // Live getters — these are called EVERY render
            const getMouse = () => mouse.value;
            const getCamera = () => camera.value;

            window.addEventListener("mousemove", (e) => {
                mouse.value.x = e.clientX;
                mouse.value.y = e.clientY;
            });

            window.addEventListener("mouseup", () => {
                containers.value.forEach(c => {
                    c.moving = false;
                    c.resizing = false;
                    c.movingDivider = false;
                    if (c.packing){
                        c.packed = false; //WORK ON THIS FIRST
                    }
                    
                });

                if (selectedIndex.value != -1){
                    const m = getMouse();  // ← LIVE MOUSE
                    containers.value[selectedIndex.value].pos = [m.x, m.y];
                    selectedIndex.value = -1;
                }
            });

            class Container {
                constructor(iName) {
                    this.name = iName;
                    this.packing = false;
                    this.packed = false;
                    this.pos = [300, 200];
                    this.size = [400, 300];
                    this.posOffset = [0, 0];
                    this.items = [];
                    this.slots = [];
                    this.vehicleDivider = this.size[0] / 2;
                    this.moving = false;
                    this.resizing = false;
                    this.movingDivider = false;
                }

                Pickup() {
                    const m = getMouse();  // ← LIVE MOUSE
                    this.posOffset[0] = this.pos[0] - m.x;
                    this.posOffset[1] = this.pos[1] - m.y;
                    this.moving = true;
                }

                getX() {
                    const m = getMouse();
                    const cam = getCamera();
                    if (this.moving) {
                        this.pos[0] = m.x + this.posOffset[0];
                        return this.pos[0];
                    }
                    return this.pos[0] * cam.zoom;
                }

                getY() {
                    const m = getMouse();
                    const cam = getCamera();
                    if (this.moving) {
                        this.pos[1] = m.y + this.posOffset[1];
                        return this.pos[1];
                    }
                    return this.pos[1] * cam.zoom;
                }

                getWidth() {
                    const m = getMouse();
                    if (this.resizing) {
                        this.size[0] = Math.max(100, m.x - this.getX() + 15);
                    }
                    if (this.vehicleDivider > this.size[0]) {
                        this.vehicleDivider = Math.max(98, this.size[0] - 2);
                    }
                    return this.size[0];
                }

                getHeight() {
                    const m = getMouse();
                    if (this.resizing) {
                        this.size[1] = Math.max(80, m.y - this.getY() + 15);
                    }
                    return this.size[1];
                }

                vDividerFunction() {
                    const m = getMouse();
                    if (this.movingDivider) {
                        this.vehicleDivider = Math.max(80, Math.min(m.x - this.getX(), this.size[0] - 80));
                    }
                    return this.vehicleDivider;
                }

                totalWeight() {
                    let tWeight = 0;
                    this.items.forEach(item => {
                        tWeight += (item.weight || 0) * (item.count || 0);
                    });
                    this.slots.forEach(slot => {
                        if (slot) tWeight += parseFloat(slot.totalWeight() || 0);
                    });
                    return tWeight;
                }

                PackItem() {
                    this.items.push(new Item({}));
                }
            }

            class Item {
                constructor({ iName = "Name", iCount = 1, iWeight = 0 } = {}) {
                    this.name = iName;
                    this.count = iCount;
                    this.weight = iWeight;
                    this.editing = true;
                }
            }

            // Create containers
            containers.value.push(new Container("Cont1"));
            containers.value.push(new Container("Cont2"));
            containers.value[0].items.push(new Item({ iName: "Ladder" }));
            containers.value[1].slots = [null, null];

            return { page, containers, camera, mouse, selectedContainer, selectedIndex };
        }
    }).mount('#app');
});