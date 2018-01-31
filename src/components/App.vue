<template>
  <main>

    <section>
      <div class="container-small text-center">
        <h1 class="text-huge">Trip Sorter</h1>
      </div>
    </section>

    <section :class="{hidden: !isEditing}" class="background-dark mid-section">
      <div class="container-small">
        <search-select-component v-model="cityFrom" :options="departures" :errorMessage="cityFromErrorMessage" label="From" @input="!valid && validate()"/>
        <search-select-component v-model="cityTo" :options="arrivals" :errorMessage="cityToErrorMessage" label="To" @input="!valid && validate()"/>
        <search-mode-toggle-component v-model="searchMode"/>
        <div class="row compact">
          <div class="col-xs-6">
            <button @click="search" class="button button-block button-primary">
              <i class="fa fa-search fa-lg"></i>
              &nbsp;Search
            </button>
          </div>
          <div class="col-xs-6">
            <button @click="changeDirection" class="button button-block button-outlined">
              <i class="fa fa-retweet fa-lg"></i>
              &nbsp;Switch
            </button>
          </div>
        </div>
      </div>
    </section>

    <section :class="{hidden: isEditing}" class="background-dark mid-section">
      <div class="container-small">
        <search-results-component :results="searchResults" :currency="currency" />
        <div class="row">
          <div class="col-xs-12">
            <button @click="reset" class="button button-block button-primary">
              <i class="fa fa-refresh fa-lg"></i>
              &nbsp;Search again
            </button>
          </div>
        </div>
      </div>
    </section>

  </main>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import SearchSelectComponent from "./SearchSelect.vue";
import SearchModeToggleComponent from "./SearchModeToggle.vue";
import SearchResultsComponent from "./SearchResults.vue";
import { ResponseType, DealType, SearchModeType } from "../types";
import { getDealPrice, getDealTime } from '../helpers/format';
import { filterDisctinct } from '../helpers/filter';
import { findTrip } from '../helpers/pathfinding';
import data from '../response.json';

@Component({
  components: {
    SearchSelectComponent,
    SearchModeToggleComponent,
    SearchResultsComponent
  }
})
export default class AppComponent extends Vue {
  @Prop() cityFrom: string = '';
  @Prop() cityTo: string = '';
  @Prop() searchMode: SearchModeType = SearchModeType.Price;
  
  get deals(): DealType[] { return (<ResponseType>data).deals; }
  get currency(): string { return (<ResponseType>data).currency; }
  get departures(): string[] { return this.getDistinctCitiesFromDeals('departure'); } 
  get arrivals(): string[]  { return this.getDistinctCitiesFromDeals('arrival'); }
  editing: boolean = true;
  cityFromErrorMessage: string = '';
  cityToErrorMessage: string = '';
 
  getDistinctCitiesFromDeals(propertyName: string): string[] {
    return this.deals.map((deal: DealType) => {
      return (<any>deal)[propertyName];
    }).filter(filterDisctinct).sort();
  }
  
  changeDirection() {
    let from = this.cityFrom;
    this.cityFrom = this.cityTo;
    this.cityTo = from;
  }

  get isEditing(): boolean {
    return this.editing;
  }

  get valid(): boolean {
    return !this.cityFromErrorMessage && !this.cityToErrorMessage;
  }
  
  validate() {
    this.cityFromErrorMessage =
      !this.cityFrom ? 'error - required' :
      this.departures.indexOf(this.cityFrom) == -1 ? 'error - unknown city' :
      '';
    this.cityToErrorMessage =
      !this.cityTo ? 'error - required' :
      this.arrivals.indexOf(this.cityTo) == -1 ? 'error - unknown city' :
      !this.cityFromErrorMessage && this.cityFrom === this.cityTo ? 'error - same cities' :
      '';
    
    return this.valid;
  }
  
  search() {
    if (this.validate()) {
      this.editing = false;
    }
  }

  reset() {
    this.editing = true;
  }
  
  get searchResults(): DealType[] {
    return this.editing ? [] : findTrip(this.deals, this.cityFrom, this.cityTo, this.searchMode);
  }
  
}

</script>

<style lang="scss">
@import '~sierra-library';

.hidden {
  display: none !important;
}
label.label {
  margin-bottom: 0.2em;
}
.text-huge {
  margin-bottom: 0.6em;
}
.mid-section {
  padding: 1em 0;
}
.button-block {
  width: 100%;
}
.text-error {
  margin-top: 0;
}
.error .form-collapse {
  margin-bottom: 0.2em;
}
.button {
  border-radius: 3px;
}
.row.compact *[class^='col']:not(:first-child) {
  padding-left: 7px;
}
.row.compact *[class^='col']:not(:last-child) {
  padding-right: 7px;
}

</style>
