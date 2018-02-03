import axios, { AxiosResponse } from 'axios'
import { ResponseType, DealType } from "../types";

export const GET_DEALS: string = 'response/GET_DEALS';
export const SET_DEALS: string = 'response/SET_DEALS';

export const GET_CURRENCY: string = 'response/GET_CURRENCY';
export const SET_CURRENCY: string = 'response/SET_CURRENCY';

export const FETCH_DATA: string = 'response/FETCH_DATA';

export const getters = {
  [GET_DEALS](state: any): DealType[] { return state.deals; },
  [GET_CURRENCY](state: any): string { return state.currency; }
}

export const mutations = {
  [SET_DEALS](state: any, deals: DealType[]) { state.deals = deals; },
  [SET_CURRENCY](state: any, currency: string) { state.currency = currency; }
}

export const actions = {
  [FETCH_DATA]({ commit }: any) {
    return axios.get('response.json')
      .then((response: AxiosResponse<ResponseType>) => {
        <any>commit(SET_DEALS, response.data && response.data.deals ? response.data.deals : []);
        <any>commit(SET_CURRENCY, response.data && response.data.currency ? response.data.currency : '');
      });
  }
}
