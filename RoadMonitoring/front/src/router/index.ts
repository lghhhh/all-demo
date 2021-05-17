import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import ObserveRoad from '../views/ObserveRoad.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/observe-data',
  },
  {
    path: '/observe-data',
    name: 'ObserveData',
    component: ObserveRoad,
  },
  {
    path: '/observe-setting',
    name: 'ObserveSetting',
    component: Home,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
