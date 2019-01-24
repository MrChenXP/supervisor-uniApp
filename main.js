import Vue from 'vue'
import App from './App'
import $kwz from './common/plugins/kwz/index.js'

Vue.use($kwz)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
