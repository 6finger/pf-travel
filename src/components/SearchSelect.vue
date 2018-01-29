<template>
  <div>
    From: <input v-model.trim="value" type="text">
    <div class="matches">
      <div v-for="match in matches" :key="match" @click="selectMatch(match)" class="match">
        {{match}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { DealType } from "../types";
import * as Fuse from 'fuse.js';

@Component
export default class SearchSelectComponent extends Vue {
  @Prop() value: string;
  @Prop() options: string[];

  @Watch('value')
  onPropertyChanged(value: string, oldValue: string) {
    this.$emit('input', value);
    // this.findMatches();
  }

  selectMatch(match: string) {
    this.value = match;
  }

  get matches(): string[] {
    var settings = {
      shouldSort: true,
      findAllMatches: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1
    };
    var fuse = new Fuse(this.options, settings);
    return fuse.search<number>(this.value).map((i: number) => {
      return this.options[i];
    });
  }


findMatches() {
    // _.debounce(() => {
    //   
    // }, 500);
    
  }
}
</script>

<style>
.greeting {
  font-size: 20px;
}
</style>
