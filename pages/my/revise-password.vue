<template>
	<view class="revise-password child-content">
		<!-- 表单 -->
		<form class="form clearfix">
			<view>
				<text>{{msg}}</text>
			</view>
		  <view class="bg">
				<input password v-model="oldPassword" placeholder="请输入原始密码"/>
			</view>
			<view class="bg">
				<input password v-model="newPassword" placeholder="请输入新密码"/>
			</view>
			<view class="bg">
				<input password v-model="qrPassword" placeholder="请重新输入新密码" />
			</view>
			<view class="bg" >
				<button @tap="savePassword">保存</button>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPassword: '',
        newPassword:"",
        qrPassword:"",
				msg: ''
			};
		},
		onLoad() {
			this.initMsg()
		},
    methods: {
			initMsg () {
				this.$kwz.ajax.ajaxUrl({
					url: 'jc_user/doCheckPassword',
					vue: this,
					success (data) {
						if(data && data.datas && data.datas.msg) {
							this.msg = data.datas.msg
						}
					}
				})
			},
      // 确认
      savePassword(){
        if(!this.oldPassword) {
					this.$kwz.alert('旧密码不能为空')
					return false
				}
				if(!this.newPassword) {
					this.$kwz.alert('新密码不能为空')
					return false
				}
				if(this.newPassword != this.qrPassword) {
					this.$kwz.alert('两次输入密码不一致')
					return false
				}
				
				let data = {
					U_PWD: this.oldPassword,
					U_PWD_NEW1: this.newPassword,
					U_PWD_NEW2: this.qrPassword
				}
				
				this.$kwz.ajax.ajaxUrl({
					url: 'jc_user/doJcUserGgmm',
					data,
					vue: this,
					success (data) {
						console.info(data)
					}
				})
      }
    }
	}
</script>

<style lang="scss">
  .form{
    background: #f5f5f5;
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .bg{
    width: 544upx;
    height: 85upx;
    border-radius: 42.5upx;
    border: solid 1upx #e1e1e1;
    margin: 25upx auto;
    display: flex;
    background: white;
  }
  .bg input{
    margin-left: 47upx;
    margin-right:47upx;
    line-height: 83upx;
    height: 83upx;
    width: 100%;
    font-size: 30upx;
    color: #b0b0b0;
  }
  .bg input{
    text-align: left;
  }
  .bg button{
    padding: 0;
    margin: 0;
    width: 100%;
    border-radius: 42.5upx;
    background: linear-gradient(90deg, #00befe 0%, #028edf 100%), linear-gradient(#109dea, #109dea);
    color: white;
    line-height: 83upx;
  }
  .bg button:after{
    border: none;
  }
</style>
