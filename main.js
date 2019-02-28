import Vue from 'vue'
import App from './App'
import $kwz from './common/plugins/kwz/index.js'
import uniIcon from "@dcloudio/uni-ui/lib/uni-icon/uni-icon.vue"
import uniBadge from "@dcloudio/uni-ui/lib/uni-badge/uni-badge.vue"
import uniTag from "@dcloudio/uni-ui/lib/uni-tag/uni-tag.vue"
Vue.component('uniIcon',uniIcon) // 引入uniapp图标
Vue.component('uniBadge',uniBadge) // 引入数字角标
Vue.component('uniTag',uniTag) // 引入标签

Vue.use($kwz)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
