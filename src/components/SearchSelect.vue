<template>
  <div v-click-outside="close" :class="{error: errorMessage}">
    <label :for="id" class="label">{{label}}</label>
    <div class="form-collapse">
      <div :class="{error: errorMessage}" class="input item item-main">
        <input v-model.trim="searchText" type="text" :id="id" @input="open" @focus="open" ref="searchInput" placeholder="Please enter a city" class="input full-width">
      </div>
      <button @click="clear" class="item button" :class="{'button-red': errorMessage, 'button-primary': !errorMessage}">
        <i v-if="!searchText" class="fa fa-chevron-down fa-lg"></i>
        <i v-if="searchText" class="fa fa-close fa-lg"></i>
      </button>
    </div>
    <p v-if="errorMessage" class="text-error text-small">{{errorMessage}}</p>

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

  searchText: string = this.value;  
  opened: boolean = false;
  history: string[] = [];
  fuzzySearch: FuzzySearch = new FuzzySearch();

  @Watch('value')
  onValueChanged(newValue: string) {
    this.searchText = newValue;
  }

  @Watch('searchText')
  onPropertyChanged(newValue: string) {
    this.$emit('input', newValue);
  }
  
  get lastMatches(): string[] {
    return this.history.filter(filterDisctinct).slice(0, 3);
  }
  
  get showLastMatches(): boolean {
    return !this.searchText && (!this.matches || !this.matches.length) && !!this.lastMatches.length;
  }
  
  get showNoMatches(): boolean {
    return !!this.searchText && (!this.matches || !this.matches.length);
  }
  
  addToHistory(match: string) {
    this.history.unshift(match);
  }

  selectMatch(match: string) {
    this.searchText = match;
    this.addToHistory(match);
    this.close();
  }

  clear() {
    this.searchText = '';
    (<any>this).$refs.searchInput.focus();
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
    return this.fuzzySearch.getMatches(this.options, this.searchText);
  }

}
</script>

<style>
.hidden {
  display: none !important;
}
</style>
