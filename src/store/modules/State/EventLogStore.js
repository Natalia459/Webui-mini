import api from '@/store/api';

const getHealthStatus = (events, loadedEvents) => {
  let status = loadedEvents ? 'OK' : '';
  for (const event of events) {
    if (event.filterByStatus === 'Unresolved') {
      if (event.severity === 'Warning') {
        status = 'Warning';
      }
      if (event.severity === 'Critical') {
        status = 'Critical';
        break;
      }
    }
  }
  return status;
};

const EventLogStore = {
  namespaced: true,
  state: {
    allEvents: [],
    loadedEvents: false,
  },
  getters: {
    allEvents: (state) => state.allEvents,
    healthStatus: (state) =>
      getHealthStatus(state.allEvents, state.loadedEvents),
  },
  mutations: {
    setAllEvents: (state, allEvents) => (
      (state.allEvents = allEvents), (state.loadedEvents = true)
    ),
  },
  actions: {
    async getEventLogData({ commit }) {
      return await api
        .get(
          `${await this.dispatch('global/getSystemPath')}/LogServices/EventLog/Entries`,
        )
        .then(({ data: { Members = [] } = {} }) => {
          const eventLogs = Members.map((log) => {
            const {
              Id,
              Severity,
              Created,
              EntryType,
              Message,
              Name,
              Modified,
              Resolved,
              AdditionalDataURI,
            } = log;
            return {
              id: Id,
              severity: Severity,
              date: new Date(Created),
              type: EntryType,
              description: Message,
              name: Name,
              modifiedDate: new Date(Modified),
              uri: log['@odata.id'],
              filterByStatus: Resolved ? 'Resolved' : 'Unresolved',
              status: Resolved, //true or false
              additionalDataUri: AdditionalDataURI,
            };
          });
          commit('setAllEvents', eventLogs);
        })
        .catch((error) => {
          console.log('Event Log Data:', error);
        });
    },
  }
};

export default EventLogStore;
