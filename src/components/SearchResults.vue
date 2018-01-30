<template>
  <div>
    <div v-for="deal in results" :key="deal.reference">
      <span>{{deal.transport}}</span>
      <span>{{deal.departure}}</span>
      &gt;
      <span>{{deal.arrival}}</span>
      <span>{{getDealPrice(deal)}} {{currency}}</span>,
      <span>{{deal.duration.h}} h</span>
      <span>{{deal.duration.m}} m</span>,
      <span>ref {{deal.reference}}</span>
    </div>
    <br/>
    <div>
      summary:
      <span>{{searchResultsSummary.price}} {{currency}}</span>,
      <span>{{searchResultsSummary.time.h}} h</span>
      <span>{{searchResultsSummary.time.m}} m</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { DealType } from "../types";
import { getDealPrice, getDealTime, minutesToHoursAndMinutes } from '../helpers';
  
export type PriceAndTimeType = { price: number, time: number };
export type SummaryType = { price: number, time: {h: number, m: number} };

@Component
export default class SearchResultsComponent extends Vue {
  @Prop() results: DealType[];
  @Prop() currency: string;

  getDealPrice = getDealPrice;
  
  get searchResultsSummary(): SummaryType {
    let summary: SummaryType = {
      price: 0,
      time: {h: 0, m: 0}
    };
    if (!this.results || !this.results.length) {
      return summary;
    }
    let priceAndTime: PriceAndTimeType = this.results.map((deal: DealType): PriceAndTimeType => {
      return {
        price: getDealPrice(deal),
        time: getDealTime(deal)
      }
    }).reduce((acc: PriceAndTimeType, next: PriceAndTimeType): PriceAndTimeType => {
      return {
        price: acc.price + next.price,
        time: acc.time + next.time
      }
    });
    return {
      price: priceAndTime.price,
      time: minutesToHoursAndMinutes(priceAndTime.time)
    }
  }
  
}
</script>

<style>
</style>
