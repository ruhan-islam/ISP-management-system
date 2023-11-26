import axios from 'axios';
import Vue from 'vue';
import App from './App.vue';
import vuetify from "./plugins/vuetify";
import router from "./router";
//export const eventBus = new Vue(); 
import store from './store';

//export const eventBus = new Vue(); 
Vue.config.productionTip = false

axios.defaults.baseURL = 'https://amader-internet.herokuapp.com/';

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

