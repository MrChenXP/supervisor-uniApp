<template>
	<view class="child-content">
    <kw-list-cell title="工作计划" :rightNote="gzjh" @click="gzjhShow=true"></kw-list-cell>
    <kw-list-cell title="学校(校园)" :rightNote="gzjh" @click="schoolShow=true"></kw-list-cell>
    <kw-list-cell title="随行督学" :rightNote="gzjh" @click="sxdxShow=true"></kw-list-cell>
    <picker :range="time" mode="date">
      <kw-list-cell title="时间"></kw-list-cell>
    </picker>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="ddjsShow = !ddjsShow">
          <text class="fl">督导纪实</text>
          <view class="fr" v-show="!ddjsShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="ddjsShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="ddjsShow" class="ddjs-body">
          <textarea maxlength="4000"></textarea>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="jyzfShow = !jyzfShow">
          <text class="fl">典型经验和做法</text>
          <view class="fr" v-show="!jyzfShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="jyzfShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="jyzfShow" class="ddjs-body">
          <textarea maxlength="4000"></textarea>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="czwtShow = !czwtShow">
          <text class="fl">存在问题</text>
          <view class="fr" v-show="!czwtShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="czwtShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="czwtShow" class="ddjs-body">
          <textarea maxlength="4000"></textarea>
        </view>
      </view>
    </kw-list-cell>
    <picker :range="hxclyjList" value="hxclyValue" @change="PickerChange">
      <kw-list-cell title="后续处理意见" :rightNote="hxclyValue"></kw-list-cell>
    </picker>

    <!-- 工作计划(请把工作计划搜索ajax写在该组件里) -->
    <view v-show="gzjhShow">
      <xcdd-select-gzjh @close="gzjhShow=false" @confirm="gzjhConfirm"></xcdd-select-gzjh>
    </view>
    <!-- 学校(请把学校搜索ajax写在该组件里) -->
    <view v-show="schoolShow">
      <xcdd-select-school @close="schoolShow=false" @confirm="schoolConfirm"></xcdd-select-school>
    </view>
    <!-- 随行督学(请把随行督学搜索ajax写在该组件里) -->
    <view v-show="sxdxShow">
      <xcdd-select-sxdx @close="sxdxShow=false" @confirm="sxdxConfirm"></xcdd-select-sxdx>
    </view>
    <!-- 后续处理意见 请把ajax写在该组件里 -->
    <view v-show="hxclyjShow">
      <xcdd-hxclyj :hxclyValue="hxclyValue" @close="hxclyjShow=false" @confirm="confirmHxclyj"></xcdd-hxclyj>
    </view>
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import XcddSelectGzjh from "./compoentns/xcdd-select-gzjh.vue"
  import XcddSelectSchool from "./compoentns/xcdd-select-school.vue"
  import XcddSelectSxdx from "./compoentns/xcdd-select-sxdx.vue"
  import XcddHxclyj from "./compoentns/xcdd-hxclyj.vue"
  import {uniIcon} from "@dcloudio/uni-ui"
	export default {
    components:{KwListCell,XcddSelectGzjh,XcddSelectSchool,XcddSelectSxdx,XcddHxclyj,uniIcon},
		data() {
			return {
        // 工作计划显示隐藏
        gzjhShow:false,
        // 学校显示隐藏
        schoolShow:false,
        // 随行督学显示隐藏
        sxdxShow:false,
        // 工作计划数据
        gzjh:"工作计划",
        // 督导时间
        time:"",
        // 督导纪实
        ddjs:"<p>22</p>",
        // 督导纪实显示隐藏
        ddjsShow: false,
        // 经验做法显示隐藏
        jyzfShow:false,
        // 存在问题显示隐藏
        czwtShow:false,
        // 后续处理意见的类型
        hxclyjList:["无意见","小问题-向学校反馈建议","一般问题-向学校发送整改建议","严重问题-向督导办上报整改建议","复杂问题-向科室发送协商意见"],
        // 后续处理意见状态码
        hxclyValue:2,
        // 后续处理意见显示隐藏
        hxclyjShow:false
			};
		},
    methods:{
      // 路由跳转
      goLink(link){
        uni.navigateTo({
          url: link
        });
      },
      // 工作计划确定
      gzjhConfirm(e){
        console.log(e)
      },
      // 学校确定
      schoolConfirm(e){
      },
      // 随行督学确定
      sxdxConfirm(){},
      // 后续处理意见改变 按下选择器的确定 0没问题不用弹框
      PickerChange(e) {
        this.hxclyValue = e.target.value
        if(e!="0"){
          this.hxclyjShow = true
        }
      },
      // 后续处理意见点 确认
      confirmHxclyj(e){
        this.hxclyjShow=false;
        console.log(e);
      }
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
