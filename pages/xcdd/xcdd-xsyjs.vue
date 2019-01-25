<template>
	<view class="child-content">
    <kw-list-cell title="编号" rightNote="22"></kw-list-cell>
    <kw-list-cell title="科室/中心" rightNote="傻白"></kw-list-cell>
    <kw-list-cell>
      <view>
        我室
        <text>放整名字</text>
        责任督学于
        <text>放整督导时间</text>
        对
        <text>放整学校</text>
        进行了教育督导，发现该学校(幼儿园)存在以下问题:
        <view>放问题</view>
        <view>
          请贵科室（中心）予以支持、配合、协调解决!
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell>
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
