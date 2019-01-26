<template>
	<view class="child-content">
    <kw-list-cell title="学校" :rightNote="schoolName" @click="schoolShow=true"></kw-list-cell>
    <picker :range="ywsj" mode="date" @change="changeYwsj">
      <kw-list-cell title="计划时间" :rightNote="ywsj"></kw-list-cell>
    </picker>
    <picker :range="sdList" @change="changeSd">
      <kw-list-cell title="时段" :rightNote="sdValue"></kw-list-cell>
    </picker>
    <kw-list-cell title="随行督学" :rightNote="schoolName" @click="sxdxShow=true"></kw-list-cell>
    <picker :range="pjList" @change="changePj">
      <kw-list-cell title="规定任务评价" :rightNote="pjValue"></kw-list-cell>
    </picker>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="ddsxShow = !ddsxShow">
          <text class="fl">督导事项</text>
          <view class="fr" v-show="!ddsxShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="ddsxShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="ddsxShow" class="ddjs-body">
          <textarea maxlength="4000"></textarea>
        </view>
      </view>
    </kw-list-cell>
    
     <!-- 学校(请把学校搜索ajax写在该组件里) -->
    <view v-show="schoolShow">
      <xcdd-select-school @close="schoolShow=false" @confirm="confirmSchool"></xcdd-select-school>
    </view>
    <!-- 随行督学(请把随行督学搜索ajax写在该组件里) -->
    <view v-show="sxdxShow">
      <xcdd-select-sxdx @close="sxdxShow=false" @confirm="sxdxConfirm"></xcdd-select-sxdx>
    </view>
	</view>
</template>

<script>
  import { uniBadge,uniTag,uniIcon} from '@dcloudio/uni-ui'
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import XcddSelectSchool from "../xcdd/compoentns/xcdd-select-school.vue"
  import XcddSelectSxdx from "../xcdd/compoentns/xcdd-select-sxdx.vue"
	export default {
		data() {
			return {
        // 学校显示隐藏
        schoolShow:false,
        // 随行督学显示隐藏
        sxdxShow:false,
        // 学校名字
        schoolName:'laja',
        // 业务时间
        ywsj:"22",
        // 时段列表
        sdList:["上午","下午"],
        // 时段值
        sdValue:"上午",
        // 评估标准名字列表 规定任务评价
        pjList:["评估标准名字"],
        // 评估标准值
        pjValue:"2",
        // 督导事项显示隐藏
        ddsxShow:false
			};
		},
    components:{uniBadge,uniTag,uniIcon,KwListCell,XcddSelectSchool,XcddSelectSxdx,},
    methods:{
      // 更改业务时间
      changeYwsj (e) {
      	this.ywsj = e.detail.value
      },
      // 更改时段
      changeSd (e) {
      	this.ywsj = e.detail.value
      },
      // 更改评价标准
      changePj (e) {
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
      border:#D9D9D9 solid 2upx;
      textarea{
        width: 100%;
      }
  }
  
</style>
