<template>
	<view class="child-content revise-institution">
		<radio-group class="position-xx" v-if="currentRecordShow" @change="changePostionOrg">
			<label v-for="(item, index) in userOrgs" :key="index" :class="{borderBottom: index < userOrgs.length-1}">
				<radio v-if="userOrgsShow" :value="item.ORG_ID"  />
				<view class="radio-label">{{item.ORG_MC}}</view>
			</label>
      
      <view class="save">
        <button @click="checkPosition">签到</button>
      </view>
      <view class="lists-dkjl">打卡记录</view>
		</radio-group>
    
		<checkbox-group class="lists position-xx lists-pos" v-else >
		  <view>
		    <view class="list" >
		      <view class="info">
		        <view>
		          {{currentRecord.ORG_MC}}
		        </view>
		        <view class="clearfix time">
		          <view class="fl">{{currentRecord.IN_TIME}}</view>
		          <!-- <view class="fr">可放文字11</view> -->
		        </view>
		      </view>
		    </view>
		  </view>
			<view class="save">
			  <button @click="checkPosition">签出</button>
			</view>
			<view class="lists-dkjl">打卡记录</view>
		</checkbox-group>
		
    <!-- 列表组 -->
    <checkbox-group class="lists">
      <view>
    	<!-- 单项列表 -->
        <view class="list" v-for="(item, index) in currentRecords" :key="index"  >
          <view class="info">
            <view>{{item.ORG_MC}}</view>
            <view class="clearfix time">
              <view class="fl">签到时间:{{item.IN_TIME}}</view>
              <view class="fr">签出时间:{{item.OUT_TIME}}</view>
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
					ORG_MC: '在您附近未找到学校',
					ORG_ID: ''
				}],
				// 加载的学校是否空
				userOrgsShow: false,
        // 加载更多状态
        loadingType: "nomore",
        // 加载更多状态对应文字 键名不能改
        contentText: {
          contentdown: "上拉显示更多",
          contentrefresh: "正在加载...",
          contentnomore: "没有更多数据了"
        },
				// 当前的签到记录
				currentRecord: {
						ORG_ID: ''
				},
				// 显示签到页面还是显示签出页面
				currentRecordShow: true,
				// 历史记录
				currentRecords: []
			};
		},
		onLoad() {
			this.init()
			// this.loadUserOrgs()
		},
    // 上拉加载事件
    onReachBottom() {
			this.initPage()
      // 先把状态变成加载中
      this.loadingType = "loading"
      // 然后加载数据
      // 加载完将数据变为 上拉显示更多 || 没有更多数据了
      this.loadingType = "more"
      this.loadingType = "noMore"
    },
		methods: {
			init () {
				// 加载当前签到状态
				this.initPosition()
				// 加载历史记录
				this.loadPistionRecords()
			},
			// 初始化页面 flag =>true/false 初始化/增加
			initPage (flag) {
				this.$kwz.ajax.ajaxUrl({
					url: 'jc_gps/listPositionRecord',
					type: 'GET',
					vue: this,
					then (response) {
						if (response.statusCode === '200' && response.datas && response.datas.length > 0) {
							this.currentRecords = response.datas
						}
					}
				})
			},
			initPosition () {
				this.$kwz.ajax.ajaxUrl({
					url: 'jc_gps/getCurrentPostionRecord',
					type: 'GET',
					vue: this,
					then (response) {
						if (response.statusCode === '200' && response.datas && response.datas.length > 0) {
							// 已存在签到记录
							this.currentRecordShow = false
							this.currentRecord = response.datas[0]
						} else {
							// 不存在签到记录,获取当前地理位置，请求附近的学校列表
							this.loadPosition((res) => {
								this.$kwz.ajax.ajaxUrl({
									url: 'jc_gps/jc_gps/getOrgByPosition',
									type: 'GET',
									data: {
										latitude: res.latitude,
										longitude: res.longitude
									},
									vue: this,
									then (response) {
										if (response.statusCode === '200' && response.datas) {
											this.userOrgs = response.datas
											this.userOrgsShow = true
										}
									}
								})
							})
						}
					}
				})
			},
			loadPistionRecords () {
				this.initPage(true)
			},
			// 签到/签出
			checkPosition () {
				let positionData = {}
				if (!this.currentRecordShow) {
					// 签到状态
					positionData.record_id = this.currentRecord.RECORD_ID
				}
				if (!this.currentRecord.ORG_ID) {
					this.$kwz.alert('未定位学校，请先定位学校')
				}
				positionData.ORG_ID = this.currentRecord.ORG_ID
				this.loadPosition((res) => {
					
					positionData.latitude = res.latitude
					positionData.longitude = res.longitude
					
					this.$kwz.ajax.ajaxUrl({
						url: 'jc_gps/savePositionRecord',
						type: 'POST',
						data: positionData,
						vue: this,
						then (response) {
							if (response.statusCode === '200' ) {
								this.$kwz.alert(response.datas.resultMsg || '操作成功')
							}
						}
					})
				})
			},
			changePostionOrg (org) {
				this.currentRecord.ORG_ID = org
			},
			loadPosition (callback) {
				let vue = this
				uni.getLocation({
					success (res) {
						if (typeof callback === 'function') {
							callback.apply(vue, [res])
						}
					}, 
					fail () {
						vue.$kwz.alert('获取当前地理位置失败')
					}
				})
			}
      // 加载更多
//       loadMore(){
//         console.log('loadMore')
//       }
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
	.lists-pos{
		.list{
		background: #cccccc;
		margin-top: 10upx;
		}
	}
</style>
