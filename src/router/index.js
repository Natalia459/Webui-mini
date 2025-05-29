import { createRouter, createWebHashHistory } from 'vue-router';

// //Do not change store or routes import.
// //Exact match alias set to support
// //dotenv customizations.
// import store from '../store';
import routes from './routes';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkExactActiveClass: 'nav-link--current',
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;
