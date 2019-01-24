<template>
	<view class="ddjs child-content">
    <!-- 搜索 -->
    <kw-search placeholder="请输入学校名称">
      <view slot="content">
        <picker :range="startTime" mode="date">
          <kw-list-cell title="开始时间"></kw-list-cell>
        </picker>
        <picker :range="endTime" mode="date">
          <kw-list-cell title="结束时间"></kw-list-cell>
        </picker>
      </view>
    </kw-search>
    <!-- 功能(新增删除) -->
    <view class="gn">
      <view class="check fl" v-if="!deleteShow">
        <radio>全选</radio>
      </view>
      <view class="delete fl" v-if="deleteShow" @click="deleteCard('sc')">删除</view>
      <view class="delete fl"  v-if="!deleteShow" @click="deleteCard('qr')">确认删除</view>
      <view class="add fr">新增</view>
    </view>
    <!-- 列表组 -->
    <view class="lists">
      <!-- 单项列表 -->
      <view class="list">
        <view class="check" v-if="!deleteShow">
          <radio checked="true"></radio>
        </view>
        <view class="info">
          <view>光轴市白云区沙发小学</view>
          <view class="clearfix time">
            <view class="fl">这里写提交人</view>
            <view class="fr">督导时间：2019-10-09</view>
          </view>
          <view class="clearfix status">
            <view v-if="true" class="fl clyj"><uni-tag text="这里放处理意见" size="small" type="primary"></uni-tag></view>
            <!--别删 <view v-if="false" class="fl zgz"><uni-tag text="整改中" size="small" type="primary"></uni-tag></view> -->
            <!--别删 <view v-if="false" class="fl yys"><uni-tag text="已验收" size="small" type="primary"></uni-tag></view> -->
            <view v-if="true" class="fr bj"><uni-tag text="修改"  size="small" circle="true" inverted="true" type="primary"></uni-tag></view>
          </view>
        </view>
      </view>
    
    </view>
	 </view>
</template>

<script>
  import KwSearch from "@kwz/kw-ui/kw-search.vue"
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
	export default {
		data() {
			return {
				deleteShow: true, // 删除显示隐藏
        startTime:"", // 开始时间
        endTime:"" // 结束时间
			};
		},
    components:{KwSearch,KwListCell},
    methods:{
      // 删除
      deleteCard(status){
        if(status=="sc"){
          this.deleteShow = false;
        }else{
          this.deleteShow = true;
        }
      },
      // 路由跳转
      goLink(link){
        uni.navigateTo({
          url: link,
        });
      }
    }
	}
</script>

<style lang="scss">
  .gn{
    height: 86upx;
    padding: 18upx 0;
    .delete,.add,.check{
      width: 125upx;
      height: 50upx;
      border-radius: 25upx;
      margin-left:25upx;
      display: flex;
      justify-content:center;
      align-items: center;
    }
    .delete{
      border: solid 2upx #e64c48;
      color: #e64c48;
    }
    .add{
      margin-right: 25upx;
      border: solid 2upx #68ae1d;
      color: #68ae1d;
    }
  }
  .lists{
    height: calc(100% - 186upx);
    padding : 0 20upx;
    overflow: auto;
    .list{
      margin-bottom: 20upx;
      background: white;
      padding: 25upx;
      border-radius: 15upx;
      display: flex;
      flex-direction: row;
      .check{
        width: 50upx;
      }
      .info{
        flex-grow: 2;
        .time{
          color:#999999;
          font-size: 26upx;
          margin: 10upx 0;
          view{
            color:#999999;
          }
        }
        .status{
          margin: 10upx 0 0;
          font-size: 24upx;
          .clyj .uni-tag{
            background-color: #dcf0c7;
            border-color: #dcf0c7;
            color: #68ae1d;
          }
//           .zgz .uni-tag{
//             background-color: #f7e6c1;
//    别删         border-color: #f7e6c1;
//             color: #f27506;
//           }
//           .yys .uni-tag{
//             background-color: #d6f1fb;
//             border-color: #d6f1fb;
//             color: #109dea;
//           }
          .bj .uni-tag{
            border-color: #00bdfd;
            color: #00bdfd;
            font-size: 24upx;
          }
        }
        
      }
    }
  }
</style>
