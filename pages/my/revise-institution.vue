<template>
	<view class="child-content revise-institution">
		<radio-group @change="radioChange">
      <label class="" v-for="(item, index) in userOrgs" :key="index" :class="{borderBottom: index < userOrgs.length-1}">
				<radio :checked="item.value == userOrg" :value="item.value" />
        <view class="radio-label">{{item.label}}</view>
      </label>
    </radio-group>
		<!-- <view class="save">
      <button @click="radioChange">保存</button>
    </view> -->
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
	export default {
    components: {KwListCell},
		data() {
			return {
				userOrgs: [
          {label: '暂无机构', value: ''}
        ],
				userOrg: '',
				userOrgName: ''
			};
		},
		onLoad() {
			this.loadUserOrgs()
		},
    methods:{
      // 修改选项
      radioChange(e){
				this.userOrg = e.detail.value
        if (this.userOrg) {
					this.$kwz.ajax.ajaxUrl({
						url: 'index/resetOrgRole',
						data: {
							'ORG_ID': this.userOrg
						},
						vue: this,
						success (data) {
							let loginUser = this.$kwz.getLoginUser()
							if(this.userOrgs && this.userOrgs.length > 0) {
								for (let i = 0; i < this.userOrgs.length; i++) {
									if(this.userOrgs[i].ORG_ID == this.userOrg) {
										this.userOrgName = this.userOrgs[i].ORG_MC
									}
								}
							}
							loginUser.orgid = this.userOrg
							loginUser.orgMc = this.userOrgName
							this.$kwz.setLoginUser(loginUser)
							this.$kwz.back()
						}
					})
				}
      },
			loadUserOrgs () {
				let loginUser = this.$kwz.getLoginUser()
				if (loginUser && loginUser.orgs && loginUser.orgs.length > 0) {
					let loginOrgs = loginUser.orgs
					for (let i = 0; i < loginOrgs.length; i++) {
						loginOrgs[i].label = loginOrgs[i].ORG_MC
						loginOrgs[i].value = loginOrgs[i].ORG_ID
					}
					this.userOrgs = loginOrgs
				}
				this.userOrg = loginUser.orgid
			}
    }
	}
</script>

<style lang="scss">
  .revise-institution{
    width: 100%;
  }
  label{
    display: inline-block;
    background: white;
    width: 100%;
    padding: 20upx !important;
    position: relative;
    box-sizing: border-box;
  }
  .radio-label{
    text-align: right;
    position: absolute;
    right: 20upx;
    top:20upx;
  }
  .borderBottom::after{
    position: absolute;
    z-index: 3;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    transform: scaleY(.5);
    background-color: #c8c7cc;  
    margin:0 20upx;
  }
  .save{
    width: 710upx;
    height: 85upx;
    border-radius: 42.5upx;
    border: solid 1upx #e1e1e1;
    margin: 25upx auto;
    display: flex;
    background: white;
    button{
      padding: 0;
      margin: 0;
      width: 100%;
      border-radius: 42.5upx;
      background: linear-gradient(90deg, #00befe 0%, #028edf 100%), linear-gradient(#109dea, #109dea);
      color: white;
      line-height: 83upx;
    }
    button:after{
      border: none;
    }
  }	
</style>
