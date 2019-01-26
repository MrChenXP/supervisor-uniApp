<template>
	<view class="child-content">
    <kw-list-cell title="编号" :rightNote="bh"></kw-list-cell>
    <kw-list-cell title="学校" :rightNote="schoolName" @click="schoolShow=true"></kw-list-cell>
    <picker :range="ksList" @change="changeKs">
      <kw-list-cell title="科室/中心" :rightNote="ksValue"></kw-list-cell>
    </picker>
    <picker :range="ywsj" mode="date" @change="changeYwsj">
      <kw-list-cell title="时间" :rightNote="ywsj"></kw-list-cell>
    </picker>
    <kw-list-cell>
      <view>
        <!-- <view class="ddjs-head clearfix" @click="xsyjShow = !xsyjShow">
          <text class="fl">填写协商意见</text>
          <view class="fr" v-show="!xsyjShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="xsyjShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view> -->
        <view class="ddjs-body">
          <view>
            <view>
              我室责任督学
              <text>名字</text>
              于
              <text>时间</text>
              对该校(幼儿园)进行了教育督导，发现该学校(幼儿园)存在以下问题：
            </view>
            <textarea maxlength="4000"></textarea>
            <view>
             请贵科室（中心）予以支持、配合、协调解决!
            </view>
          </view>
        </view>
      </view>
    </kw-list-cell>
    <view class="save">
      <button @click="saveUserSet">保存</button>
    </view>
    
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
        // 科室列表
        ksList:["科室"],
        // 科室值
        ksValue:"33",
        // 时间
        ywsj:"22",
        // 整改详情显示隐藏
        xsyjShow:false
			};
		},
    components:{uniBadge,uniTag,uniIcon,KwListCell,XcddSelectSchool},
    methods:{
      // 更改时间
      changeYwsj (e) {
      	this.ywsj = e.detail.value
      },
      // 更改科室
      changeKs(e) {
      	this.ksValue = e.detail.value
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
