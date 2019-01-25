<template>
	<view class="xcdd-hxclyj child-content">
    <!-- 蒙版 -->
    <view class="xcdd-hxclyj-mask" @tap="close"></view>
    <!-- 内容 -->{{hxclyValue=='1'}}
    <view class="xcdd-hxclyj-content">
      <!-- 小问题-向学校反馈建议 -->
      <view v-if="hxclyValue=='1'" class="xcdd-hxclyj-xwt">
        <textarea :value="xwtValue" @input="xwtChange" maxlength="4000"></textarea>
      </view>
      <!-- 一般问题-向学校发送整改建议 严重问题-向督导办上报整改建议 -->
      <view v-if="hxclyValue=='2' || hxclyValue=='3'" class="xcdd-hxclyj-ybwt">
        <kw-list-cell title="编号" rightNote="这里是编号"></kw-list-cell>
        <kw-list-cell title="单位" rightNote="这里是单位"></kw-list-cell>
        <kw-list-cell title="来源渠道" rightNote="这里是来源渠道"></kw-list-cell>
        <view class="clyj">
          <view>经挂牌督导，你单位存在以下问题及建议:</view>
          <textarea @input="ybwtChange" maxlength="4000"></textarea>
          <view>对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发
            <input />
            日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。
          </view>
        </view>
        <view class="ddsj">督导时间</view>
      </view>
      <!-- 复杂问题-向科室发送协商意见 -->
      <view v-if="hxclyValue=='4'" class="xcdd-hxclyj-fzwt">
        <picker :range="ksList">
          <kw-list-cell title="科室"></kw-list-cell>
        </picker>
        <view class="clyj">
          <view>我室责任督学于</view><text>time</text>对<text>school</text>
          进行了教育督导，发现该学校(幼儿园)存在以下问题及建议：
          <textarea @input="fzwtChange" maxlength="4000"></textarea>
          <view>请贵科室（中心）予以支持、配合、协调解决!</view>
        </view>
      </view>
      <view class="xcdd-hxclyj-save clearfix">
        <button @tap="close" size="mini" class="fl">取消</button>
        <button @tap="confirm" size="mini" class="fr">确定</button>
      </view>
    </view>
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import { uniBadge,uniTag,uniIcon} from '@dcloudio/uni-ui'
	export default {
		data() {
			return {
        ksList:["这里放复杂问题可以选择的科室"]
			};
		},
    props:{
      // 后续处理意见的状态 传进来的是0-4 对应的状态是1-5
      hxclyValue: String,
      // 小问题的值
      xwtValue: String,
      // 一般问题 || 严重问题 的值 
      ybwtValue: {
        type: Object,
        default () {
          return {
            bh:"编号",
            dw:"单位",
            lyqd:"来源渠道",
            jy:"建议",
            sbrq:"上报责任督学日期",
            ddsj:"督导时间"
          }
        }
      },
      // 复杂问题的值
      fzwtValue: {
        type: Object,
        default () {
          return {
            bh:"编号",
            ks:"科室、中心",
            dxname:"督学姓名",
            school:"学校名称",
            ddsj: "督导时间",
            jy:"建议"
          }
        }
      },
    },
    components:{uniBadge,uniTag,uniIcon,KwListCell},
    methods:{
      // 点击确定
      confirm(){
        if(this.hxclyValue=="0"){
          this.$emit("confirm",this.hxclyValue)
        } else if(this.hxclyValue=="2" || this.hxclyValue=="3"){
          this.$emit("confirm",this.ybwtValue)
        } else{
          this.$emit("confirm",this.fzwtValue)
        }
      },
      // 点击取消用的
      close(){
        this.$emit("close")
      },
      // 小问题修改
      xwtChange(e){
        this.hxclyValue = e.detail.value;
      },
      // 一般问题修改
      ybwtChange(e){
      },
      // 复杂问题修改
      fzwtChange(e){
      }
    }
	}
</script>

<style lang="scss">
  .xcdd-hxclyj{
    position: fixed;
    top:44upx;
    left: 0;
    width: 750upx;
    padding: 20upx;
    z-index: 1001;
    background: none;
    height: calc(100vh - 44px);
    /* #ifdef MP-WEIXIN */
    height: 100vh;
    top: 0;
    /* #endif */
    .clyj{
      padding: 20upx;
    }
    input{
      display: inline-block;
      width: 100upx;
      border:#D9D9D9 solid 2upx;
    }
    .ddsj{
      padding: 20upx;
      text-align: right;
    }
  }
  .xcdd-hxclyj-mask{
    z-index: auto;
    position: fixed;
    // background: rgba(0, 0, 0, 0.5);
    height: calc(100vh - 44px);
    width: 100%;
    top: 44px;
    left: 0;
    /* #ifdef MP-WEIXIN */
    height: 100vh;
    top: 0;
    /* #endif */
  }
  .xcdd-hxclyj-xwt{
    padding:20upx;
  }
  .xcdd-hxclyj-ybwt{
    border-radius: 10upx;
    padding-bottom: 20upx;
    
  }
  .xcdd-hxclyj-content{
    z-index: 1001;
    margin: auto;
    width: 100%;
    background: white;
    box-shadow: 0 0 15upx 5upx darkgray;
    padding-bottom: 20upx;
    border-radius: 10upx;
    textarea{
      width: 100%;
      border:#D9D9D9 solid 2upx;
    }
  }
  .xcddSelectGzjBorderBottom::after{
    position: absolute;
    z-index: 3;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    transform: scaleY(.5);
    background-color: #c8c7cc;  
    margin:0 20upx;
  }
  .xcdd-hxclyj-save{
    width: 670upx;
    height: 85upx;
    border-radius: 42.5upx;
    margin: 0 20upx;
    display: flex;
    background: white;
    button{
      padding: 0;
      width: 40%;
      border-radius: 42.5upx;
      background: linear-gradient(90deg, #00befe 0%, #028edf 100%), linear-gradient(#109dea, #109dea);
      color: white;
      line-height: 83upx;
    }
    .fl{
      background: lightgray;
    }
    button:after{
      border: none;
    }
  }
</style>
