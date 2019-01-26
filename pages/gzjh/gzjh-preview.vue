<template>
	<view class="child-content">
    <kw-list-cell title="学校" :rightNote="school"></kw-list-cell>
    <kw-list-cell title="督导时段" :rightNote="school"></kw-list-cell>
    <kw-list-cell title="小组成员" :rightNote="school"></kw-list-cell>
    <kw-list-cell title="确认参加成员" :rightNote="school"></kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="ddsxShow = !ddsxShow">
          <text class="fl">督导事项</text>
          <view class="fr" v-show="!ddsxShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="ddsxShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="ddsxShow" class="ddjs-body">
          <view class="ddjs-text">这里显示内容</view>
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
        school:"垃圾学校",
        // 督导事项显示隐藏
        ddsxShow:false
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
      border:#D9D9D9 solid 2upx;
      textarea{
        width: 100%;
      }
  }
</style>
