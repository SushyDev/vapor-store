import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '*',
        redirect: '/',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/games',
        name: 'Games',
        component: () => import('../views/Games.vue'),
    },
    {
        path: '/downloads',
        name: 'Downloads',
        component: () => import('../views/Downloads.vue'),
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
