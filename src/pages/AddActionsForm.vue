<template>
    <v-card>
        <v-card-title>
            Add actions to {{ props.characterName }}'s queue
        </v-card-title>
        <v-card-text>
            <v-select
                :items="Object.keys(presets)"
                @update:model-value="loadPreset"
                hide-details
                variant="outlined"
                density="compact"
				label="Choose preset"
            ></v-select>
            <div>
                <v-row>
                    <v-col> Start </v-col>
                </v-row>
                <div class="ml-3 pl-2" style="border-left: 1px solid white">
                    <v-row
                        v-for="(action, index) in pendingStates"
                        :key="index"
                    >
                        <v-col>
                            {{ action.state }}
                        </v-col>
                            <v-col
                                v-for="param in Object.keys(action.params ? action.params : [])"
                                :key="param"
                            >
                                {{ param }}:{{ action.params[param] }}
                            </v-col>

                    </v-row>
                    <v-row>
                        <v-col class="mb-0 pb-0">
                            <div class="font-weight-bold mr-1">
                                Add to queue:
                            </div>
                            <v-select
                                :items="Object.keys(states)"
                                hide-details
                                variant="outlined"
                                density="compact"
                                v-model="newStateType"
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <div v-if="newStateType">
                                <div
                                    v-for="(param, index) in states[
                                        newStateType
                                    ].parameters"
                                    :key="index"
                                    class="my-3"
                                >
                                    <div v-if="param.type == 'location'">
                                        <v-row>
                                            <v-col class="pt-0" col="6">
                                                <v-select
                                                    :items="
                                                        Object.keys(locations)
                                                    "
                                                    hide-details
                                                    variant="outlined"
                                                    density="compact"
                                                    v-model="parameters[index]"
                                                    label="Location"
                                                    @update:model-value="
                                                        handleChangeLocation
                                                    "
                                                ></v-select>
                                            </v-col>
                                            <v-col class="pt-0" cols="3">
                                                <v-text-field
                                                    label="x"
                                                    v-model="locationX"
                                                    variant="outlined"
                                                    hide-details
                                                    density="compact"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col class="pt-0" cols="3">
                                                <v-text-field
                                                    label="y"
                                                    v-model="locationY"
                                                    variant="outlined"
                                                    hide-details
                                                    density="compact"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </div>
                                    <div v-else-if="param.type == 'item-code'">
                                        <v-row>
                                            <v-col class="pt-0">
                                                <v-select
                                                    :items="itemCodes"
                                                    hide-details
                                                    variant="outlined"
                                                    density="compact"
                                                    v-model="parameters[index]"
                                                    label="Item Code"
                                                ></v-select>
                                            </v-col>
                                            <v-col class="pt-0">
                                                <v-text-field
                                                    label="Item Code"
                                                    v-model="parameters[index]"
                                                    variant="outlined"
                                                    hide-details
                                                    density="compact"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </div>
                                    <div v-else-if="param.type == 'slot-code'">
                                        <v-row>
                                            <v-col class="pt-0">
                                                <v-select
                                                    :items="slotCodes"
                                                    hide-details
                                                    variant="outlined"
                                                    density="compact"
                                                    v-model="parameters[index]"
                                                    label="Slot Code"
                                                ></v-select>
                                            </v-col>
                                            <v-col class="pt-0">
                                                <v-text-field
                                                    label="Slot Code"
                                                    v-model="parameters[index]"
                                                    variant="outlined"
                                                    hide-details
                                                    density="compact"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </div>
                                    <div v-else>
                                        <v-row>
                                            <v-col class="pt-0">
                                                <v-text-field
                                                    :label="param.name"
                                                    v-model="parameters[index]"
                                                    variant="outlined"
                                                    hide-details
                                                    density="compact"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </div>
                                <v-btn
                                    color="primary"
                                    prepend-icon="mdi-plus"
                                    @click="handleAddState"
                                >
                                    Add
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </div>
                <v-row>
                    <v-col>End</v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-btn
                            class="w-100"
                            color="light-green"
                            prepend-icon="mdi-check"
                            :loading="loading"
                            @click="handleActionSubmit"
                        >
                            Submit
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Close Dialog" @click="close"></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app";

const props = defineProps({
    close: {
        type: Function,
        required: true,
    },
    characterName: {
        type: String as PropType<"Bobby" | "Stuart" | "George" | "Tim" | "Joe">,
        required: true,
    },
});

