import api from '@/store/api';

const InfoStore = {
    namespaced: true,
    state: {
        username: localStorage.getItem('storedUsername'),
        isAuthorized: true,
        userPrivilege: null,
        bmcTime: null,
    },
    getters: {
        username: (state) => state.username,
        isAuthorized: (state) => state.isAuthorized,
        bmcTime: (state) => state.bmcTime,
        userPrivilege: (state) => state.userPrivilege,
    },
    mutations:{
        setBmcTime: (state, bmcTime) => (state.bmcTime = bmcTime),
    },
    actions: {
        async getBmcPath() {
          const serviceRoot = await api
          .get('/redfish/v1')
          .catch((error) => { 
            console.log(error);
          });
          let bmcPath = serviceRoot?.data?.ManagerProvidingService?.['@odata.id'];
          if (!bmcPath) {
            const managers = await api
              .get('/redfish/v1/Managers')
              .catch((error) => { 
                console.log(error);
              });
            bmcPath = managers.data?.Members?.[0]?.['@odata.id'];
          }
          console.log(bmcPath);
          return bmcPath;
        },
        async getSystemPath() {
        const systems = await api
            .get('/redfish/v1/Systems')
            .catch((error) => console.log(error));
        let systemPath = systems?.data?.Members?.[0]?.['@odata.id'];
        return systemPath;
        },
        async getBmcTime({ commit }) {
          return await api
            .get(`${await this.dispatch('global/getBmcPath')}`)
            .then((response) => {
              const bmcDateTime = response.data.DateTime;
              const date = new Date(bmcDateTime);
              commit('setBmcTime', date);
            })
            .catch((error) => console.log(error));
        },
        async getSystemInfo({ commit }) {
        api
            .get(`${await this.dispatch('global/getSystemPath')}`)
            .then(
            ({
                data: {
                AssetTag,
                Model,
                PowerState,
                SerialNumber,
                Status: { State } = {},
                },
            } = {}) => {
                commit('setAssetTag', AssetTag);
                commit('setSerialNumber', SerialNumber);
                commit('setModelType', Model);
            },
            )
            .catch((error) => console.log(error));
        },
    }
};

export default InfoStore;