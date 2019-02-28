<template>
	<view class="child-content">
    <kw-list-cell title="编号" :rightNote="data.BH"></kw-list-cell>
    <kw-list-cell title="科室/中心" :rightNote="data.XS_ORG"></kw-list-cell>
    <kw-list-cell>
      <view>
        我室
        <text class="text-bold">{{data.AUTHOR}}</text>
        责任督学于
        <text class="text-bold">{{data.RQ}}</text>
        对
        <text class="text-bold">{{data.XXMC}}</text>
        进行了教育督导，发现该学校(幼儿园)存在以下问题:
        <view class="text-bold">{{data.XSNR}}</view>
        <view>
          请贵科室（中心）予以支持、配合、协调解决!
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell :show="cljgCellShow" :isArrow="false" >
      <view>
        <view class="cljg-head clearfix" @click="cljgShow = !cljgShow">
          <text class="fl">处理结果</text>
          <view class="fr" v-show="!cljgShow"><uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon></view>
          <view class="fr" v-show="cljgShow"><uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon></view>
        </view>
        <view v-show="cljgShow" class="cljg-body">
          <view class="cljg-text">
    				<kw-editor-preview :content="ddjs"></kw-editor-preview>
    			</view>
        </view>
      </view>
    </kw-list-cell>
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import KwEditorPreview from "@kwz/kw-ui/kw-editor-preview.vue"
	export default {
		data() {
			return {
        cljgShow: false,
        cljgCellShow: false,
				zgxsId: '',
        // 数据
        data:'',
        ddjs: {}
			};
		},
    components:{KwListCell,KwEditorPreview},
		onLoad(param) {
			if(param && param.zgxsId) {
				this.zgxsId = param.zgxsId
				this.initData()
			}
		},
    methods:{
      initData () {
				if (this.zgxsId) {
					this.$kwz.ajax.ajaxUrl({
						url: 'dd_zgxs/doSelectByPrimary',
						type: 'POST',
						data: {
							ZGXSID: this.zgxsId
						},
						vue: this,
						then (response) {
							let datas = response.datas
							if (datas && datas.ZGXSID) {
								this.data = datas
                if (datas.CLZTDM >= '24') {
                  this.cljgCellShow = true
                  this.setDdjs(this.data.CLBG)
                }
							}
						}
					})
				}
			},
      // 设置内容 将html转成ddjs
      setDdjs (html) {
      	let ddjs = []
      	let ddjsImage = []
      	let ddjsSplit = this.$kwz.splitHtml(html)
      	if (ddjsSplit && ddjsSplit.length > 0) {
      		for (let i in ddjsSplit) {
      			let content = ddjsSplit[i]
      			if (content.content) {
      				ddjs.push(content.content)
      			}
      			if (content.imageUrl) {
      				ddjsImage.push({
      					type: 'image',
      					content: content.imageUrl,
      					imageUrl: content.realUrl
      				})
      			}
      		}
      	}
      	this.ddjs = {
      		content: ddjs.join(''),
      		images: ddjsImage
      	}
      },
    }
	}
</script>

<style lang="scss">
  .cljg-head{
      height: 55upx;
    }
  .cljg-body{
    padding:0 20upx;
    .time{
      text-align: right;
    }
  }
</style>