const appStore = useAppStore();
const loading = ref(false as boolean);
const newStateType = ref(undefined);
const pendingStates = ref([] as any[]);

interface stateSelection {
    [key: string]: {
        parameters: {
            name: string;
            type: string;
        }[];
    };
}

const parameters = ref([undefined, undefined, undefined] as any[]);
const locationX = ref(undefined as undefined | number);
const locationY = ref(undefined as undefined | number);

const states: stateSelection = {
    idle: { parameters: [] },
    move: { parameters: [{ name: "location", type: "location" }] },
    attack: { parameters: [{ name: "repeat", type: "number" }] },
    rest: { parameters: [] },
    collect: { parameters: [{ name: "repeat", type: "number" }] },
    craft: {
        parameters: [
            { name: "code", type: "item-code" },
            { name: "quantity", type: "number" },
        ],
    },
    recycle: {
        parameters: [
            { name: "code", type: "item-code" },
            { name: "quantity", type: "number" },
        ],
    },
    "use item": {
        parameters: [
            { name: "code", type: "item-code" },
            { name: "quantity", type: "number" },
        ],
    },
    equip: {
        parameters: [
            { name: "code", type: "item-code" },
            { name: "slot", type: "slot-code" },
        ],
    },
    "deposit all": { parameters: [] },
    withdraw: {
        parameters: [
            { name: "code", type: "item-code" },
            { name: "quantity", type: "number" },
        ],
    },
    autopilot: { parameters: [] },
    "copy queue": { parameters: [] },
    "paste queue": { parameters: [] },
};

const locations: { [key: string]: { x: number; y: number } } = {
    bank: { x: 4, y: 1 },
    jewelryCrafting: { x: 1, y: 3 },
    gearCrafting: { x: 3, y: 1 },
    weaponCrafting: { x: 2, y: 1 },
    forge: { x: 1, y: 5 },
    greenSlime: { x: 0, y: -1 },
    yellowSlime: { x: 4, y: -1 },
    redSlime: { x: 1, y: -1 },
    chicken: { x: 0, y: 1 },
    copperMine: { x: 2, y: 0 },
    ironMine: { x: 1, y: 7 },
    woodcuttingWorkshop: { x: -2, y: -3 },
    custome: { x: 0, y: 0 },
};

const itemCodes = [
    "copper_ore",
    "copper",
    "copper_boots",
    "copper_helmet",
    "copper_ring",
    "copper_dagger",
    "feather",
    "copper_armor",
    "copper_legs_armor",
    "ash_wood",
    "ash_plank",
];

const slotCodes = [
    "weapon",
    "shield",
    "helmet",
    "body_armor",
    "leg_armor",
    "boots",
    "ring1",
    "ring2",
    "amulet",
    "artifact1",
    "artifact2",
    "artifact3",
    "utility1",
    "utility2",
];

const presets = {
    "Mine and Smelt Copper": [
        { state: "copy queue" },
        { state: "move", params: locations.bank },
        { state: "deposit all" },
        { state: "move", params: locations.copperMine },
        { state: "collect", params: { repeat: 8 * 12 } },
        { state: "move", params: locations.forge },
        { state: "craft", params: { code: "copper", quantity: 12 } },
        { state: "paste queue" },
    ],
};

function handleChangeLocation(newVal: string) {
    if (locations[newVal]) {
        locationX.value = locations[newVal].x;
        locationY.value = locations[newVal].y;
    }
}

function handleAddState() {
    if (newStateType.value) {
        const params: any = {};
        states[newStateType.value].parameters.forEach((param, index) => {
            // If its a location add x and y
            if (param.name === "location") {
                params.x = locationX.value;
                params.y = locationY.value;
            } else {
                // Otherwise, add the index from the parameters array
                params[param.name] = parameters.value[index];
            }
        });

        pendingStates.value.push({
            state: newStateType.value,
            params,
        });

        newStateType.value = undefined;
        parameters.value = [undefined, undefined, undefined];
    }
}

async function handleActionSubmit() {
    loading.value = true;
    for (let i = 0; i < pendingStates.value.length; i++) {
        const elem = pendingStates.value[i];
        console.log(props.characterName, elem.state, elem.params);
        await appStore.addActionToQueue(
            props.characterName,
            elem.state,
            elem.params
        );
    }
    loading.value = false;
}

function loadPreset(presentName) {
	console.log(presets[presentName])
	pendingStates.value = presets[presentName]
}
</script>
