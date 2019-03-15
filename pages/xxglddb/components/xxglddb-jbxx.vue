<template>
	<view class="child-content">
    <kw-list-cell title="上级机构" :right-note="data.PARENT_ORGS"></kw-list-cell>
    <kw-list-cell title="学校名称" :right-note="data.ORG_MC"></kw-list-cell>
    <kw-list-cell title="学校代码" :right-note="data.ORG_DM"></kw-list-cell>
    <kw-list-cell title="办学类型" :right-note="data.XXBXLX"></kw-list-cell>
    <kw-list-cell title="办学模式" :right-note="data.XXBBMC"></kw-list-cell>
    <kw-list-cell title="所在地城乡类型" :right-note="data.XXZDCXLXDMC"></kw-list-cell>
    <kw-list-cell title="学校等级" :right-note="data.XXDJMC"></kw-list-cell>
    <kw-list-cell title="联系电话" :right-note="data.LXDH"></kw-list-cell>
    <kw-list-cell title="主页地址" :right-note="data.ZYDZ"></kw-list-cell>
    <kw-list-cell title="学校经度" :right-note="data.XXJD"></kw-list-cell>
    <kw-list-cell title="学校纬度" :right-note="data.XXWD"></kw-list-cell>
    <kw-list-cell title="学校地址" :right-note="data.XXDZ"></kw-list-cell>
    <kw-list-cell title="简介" :right-note="data.LSYG"></kw-list-cell>
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
	export default {
    components:{KwListCell},
		data() {
			return {
        data:{},
        sjjgShow:true,
			}
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
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_xx/doSelectByPrimaryKey',
          type: 'POST',
          data: {
            ORG_ID: this.id
          },
          vue: this,
          then (response) {
            this.data = response.datas
          }
        })
      }
    }
	}
</script>

<style lang="scss">
  
</style>
