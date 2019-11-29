import Vue from 'vue'
import App from './App.vue'
import Vlf from 'vlf'
// import './plugins/element.js'

Vue.use(Vlf)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
