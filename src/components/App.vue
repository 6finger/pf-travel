<template>
  <div>
    <h1>Search</h1>
    <search-select-component v-model="cityFrom" :options="departures" label="From"/>
    <search-select-component v-model="cityTo" :options="arrivals" label="To"/>
    <search-direction-toggle-component @change="changeDirection"/>
    <search-mode-toggle-component v-model="searchMode"/>
    <br/>
    path: {{path}}
    <br/>
    <search-results-component :results="searchResults" />
  </div>
</template>

<script lang="ts">

import SearchSelectComponent from "./SearchSelect.vue";
import SearchModeToggleComponent from "./SearchModeToggle.vue";
import SearchDirectionToggleComponent from "./SearchDirectionToggle.vue";
import SearchResultsComponent from "./SearchResults.vue";
import { ResponseType, DealType, SearchModeType } from "../types";
import data from '../response.json';
import * as Graph from "node-dijkstra";
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { getDealPrice, getDealTime } from '../helpers';

export type DealsMapType = { [key: string]: { [key: string]: DealType } };
  
@Component({
  el: "#app",
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
  get departures(): string[] { return this.getDistinctCitiesFromDeals('departure'); } 
  get arrivals(): string[]  { return this.getDistinctCitiesFromDeals('arrival'); }
  dealsMap: DealsMapType;  
 
  getDistinctCitiesFromDeals(propertyName: string): string[] {
    return this.deals.map((deal: DealType) => {
      return (<any>deal)[propertyName];
    }).filter((x, i, a) => a.indexOf(x) == i).sort();
  }
  
  changeDirection() {
    let from = this.cityFrom;
    this.cityFrom = this.cityTo;
    this.cityTo = from;
  }
  
  get path(): string[] {
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

<style>
</style>
