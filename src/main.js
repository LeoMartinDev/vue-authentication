import '@babel/polyfill'
import Vue from 'vue'
import './plugins/axios'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
// on importe VeeValidate
import VeeValidate from 'vee-validate'

Vue.config.productionTip = false

// et on l'enregistre auprès de Vue
Vue.use(VeeValidate);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
