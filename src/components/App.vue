<template>
  <main class="flex-column">

    <section class="header flex-none shadow-bottom">
      <div class="container-small text-center">
        <h1 class="text-huge">Trip Sorter</h1>
      </div>
    </section>

    <section :class="{hidden: !isEditing}" class="background-dark mid-section flex-content">
      <div class="container-small">
        <search-select-component
          v-model="cityFrom"
          :options="departures"
          :optionsExclude="[cityTo]"
          :errorMessage="cityFromErrorMessage"
          label="From"
          @input="!valid && validate()"/>
        <search-select-component
          v-model="cityTo"
          :options="arrivals"
          :optionsExclude="[cityFrom]"
          :errorMessage="cityToErrorMessage"
          label="To"
          @input="!valid && validate()"/>
        <search-mode-toggle-component v-model="searchMode"/>
        <div class="row compact">
          <div class="col-xs-6">
            <button @click="search" class="button button-primary full-width">
              <i class="fa fa-search fa-lg"></i>
              &nbsp;Search
            </button>
          </div>
          <div class="col-xs-6">
            <button @click="changeDirection" class="button button-outlined full-width">
              <i class="fa fa-retweet fa-lg"></i>
              &nbsp;Switch
            </button>
          </div>
        </div>
      </div>
    </section>

    <section :class="{hidden: isEditing}" class="background-dark mid-section flex-content">
      <div class="container-small">
        <search-results-component :results="searchResults" :currency="currency" :cityFrom="cityFrom" :cityTo="cityTo"/>
        <div class="row">
          <div class="col-xs-12">
            <button @click="reset" class="button button-primary full-width">
              <i class="fa fa-refresh fa-lg"></i>
              &nbsp;Search again
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="footer flex-none shadow-top">
      <div class="spinner" :class="{hidden: !loading}">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
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
import { mapGetters, mapActions } from 'vuex';
import { GET_DEALS, GET_CURRENCY, FETCH_DATA } from '../store/actions';

@Component({
  components: {
    SearchSelectComponent,
    SearchModeToggleComponent,
    SearchResultsComponent
  },
  computed: {
    ...mapGetters({
      deals: GET_DEALS,
      currency: GET_CURRENCY
    })
  },
  methods: {
    ...mapActions({
      fetchData: FETCH_DATA
    })
  },
})
export default class AppComponent extends Vue {
  @Prop() cityFrom: string = '';
  @Prop() cityTo: string = '';
  @Prop() searchMode: SearchModeType = SearchModeType.Price;
  
  // mapped by vuex
  deals: DealType[];
  currency: string;
  fetchData: Function;
  
  get departures(): string[] { return this.getDistinctCitiesFromDeals('departure'); } 
  get arrivals(): string[]  { return this.getDistinctCitiesFromDeals('arrival'); }
  editing: boolean = true;
  loading: boolean = true;
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

  created () {
    this.fetchData().then(() => this.loading = false);
  }
  
  validate() {
    this.cityFromErrorMessage =
      !this.cityFrom ? 'Please select a city.' :
      this.departures.indexOf(this.cityFrom) == -1 ? 'Unknown city.' :
      '';
    this.cityToErrorMessage =
      !this.cityTo ? 'Please select a city.' :
      this.arrivals.indexOf(this.cityTo) == -1 ? 'Unknown city.' :
      !this.cityFromErrorMessage && this.cityFrom === this.cityTo ? 'Both cities can\'t be the same.' :
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
@import '~sierra-library/src/variables';

@import '~sierra-library/src/scss/utils/mixins';
@import '~sierra-library/src/scss/placeholders';
@import '~sierra-library/src/scss/vendor/reset';

@import '~sierra-library/src/scss/main';

@import '~sierra-library/src/scss/background-colors';
@import '~sierra-library/src/scss/buttons';
@import '~sierra-library/src/scss/forms';
@import '~sierra-library/src/scss/helpers';
@import '~sierra-library/src/scss/layout';
@import '~sierra-library/src/scss/typography';

@import '~sierra-library/src/scss/bootstrapgrid';

@import '../styles/typography';
@import '../styles/layout';
@import '../styles/buttons';
@import '../styles/forms';
@import '../styles/shadows';
@import '../styles/lists';
@import '../styles/spinner';

</style>
