<template>
	<view class="user-set child-content">
    <view>
      <kw-list-cell>
          <view>
            <view class="head-img">
              <view class="head-img-title">头像</view>
              <view class="head-img-img" @tap="changeIcon">
                <image :src="user.IMAGE"></image>
              </view>
            </view>
          </view>
      </kw-list-cell>
      <kw-list-cell title="姓名" :right-note="user.XM" @click="alertXm"></kw-list-cell>
			<kw-list-cell title="显示名" :right-note="user.U_USERNAME" @click="alertUsername"></kw-list-cell>
      <kw-list-cell title="年龄" :right-note="user.AGE" @click="alertAge"></kw-list-cell>
      <kw-list-cell title="性别" :right-note="mc.xbMc" @click="alertXb"></kw-list-cell>
      <kw-list-cell title="督学类型" :right-note="mc.dxlxMc" ></kw-list-cell>
      <kw-list-cell title="联系电话" :right-note="user.DH" @click="alertDh"></kw-list-cell>
      <kw-list-cell title="身份证件类型" :right-note="mc.sfzjlxMc" @click="alertSfzjlx"></kw-list-cell>
      <kw-list-cell title="身份证件号" :right-note="user.SFZJH" @click="alertSfzjh"></kw-list-cell>
      <kw-list-cell title="民族" :right-note="mc.mzMc" @click="alertMz"></kw-list-cell>
      <kw-list-cell title="出生年月" :right-note="user.BIRTH" :border="{bottom: false}" @click="alertBirth"></kw-list-cell>
    </view>
		
    <view class="group">
      <kw-list-cell title="学历" :right-note="mc.xlMc" style="margin-top: 20upx;" @click="alertXl"></kw-list-cell>
      <kw-list-cell title="专业技术职称" :right-note="mc.zyjszcMc" @click="alertZyjszc"></kw-list-cell>
      <kw-list-cell title="职务" :right-note="user.ZW" @click="alertZw"></kw-list-cell>
      <kw-list-cell title="工作单位" :right-note="user.WORKUNIT" @click="alertWorkUnit"></kw-list-cell>
      <kw-list-cell title="个人简介(1000字以内)" :right-note="user.JL" @click="alertJl"></kw-list-cell>
    </view>
		<view class="save">
      <button @click="saveUserSet">保存</button>
    </view>
    <!-- 弹出框组 -->
    <view>
			<view v-if="alertXmShow">
			  <kw-alert-input :input-list="inputList" @confirm="confirmXm" @close="alertXmShow=false"></kw-alert-input>
			</view>
			<view v-if="alertUsernameShow">
			  <kw-alert-input :input-list="inputList" @confirm="confirmUsername" @close="alertUsernameShow=false"></kw-alert-input>
			</view>
			<view v-if="alertAgeShow">
			  <kw-alert-input :input-list="inputList" @confirm="confirmAge" @close="alertAgeShow=false"></kw-alert-input>
			</view>
			<view v-if="alertXbShow">
			  <kw-alert-input :check-list="checkList" :check-radio="user.XBM" @confirm="confirmXb" :isCheck="true" @close="alertXbShow=false"></kw-alert-input>
			</view>
			<view v-if="alertDxlxShow">
			  <kw-alert-input :check-list="checkList" :check-radio="user.DXLXM" @confirm="confirmDxlx" :isCheck="true" @close="alertDxlxShow=false"></kw-alert-input>
			</view>
			<view v-if="alertDhShow">
			  <kw-alert-input :input-list="inputList" @confirm="confirmDh" @close="alertDhShow=false"></kw-alert-input>
			</view>
			<view v-if="alertSfzjlxShow">
			  <kw-alert-input :check-list="checkList" :check-radio="user.SFZJLXM" @confirm="confirmSfzjlx" :isCheck="true" @close="alertSfzjlxShow=false"></kw-alert-input>
			</view>
			<view v-if="alertSfzjhShow">
			  <kw-alert-input :check-list="inputList" @confirm="confirmSfzjh" @close="alertSfzjhShow=false"></kw-alert-input>
			</view>
			<view v-if="alertMzShow">
			  <kw-alert-input :check-list="checkList" :check-radio="user.MZM" @confirm="confirmMz" :isCheck="true" @close="alertMzShow=false"></kw-alert-input>
			</view>
			<view v-if="alertBirthShow">
			  <kw-alert-input :check-list="inputList" @confirm="confirmBirth" @close="alertBirthShow=false"></kw-alert-input>
			</view>
			<view v-if="alertXlShow">
			  <kw-alert-input :check-list="checkList" :check-radio="user.XL" @confirm="confirmXl" :isCheck="true" @close="alertXlShow=false"></kw-alert-input>
			</view>
			<view v-if="alertZyjszcShow">
			  <kw-alert-input :check-list="checkList" :check-radio="user.ZYJSZC" @confirm="confirmZyjszc" :isCheck="true" @close="alertZyjszcShow=false"></kw-alert-input>
			</view>
			<view v-if="alertZwShow">
			  <kw-alert-input :check-list="inputList" @confirm="confirmZw" @close="alertZwShow=false"></kw-alert-input>
			</view>
			<view v-if="alertWorkUnitShow">
			  <kw-alert-input :check-list="inputList" @confirm="confirmWorkUnit" @close="alertWorkUnitShow=false"></kw-alert-input>
			</view>
			<view v-if="alertJlShow">
			  <kw-alert-input :textarea-list="inputList" @confirm="confirmJl" :isTextarea="true" @close="alertJlShow=false"></kw-alert-input>
			</view>
      <!-- <view v-if="alertinputShow">
        <kw-alert-input :input-list="inputList" @confirm="confirmAlert" @close="alertinputShow=false"></kw-alert-input>
      </view>
      <view v-if="alertCheckShow">
        <kw-alert-input :check-list="checkList" @confirm="confirmAlert" :isCheck="true" @close="alertCheckShow=false"></kw-alert-input>
      </view>
      <view v-if="alertTextareaShow">
        <kw-alert-input :textarea-list="textareaList" @confirm="confirmAlert" :isTextarea="true" @close="alertTextareaShow=false"></kw-alert-input>
      </view> -->
    </view>
    
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import KwAlertInput from "@kwz/kw-ui/kw-alert-input.vue"
	export default {
		data() {
			return {
				user: {
					IMAGE: '../../static/images/DefaultImg.png',
					XM: '',
					U_USERNAME: '',
					AGE: '',
					XBM: '',
					DXLXM: '',
					DH: '',
					SFZJLXM: '',
					SFZJH: '',
					MZM: '',
					BIRTH: '',
					XL: '',
					ZYJSZC: '',
					ZW: '',
					WORKUNIT: '',
					JL: ''
				},
				mc: {
					xbMc: '',
					zyjszcMc: '',
					xlMc: '',
					mzMc: '',
					sfzjlxMc: '',
					dxlxMc: ''
				},
				alertXmShow: false,
				alertUsernameShow: false,
        alertAgeShow:false,
        alertXbShow:false,
				alertDxlxShow: false,
				alertDhShow:false,
				alertSfzjlxShow:false,
				alertSfzjhShow: false,
				alertMzShow:false,
				alertBirthShow:false,
				alertXlShow:false,
				alertZyjszcShow:false,
				alertZwShow:false,
				alertWorkUnitShow:false,
				alertJlShow:false,
				// 选择器值
        checkList:[],
				inputList: {},
				dms: {}
			};
		},
    components: {KwListCell,KwAlertInput},
		onLoad() {
			this.$kwz.loadVueDms('DM_XD,DM_MZ,DM_XB,DM_XK,DM_ZW,DM_XLCC,DM_SFZJLX,DM_ZYJSDJ,DM_DD_DXLX,DM_XWCC', dms => {
        for(let i in dms) {
					let dm = dms[i]
					for(let j in dm) {
						dm[j].label = dm[j].DMMX_MC
						dm[j].value = dm[j].DMMX_CODE
					}
				}
				this.dms = dms
				
				this.showMc(this.user.XBM, 'DM_XB', 'xbMc')
				this.showMc(this.user.DXLXM, 'DM_DD_DXLX', 'dxlxMc')
				this.showMc(this.user.SFZJLXM, 'DM_SFZJLX', 'sfzjlxMc')
				this.showMc(this.user.MZM, 'DM_MZ', 'mzMc')
				this.showMc(this.user.XL, 'DM_XLCC', 'xlMc')
				this.showMc(this.user.ZYJSZC, 'DM_ZYJSDJ', 'zyjszcMc')
				
      }, this)
		},
		onShow () {
			this.loadUserSet()
		},
    methods:{
			// 加载数据
			loadUserSet () {
				this.$kwz.ajax.ajaxUrl({
					url: 'dd_dxgl/selectByPrimaryKeyGrzl',
					type: 'POST',
					vue: this,
					then (response) {
						let datas = response.datas
						if (datas) {
							this.user = datas
							
							this.showMc(this.user.XBM, 'DM_XB', 'xbMc')
							this.showMc(this.user.DXLXM, 'DM_DD_DXLX', 'dxlxMc')
							this.showMc(this.user.SFZJLXM, 'DM_SFZJLX', 'sfzjlxMc')
							this.showMc(this.user.MZM, 'DM_MZ', 'mzMc')
							this.showMc(this.user.XL, 'DM_XLCC', 'xlMc')
							this.showMc(this.user.ZYJSZC, 'DM_ZYJSDJ', 'zyjszcMc')
							
						}
					}
				})
			},
			// 保存
			saveUserSet () {
				if (!this.user.XM) {
					this.$kwz.alert('姓名不能为空')
					return false
				}
				if (!this.user.DH) {
					this.$kwz.alert('电话不能为空')
					return false
				}
				let data = JSON.parse(JSON.stringify(this.user))
				this.$kwz.ajax.ajaxUrl({
					url: 'dd_dxgl/doUpdateGrzl',
					type: 'POST',
					data,
					vue: this,
					then (response) {
						this.$kwz.alert('保存成功')
						this.loadUserSet()
					}
				})
			},
			changeIcon () {
				this.$kwz.uploadImage({}, {
					url: 'jc_jsgl/doUpload',
					success (data) {
						let datas = data.datas;
						if (datas && datas.saveInfos && datas.saveInfos[0]
							&& datas.saveInfos[0].fId) {
								let url = `jc_file/doDownload?F_ID=${datas.saveInfos[0].fId}`;
								url += this.$kwz.token ? ('&token=' + this.$kwz.token) : ''
								this.$kwz.ajax.loadSource(url, (file) => {
									this.user.IMAGE = file;
								}, this);
						}
					}
				}, this)
			},
      alertXm () {
        this.alertXmShow = true;
        this.inputList = {value: this.user.XM, info: "请输入您的姓名"}
      },
			alertUsername () {
			  this.alertUsernameShow = true;
			  this.inputList = {value: this.user.U_USERNAME, info: "请输入您的显示名"}
			},
			alertAge () {
			  this.alertAgeShow = true;
			  this.inputList = {value: this.user.AGE, info: "请输入您的年龄"}
			},
			alertXb () {
			  this.alertXbShow = true;
			  this.checkList = this.dms.DM_XB
			},
			alertDxlx () {
				this.alertDxlxShow = true;
				this.checkList = this.dms.DM_DD_DXLX
			},
			alertDh () {
			  this.alertDhShow = true;
			  this.inputList = {value: this.user.DH, info: "请输入您的电话"}
			},
			alertSfzjlx () {
				this.alertSfzjlxShow = true;
				this.checkList = this.dms.DM_SFZJLX
			},
			alertSfzjh () {
			  this.alertSfzjhShow = true;
			  this.inputList = {value: this.user.SFZJH, info: "请输入您的身份证件号"}
			},
			alertMz () {
				this.alertMzShow = true;
				this.checkList = this.dms.DM_MZ
			},
			alertBirth () {
			  this.alertBirthShow = true;
			  this.inputList = {value: this.user.BIRTH, info: "请输入您的出生日期"}
			},
			alertXl () {
				this.alertXlShow = true;
				this.checkList = this.dms.DM_XLCC
			},
			alertZyjszc () {
				this.alertZyjszcShow = true;
				this.checkList = this.dms.DM_ZYJSDJ
			},
			alertZw () {
			  this.alertZwShow = true;
			  this.inputList = {value: this.user.ZW, info: "请输入您的职务"}
			},
			alertWorkUnit () {
			  this.alertWorkUnitShow = true;
			  this.inputList = {value: this.user.WORKUNIT, info: "请输入您的工作单位"}
			},
      alertJl () {
        this.alertJlShow = true;
        this.textareaList = {
          value: this.user.JL,
          info: "个人简介（1000字以内）"
        }
      },
			confirmXm (data) {
			  this.user.XM = data.value
				this.alertXmShow = false
			},
			confirmUsername (data) {
			  this.user.U_USERNAME = data.value
				this.alertUsernameShow = false
			},
			confirmAge (data) {
			  if (data.value && isNaN(data.value)) {
					this.$kwz.alert('年龄必须为正整数')
				} else {
					this.user.AGE = data.value
				}
				this.alertAgeShow = false
			},
			confirmXb (data) {
			  this.user.XBM = data.value
				this.showMc(data.value, 'DM_XB', 'xbMc')
				this.alertXbShow = false
			},
			confirmDxlx(data) {
				this.user.DXLXM = data.value
				this.showMc(data.value, 'DM_DD_DXLX', 'dxlxMc')
				this.alertDxlxShow = false
			},
			confirmDh (data) {
				if(data.value && (!/^1(3|5|8)\d{9}$/.test(data.value) && !/^0\d{2,3}\-?\d{7,8}$/.test(data.value) )) {
					this.$kwz.alert('联系电话格式不正确')
				} else {
					this.user.DH = data.value
				}
				this.alertDhShow = false
			},
			confirmSfzjlx (data) {
				this.user.SFZJLXM = data.value
				this.showMc(data.value, 'DM_SFZJLX', 'sfzjlxMc')
				this.alertSfzjlxShow = false
			},
			confirmSfzjh (data) {
				if (this.user.SFZJLXM == '1' && (data.value && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(data.value))) {
					this.$kwz.alert('身份证件号格式不正确')
				} else {
					this.user.DH = data.value
				}
				this.alertSfzjhShow = false
			},
			confirmMz (data) {
				this.user.MZM = data.value
				this.showMc(data.value, 'DM_MZ', 'mzMc')
				this.alertMzShow = false
			},
			confirmBirth (data) {
			  this.user.BIRTH = data.value
				this.alertBirthShow = false
			},
			confirmXl (data) {
				this.user.XL = data.value
				this.showMc(data.value, 'DM_XLCC', 'xlMc')
				this.alertXlShow = false
			},
			confirmZyjszc (data) {
				this.user.ZYJSZC = data.value
				this.showMc(data.value, 'DM_ZYJSDJ', 'zyjszcMc')
				this.alertZyjszcShow = false
			},
			confirmZw (data) {
			  this.user.ZW = data.value
				this.alertZwShow = false
			},
			confirmWorkUnit (data) {
			  this.user.WORKUNIT = data.value
				this.alertWorkUnitShow = false
			},
			confirmJl (data) {
				let value = data.value
			  this.user.JL = value.length > 8 ? (value.substr(0, 8) + '...') : value
				this.alertJlShow = false
			},
			showMc (value, dmsKey, dmMcKey) {
				let dms = this.dms[dmsKey]
				if (value && dms && dms.length > 0) {
					for(let i = 0 ;i < dms.length;i++) {
						if(dms[i].value == value) {
							this.mc[dmMcKey] = dms[i].label
						}
					}
				}
			}
    }
	}
</script>

<style lang="scss">
  .group{
    margin-top: 20upx;
  }
  .head-img{
    height: 100upx;
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;
    .head-img-title{
      line-height: 100upx;
      min-width: 20%;
    }
    .head-img-img{
      position:absolute;
      right: 0;
      width: 100upx;
      height: 100upx;
      image{
        width: 100%;
        height: 100%;
      }
    }
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
