import { getters, mutations, actions } from './actions';

const initialState = {
  deals: [],
  currency: ''
}

export default {
  state: {
    ...initialState
  },
  getters,
  mutations,
  actions
}
