<template>
	<view class="child-content">
    <kw-list-cell title="编号" :rightNote="data.BH"></kw-list-cell>
    <kw-list-cell title="科室中心" :rightNote="data.XXMC"></kw-list-cell>
    <kw-list-cell :isArrow="false">
      <view>
        <view class="ddjs-body">
          <view>
            <view>
              我室
              <text>{{data.AUTHOR}}</text>
              责任督学于
              <text>{{data.RQ}}</text>
              对
              <text>{{data.XXMC}}</text>
              进行了教育督导，发现该学校(幼儿园)存在以下问题：
            </view>
            <view>{{data.XSNR}}</view>
            <view>
              请贵科室（中心）予以支持、配合、协调解决!
            </view>
          </view>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell title="日期" :rightNote="data.RQ"></kw-list-cell>
    <kw-list-cell :isArrow="false">
      <view>
        <view class="ddjs-head clearfix" @click="cljgShow = !cljgShow">
          <text class="fl">处理结果</text>
          <view class="fr" v-show="!cljgShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="cljgShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view class="ddjs-body" v-show="cljgShow">
          <view v-if="resultShow">
           <kw-editor :content="ddjs">11</kw-editor>
          </view>
          <view v-if="detailShow">
           <rich-text :nodes="data.CLBG">22</rich-text>
          </view>
        </view>
      </view>
    </kw-list-cell>
    <view class="save" v-if="SF != undefined">
      <button @click="fn_zggz_xsyjs_dispose" v-if="!detailShow" 
        >处理</button>
      <button @click="changeStatue('26')" v-if="data.CLZTDM < '26'" 
        v-show="SF === 'dx'">确认整改完成</button>
    </view>
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import KwEditor from "@kwz/kw-ui/kw-editor.vue"

	export default {
    components:{KwListCell,KwEditor},
		data() {
			return {
        // 表单数据
        data:{
          BH:"",
          XXMC:"",
          XSNR:"",
          CLQX:"",
          RQ:"",
        },
        // 处理结果显示隐藏
        cljgShow:false,
        // 学校填写处理的值
        disposeResultData: '',
        // 已处理的详情页显示隐藏
        detailShow: false,
        // 编辑页显示隐藏
        resultShow: false,
        // 身份存储 督学||学校
        SF: '',
        ddjs:[]
			};
		},
    onLoad(query) {
      this.data.ZGXSID = query.id
      this.SF = query.SF
      this.loadData()
    },
    methods:{
      // 获取功能权限
      getPermission (url) {
        return this.$kwz.hasAuth(url, this)
      },
      // 事先加载数据
      loadData () {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doSelectByPrimary',
          type: 'POST',
          data: {
            ZGXSID: this.data.ZGXSID
          },
          vue: this,
          then (response) {
            let datas = response.datas
            datas.IS_PHONE = '2'
            if (datas && datas.ZGXSID) {
              this.data = datas
              // 处理结果赋值
              if (datas.CLBG != null) {
                this.disposeResultData = datas.CLBG
              }
              // 是学校且不是整改完成
              if (this.SF === 'xx' && datas.CLZTDM < '26') {
                this.resultShow = true
                this.setDdjs(this.data.CLBG)
              }
              // 是督学且不是整改完成
              if (this.SF === 'dx' || datas.CLZTDM === '26') {
                this.detailShow = true
              }
            }
            // 处理/验收进来的时候修改状态码
            if (this.SF) {
              if (this.data.CLZTDM <= '23' && this.SF === 'xx') {
                this.changeStatue('23')
              } else if (this.data.CLZTDM === '4' && this.SF === 'dx') {
                this.changeStatue('25')
              }
            } else {
              this.detailShow = true
            }
          }
        })
      },
         setDdjs (html) {
      	let ddjs = []
      	let ddjsSplit = this.$kwz.splitHtml(html)
      	if (ddjsSplit && ddjsSplit.length > 0) {
      		for (let i in ddjsSplit) {
      			let content = ddjsSplit[i]
      			if (content.content) {
      				ddjs.push({
      					type: 'textarea',
      					content: content.content
      				})
      			}
      			if (content.imageUrl) {
      				ddjs.push({
      					type: 'image',
      					content: content.imageUrl,
      					imageUrl: content.realUrl
      				})
      			}
      		}
      	} else {
      		ddjs.push({
      			type: 'textarea',
      			content: ''
      		})
      	}
      	this.ddjs = ddjs
      },
      // 改变处理状态
      changeStatue (status) {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doUpdate/XSYJ',
          type: 'POST',
          data: {
            CMS_LMTYPE: '1',
            ZGXSID: this.data.ZGXSID,
            CLLX: status
          },
          vue: this,
          then (response) {
            if (status === '26') {
              this.$kwz.redirect({url: 'xsyj'})
            }
          }
        })
      },
      // 点击处理事件
      fn_zggz_xsyjs_dispose () {
        if (!this.disposeResultData) {
          this.$kwz.alert('请填写处理结果')
          return
        }
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doUpdate/XSYJ',
          type: 'POST',
          data: {
            CLBG: this.disposeResultData,
            CMS_LMTYPE: '1',
            IS_PHONE: '2',     // 标记此内容是来自手机端
            ZGXSID: this.data.ZGXSID,
            CLLX: '24'
          },
          vue: this,
          then (response) {
            this.$kwz.alert('保存成功')
            this.$kwz.redirect({url: 'xsyj'})
          }
        })
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
  .save{
    width: 710upx;
    height: 85upx;
    border-radius: 42.5upx;
    border: solid 1upx #e1e1e1;
    margin: 25upx auto;
    display: flex;
    background: white;
    button{
      padding: 0;
      margin: 0;
      width: 100%;
      border-radius: 42.5upx;
      background: linear-gradient(90deg, #00befe 0%, #028edf 100%), linear-gradient(#109dea, #109dea);
      color: white;
      line-height: 83upx;
    }
    button:after{
      border: none;
    }
  }
</style>
