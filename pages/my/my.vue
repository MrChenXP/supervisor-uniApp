<template>
	<view class="my main-content" >
    <!-- 上面背景背景图 -->
    <view class="title">
      <image class="img" src="../../static/images/loginBG.png" mode="scaleToFill"></image>
      <!-- 用户简略信息 -->
      <view class="info">
        <image class="info-img" v-if="!imgShow" src="../../static/images/DefaultImg.png"></image>
        <image class="info-img" v-else :src="user.IMAGE"></image>        
        <view>
          <view class="name-zw">
            <text class="name text-bold" v-if="user.name">{{user.name}}</text>
            <text class="zw" v-if="user.ddlx">{{user.ddlx}}</text>
            <view v-else class="text-bold name">
              请您先登录
            </view>
          </view>
          <view class="info-jg" v-if="user.orgMc">机构：{{user.orgMc}}</view>
        </view>
      </view>
    </view>
   
    <!-- 功能 -->
    <view class="my-gn">
      <kw-login-cell title="个人资料" thumb="../../static/images/icons/set.png" link="/pages/my/user-set" ></kw-login-cell>
      <kw-login-cell title="修改密码" thumb="../../static/images/icons/change.png" link="/pages/my/revise-password" ></kw-login-cell>
      <kw-login-cell title="切换机构" :border="{bottom:false}" thumb="../../static/images/icons/repeat.png" link="/pages/my/revise-institution" ></kw-login-cell>
      <!-- #ifndef H5 -->
      <kw-login-cell title="扫码" :border="{top:true}" thumb="../../static/images/icons/scanCode.png" @click="scanCode"></kw-login-cell>
      <!-- #endif -->
    </view>
    
    <!-- 退出登录 -->
    <view class="my-gn close-login">
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
        // 登录页显示隐藏
        loginShow : false,
        // 默认头像显示隐藏
        imgShow:false,
        // 用户数据
				user: {}
			}
		},
		onShow () {
      this.loginShow = !this.$kwz.isLogin()
			this.loadIndexData()
		},
    computed:{
/* 个人资料权限  暂时无用。因为需要pro_id this.$kwz.hasAuth需要先登录才能用，不然报错
//     	hasXzAuth () {
//     		return this.$kwz.hasAuth('dd_dxgl/toGrzl')
//     	},
//     	// 修改密码权限
//     	hasXgAuth () {
//     		return this.$kwz.hasAuth('ddjl/doEdit')
//     	},
//     	// 切换机构权限
//     	hasScAuth () {
//     		return this.$kwz.hasAuth('ddjl/deleteddjl')
//     	}*/
    },
		methods: {
			// 加载工作区数据
			loadIndexData () {
				// 验证是否属于登陆状态
				if (this.$kwz.isLogin()) {
					this.initUser();
				} else {
          this.user = {}
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
      // 加载用户数据
			initUser () {
        // 这里要用浅拷贝。不然切换tab页头像会消失
				this.user = this.$kwz.getLoginUser()
        // 将fid变成本地指向地址
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_dxgl/selectByPrimaryKeyGrzl',
          type: 'POST',
          vue: this,
          then (response) {
            let datas = response.datas
            this.user.IMAGE = datas.IMAGE
            let url = `jc_file/doDownload?F_ID=${this.user.IMAGE}`;
            url += this.$kwz.token ? ('&token=' + this.$kwz.token) : ''
            this.$kwz.ajax.loadSource(url, (file) => {
              this.user.IMAGE = file;
              this.imgShow = true
            }, this)
          }
        })
			},
			// 退出
			logout () {
				this.$kwz.logout(false)
        this.user = {}
        this.imgShow = false
        this.$kwz.alert("已成功退出",this.loginShow = true)
			},
      // 扫码
      scanCode () {
        let _this = this
        uni.scanCode({
            success: function (response) {
                let res = JSON.parse(response.result)
                _this.scanCodeAjax(res)
            },
            fail: function (e) {
            // e.errMsg === "scanCode:fail" 失败   "scanCode:fail cancel" 取消
              if (e.errMsg === "scanCode:fail") {
                _this.$kwz.alert("扫码失败,请重新扫码！",2000)
              }
            }
        });
        
      },
      // 扫码成功后执行的ajax
      scanCodeAjax(res) {
        let TIME = this.$kwz.formatDate("yyyy/MM/dd hh:mm:ss")
        this.$kwz.ajax.ajaxUrl({
          url: res.URL,
          type: 'POST',
          vue: this,
          data:{
            CONTENT_ID: res.CONTENT_ID,
            SIGNAL: res.SIGNAL,
            TIME: TIME,
            U_ID: this.user.uid,
            STARTTIME: res.STARTTIME,
            ENDTIME: res.ENDTIME,
          },
          then (response) {
            let data = response.datas
            if(data.code < "1005"){
              this.$kwz.alert(data.info, 2000)
            } else {
              console.error(data.info)
            }
          }
        })
      },
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
         .name{
           font-size: 36upx;
           color: white;
         }
         .zw{
           color: white;
           font-size: 24upx;
           margin-left: 30upx;
           width: 140upx;
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
  .my-gn{
    background: white;
  }
  .close-login{
    margin-top: 20upx;
  }
</style>
