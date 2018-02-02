<template>
  <div v-click-outside="close" :class="{error: errorMessage, 'show-items': showItems}">

    <label :for="id" class="label">{{label}}</label>
    
    <div class="form-collapse">
    
      <div :class="{error: errorMessage}" class="input item item-main">
        <input v-model.trim="searchText" type="text" :id="id" @input="open" @focus="open" ref="searchInput" placeholder="Please enter a city" class="input full-width">
      </div>
      
      <div v-if="showItems" class="matches border-right border-left border-bottom">
        <div v-if="showNoMatches" class="select-item border-bottom text-gray">No matches found</div>
        <div v-if="showLastMatches" class="select-item border-bottom text-gray">Recently selected</div>
        <div v-if="showLastMatches" v-for="match in lastMatches" :key="match+'-recent'" @click="selectMatch(match)" class="select-item border-bottom match">
          {{match}}
        </div>
        <div v-if="showAll && showLastMatches" class="select-item border-bottom text-gray">All cities</div>
        <div v-for="match in matches" :key="match" @click="selectMatch(match)" class="select-item border-bottom match">
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
    return this.options.indexOf(this.searchText) != -1;
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
    return this.searchText ? this.fuzzySearch.getMatches(this.options, this.searchText) : this.options;
  }

}
</script>

<style lang="scss">
.item.button {
  width: 3.3em;
  padding: 10px 15px;
}
label.label {
  font-size: 14px;
  margin-bottom: 0.2em;
}
.text-error {
  margin-top: 0;
}
.error .form-collapse {
  margin-bottom: 0.2em;
}
.matches {
  border-radius: 0 0 3px 3px;
  position: absolute;
  top: 100%;
  z-index: 10;
  left: 0;
  right: 0;
  &::after {
    content: '';
    height: 1em;
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    box-shadow: inset 0 6px 5px -4px rgba(0, 0, 0, 0.4);
  }
}
.select-item:last-child {
  border-bottom: none;
}
.select-item {
  padding: 5px 10px;
  background-color: #34495e;
}
.select-item.text-gray {
  background-color: #2b3d4e;
}
.select-item.match {
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;
  &:hover, &:focus {
    background-color: #46637f;
  }
}
.form-collapse {
  position: relative;
}
.show-items .form-collapse {
  box-shadow: 0 0 10px 3px rgba(0,0,0,0.4);
  .item:first-child {
    border-bottom-left-radius: 0;
  }
  .item:last-child {
    border-bottom-right-radius: 0;
  }
}

</style>
