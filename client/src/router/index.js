import Vue from 'vue'
import Router from 'vue-router'
import StockWindow from '@/components/StockWindow'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'StockWindow',
      component: StockWindow
    }
  ]
})
