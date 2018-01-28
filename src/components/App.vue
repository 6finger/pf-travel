<template>
  <div>
    <h1>Search</h1>
    <search-select-component v-model="cityFrom" :options="departures"/>
    <search-select-component v-model="cityTo" :options="arrivals"/>
    path: {{path}}
  </div>
</template>

<script lang="ts">

import SearchSelectComponent from "./SearchSelect.vue";
import { ResponseType, DealType } from "../types";
import data from '../response.json';
import * as Graph from "node-dijkstra";
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component({
  el: "#app",
  components: {
    SearchSelectComponent
  }
})
export default class AppComponent extends Vue {
  @Prop() cityFrom: string = '';
  @Prop() cityTo: string = '';
  @Prop() departures: string[] = (<ResponseType>data).deals.map((deal: DealType) => {
      return deal.departure;
    }).filter((x, i, a) => a.indexOf(x) == i).sort();
  @Prop() arrivals: string[] = (<ResponseType>data).deals.map((deal: DealType) => {
      return deal.arrival;
    }).filter((x, i, a) => a.indexOf(x) == i).sort();
 
  get path():any {
    var mode = 'price'; // price / time
    var dealsMap: { [key: string]: { [key: string]: DealType } } = {};
    var graphMap: { [key: string]: { [key: string]: number}} = {};

    (<ResponseType>data).deals.forEach((deal: DealType) => {
      dealsMap[deal.departure] = dealsMap[deal.departure] || {};
      dealsMap[deal.departure][deal.arrival] = deal;

      var weight = 0;
      if (mode === 'price') {
        weight = deal.cost * (deal.discount ? deal.discount / 100 : 1);
      } else {
        weight = parseFloat(deal.duration.h) * 60 + parseFloat(deal.duration.m);
      }
      graphMap[deal.departure] = graphMap[deal.departure] || {};
      graphMap[deal.departure][deal.arrival] = weight;
    });

    var g = new Graph(graphMap);
    return g.shortestPath((<any>this).cityFrom, (<any>this).cityTo);
  }
  
}

</script>

<style>
</style>
