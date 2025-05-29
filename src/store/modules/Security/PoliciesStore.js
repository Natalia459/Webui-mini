import api from '@/store/api';

const PoliciesStore = {
  namespaced: true,
  state: {
    sshProtocolEnabled: false,
    ipmiProtocolEnabled: false,
    sessionTimeoutValue: null,
  },
  getters: {
    sshProtocolEnabled: (state) => state.sshProtocolEnabled,
    ipmiProtocolEnabled: (state) => state.ipmiProtocolEnabled,
    getSessionTimeoutValue: (state) => state.sessionTimeoutValue,
  },
  mutations: {
    setSshProtocolEnabled: (state, sshProtocolEnabled) =>
      (state.sshProtocolEnabled = sshProtocolEnabled),
    setIpmiProtocolEnabled: (state, ipmiProtocolEnabled) =>
      (state.ipmiProtocolEnabled = ipmiProtocolEnabled),
    setSessionTimeoutValue(state, sessionTimeoutValue) {
      state.sessionTimeoutValue = sessionTimeoutValue;
    },
  },
  actions: {
    async getNetworkProtocolStatus({ commit }) {
      return await api
        .get(`${await this.dispatch('global/getBmcPath')}/NetworkProtocol`)
        .then((response) => {
          const sshProtocol = response.data.SSH.ProtocolEnabled;
          const ipmiProtocol = response.data.IPMI.ProtocolEnabled;
          commit('setSshProtocolEnabled', sshProtocol);
          commit('setIpmiProtocolEnabled', ipmiProtocol);
        })
        .catch((error) => console.log(error));
    },
    async getSessionTimeout({ commit }) {
      return await api
        .get('/redfish/v1/SessionService')
        .then((response) => {
          const sessionTimeoutValue = response.data.SessionTimeout;
          commit('setSessionTimeoutValue', sessionTimeoutValue);
        })
        .catch((error) => console.log(error));
    },
    async saveIpmiProtocolState({ commit }, protocolEnabled) {
      commit('setIpmiProtocolEnabled', protocolEnabled);
      const ipmi = {
        IPMI: {
          ProtocolEnabled: protocolEnabled,
        },
      };
      return await api
        .patch(
          `${await this.dispatch('global/getBmcPath')}/NetworkProtocol`,
          ipmi,
        )
        .then(() => {
          if (protocolEnabled) {
            console.info('success: IpmiEnabled');
          } else {
            console.info('success: IpmiDisabled');
          }
        })
        .catch((error) => {
          console.log(error);
          commit('setIpmiProtocolEnabled', !protocolEnabled);
          if (protocolEnabled) {
            throw new Error(
              'pagePolicies.toast.errorIpmiEnabled',
            );
          } else {
            throw new Error(
              'pagePolicies.toast.errorIpmiDisabled',
            );
          }
        });
    },
    async saveSshProtocolState({ commit }, protocolEnabled) {
      commit('setSshProtocolEnabled', protocolEnabled);
      const ssh = {
        SSH: {
          ProtocolEnabled: protocolEnabled,
        },
      };
      return await api
        .patch(
          `${await this.dispatch('global/getBmcPath')}/NetworkProtocol`,
          ssh,
        )
        .then(() => {
          if (protocolEnabled) {
            console.info('success: SshEnabled');
          } else {
            console.info('success: SshDisabled');
          }
        })
        .catch((error) => {
          console.info("saveSshProtocolState error catched");
          console.log(error);
          commit('setSshProtocolEnabled', !protocolEnabled);
          if (protocolEnabled) {
            throw new Error(
              'pagePolicies.toast.errorSshEnabled',
            );
          } else {
            throw new Error(
              'pagePolicies.toast.errorSshDisabled',
            );
          }
        });
    },
    async saveSessionTimeoutValue({ dispatch }, sessionTimeoutNewValue) {
      const sessionValue = {
        SessionTimeout: sessionTimeoutNewValue,
      };
      return await api
        .patch('/redfish/v1/SessionService', sessionValue)
        .then(() => dispatch('getSessionTimeout'))
        .then(() => {
          console.info('success: SessionTimeout');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            'pagePolicies.toast.errorSessionTimeout',
          );
        });
    },
  },
};

export default PoliciesStore;
