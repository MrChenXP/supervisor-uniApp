import kwz from './kwz.uni.js'

export default {
  install (Vue) {
    Vue.prototype.$kwz = kwz
    Vue.kwz = kwz
  },
  $kwz: kwz
}

export const $kwz = kwz
