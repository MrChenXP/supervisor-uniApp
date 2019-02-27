<template>
	<view class="my main-content" >
    <!-- 上面背景背景图 -->
    <view class="title">
      <image class="img" src="../../static/images/loginBG.png" mode="scaleToFill"></image>
      <!-- 用户简略信息 -->
      <view class="info">
        <image class="info-img" src="../../static/images/DefaultImg.png"></image>
        <view>
          <view class="name-zw">
            <text class="name">{{user.name}}</text>
            <text class="zw">{{user.ddlx}}</text>
          </view>
          <view class="info-jg">机构：{{user.orgMc}}</view>
        </view>
      </view>
    </view>
   
    <!-- 功能 -->
    <view class="gn">
      <kw-login-cell title="个人资料" thumb="../../static/images/icons/set.png" link="/pages/my/user-set" ></kw-login-cell>
      <kw-login-cell title="修改密码" thumb="../../static/images/icons/change.png" link="/pages/my/revise-password" ></kw-login-cell>
      <kw-login-cell title="切换机构" :border="{bottom:false}" thumb="../../static/images/icons/repeat.png" link="/pages/my/revise-institution" ></kw-login-cell>
    </view>
    
    <!-- 退出登录 -->
    <view class="gn close-login">
      <kw-login-cell title="退出" :border="{bottom:false}" thumb="../../static/images/icons/close.png" @click="logout"></kw-login-cell>
    </view>
		<kw-login v-if="loginShow" @loginSuccess="loginSuccess" @closeLogin="closeLogin" ></kw-login>
	</view>
</template>

<script>
	import KwLogin from "@kwz/kw-ui/kw-login.vue"
  import KwLoginCell from "@kwz/kw-ui/kw-list-cell.vue"

	export default {
    name: "kw-my",
		components: {KwLoginCell,KwLogin},
		data() {
			return {
				msg: "...",
        loginShow : false,
				user: {}
			}
		},
		onShow () {
      this.loginShow = !this.$kwz.isLogin()
			this.loadIndexData();
		},
    computed:{
    	// 个人资料权限  暂时无用。因为需要pro_id
    	hasXzAuth () {
    		return this.$kwz.hasAuth('dd_dxgl/toGrzl')
    	},
    	// 修改密码权限
    	hasXgAuth () {
    		return this.$kwz.hasAuth('ddjl/doEdit')
    	},
    	// 切换机构权限
    	hasScAuth () {
    		return this.$kwz.hasAuth('ddjl/deleteddjl')
    	}
    },
		methods: {
			// 加载工作区数据
			loadIndexData () {
				// 验证是否属于登陆状态
				if ( this.$kwz.isLogin()) {
					this.initUser();
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
				this.initUser();
			},
			initUser () {
				this.user = this.$kwz.getLoginUser();
			},
			// 退出
			logout () {
				this.$kwz.logout(false)
			}
		}
	}
</script>

<style lang="scss">
  .title{
     height: 461upx;
     background-image: linear-gradient(to bottom, #028edf 0%, #00befe 100%);
     position: relative;
     .img{
       position: absolute;
       height: 125upx;
       width: 100%;
       left: 0;
       bottom: 0;
     }
     .info{
       position: absolute;
       top: 80upx;
       height: 125upx;
       padding: 0 60upx;
       width: 100%;
       box-sizing: border-box;
       display: flex;
       .info-img{
         width: 125upx;
         height: 125upx;
         border-radius: 50%;
         margin-right: 30upx;
       }
       .name-zw{
         display: flex;
         line-height: 80upx;
         color: white;
         .name{
           font-size: 34upx;
         }
         .zw{
           font-size: 24upx;
           margin-left: 30upx;
           width: 125upx;
           height: 44upx;
           line-height: 44upx;
           background: #fdab3b;
           align-self:center;
           text-align: center;
           border-radius: 5upx;
         }
       }
      .info-jg{
        color: white;
        line-height: 45upx;
        font-size: 28upx;
      }
     }
   }
  .gn{
    background: white;
  }
  .close-login{
    margin-top: 20upx;
  }
</style>
