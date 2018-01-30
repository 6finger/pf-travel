<template>
  <div>
    <h1>TripSorter</h1>
    <div :class="{hidden: !isEditing}">
      <search-select-component v-model="cityFrom" :options="departures" label="From"/>
      <search-select-component v-model="cityTo" :options="arrivals" label="To"/>
      <search-direction-toggle-component @change="changeDirection"/>
      <search-mode-toggle-component v-model="searchMode"/>
      <input type="button" value="Search" @click="search"/>
    </div>
    <div :class="{hidden: isEditing}">
      <search-results-component :results="searchResults" :currency="currency" />
      <input type="button" value="Reset" @click="reset"/>
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import SearchSelectComponent from "./SearchSelect.vue";
import SearchModeToggleComponent from "./SearchModeToggle.vue";
import SearchDirectionToggleComponent from "./SearchDirectionToggle.vue";
import SearchResultsComponent from "./SearchResults.vue";
import { ResponseType, DealType, SearchModeType } from "../types";
import { getDealPrice, getDealTime, filterDisctinct } from '../helpers';
import data from '../response.json';
import * as Graph from "node-dijkstra";

@Component({
  components: {
    SearchSelectComponent,
    SearchModeToggleComponent,
    SearchDirectionToggleComponent,
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
  dealsMap: { [key: string]: { [key: string]: DealType } };
  editing: boolean = true;
 
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

  search() {
    this.editing = false;
  }

  reset() {
    this.editing = true;
  }
  
  get path(): string[] {
    if (!this.cityFrom || !this.cityTo || this.cityFrom === this.cityTo) {
      return [];
    }

    var graphMap: { [key: string]: { [key: string]: number } } = {};
    this.dealsMap = {};
    this.deals.forEach((deal: DealType) => {
      graphMap[deal.departure] = graphMap[deal.departure] || {};
      this.dealsMap[deal.departure] = this.dealsMap[deal.departure] || {};
      
      let weight = this.searchMode === SearchModeType.Price ? getDealPrice(deal) : getDealTime(deal);
      let currentWeight = graphMap[deal.departure][deal.arrival];
      if (currentWeight == null || weight < currentWeight) {
        graphMap[deal.departure][deal.arrival] = weight;
        this.dealsMap[deal.departure][deal.arrival] = deal;
      }
    });

    var g = new Graph(graphMap);
    return g.shortestPath(this.cityFrom, this.cityTo);
  }
  
  get searchResults(): DealType[] {
    let path = this.path;
    let results: DealType[] = [];
    this.dealsMap && path && path.forEach((city: string, index: number) => {
      if (index !== path.length - 1) {
        results.push(this.dealsMap[city][path[index+1]]);
      }
    });
    return results;
  }
  
}

</script>

<style lang="scss">
@import '~sierra-library';

// .someclass { color: $some-variable; }
.hidden {
  display: none !important;
}
</style>
