<template>
    <v-card>
        <v-card-title class="d-flex justify-space-between">
            {{ props.characterName }}
            <v-btn
                icon="mdi-refresh"
                color="primary"
                variant="outlined"
                density="compact"
                :loading="appStore.loading[props.characterName]"
                @click="appStore.fetchCharacter(props.characterName)"
            ></v-btn>
        </v-card-title>

        <v-card-text v-if="!appStore.loading[props.characterName]">
            <v-divider class="my-2" />
            <v-row>
                <v-col>
                    <v-icon>mdi-arrow-up-bold</v-icon>
                    {{ characterData.character.data.level }}
                    <div
                        class="d-flex justify-center"
                        :style="{
                            border: '1px solid white',
                            borderRadius: '3px',
                            position: 'relative',
                            overflow: 'hidden',
                            height: '10px',
                        }"
                    >
                        <div
                            :style="{
                                position: 'absolute',
                                left: '0',
                                right: '0',
                                height: '100%',
                                width: `${
                                    (characterData.character.data.xp /
                                        characterData.character.data.max_xp) *
                                    100
                                }%`,
                                backgroundColor: 'lightgreen',
                            }"
                        ></div>
                    </div>
                </v-col>
                <v-col>
                    <v-icon>mdi-heart</v-icon>
                    {{ characterData.character.data.hp }}/{{
                        characterData.character.data.max_hp
                    }}
                    <div
                        class="d-flex justify-center"
                        :style="{
                            border: '1px solid white',
                            borderRadius: '3px',
                            position: 'relative',
                            overflow: 'hidden',
                            height: '10px',
                        }"
                    >
                        <div
                            :style="{
                                position: 'absolute',
                                left: '0',
                                right: '0',
                                height: '100%',
                                width: `${
                                    (characterData.character.data.hp /
                                        characterData.character.data.max_hp) *
                                    100
                                }%`,
                                backgroundColor: 'red',
                            }"
                        ></div>
                    </div>
                </v-col>
                <v-col>
                    <v-icon>mdi-map-marker</v-icon>
                    {{ characterData.currentMap.data.name }}
                    <span v-if="characterData.currentMap.data.content">
                        -{{ characterData.currentMap.data.content.code }}
                    </span>
                </v-col>
            </v-row>
            <v-row v-if="characterData.character.data.task">
                <v-col>
                    {{ characterData.character.data.task }}
                </v-col>
                <v-col>
                    <div
                        class="d-flex justify-center"
                        :style="{
                            border: '1px solid white',
                            borderRadius: '3px',
                            position: 'relative',
                            overflow: 'hidden',
                            height: '10px',
                        }"
                    >
                        <div
                            :style="{
                                position: 'absolute',
                                left: '0',
                                right: '0',
                                height: '100%',
                                width: `${
                                    (characterData.character.data
                                        .task_progress /
                                        characterData.character.data
                                            .task_total) *
                                    100
                                }%`,
                                backgroundColor: 'lightgreen',
                            }"
                        ></div>
                    </div>
                </v-col>
                <v-col>
                    {{ characterData.character.data.task_progress }}/{{
                        characterData.character.data.task_total
                    }}
                </v-col>
            </v-row>
            <v-divider class="my-2" />
            <div>
                <span class="font-weight-bold">Last action: </span>
                {{ characterData.lastState?.state }}
            </div>
            <div>
                <div class="d-flex align-center justify-space-between">
                    <div class="font-weight-bold">Upcoming:</div>
                    <v-btn
                        icon="mdi-delete"
                        color="red"
                        rounded="sm"
                        density="compact"
                        @click="appStore.clearCharacterQueue(characterName)"
                    ></v-btn>
                </div>
                <div
                    v-for="(task, index) in characterData.upcomingActions"
                    class="pl-5"
                    :key="index"
                >
                    <v-row>
                        <v-col>
                            {{ task.state }}
                        </v-col>
                        <v-col>
                            {{ task.x || task.code || task.repeat }}
                        </v-col>
                        <v-col>
                            {{ task.y || task.quantity }}
                        </v-col>
                    </v-row>
                </div>
            </div>
            <v-divider class="my-3" />

            <div class="d-flex align-center">
                <div class="font-weight-bold mr-1">Default action:</div>
                <v-select
                    :items="actions.map((items) => items.name)"
                    @update:model-value="defaultStateChanged = true"
                    v-model="selectedDefaultState"
                    hide-details
                    variant="outlined"
                    density="compact"
                ></v-select>
                <v-btn
                    class="ml-2"
                    icon="mdi-check"
                    rounded="sm"
                    density="compact"
                    color="light-green"
                    v-if="defaultStateChanged"
                    @click="handleDefaultStateSubmit"
                    :loading="defaultActionLoading"
                ></v-btn>
            </div>
            <v-row class="mt-2">
                <v-col>
                    <v-dialog max-width="500">
                        <template #activator="{ props: activatorProps }">
                            <v-btn
                                class="w-100"
                                color="primary"
                                v-bind="activatorProps"
                            >
                                Add Actions
                            </v-btn>
                        </template>

                        <template #default="{ isActive }">
                            <AddActionsForm
                                :close="() => (isActive.value = false)"
                                :character-name="characterName"
                            />
                        </template>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { PropType } from "vue";
import AddActionsForm from "./AddActionsForm.vue";

const props = defineProps({
    characterName: {
        type: String as PropType<"Bobby" | "Stuart" | "George" | "Tim" | "Joe">,
        required: true,
    },
});

const appStore = useAppStore();
appStore.fetchCharacter(props.characterName);

const selectedDefaultState = ref(undefined as undefined | string);
const defaultStateChanged = ref(false as boolean);
const defaultActionLoading = ref(false as boolean);

const characterData = computed(() => {
    return appStore.characters[props.characterName];
});

watch(
    () => appStore.characters[props.characterName].defaultState,
    (newVal) => {
        selectedDefaultState.value = newVal.state;
    }
);

const actions = [
    { name: "idle", parameters: ["repeat"] },
    { name: "move", parameters: ["x", "y", "repeat"] },
    { name: "attack", parameters: ["repeat"] },
    { name: "rest", parameters: ["repeat"] },
    { name: "collect", parameters: ["repeat"] },
    { name: "craft", parameters: ["code", "quantity", "repeat"] },
    { name: "recycle", parameters: ["code", "quantity", "repeat"] },
    { name: "use item", parameters: ["code", "quantity", "repeat"] },
    { name: "equip", parameters: ["code", "slot", "repeat"] },
    { name: "deposit all", parameters: ["repeat"] },
    { name: "withdraw", parameters: ["code", "quantity", "repeat"] },
    { name: "autopilot", parameters: ["repeat"] },
    { name: "copy queue", parameters: ["repeat"] },
    { name: "paste queue", parameters: ["repeat"] },
];

async function handleDefaultStateSubmit() {
    if (selectedDefaultState.value) {
        defaultActionLoading.value = true;
        appStore.setDefaultAction(
            props.characterName,
            selectedDefaultState.value
        );
        defaultStateChanged.value = false;
        defaultActionLoading.value = false;
    }
}
</script>
