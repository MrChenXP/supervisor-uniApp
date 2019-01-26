<template>
	<view class="child-content">
    <kw-list-cell title="编号" :rightNote="bh"></kw-list-cell>
    <kw-list-cell title="学校" :rightNote="schoolName" @click="schoolShow=true"></kw-list-cell>
    <picker :range="ywsj" mode="date" @change="changeYwsj">
      <kw-list-cell title="时间" :rightNote="ywsj"></kw-list-cell>
    </picker>
    <kw-list-cell title="督学" :rightNote="bh"></kw-list-cell>
    <kw-list-cell>
      <view>
        <!-- <view class="ddjs-head clearfix" @click="zggzShow = !zggzShow">
          <text class="fl">填写整改工作</text>
          <view class="fr" v-show="!zggzShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="zggzShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view> -->
        <view class="ddjs-body">
          <view>
            <view>经挂牌督导，你单位存在以下问题:</view>
            <textarea maxlength="4000"></textarea>
            <view>
              对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发
              <input />
              日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。
            </view>
          </view>
        </view>
      </view>
    </kw-list-cell>
    
    <!-- 学校(请把学校搜索ajax写在该组件里) -->
    <view v-show="schoolShow">
      <xcdd-select-school @close="schoolShow=false" @confirm="confirmSchool"></xcdd-select-school>
    </view>
	</view>
</template>

<script>
  import { uniBadge,uniTag,uniIcon} from '@dcloudio/uni-ui'
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import XcddSelectSchool from "../xcdd/compoentns/xcdd-select-school.vue"
	export default {
		data() {
			return {
        bh:"laji",
        // 学校显示隐藏
        schoolShow:false,
        // 学校名字
        schoolName:'laja',
        // 时间
        ywsj:"22",
        // 整改详情显示隐藏
        zggzShow:false
			};
		},
    components:{uniBadge,uniTag,uniIcon,KwListCell,XcddSelectSchool},
    methods:{
      // 更改时间
      changeYwsj (e) {
      	this.ywsj = e.detail.value
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
