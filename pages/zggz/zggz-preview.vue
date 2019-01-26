<template>
	<view class="child-content">
    <kw-list-cell title="编号" :rightNote="data.BH"></kw-list-cell>
    <kw-list-cell title="单位" :rightNote="data.XXMC"></kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-body">
          <view>
            <view>经挂牌督导，你单位存在以下问题:</view>
            <view>放XSNR</view>
            <view>
              对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发
              <text>CLQX</text>
              日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。
            </view>
          </view>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell title="日期" :rightNote="data.RQ"></kw-list-cell>
    <kw-list-cell title="处理状态" :rightNote="data.CLZTMC"></kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="cljgShow = !cljgShow">
          <text class="fl">处理结果</text>
          <view class="fr" v-show="!cljgShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="cljgShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view class="ddjs-body" v-show="cljgShow">
          <view>
           CLBG
          </view>
        </view>
      </view>
    </kw-list-cell>
	</view>
</template>

<script>
  import { uniBadge,uniTag,uniIcon} from '@dcloudio/uni-ui'
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
	export default {
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
        },
        // 处理结果显示隐藏
        cljgShow:false
			};
		},
    components:{uniBadge,uniTag,uniIcon,KwListCell},
    methods:{
      
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
