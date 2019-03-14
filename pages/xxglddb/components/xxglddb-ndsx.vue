<template>
	<view class="child-content">
    <kw-list-cell title="占地面积" :right-note="data.ZDMJ"></kw-list-cell>
    <kw-list-cell title="其中：绿化用地面积" :right-note="data.LHYDMJ"></kw-list-cell>
    <kw-list-cell title="其中：运动场地面积" :right-note="data.YDCDMJ"></kw-list-cell>
    <kw-list-cell title="校舍建筑面积" :right-note="data.XSJZMJ"></kw-list-cell>
    <kw-list-cell title="图书量" :right-note="data.PARENT_ORGS"></kw-list-cell>
    <kw-list-cell title="数字资源量" :right-note="data.PARENT_ORGS"></kw-list-cell>
    <kw-list-cell title="计算机台数" :right-note="data.PARENT_ORGS"></kw-list-cell>
    <kw-list-cell title="其中：教学用计算机" :right-note="data.PARENT_ORGS"></kw-list-cell>
    <kw-list-cell title="其中：平板电脑" :right-note="data.PARENT_ORGS"></kw-list-cell>
    <kw-list-cell title="教室" :right-note="data.PARENT_ORGS"></kw-list-cell>
    <kw-list-cell title="其中：网络多媒体教室" :right-note="data.PARENT_ORGS"></kw-list-cell>
    <kw-list-cell title="固定资产总值" :right-note="data.PARENT_ORGS"></kw-list-cell>
    <kw-list-cell title="其中：教学仪器设备资产值" :right-note="data.PARENT_ORGS"></kw-list-cell>
    
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
	export default {
    components:{KwListCell},
		data() {
			return {
        xnList:[],
        xnValue:"",
        data:[]
        
			};
		},
    onLoad() {
    	this.loadData()
    },
    props: {
    	id: {
    		type: String,
    		default: ""
    	},
    },
    methods:{
      // 预先加载数据
      loadData () {
        this.getXnList()
        this.getXnValue()
      },
      // 学年下拉数据获取
      getXnList(){
        this.$kwz.ajax.ajaxUrl({
          url: 'jc_xq/doList',
          type: 'POST',
          vue: this,
          then (response) {
            this.xnList = response.datas
            // console.log(this.xnList)
          }
        })
      },
      // 获取当前学年
      getXnValue(){
        this.$kwz.ajax.ajaxUrl({
          url: 'jc_xq/getCurXq',
          type: 'POST',
          vue: this,
          then (response) {
            this.xnValue = response.datas
            // console.log(this.xnValue)
            this.getData()
          }
        })
      },
      // 获取数据
      getData(){
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_xx/doSelectNdsx',
          type: 'POST',
          data: {
            ORG_ID: this.id,
            XQ_ND:"2018"
          },
          vue: this,
          then (response) {
            this.data = response.datas
            console.log(this.data)
          }
        })
      }
    }
	}
</script>

<style lang="scss">
  
</style>
