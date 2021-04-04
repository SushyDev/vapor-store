import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    data: {
        // Uh oh - appName is *also* the name of the
        // instance property we defined!
        appName: 'The name of some other app',
    },
    render: (h) => h(App),
}).$mount('#app');
