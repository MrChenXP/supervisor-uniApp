<template>
	<view class="child-content">
    <kw-list-cell title="学校" :right-note="data.MB_ORG_MC" :isArrow="false"></kw-list-cell>
    <kw-list-cell title="听课日期" :right-note="data.YWSJ" :isArrow="false"></kw-list-cell>
    <kw-list-cell title="授课教师" :right-note="data.JSMC" :isArrow="false"></kw-list-cell>
    <kw-list-cell title="听课班级" :right-note="data.BJ" :isArrow="false"></kw-list-cell>
    <kw-list-cell title="听课学科" :right-note="data.XK" :isArrow="false"></kw-list-cell>
    <kw-list-cell :isArrow="false">
      <view>
        <view class="ddjs-head clearfix" @click="gcjlShow = !gcjlShow">
          <text class="fl">过程记录</text>
          <view class="fr" v-show="!gcjlShow"><uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon></view>
          <view class="fr" v-show="gcjlShow"><uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon></view>
        </view>
        <view class="ddjs-body" v-show="gcjlShow">
          <view>
           <kw-editor-preview :content="ddjs"></kw-editor-preview>
          </view>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell title="定性评价" :isArrow="false">
      <view slot="rightNote">
        <uni-rate :value="data.ZHPJ" ></uni-rate>
      </view>
    </kw-list-cell>
    <kw-list-cell :isArrow="false">
      <view>
        <view class="ddjs-head clearfix" @click="zhpjShow = !zhpjShow">
          <text class="fl">综合评价</text>
          <view class="fr" v-show="!zhpjShow"><uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon></view>
          <view class="fr" v-show="zhpjShow"><uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon></view>
        </view>
        <view class="ddjs-body" v-show="zhpjShow">
          <view>
           {{data.ZHPJ}}
          </view>
        </view>
      </view>
    </kw-list-cell>
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import KwEditorPreview from "@kwz/kw-ui/kw-editor-preview.vue"
  import {uniRate } from "@dcloudio/uni-ui"
	export default {
    components:{KwListCell,KwEditorPreview,uniRate},
		data() {
			return {
        // 过程记录显示隐藏
        gcjlShow:false,
        // 综合评价显示隐藏
        zhpjShow:false,
        // 表单数据
        data: {
          MXID: ''
        },
        tbmbglData: {}, // 老记录模板数据
        ddjs:"",
        isNew: "1"
			};
		},
    onLoad(param) {
      this.data.MXID = param.id
      this.isNew = param.isNew
      this.initPage()
    },
    methods:{
      // 初始化页面
      initPage () {
        if (this.data.MXID) {
          this.$kwz.ajax.ajaxUrl({
            url: 'jc_pgbzmx/doSelectByPrimary/TKJL',
            type: 'POST',
            data: {
              MXID: this.data.MXID
            },
            vue: this,
            then (response) {
              this.data = response.datas
              let date = new Date(this.data.YWSJ.replace(/-/g, '/'))
              this.data.YWSJ = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 '
              if (this.isNew !== "1") {
                console.log('old preview')
                // this.getTemplate()
              }
              this.data.SJ = JSON.parse(this.data.SJ)
              this.setDdjs(this.data.GCJL)
            }
          })
        }
      },
      // 设置督导纪实内容 将html转成ddjs
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
  .ddjs-head{
      height: 55upx;
    }
  .ddjs-body{
    padding:0 20upx;
    textarea{
      width: 100%;
      border:#D9D9D9 solid 2upx;
    }
    input{
      display: inline-block;
      width: 100upx;
      border:#D9D9D9 solid 2upx;
    }
  }
</style>
