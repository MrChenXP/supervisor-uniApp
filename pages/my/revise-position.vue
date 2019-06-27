<template>
	<view class="child-content revise-institution">
		<radio-group class="position-xx">
			<label class="" v-for="(item, index) in userOrgs" :key="index" :class="{borderBottom: index < userOrgs.length-1}">
				<radio :value="item.value" />
				<view class="radio-label">{{item.label}}</view>
			</label>
      
      <label class="" v-for="(item, index) in userOrgs" :key="index" :class="{borderBottom: index < userOrgs.length-1}">
      	<radio :value="item.value" />
      	<view class="radio-label">{{item.label}}</view>
      </label>
      
      <view class="save">
        <button @click="radioChange">签到</button>
      </view>
      <view class="lists-dkjl">打卡记录</view>
		</radio-group>
    
		
    
    <!-- 列表组 -->
    <checkbox-group class="lists">
      <view>
    	<!-- 单项列表 -->
        <view class="list" v-for="(item, index) in 50" :key="index"  >
          <view class="info">
            <view>
              可放文字
            </view>
            <view class="clearfix time">
              <view class="fl">可放文字</view>
              <view class="fr">可放文字</view>
            </view>
          </view>
        </view>
      </view>
    </checkbox-group>
    <uni-load-more :status="loadingType" :contentText="contentText"></uni-load-more>
    
	</view>
</template>

<script>
	import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import {uniLoadMore} from '@dcloudio/uni-ui'

	export default {
		components: {
			KwListCell,uniLoadMore
		},
		data() {
			return {
				userOrgs: [{
					label: '在您附近未找到学校',
					value: ''
				}],
        // 加载更多状态
        loadingType: "more",
        // 加载更多状态对应文字 键名不能改
        contentText: {
          contentdown: "上拉显示更多",
          contentrefresh: "正在加载...",
          contentnomore: "没有更多数据了"
        },
			};
		},
		onLoad() {
			// this.loadUserOrgs()
		},
    // 上拉加载事件
    onReachBottom() {
      // 先把状态变成加载中
      this.loadingType = "loading"
      // 然后加载数据
      // 加载完将数据变为 上拉显示更多 || 没有更多数据了
      this.loadingType = "more"
      this.loadingType = "noMore"
      
    },
		methods: {
      // 加载更多
      loadMore(){
        console.log('loadMore')
      }
		}
	}
</script>

<style lang="scss">
	.revise-institution {
		width: 100%;
	}

	label {
		display: inline-block;
		background: white;
		width: 100%;
		padding: 20upx !important;
		position: relative;
		box-sizing: border-box;
	}

	.radio-label {
		text-align: right;
		position: absolute;
		right: 20upx;
		top: 20upx;
	}

	.borderBottom::after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		transform: scaleY(.5);
		background-color: #c8c7cc;
		margin: 0 20upx;
	}

	.save {
		width: 100%;
		height: 135upx;
    margin: 0;
		display: flex;
		background: white;
    border-radius: 0 !important;
    border: none !important;
		button {
      margin: 25upx auto;
			padding: 0;
			margin: 2;
			width: 100%;
			background: linear-gradient(90deg, #00befe 0%, #028edf 100%), linear-gradient(#109dea, #109dea);
			color: white;
			line-height: 83upx;
      height: 85upx;
		}

		button:after {
			border: none;
		}
	}
  
  .position-xx{
    position: sticky;
    top: 0;
  }
  .jzgd {
  	width: 100%;
  	height: 85upx;
  	// border-radius: 42.5upx;
  	// border: solid 1upx #e1e1e1;
  	margin: 25upx auto;
  	// display: flex;
  	background: white;
    position: fixed;
    bottom: 0;
    text-align: center;
    color: #999999;
    line-height: 85upx;
  // 	button {
  // 		padding: 0;
  // 		margin: 0;
  // 		width: 100%;
  // 		border-radius: 42.5upx;
  // 		background: linear-gradient(90deg, #00befe 0%, #028edf 100%), linear-gradient(#109dea, #109dea);
  // 		color: white;
  // 		line-height: 83upx;
  // 	}
  // 
  // 	button:after {
  // 		border: none;
  // 	}
  }
  .lists-dkjl{
    height: 50upx;
    margin: 0 20upx;
    background: #f5f5f5;
    text-shadow: 2upx 2upx 5upx #999999;
  }
  .lists{
    .time{
      margin: 0 !important;
    }
    .list{
      padding: 15upx;
    }
  }
</style>
