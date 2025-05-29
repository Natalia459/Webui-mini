import api from '@/store/api';

const SystemStore = {
  namespaced: true,
  state: {
    systems: [],
  },
  getters: {
    systems: (state) => state.systems,
  },
  mutations: {
    setSystemInfo: (state, data) => {
      state.systems.model = data.Model;
    },
  },
  actions: {
    async getSystem({ commit }) {
      return await api
        .get(`${await this.dispatch('global/getSystemPath')}`)
        .then(({ data }) => commit('setSystemInfo', data))
        .catch((error) => console.log(error));
    },
  },
};

export default SystemStore;
