import Vue from 'vue'
import StockWindow from '@/components/StockWindow'

console.log('HERE!!!')

describe('StockWindow.vue', () => {
  it('should have ten stocks', () => {

    const container = document.createElement('div');
    const StockWindowComponent = Vue.extend(StockWindow);
    new StockWindowComponent({
      data: {
        wsData: {
          sellings: [],
          purchases: []
        }
      }
    });

    vm.$mount(container);

    expect(vm.wsData.sellings.length).to.equal(10);
    expect(vm.$el.querySelectorAll('td').length).to.equal(20);
    // const vm = new Constructor().$mount()
    // expect(vm.$el.querySelector('.hello h1').textContent)
    //   .toEqual('Welcome to Your Vue.js App')
  })
})
