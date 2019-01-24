<template>
	<view class="workspace main-content">
    <!-- 上部图片 -->
		<view class="banner">
      <image src="../../static/images/workspace.png" ></image>
    </view>
    <!-- 统计 -->
    <view class="statistics">
      <view class="s-body">
        <view class="badge">
          <text>2</text>        	
        </view>
        <view class="s-title">我的待办</view>
      </view>
      <view class="s-body">
        <view class="badge">
          <text>2</text>        	
        </view>
        <view class="s-title">出行次数</view>
      </view>
      <view class="s-body">
        <view class="badge">
          <text>2</text>        	
        </view>
        <view class="s-title">听课次数</view>
      </view>
      <view class="s-body">
        <view class="badge">
          <text>2</text>        	
        </view>
        <view class="s-title">验收数</view>
      </view>
    </view>
    <!-- 功能 -->
    <view class="gn" >
    	<kw-list-cell v-for="(item, index) in products" :title="item.PRO_MC" v-bind:key="index" :note="item.PRO_DESC" :redDot="true"
    	    :thumb="item.THUMB" :link="item.LINK"></kw-list-cell>
      <!-- <kw-list-cell title="现场督导" note="对学校的...现场监督指导"
          thumb="../../static/images/icons/video.png"></kw-list-cell>
      <kw-list-cell title="工作计划" note="关于...的工作安排和计划"
          thumb="../../static/images/icons/jsb.png"></kw-list-cell>
      <kw-list-cell title="听课记录" :border="{bottom:false}" note="选择学校听课记录" :redDot="true"
          thumb="../../static/images/icons/edit.png"></kw-list-cell> -->
    </view>
	<kw-login v-if="loginShow" @loginSuccess="loginSuccess" @closeLogin="closeLogin" ></kw-login>
	</view>
</template>
<script>
	import KwLogin from "@kwz/kw-ui/kw-login.vue"
	import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
	export default {
		data() {
			return {
				msg: "...",
				loginShow: false,
				products : []
			};
		},
		components: {
			KwLogin,
			KwListCell
		},
		onShow () {
      this.loginShow = !this.$kwz.isLogin()
			this.loadIndexData();
		},
		methods: {
			// 加载工作区数据
			loadIndexData () {
				// 验证是否属于登陆状态
				if (this.$kwz.isLogin()) {
					this.initProducts();
				}
			},
			// 关闭登陆框
			closeLogin () {
				if (!this.$kwz.isLogin()) {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}
			},
			// 登陆成功事件
			loginSuccess () {
				this.loginShow = false
				this.initProducts();
			},
			initProducts () {
				// let products = this.$kwz.getProducts();
				this.products = this.$kwz.getProducts();
			}
		}
	}
</script>

<style lang="scss">
  .banner,.banner image{
    width: 100%;
    height: 254upx;
  }
  .statistics{
    height: 200upx;
    background: white;
    padding: 30upx 75upx;
    display: flex;
    .s-body{
      width: 150upx;
      height: 140upx;
      .badge{
        background: #f5f5f5;
        margin: 0 25upx;
        border-radius: 50%;
        width: 100upx;
        height: 100upx;
        display: flex;
        text{
          margin: auto;
          color: #109dea;
          font-size: 32upx;
          font-weight: normal;
        }
      }
      .s-title{
        font-size: 26upx;
        color: #666666;
        text-align: center;
        width: 100%;
      }
    }
  }
  .gn{
    margin-top: 20upx;
  }
</style>

