<template>
  <v-row class="ma-5">
    <v-col cols="4">
      <CharacterCard character-name="Bobby" />
    </v-col>
    <v-col cols="4">
      <CharacterCard character-name="Stuart" />
    </v-col>
    <v-col cols="4">
      <CharacterCard character-name="George" />
    </v-col>
    <v-col cols="4">
      <CharacterCard character-name="Tim" />
    </v-col>
    <v-col cols="4">
      <CharacterCard character-name="Joe" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import CharacterCard from "./CharacterCard.vue";
</script>
