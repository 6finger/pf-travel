<template>
  <div>
    <label :for="id">{{label}}:</label>
    <input v-model.trim="value" type="text" :id="id">
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
  @Prop() label: string;

  @Watch('value')
  onPropertyChanged(value: string, oldValue: string) {
    this.$emit('input', value);
  }

  selectMatch(match: string) {
    this.value = match;
  }

  get id() {
    return this.label.toLowerCase();
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

}
</script>

<style>
.greeting {
  font-size: 20px;
}
</style>
