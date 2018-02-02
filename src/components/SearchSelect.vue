<template>
  <div v-click-outside="close" :class="{error: errorMessage, 'show-items': showItems}">

    <label :for="id" class="label">{{label}}</label>
    
    <div class="form-collapse pos-rel">
    
      <div :class="{error: errorMessage}" class="input item item-main">
        <input v-model.trim="searchText" type="text" :id="id" @input="open" @focus="open" ref="searchInput" placeholder="Please enter a city" class="input full-width">
      </div>
      
      <div v-if="showItems" class="matches list">
        <div v-if="showNoMatches" class="list-item heading text-gray">No matches found</div>
        <div v-if="showLastMatches" class="list-item heading text-gray">Recently selected</div>
        <div v-if="showLastMatches" v-for="match in lastMatches" :key="match+'-recent'" @click="selectMatch(match)" class="list-item action">
          {{match}}
        </div>
        <div v-if="showAll && showLastMatches" class="list-item heading text-gray">All cities</div>
        <div v-for="match in matches" :key="match" @click="selectMatch(match)" class="list-item action">
          {{match}}
        </div>
      </div>

      <button @click="onInputButtonClick" class="item button" :class="{'button-red': errorMessage, 'button-primary': !errorMessage}">
        <i v-if="!searchText && !isOpen" class="fa fa-chevron-down fa-lg"></i>
        <i v-if="!searchText && isOpen" class="fa fa-chevron-up fa-lg"></i>
        <i v-if="searchText" class="fa fa-close fa-lg"></i>
      </button>

    </div>
    
    <p v-if="errorMessage" class="text-error text-small">{{errorMessage}}</p>
  
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
  @Prop() optionsExclude: string[];
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

  get availableOptions(): string[] {
    return this.options && this.options.length ?
      this.options.filter((option) => {
        return this.optionsExclude && this.optionsExclude.indexOf(option) == -1
      }) :
      [];
  }
  
  get lastMatches(): string[] {
    return this.history.filter(filterDisctinct).slice(0, 3);
  }
  
  get showAll(): boolean {
    return !! (!this.searchText && this.hasMatches);
  }

  get showLastMatches(): boolean {
    return !! (!this.searchText && this.lastMatches.length);
  }
  
  get showNoMatches(): boolean {
    return !! (this.searchText && !this.hasPerfectMatch && !this.hasMatches);
  }

  get hasMatches(): boolean {
    return !! (this.matches && this.matches.length);
  }

  get showItems(): boolean {
    return this.isOpen && (this.showNoMatches || this.showLastMatches || this.hasMatches);
  }

  get hasPerfectMatch(): boolean {
    return this.availableOptions.indexOf(this.searchText) != -1;
  }

  onInputButtonClick() {
    !this.searchText && this.isOpen ? this.close() : this.clear();
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
    !this.isOpen ? this.open() : this.focusInput();
  }

  close() {
    this.opened = false;
  }

  open() {
    !this.isOpen && this.focusInput();
    this.opened = true;
  }

  focusInput() {
    (<any>this).$refs.searchInput.focus();
  }

  get isOpen(): boolean {
    return this.opened;
  }

  get id() {
    return this.label.toLowerCase();
  }
  
  get matches(): string[] {
    if (this.hasPerfectMatch) return [];
    return this.searchText ? this.fuzzySearch.getMatches(this.availableOptions, this.searchText) : this.availableOptions;
  }

}
</script>

<style lang="scss">

@import '../styles/variables';

@mixin drop-from-bottom {
  top: 100%;
  left: 0;
  right: 0;
  position: absolute;
}

.matches {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: none;
  @include drop-from-bottom;
  z-index: $z-index-lvl2;
  &::after {
    content: '';
    height: $margin-base;
    display: block;
    @include drop-from-bottom;
    box-shadow: inset 0 6px 5px -4px $shadow-color;
  }
}

.show-items .form-collapse {
  box-shadow: 0 0 10px 3px $shadow-color;
  .item:first-child {
    border-bottom-left-radius: 0;
  }
  .item:last-child {
    border-bottom-right-radius: 0;
  }
}

</style>
