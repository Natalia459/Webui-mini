import api from '@/store/api';

const NetworkStore = {
  namespaced: true,
  state: {
    ethernetData: [],
    firstInterfaceId: '', //used for setting global DHCP settings
    globalNetworkSettings: [],
    selectedInterfaceId: '', // which tab is selected
    selectedInterfaceIndex: 0, // which tab is selected
  },
  getters: {
    ethernetData: (state) => state.ethernetData,
    firstInterfaceId: (state) => state.firstInterfaceId,
    globalNetworkSettings: (state) => state.globalNetworkSettings,
    selectedInterfaceId: (state) => state.selectedInterfaceId,
    selectedInterfaceIndex: (state) => state.selectedInterfaceIndex,
  },
  mutations: {
    setDomainNameState: (state, domainState) =>
      (state.domainState = domainState),
    setDnsState: (state, dnsState) => (state.dnsState = dnsState),
    setEthernetData: (state, ethernetData) =>
      (state.ethernetData = ethernetData),
    setFirstInterfaceId: (state, firstInterfaceId) =>
      (state.firstInterfaceId = firstInterfaceId),
    setGlobalNetworkSettings: (state, data) => {
      state.globalNetworkSettings = data.map(({ data }) => {
        const {
          DHCPv4,
          DHCPv6,
          HostName,
          IPv4Addresses,
          IPv4StaticAddresses,
          IPv6Addresses,
          IPv6StaticAddresses,
          LinkStatus,
          MACAddress,
          IPv6DefaultGateway,
        } = data;
        return {
          defaultGateway: IPv4StaticAddresses[0]?.Gateway, //First static gateway is the default gateway
          ipv6DefaultGateway: IPv6DefaultGateway,
          dhcpAddress: IPv4Addresses.filter(
            (ipv4) => ipv4.AddressOrigin === 'DHCP',
          ),
          dhcpv6Address: IPv6Addresses.filter(
            (ipv6) =>
              ipv6.AddressOrigin === 'SLAAC' || ipv6.AddressOrigin === 'DHCPv6',
          ),
          dhcpEnabled: DHCPv4.DHCPEnabled,
          dhcp6Enabled: DHCPv6.OperatingMode,
          hostname: HostName,
          macAddress: MACAddress,
          linkStatus: LinkStatus,
          staticAddress: IPv4StaticAddresses[0]?.Address, // Display first static address on overview page
          ipv6StaticAddress: IPv6StaticAddresses[0]?.Address,
          useDnsEnabled: DHCPv4.UseDNSServers,
          useDomainNameEnabled: DHCPv4.UseDomainName,
          useNtpEnabled: DHCPv4.UseNTPServers,
          useDnsEnabledIpv6: DHCPv6.UseDNSServers,
          useDomainNameEnabledIpv6: DHCPv6.UseDomainName,
          useNtpEnabledIpv6: DHCPv6.UseNTPServers,
        };
      });
    },
    setNtpState: (state, ntpState) => (state.ntpState = ntpState),
    setDomainNameStateIpv6: (state, domainState) =>
      (state.domainStateIpv6 = domainState),
    setDnsStateIpv6: (state, dnsState) => (state.dnsStateIpv6 = dnsState),
    setNtpStateIpv6: (state, ntpState) => (state.ntpStateIpv6 = ntpState),
    setSelectedInterfaceId: (state, selectedInterfaceId) =>
      (state.selectedInterfaceId = selectedInterfaceId),
    setSelectedInterfaceIndex: (state, selectedInterfaceIndex) =>
      (state.selectedInterfaceIndex = selectedInterfaceIndex),
  },
  actions: {
    async getEthernetData({ commit }) {
      return await api
        .get(`${await this.dispatch('global/getBmcPath')}/EthernetInterfaces`)
        .then((response) =>
          response.data.Members.map(
            (ethernetInterface) => ethernetInterface['@odata.id'],
          ),
        )
        .then((ethernetInterfaceIds) =>
          api.all(
            ethernetInterfaceIds.map((ethernetInterface) =>
              api.get(ethernetInterface),
            ),
          ),
        )
        .then((ethernetInterfaces) => {
          const ethernetData = ethernetInterfaces.map(
            (ethernetInterface) => ethernetInterface.data,
          );
          const firstInterfaceId = ethernetData[0].Id;
          commit('setEthernetData', ethernetData);
          commit('setFirstInterfaceId', firstInterfaceId);
          commit('setSelectedInterfaceId', firstInterfaceId);
          commit('setGlobalNetworkSettings', ethernetInterfaces);
        })
        .catch((error) => {
          console.log('Network Data:', error);
        });
    },
    async setSelectedTabIndex({ commit }, tabIndex) {
      commit('setSelectedInterfaceIndex', tabIndex);
    },
    async setSelectedTabId({ commit }, tabId) {
      commit('setSelectedInterfaceId', tabId);
    },
  },
};

export default NetworkStore;
