import { createStore } from 'vuex';

import GlobalStore from './modules/GlobalStore';
import AuthenticationStore from './modules/Authentication/AuthenticanStore';
import SessionsStore from './modules/Security/SessionsStore';
import DateAndTimeStore from './modules/Settings/DateAndTimeStore';
import NetworkStore from './modules/Settings/NetworkStore';
import BmcRebootStore from './modules/Operations/RebootBmcStore';
import PoliciesStore from './modules/Security/PoliciesStore';
import UserManagementStore from './modules/Security/UserManagementStore';
import EventLogStore from './modules/State/EventLogStore';
import SystemStore from './modules/State/SystemStore';
import FirmwareStore from './modules/State/FirmwareStore';

const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    global: GlobalStore,
    authentication: AuthenticationStore,
    userManagement: UserManagementStore,
    sessions: SessionsStore,
    dateAndTime: DateAndTimeStore,
    network: NetworkStore,
    controls: BmcRebootStore,
    policies: PoliciesStore,
    eventLog: EventLogStore,
    system: SystemStore,
    firmware: FirmwareStore,
    },
});

export default store;
