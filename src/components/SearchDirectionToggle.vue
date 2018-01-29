<template>
  <div>
    <input type="button" name="search-direction" value="switch cities" @click="$emit('change')">
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class SearchDirectionToggleComponent extends Vue {
}
</script>

<style>
</style>
