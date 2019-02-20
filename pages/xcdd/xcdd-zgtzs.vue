<template>
	<view class="child-content">
    <kw-list-cell title="编号" rightNote="22"></kw-list-cell>
    <kw-list-cell title="单位" rightNote="傻白"></kw-list-cell>
    <kw-list-cell>
      <view>
        <view>经挂牌督导，你单位存在以下问题:</view>
        <view>放问题</view>
        <view>
          对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发
          <text>放整改期限</text>
          日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell title="日期" rightNote="傻白"></kw-list-cell>
    <kw-list-cell title="状态" rightNote="傻白"></kw-list-cell>
    <kw-list-cell :isArrow=false>
      <view>
        <view class="cljg-head clearfix" @click="cljgShow = !cljgShow">
          <text class="fl">处理结果</text>
          <view class="fr" v-show="!cljgShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="cljgShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="cljgShow" class="cljg-body">
          <view class="cljg-text">这里显示内容</view>
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
        cljgShow:false
			};
		},
    components:{uniBadge,uniTag,uniIcon,KwListCell},
    methods:{
      
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
