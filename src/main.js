import 'babel-polyfill'
import Vue from "vue";
import frame from "./frame.vue";
import router from "./router";
import store from "./store";
import axios from "./common/axios";
import filters from "./filters";
import VueProgressBar from "vue-progressbar";
import Element from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
import ImpPanel from "./components/panel.vue";
import draggable from 'vuedraggable'

Vue.prototype.$http = axios
Vue.axios = axios
Vue.http = axios;
Vue.use(axios);

Vue.use(Element);

Vue.component(ImpPanel.name, ImpPanel);
Vue.component('draggable', draggable)

Vue.use(VueProgressBar, {
  color: '#eeeeee',
  failedColor: '#874b4b',
  thickness: '2px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s'
  },
  autoRevert: true,
  location: 'top',
  inverse: false
})


Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  store,
  router,
  el: "#root",
  render: h => h(frame)
})
