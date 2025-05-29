import AppLayout from '@/layouts/AppLayout.vue';
import LoginLayout from '@/layouts/LoginLayout.vue';

import PageNotFound from '@/views/PageNotFound';

import Sessions from '@/views/Security/Sessions';
import Policies from '@/views/Security/Policies';
import DateAndTime from '@/views/Settings/DateAndTime';
import Network from '@/views/Settings/Network';
import RebootBmc from '../views/Operations/RebootBmc.vue';

const roles = {
  administrator: 'Administrator',
  operator: 'Operator',
  readonly: 'ReadOnly',
  noaccess: 'NoAccess',
};

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginLayout,
  },
  {
    path: '/',
    meta: {
      requiresAuth: true,
    },
    component: AppLayout,
    children: [
      {
        path: 'security-and-access/sessions',
        name: 'sessions',
        component: Sessions,
      },
      {
        path: 'security-and-access/policies',
        name: 'policies',
        component: Policies,
      },
      {
        path: 'settings/date-time',
        name: 'date-time',
        component: DateAndTime,
      },
      {
        path: 'settings/network',
        name: 'network',
        component: Network,
      },
      {
        path: 'operations/reboot-bmc',
        name: 'reboot-bmc',
        component: RebootBmc,
      },
      {
        path: '*',
        name: 'page-not-found',
        component: PageNotFound,
      },
    ],
  }
]

export { routes as default, roles };
