<template>
  <div>
    <input v-model="searchMode" type="radio" name="search-mode" id="price" value="price">
    <label for="price">Cheapest</label>
    <input v-model="searchMode" type="radio" name="search-mode" id="time" value="time">
    <label for="time">Fastest</label>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { SearchModeType } from "../types";

@Component
export default class SearchModeToggleComponent extends Vue {
  @Prop() value: SearchModeType;
  searchMode: SearchModeType = this.value;

  @Watch('searchMode')
  onSearchModeChanged(newValue: SearchModeType) {
    this.$emit('input', newValue);
  }

}
</script>

<style>
</style>
