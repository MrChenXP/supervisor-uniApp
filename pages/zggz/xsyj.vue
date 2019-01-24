<template>
	<view class="xsyj child-content">
    <!-- 搜索 -->
    <kw-search placeholder="点击进行搜索" :isInput="false">
      <view slot="content">
        <picker :range="xdList">
          <kw-list-cell title="学段"></kw-list-cell>
        </picker>
        <picker :range="ksList">
          <kw-list-cell title="科室"></kw-list-cell>
        </picker>
        <picker :range="zglxList">
          <kw-list-cell title="整改类型"></kw-list-cell>
        </picker>
        <picker :range="statusList">
          <kw-list-cell title="状态"></kw-list-cell>
        </picker>
      </view>
    </kw-search>
    <!-- 分页 -->
    <view class="pager">
      <view class="zg" @click="goLink('zggz')">整改</view>
      <view class="xs">协商</view>
    </view>
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
            <view class="fl">这里放科室</view>
            <view class="fr">发出时间：2019-10-09</view>
          </view>
          <view class="clearfix time">这里放整改类型</view>
          <view class="clearfix status">
            <view v-if="true" class="fl xswc"><uni-tag text="状态=='协商处理完成'用这个样式" size="small" type="primary"></uni-tag></view>
            <view v-if="false" class="fl xsz"><uni-tag text="其他状态用这个样式" size="small" type="primary"></uni-tag></view>
            <view v-if="false" class="fl shys"><uni-tag text="审核" size="small" type="primary"></uni-tag></view>
            <view v-if="false" class="fl shys"><uni-tag text="验收" size="small" type="primary"></uni-tag></view>
            <view v-if="true" class="fr cl"><uni-tag text="处理"  size="small" circle="true" inverted="true" type="primary"></uni-tag></view>
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
        xdList:['1'], // 学段选择列表
        // 科室选择列表
        ksList:['a'],
        zglxList:['2'] ,// 整改类型选择列表
        // 状态选择列表
        statusList:['b']
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
  .pager{
    height: 95upx;
    display: flex;
    flex-direction: row;
    justify-content:center;
    align-items: center;
    border-top: #dedede solid 2upx;
    .zg,.xs{
      width: 355upx;
      height: 65upx;
      text-align: center;
      line-height: 65upx;
      font-size: 28upx;
    }
    .zg{
      color: white;
      border-radius: 10upx 0 0 10upx;
      background-color: #d6f1fb;
      color: #00bdfd;
    }
    .xs{
      background-color: #00bdfd;

      border-radius: 0 10upx 10upx 0;
    }
  }
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
    height: calc(100% - 281upx);
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
          .xswc .uni-tag{
            background-color: #dcf0c7;
            border-color: #dcf0c7;
            color: #68ae1d;
          }
          .xsz .uni-tag{
            background-color: #f7e6c1;
            border-color: #f7e6c1;
            color: #f27506;
          }
          .shys .uni-tag{
            background-color: #d6f1fb;
            border-color: #d6f1fb;
            color: #109dea;
          }
          .cl .uni-tag{
            border-color: #00bdfd;
            color: #00bdfd;
            font-size: 24upx;
          }
        }
      }
    }
  }
</style>
