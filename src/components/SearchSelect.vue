<template>
  <div v-click-outside="close" :class="{error: errorMessage}">
    <label :for="id">{{label}}:</label>
    <div v-if="errorMessage">
      {{errorMessage}}
    </div>
    <input v-model.trim="value" type="text" :id="id" @input="open" @focus="open">
    <input type="button" value="Clear" @click="value = ''"/>
    <div :class="{hidden: !isOpen}" class="matches">
      <small v-if="showNoMatches" class="match">no matches</small>
      <small v-if="showLastMatches" class="match">recently selected</small>
      <div v-if="showLastMatches" v-for="match in lastMatches" :key="match" @click="selectMatch(match)" class="match">
        {{match}}
      </div>
      <div v-for="match in matches" :key="match" @click="selectMatch(match)" class="match">
        {{match}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { filterDisctinct } from '../helpers/filter';
import { FuzzySearch } from '../helpers/fuzzySearch';

@Component
export default class SearchSelectComponent extends Vue {
  @Prop() value: string;
  @Prop() options: string[];
  @Prop() label: string;
  @Prop() errorMessage: string;
  opened: boolean = false;
  history: string[] = [];
  fuzzySearch: FuzzySearch = new FuzzySearch();

  @Watch('value')
  onPropertyChanged(value: string, oldValue: string) {
    this.$emit('input', value);
  }
  
  get lastMatches(): string[] {
    return this.history.filter(filterDisctinct).slice(0, 3);
  }
  
  get showLastMatches(): boolean {
    return !this.value && (!this.matches || !this.matches.length) && !!this.lastMatches.length;
  }
  
  get showNoMatches(): boolean {
    return !!this.value && (!this.matches || !this.matches.length);
  }
  
  addToHistory(match: string) {
    this.history.unshift(match);
  }

  selectMatch(match: string) {
    this.value = match;
    this.addToHistory(match);
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
  
  get matches(): string[] {
    return this.fuzzySearch.getMatches(this.options, this.value);
  }

}
</script>

<style>
.hidden {
  display: none !important;
}
</style>
