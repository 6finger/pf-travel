<template>
  <div>
    <div v-for="deal in results" :key="deal.reference">
      <span>{{deal.transport}}</span>
      <span>{{deal.departure}}</span>
      &gt;
      <span>{{deal.arrival}}</span>
      <span>{{getDealPrice(deal)}} curr</span>,
      <span>{{deal.duration.h}} h</span>
      <span>{{deal.duration.m}} m</span>,
      <span>ref {{deal.reference}}</span>
    </div>
    <br/>
    <div>
      summary:
      <span>{{searchResultsSummary.price}} curr</span>,
      <span>{{minutesToHoursAndMinutes(searchResultsSummary.time).h}} h</span>
      <span>{{minutesToHoursAndMinutes(searchResultsSummary.time).m}} m</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { DealType } from "../types";
import { getDealPrice, getDealTime, minutesToHoursAndMinutes } from '../helpers';
  
export type SummaryType = { price: number, time: number };

@Component
export default class SearchResultsComponent extends Vue {
  @Prop() results: DealType[];

  minutesToHoursAndMinutes = minutesToHoursAndMinutes;
  getDealPrice = getDealPrice;
  
  get searchResultsSummary(): SummaryType {
    return this.results.map((deal: DealType): SummaryType => {
      return {
        price: getDealPrice(deal),
        time: getDealTime(deal)
      }
    }).reduce((acc: SummaryType, next: SummaryType): SummaryType => {
      return {
        price: acc.price + next.price,
        time: acc.time + next.time
      }
    });
  }
  
}
</script>

<style>
</style>
