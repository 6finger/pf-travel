<template>
  <div v-click-outside="close">
    <label :for="id">{{label}}:</label>
    <input v-model.trim="value" type="text" :id="id" @input="open" @focus="open">
    <div class="matches" :class="{hidden: !isOpen}">
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
  opened: boolean = false;

  @Watch('value')
  onPropertyChanged(value: string, oldValue: string) {
    this.$emit('input', value);
  }

  selectMatch(match: string) {
    this.value = match;
    this.close();
  }

  close() {
    this.opened = false;
  }

  open() {
    this.opened = true;
  }

  get isOpen(): boolean {
    return this.opened;
  }

  get id() {
    return this.label.toLowerCase();
  }

  get fuse(): Fuse {
    var settings = {
      shouldSort: true,
      findAllMatches: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1
    };
    return new Fuse(this.options, settings);
  }

  get matches(): string[] {
    return this.fuse.search<number>(this.value).map((i: number) => {
      return this.options[i];
    });
  }

}
</script>

<style>
.hidden {
  display: none !important;
}
</style>
