<template>
  <div>
    <div class="results bordered">
      <div v-if="!results.length" class="result">
        No connection found between <strong>{{cityFrom}}</strong> and <strong>{{cityTo}}</strong>
      </div>
      <div v-if="results.length" v-for="(deal, index) in results" :key="deal.reference" class="aligner-space-between result border-bottom" :class="{even: index % 2 == 1}">
        <div>
          <div class="cities">
            <strong>{{deal.departure}}</strong>
            &gt;
            <strong>{{deal.arrival}}</strong>
          </div>
          <div>
            <strong>{{deal.transport}}</strong>
            <span class="text-gray">{{deal.reference}}</span>
            for
            <strong>{{deal.duration.h}}</strong>h
            <strong>{{deal.duration.m}}</strong>m
          </div>
        </div>
        <div class="price">{{getDealPrice(deal)}} {{currency}}</div>
      </div>
    </div>
    <div v-if="results.length" class="results summary bordered">
      <div class="result text-primary aligner-space-between">
        <div>Total</div>
        <div>{{searchResultsSummary.time.h}}h {{searchResultsSummary.time.m}}m</div>
        <div>{{searchResultsSummary.price}} {{currency}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { DealType } from "../types";
import { getDealPrice, getDealTime, minutesToHoursAndMinutes } from '../helpers/format';
  
export type PriceAndTimeType = { price: number, time: number };
export type SummaryType = { price: number, time: {h: number, m: number} };

@Component
export default class SearchResultsComponent extends Vue {
  @Prop() results: DealType[];
  @Prop() currency: string;
  @Prop() cityFrom: string;
  @Prop() cityTo: string;

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

<style lang="scss">
.results {
  border-radius: 3px;
  margin-bottom: 1em;
}
.result:last-child {
  border-bottom: none;
}
.result {
  align-items: center;
  padding: 7px 10px;
  background-color: #34495e;
  &.even {
    background-color: #2b3d4e;
  }
}
.cities, .price {
  font-size: 15px;
}
.summary .result {
  font-size: 20px;
  font-weight: 300;
  padding: 10px 10px;
}
</style>
