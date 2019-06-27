<template>
	<view class="child-content revise-institution">
		<radio-group class="position-xx">
			<label class="" v-for="(item, index) in userOrgs" :key="index" :class="{borderBottom: index < userOrgs.length-1}">
				<radio :value="item.value" />
				<view class="radio-label">{{item.label}}</view>
			</label>
		</radio-group>
		<view class="save">
		  <button @click="radioChange">签到</button>
		</view>
    
    <view class="lists-dkjl">打卡记录</view>

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
    <view class="jzgd" @click="loadMore">
      加载更多
      <uni-icon type="arrowdown" size="25" color="#999999"></uni-icon>
    </view> 
    
    
	</view>
</template>

<script>
	import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
	export default {
		components: {
			KwListCell
		},
		data() {
			return {
				userOrgs: [{
					label: '在您附近未找到学校',
					value: ''
				}]
			};
		},
		onLoad() {
			// this.loadUserOrgs()
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
		height: 85upx;
		border-radius: 42.5upx;
		border: solid 1upx #e1e1e1;
		margin: 25upx auto;
		display: flex;
		background: white;
    position: fixed;
    top: 90upx;
		button {
			padding: 0;
			margin: 0;
			width: 100%;
			border-radius: 42.5upx;
			background: linear-gradient(90deg, #00befe 0%, #028edf 100%), linear-gradient(#109dea, #109dea);
			color: white;
			line-height: 83upx;
		}

		button:after {
			border: none;
		}
	}
  
  .position-xx{
    height: 90upx;
    position: fixed;
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
    position: fixed;
    top: 225upx;
    height: 50upx;
    margin: 0 20upx;
  }
  .lists{
    height: calc(100% - 355upx);
    position: fixed;
    top: 275upx;
    .time{
      margin: 0 !important;
    }
    .list{
      padding: 15upx;
    }
  }
</style>
