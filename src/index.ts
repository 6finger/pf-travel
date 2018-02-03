import AppComponent from "./components/App.vue";
import './directives/ClickOutside';

import Vue from 'vue';
import Vuex from 'vuex';

import appStore from './store/store';

Vue.use(Vuex);

let store = new Vuex.Store({
  modules: {
    appStore
  },
  strict: true
})
let app = new AppComponent({
  el: "#app",
  store
});
