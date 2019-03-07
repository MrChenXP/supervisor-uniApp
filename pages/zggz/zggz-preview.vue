<template>
	<view class="child-content">
    <kw-list-cell title="编号" :rightNote="data.BH"></kw-list-cell>
    <kw-list-cell title="单位" :rightNote="data.XXMC"></kw-list-cell>
    <kw-list-cell :isArrow="false">
      <view>
        <view class="ddjs-body">
          <view>
            <view>经挂牌督导，你单位存在以下问题:</view>
            <view class="text-bold">{{data.XSNR}}</view>
            <view>
              对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发
              <text class="text-bold">{{data.CLQX}}</text>
              日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。
            </view>
          </view>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell title="日期" :rightNote="data.RQ"></kw-list-cell>
    <kw-list-cell title="处理状态" :rightNote="data.CLZTMC"></kw-list-cell>
    <!-- 处理结果 -->
    <kw-list-cell :isArrow="false">
      <view>
        <view class="ddjs-head clearfix" @click="cljgShow = !cljgShow">
          <text class="fl">处理结果</text>
          <view class="fr" v-show="!cljgShow"><uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon></view>
          <view class="fr" v-show="cljgShow"><uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon></view>
        </view>
        <view class="ddjs-body" v-show="cljgShow">
          <view v-if="resultShow">
           <kw-editor :content="ddjs"></kw-editor>
          </view>
          <view v-if="detailShow">
           <kw-editor-preview :content="ddjs"></kw-editor-preview>
          </view>
        </view>
      </view>
    </kw-list-cell>
    <!-- 处理和确认整改完成 -->
    <view class="save" v-if="SF != undefined">
      <button @click="fn_zggz_zgtzs_dispose" v-if="resultShow && hasClAuth" 
        >处理</button>
      <button @click="changeStatue('6')" v-if="data.CLZTDM < '6' && hasYsAuth"
        v-show="SF === 'dx'">确认整改完成</button>
    </view>
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import KwEditor from "@kwz/kw-ui/kw-editor.vue"
  import KwEditorPreview from "@kwz/kw-ui/kw-editor-preview.vue"

	export default {
    components:{KwListCell,KwEditor,KwEditorPreview},
		data() {
			return {
        // 表单数据
        data:{
          BH:"",
          XXMC:"",
          XSNR:"",
          CLQX:"",
          RQ:"",
          CLZTMC:"",
          CLBG:[]
        },
        // 处理结果显示隐藏
        cljgShow:false,
        // 已处理的详情页显示隐藏
        detailShow: false,
        // 编辑页显示隐藏
        resultShow: false,
        // 身份存储 督学||学校
        SF: '',
        ddjs: {
        	content: '',
        	images: []
        },
			};
		},
    onLoad(query) {
      this.data.ZGXSID = query.id
      this.SF = query.SF
      this.loadData()
		},
    computed:{
      // 处理权限
      hasClAuth () {
      	return this.$kwz.hasAuth('dd_zgxs/doUpdate/XSYJ')
      },
      // 确认整改(验收)权限
      hasYsAuth () {
      	return this.$kwz.hasAuth('dd_zgxs/zgtz_done')
      }
    },
    methods:{
      // 获取功能权限
      getPermission (url) {
        return this.$kwz.hasAuth(url, this)
      },
      // 预先加载数据
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
            if (datas && datas.ZGXSID) {
              this.data = datas
              this.setDdjs(this.data.CLBG)
              // 是学校且状态不是整改完成
              if (this.SF === 'xx' && datas.CLZTDM < '6') {
                // 处理结果按钮
                this.resultShow = true
              }
              // 是督学且状态是整改完成
              if (this.SF === 'dx' || datas.CLZTDM === '6') {
                // 处理结果的展示
                this.detailShow = true
              }
            }
            if (this.SF) { // 如果是处理/验收进来的
              // 如果还在整改中 且是学校点进来 改状态码为3（学校签收）
              if (this.data.CLZTDM <= '3' && this.SF === 'xx') {
                this.changeStatue('3')
                // 如果是督学点进来且学校整改完成 将状态码改成5（督学签收）
              } else if (this.data.CLZTDM === '4' && this.SF === 'dx') {
                this.changeStatue('5')
              }
            } else { // 否则就是新增进来的
              this.detailShow = true
            }
          }
        })
      },
      // 获取督导纪实内容 将ddjs转成html
      getDdjs () {
      	let ddjs = [this.ddjs.content]
      	if(this.ddjs.images && this.ddjs.images.length > 0) {
      		let images = this.ddjs.images
      		for(let i = 0;i < images.length; i++) {
      			ddjs.push('<p><img src="')
      			ddjs.push(images[i].imageUrl)
      			ddjs.push('" ></p>')
      		}
      	}
      	return ddjs.join('')
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
      // 改变处理状态
      changeStatue (status) {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doUpdate/ZGTZ',
          type: 'POST',
          data: {
            CMS_LMTYPE: '2',
            ZGXSID: this.data.ZGXSID,
            CLLX: status
          },
          vue: this,
          then (response) {
            if (status === '6') {
              this.$kwz.redirect({url: 'zggz'})
            }
          }
        })
      },
      // 点击处理事件(学校才有)
      fn_zggz_zgtzs_dispose () {
        if (!this.ddjs) {
          this.$kwz.alert('请填写处理结果')
          return
        }
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doUpdate/ZGTZ',
          type: 'POST',
          data: {
            CLBG: this.getDdjs(),
            CMS_LMTYPE: '2',
            IS_PHONE: '2',     // 标记此内容是来自手机端
            ZGXSID: this.data.ZGXSID,
            CLLX: '4'
          },
          vue: this,
          then (response) {
            this.$kwz.alert('保存成功')
            this.$kwz.redirect({url: 'zggz'})
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
//     textarea{
//       width: 100%;
//       border:#D9D9D9 solid 2upx;
//     }
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
