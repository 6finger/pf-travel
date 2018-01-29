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
  get dealsMap(): DealsMapType { return this.getDealsMap(); }
  
  get departures(): string[] { return this.getDistinctCitiesFromDeals('departure'); } 
  get arrivals(): string[]  { return this.getDistinctCitiesFromDeals('arrival'); }
 
  getDistinctCitiesFromDeals(propertyName: string): string[] {
    return this.deals.map((deal: DealType) => {
      return (<any>deal)[propertyName];
    }).filter((x, i, a) => a.indexOf(x) == i).sort();
  }
  
  getDealsMap() {
    var dealsMap: DealsMapType = {};
    this.deals.forEach((deal: DealType) => {
      dealsMap[deal.departure] = dealsMap[deal.departure] || {};
      dealsMap[deal.departure][deal.arrival] = deal;
    });
    return dealsMap;
  }
  
  changeDirection() {
    let from = this.cityFrom;
    this.cityFrom = this.cityTo;
    this.cityTo = from;
  }
  
  get path(): string[] {
    var graphMap: { [key: string]: { [key: string]: number}} = {};
    this.deals.forEach((deal: DealType) => {
      var weight = 0;
      if (this.searchMode === SearchModeType.Price) {
        weight = getDealPrice(deal);
      } else {
        weight = getDealTime(deal);
      }
      graphMap[deal.departure] = graphMap[deal.departure] || {};
      graphMap[deal.departure][deal.arrival] = weight;
    });

    var g = new Graph(graphMap);
    return g.shortestPath((<any>this).cityFrom, (<any>this).cityTo);
  }
  
  get searchResults(): DealType[] {
    let path = this.path;
    let results: DealType[] = [];
    path && path.forEach((city: string, index: number) => {
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
