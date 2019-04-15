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
          <text>{{tips.wddb}}</text>        	
        </view>
        <view class="s-title">我的待办</view>
      </view>
      <view class="s-body">
        <view class="badge">
          <text>{{tips.cxcs}}</text>        	
        </view>
        <view class="s-title">出行次数</view>
      </view>
      <view class="s-body">
        <view class="badge">
          <text>{{tips.tkcs}}</text>        	
        </view>
        <view class="s-title">听课次数</view>
      </view>
      <view class="s-body">
        <view class="badge">
          <text>{{tips.yss}}</text>        	
        </view>
        <view class="s-title">验收数</view>
      </view>
    </view>
    <!-- 功能 -->
    <view class="workspace-gn" >
    	<kw-list-cell v-for="(item, index) in products" :title="item.PRO_MC" v-bind:key="index" :note="item.PRO_DESC" 
          :red-dot=redDot[item.PRO_ID] :thumb="item.THUMB" :link="item.LINK" :border="{bottom:index != products.length-1}"></kw-list-cell>
    </view>
    <kw-login v-if="loginShow" @loginSuccess="loginSuccess" @closeLogin="closeLogin" ></kw-login>
	</view>
</template>
<script>
	import KwLogin from "@kwz/kw-ui/kw-login.vue"
	import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
// 	const TIPS_CONFIG = {
// 		DDGZAP: "b892eba5fae9493189ac81a510bbbd73",	//工作安排
//     DDJL: "ebc60e699bc642a1871f1e017b979483",	//督导记录
//     DDZGTZ: "3758a16aa4e14b3d87bb1f9c7e2fc509",	//整改工作
//     DDHY: "2bc72d87d12e4386b115f301bc4aeda7",	//会议通知
//     SJDDJL: "2bc72d87d12e4386b115f301bc4aeda7",	//本月督导次数
//     TKJL: "2bc72d87d12e4386b115f301bc4aeda7"	//本月听课记录
// 	}
	export default {
		data() {
			return {
				msg: "...",
				loginShow: false,
        // 统计数据 上面的看板数据
				tips: {
					// 我的代办
					wddb: 0,
					// 出行次数
					cxcs: 0,
					// 听课次数
					tkcs: 0,
					// 验收数
					yss: 0
				},
        // 提示红点显示隐藏
        redDot:{},
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
					this.initTips()
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
				this.products = this.$kwz.getProducts();
			},
			// 初始化桌面的提示信息
			initTips () {
				this.$kwz.ajax.ajaxUrl({
					url: 'ddGztx/open/getTxData',
					data: {
						TXSET: '{"b892eba5fae9493189ac81a510bbbd73":"DDGZAP","ebc60e699bc642a1871f1e017b979483":"DDJL","3758a16aa4e14b3d87bb1f9c7e2fc509":"DDZGTZ","DDHYDDHYDDHYDDHYDDHYDDHYDDHYDDHY":"DDHY","SJDDJLSJDDJLSJDDJLSJDDJLSJDDJLa1":"SJDDJL","TKJLTKJLTKJLTKJLTKJLTKJLTKJLTKJL":"TKJL"}'
					},
					vue: this,
					success (data) {
						let datas = data.datas
						if(datas) {
              // 将返回的pro_id赋值给redDot 页面循环中根据pro_id进行判断红点显示隐藏
              this.redDot = datas
              // (我的待办)
							let wddb = 0
              // 整改工作
                wddb += datas['3758a16aa4e14b3d87bb1f9c7e2fc509']	|| 0
              // 督导记录
                wddb += datas['ebc60e699bc642a1871f1e017b979483']	|| 0
							// 工作安排
                wddb += datas['b892eba5fae9493189ac81a510bbbd73']	|| 0
              // 上面的看板数据
							this.tips = {
								wddb,
								cxcs: datas['SJDDJLSJDDJLSJDDJLSJDDJLSJDDJLa1'] || 0,
								tkcs: datas['TKJLTKJLTKJLTKJLTKJLTKJLTKJLTKJL'] || 0,
								yss: datas['DDHYDDHYDDHYDDHYDDHYDDHYDDHYDDHY'] || 0
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
  .banner{
    z-index: 10;
    width: 100%;
    height: 254upx;
    position: sticky;
    top:44px;
    /* #ifdef MP-WEIXIN */
    top:0;
    /* #endif */
    image{
      width: 100%;
      height: 254upx;
    }
  }
  
  .statistics{
    z-index: 10;
    height: 200upx;
    background: white;
    padding: 30upx 75upx;
    display: flex;
    position: sticky;
    top:calc(44px + 254upx);
    /* #ifdef MP-WEIXIN */
    top:254upx;
    /* #endif */
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
  .workspace-gn{
    margin-top: 20upx;
    height: calc(100vh - 94px - 227px);
    /* #ifdef MP-WEIXIN */
    height:  calc(100vh - 474upx);
    /* #endif */
    overflow: auto;
  }
</style>

