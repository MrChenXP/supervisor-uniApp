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
              <text class="text-bold">{{data.AUTHOR}}</text>
              责任督学于
              <text class="text-bold">{{data.RQ}}</text>
              对
              <text class="text-bold">{{data.XXMC}}</text>
              进行了教育督导，发现该学校(幼儿园)存在以下问题：
            </view>
            <view class="text-bold">{{data.XSNR}}</view>
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
          <view class="fr" v-show="!cljgShow"><uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon></view>
          <view class="fr" v-show="cljgShow"><uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon></view>
        </view>
        <view class="ddjs-body" v-show="cljgShow">
          <view v-if="resultShow">
           <kw-editor :content="ddjs">11</kw-editor>
          </view>
          <view v-if="detailShow">
           <kw-editor-preview :content="ddjs"></kw-editor-preview>
          </view>
        </view>
      </view>
    </kw-list-cell>
    <view class="save" v-if="SF != undefined">
      <button @click="fn_zggz_xsyjs_dispose" v-if="!detailShow && hasClAuth" 
        >处理</button>
      <button @click="changeStatue('26')" v-if="data.CLZTDM < '26' && hasYsAuth" 
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
              this.setDdjs(this.data.CLBG)

              // 是学校且不是整改完成
              if (this.SF === 'xx' && datas.CLZTDM < '26') {
                this.resultShow = true
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
              } else if (this.data.CLZTDM === '24' && this.SF === 'dx') {
                this.changeStatue('25')
              }
            } else {
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
        if (!this.ddjs) {
          this.$kwz.alert('请填写处理结果')
          return
        }
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doUpdate/XSYJ',
          type: 'POST',
          data: {
            CLBG: this.getDdjs(),
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
