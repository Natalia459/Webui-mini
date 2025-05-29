import { createApp } from 'vue';
import App from './App.vue';

import store from './store';
import router from './router';
import $bus from './eventBus'
import { format } from 'date-fns-tz';

const app = createApp(App);

app.use(router)
app.use(store);

app.config.globalProperties.$bus = $bus;

app.mount('#app')

//Filters
const filter = {
  formatDate(value) {
    const isUtcDisplay = store.getters['global/isUtcDisplay'];

    if (value instanceof Date) {
      if (isUtcDisplay) {
        return value.toISOString().substring(0, 10);
      }
      const pattern = `yyyy-MM-dd`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return format(value, pattern, { timezone });
    }
  },
  formatTime(value) {
    const isUtcDisplay = store.getters['global/isUtcDisplay'];

    if (value instanceof Date) {
      if (isUtcDisplay) {
        let timeOptions = {
          timeZone: 'UTC',
          hourCycle: 'h23',
        };
        return `${value.toLocaleTimeString('default', timeOptions)} UTC`;
      }
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const shortTz = this.shortTimeZone(value);
      const pattern = `HH:mm:ss ('${shortTz}' O)`;
      return format(value, pattern, { timezone }).replace('GMT', 'UTC');
    }
  },
  shortTimeZone(value) {
    const longTZ = value
      .toString()
      .match(/\((.*)\)/)
      .pop();
    const regexNotUpper = /[*a-z ]/g;
    return longTZ.replace(regexNotUpper, '');
  },
};
app.config.globalProperties.$filters = filter;
