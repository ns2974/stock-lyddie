<template>
    <div class="row">
        <div id="stock-window" class="col-md-4 col-sm-12" style="margin: auto;">
            <div class="stock-info left"><h4>[체결가] {{tradedPrice}}</h4></div>
            <div class="stock-info right" style="margin-left: 5px;"><button type="button" class="btn btn-sm btn-warning" v-on:click="addOne()">ADD ONE</button></div>
            <div class="stock-info right"><button type="button" class="btn btn-sm btn-primary" v-on:click="reset()">RESET</button></div>
            <table class="table table-bordered table-condensed">
                <thead>
                    <tr>
                        <th>매도수량</th>
                        <th>매도가격</th>
                        <th>매수가격</th>
                        <th>매수수량</th>
                    </tr>
                </thead>
                <tbody id="selling">
                    <tr v-for="selling in sellings" :key="selling.index">
                        <td v-if="selling.none">-</td>
                        <td v-else>
                            <div :style="getSellingBarStyle(selling.quantity)">{{ selling.quantity }}</div>
                        </td>
                        <td v-if="selling.none">-</td>
                        <td v-else :class="{traded: selling.index == tradedIdx}">
                            <div class="icon-box"><span :class="{icon: true, 'traded-triangle': selling.index == tradedIdx}"></span>
                            </div>{{ selling.price }}
                        </td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                </tbody>
                <tbody id="purchase">
                    <tr v-for="purchase in purchases" :key="purchase.index">
                        <td>-</td>
                        <td>-</td>
                        <td v-if="purchase.none">-</td>
                        <td v-else :class="{traded: purchase.index == tradedIdx}">
                            <div class="icon-box"><span :class="{icon: true, 'traded-triangle': purchase.index == tradedIdx}"></span>
                            </div>{{ purchase.price }}
                        </td>
                        <td v-if="purchase.none">-</td>
                        <td v-else>
                            <div :style="getPurchaseBarStyle(purchase.quantity)">{{ purchase.quantity }}</div></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
var ws = new WebSocket('ws://localhost:3000/', 'echo-protocol')

export default {
  name: 'StockWindow',
  computed: {
    sellings: {
      get: function () {
        let sellings = this.wsData.selling
        let length = sellings.length
        if (length < 10) {
          let arr = []
          for (let i = 0; i < 10 - length; i++) {
            arr.push({none: true})
          }
          return arr.concat(sellings.reverse())
        } else {
          return sellings.slice(length - 10, length).reverse()
        }
      }
    },
    purchases: {
      get: function () {
        let purchases = this.wsData.purchase
        let length = purchases.length
        if (length < 10) {
          let arr = []
          for (let i = 0; i < 10 - length; i++) {
            arr.push({none: true})
          }
          return purchases.concat(arr)
        } else {
          return purchases.slice(length - 10, length)
        }
      }
    },
    tradedIdx: {
      get: function () {
        return this.wsData.tradedIdx
      }
    },
    tradedPrice: {
      get: function () {
        let price = this.wsData.tradedPrice
        return price > 0 ? price : 'None'
      }
    }
  },
  created () {
    var vm = this

    ws.onopen = function (e) {
      console.log('ws - opened')
      ws.send('getStock')
    }

    ws.onmessage = function (e) {
      let data = JSON.parse(e.data)
      vm.wsData = data
    }
    ws.onclose = function (e) {
      console.log('ws - closed')
    }
  },
  data () {
    return {
      wsData: {
        selling: [],
        purchase: []
      }
    }
  },
  methods: {
    reset: function () {
      ws.send('initStock')
    },
    addOne: function () {
      ws.send('addOne')
    },
    getSellingBarStyle: function (width) {
      let w = 100 * width / 500
      return {
        float: 'right',
        height: '20px',
        width: (w > 100 ? 100 : w) + '%',
        'background-color': '#419efc',
        'text-align': 'right',
        color: '#ffffff',
        'font-size': '0.8em'
      }
    },
    getPurchaseBarStyle: function (width) {
      let w = 100 * width / 500
      return {
        float: 'left',
        height: '20px',
        width: (w > 100 ? 100 : w) + '%',
        'background-color': '#ff5f5f',
        'text-align': 'left',
        color: '#ffffff',
        'font-size': '0.8em'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
div {
  margin: 0px;
}
div.offset {
  margin: 0px;
}
div.left {
  float: left;
}
div.right {
  float: right;
}
div.stock-info {
  display: inline-flex;
}
div.icon-box {
  position: absolute;
}
span.icon.traded-triangle {
  display: inline-flex;
  vertical-align: 0.5em;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 10px solid #000000;
}
table tbody tr td{
  font-size: 0.9em;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 5px;
  padding-bottom: 5px;
}
table tbody#selling {
  background-color: #a6d2fd;
}
table tbody#purchase {
  background-color: #fdadad;
}
table tbody td.traded {
  font-weight: 600;
  border: 3px solid #000000;
}
</style>
