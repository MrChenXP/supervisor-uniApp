<template>
	<view class="child-content">
    <kw-list-cell title="编号" :rightNote="data.BH"></kw-list-cell>
    <kw-list-cell title="科室中心" :rightNote="data.XXMC"></kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-body">
          <view>
            <view>
              我室
              <text>data.AUTHOR</text>
              责任督学于
              <text>data.RQ、</text>
              对
              <text>data.XXMC、</text>
              进行了教育督导，发现该学校(幼儿园)存在以下问题：
            </view>
            <view>放XSNR</view>
            <view>
              请贵科室（中心）予以支持、配合、协调解决!
            </view>
          </view>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell title="日期" :rightNote="data.RQ"></kw-list-cell>
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
    <view class="save">
      <button @click="saveUserSet">保存</button>
    </view>
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
