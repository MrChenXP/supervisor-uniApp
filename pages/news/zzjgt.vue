<template>
	<view class="child-content">
    <!-- 一级责任区 -->
    <view v-for="(one, oneKey) in data" :key="oneKey" class="list-cell" >
      <view>
        {{one.ORG_MC}}
        <text v-if="one.ROLELIST.length > 0" @click="oneCkdx(one.ROLELIST)" class="col-link m-l">查看督学</text>
        <text  v-if="one.CHILDREN.length == 0 && one.SCHOOLLIST.length>0" @click="oneCkdx(one.SCHOOLLIST)" class="col-link m-l">查看学校（{{one.XX_COUNT}}）</text>
      </view>
      
      <!-- 二级责任区 -->
      <view v-if="one.CHILDREN.length > 0" v-for="(two, twoKey) in one.CHILDREN" :key="twoKey">
        <text v-if="twoKey == (one.CHILDREN.length - 1)">└─</text>
        <text v-else>├─</text>
        {{two.ORG_MC}}
        <text v-if="two.ROLELIST.length > 0" @click="oneCkdx(two.ROLELIST)" class="col-link m-l">查看督学</text>
        <text  v-if="two.CHILDREN.length == 0 && two.SCHOOLLIST.length>0" @click="oneCkdx(two.SCHOOLLIST)" class="col-link m-l">查看学校（{{two.XX_COUNT}}）</text>
        
        <!-- 三级责任区 -->
        <view v-if="two.CHILDREN.length > 0" v-for="(three,threeKey) in two.CHILDREN" :key="threeKey">
          <text v-if="twoKey != (one.CHILDREN.length - 1)">│</text>
          <text class="m-l">
            <text v-if="threeKey == (two.CHILDREN.length - 1)">└─</text>
            <text v-else>├─</text>
            {{three.ORG_MC}}
          </text>
          <text v-if="three.ROLELIST.length > 0" @click="oneCkdx(three.ROLELIST)" class="col-link m-l">查看督学</text>
          <text  v-if="three.CHILDREN.length == 0 && three.SCHOOLLIST.length>0" @click="oneCkdx(three.SCHOOLLIST)" class="col-link m-l">查看学校（{{three.XX_COUNT}}）</text>
          
          <!-- 四级责任区- -->
          <view v-if="three.CHILDREN.length > 0" v-for="(four,fourKey) in three.CHILDREN" :key="fourKey">
            <text v-if="twoKey != (one.CHILDREN.length - 1)">│</text>
            <text class="m-l"><text v-if="threeKey != (two.CHILDREN.length - 1)">│</text></text>
            <text class="m-l">
              <text v-if="fourKey == (three.CHILDREN.length - 1)">└─</text>
              <text v-else>├─</text>
              {{four.ORG_MC}}
            </text>
            <text v-if="four.ROLELIST.length > 0" @click="oneCkdx(four.ROLELIST)" class="col-link m-l">查看督学</text>
            <text  v-if="four.CHILDREN.length == 0 && four.SCHOOLLIST.length>0" @click="oneCkdx(four.SCHOOLLIST)" class="col-link m-l">查看学校（{{four.XX_COUNT}}）</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 查看督学 -->
    <view v-show="ckdxShow" class="ckdx">
      <view class="ckdx-mask" @touchmove.stop.prevent="moveHandle" @click="ckdxShow = !ckdxShow"></view>
      <view class="ckdx-body">
        <view v-for="(item,key) in dxxxData" :key="key">
          <view v-if="!item.ORG_MC">
            {{item.ROLE_MC}} : <text class="color-999">{{item.DXMC}}</text>
          </view>
          <view v-else>
            {{item.ORG_MC}}
          </view>
        </view>
      </view>
    </view>
	</view>
</template> 

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import uniCollapse from '@dcloudio/uni-ui/lib/uni-collapse/uni-collapse.vue'
  import uniCollapseItem from '@dcloudio/uni-ui/lib/uni-collapse-item/uni-collapse-item.vue'
  import uniIcon from "@dcloudio/uni-ui/lib/uni-icon/uni-icon.vue"
	export default {
    components:{KwListCell,uniCollapse,uniCollapseItem,uniIcon},
		data() {
			return {
        data:[],
        // 查看督学显示隐藏
        ckdxShow:false,
        // 查看督学/学校数据
        dxxxData:{}
			};
		},
    onShow() {
    	this.initData()
    },
    methods:{
      moveHandle(){},
      // 查看督学/学校
      oneCkdx(val){
        this.ckdxShow = true
        this.dxxxData = val
      },
      initData(){
        this.$kwz.ajax.ajaxUrl({
        	url: 'dd_zrqgl/open/doPageListZzjgt',
        	type: 'POST',
        	vue: this,
        	then(data) {
            this.data = data.datas
          }
        })
      }
    }
	}
</script>

<style lang="scss">
  .list-cell{
    min-height: 95upx;
    padding: 20upx 20upx;
    box-sizing: border-box;
    position: relative;
    background: white;
    margin-bottom: 20upx;
  }
  .m-l{
    margin-left: 50upx;
  }
  .col-link{
    color: #0580c2;
  }
  .ckdx{
    z-index: 999;
    position: fixed;
    top: 44px;
    height: calc(100vh - 44px);
    left: 0;
    width: 100%;
    /* #ifdef MP-WEIXIN */
    height: 100vh;
    top: 0;
    /* #endif */
    .ckdx-mask{
      z-index: 999;
      position: fixed;
      background: rgba(0, 0, 0, 0.5);
      height: calc(100vh - 44px);
      width: 100%;
      top: 44px;
      left: 0;
      /* #ifdef MP-WEIXIN */
      height: 100vh;
      top: 0;
      /* #endif */
    }
    .ckdx-body{
      background: white;
      z-index: 1001;
      padding: 20upx;
      position: absolute;
      top: 150upx;
      width: 80%;
      left: 10%;
      border-radius: 10upx;
    }
  }
</style>
