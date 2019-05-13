<template>
  <view class="user-set child-content">
    <view>
      <kw-list-cell>
          <view>
            <view class="head-img">
              <view class="head-img-title">头像</view>
              <view class="head-img-img" @tap="changeIcon">
                <image :src="imageUrl"></image>
              </view>
            </view>
          </view>
      </kw-list-cell>
      <kw-list-cell title="姓名" >
        <view slot="rightNote">
          <view class="list-right-input"><input v-model="user.XM" /></view>
        </view>
      </kw-list-cell>
      <kw-list-cell title="显示名" >
        <view slot="rightNote">
          <view class="list-right-input"><input v-model="user.U_USERNAME" /></view>
        </view>
      </kw-list-cell>
      <kw-list-cell title="年龄">
        <view slot="rightNote">
          <view class="list-right-input"><input v-model="user.AGE"/></view>
        </view>
      </kw-list-cell>
      <kw-list-cell title="性别" :right-note="mc.xbMc" @click="alertXb"></kw-list-cell>
      <kw-list-cell title="督学类型" :right-note="mc.dxlxMc" :isArrow="false"></kw-list-cell>
      <kw-list-cell title="联系电话">
        <view slot="rightNote">
          <view class="list-right-input"><input v-model="user.DH" /></view>
        </view>
      </kw-list-cell>
      <kw-list-cell title="身份证件类型" :right-note="mc.sfzjlxMc" @click="alertSfzjlx"></kw-list-cell>
      <kw-list-cell title="身份证件号">
        <view slot="rightNote">
          <view class="list-right-input"><input v-model="user.SFZJH" /></view>
        </view>
      </kw-list-cell>

      <kw-list-cell title="民族" :right-note="mc.mzMc" @click="alertMz"></kw-list-cell>
      <picker :value="user.BIRTH" mode="date" @change="changeBIRTH">
        <kw-list-cell title="出生年月" :rightNote="user.BIRTH"></kw-list-cell>
      </picker>
    </view>
    
    <view class="group">
      <kw-list-cell title="学历" :right-note="mc.xlMc" style="margin-top: 20upx;" @click="alertXl"></kw-list-cell>
      <kw-list-cell title="专业技术职称" :right-note="mc.zyjszcMc" @click="alertZyjszc"></kw-list-cell>
      <kw-list-cell title="职务">
        <view slot="rightNote">
          <view class="list-right-input"><input v-model="user.ZW" /></view>
        </view>
      </kw-list-cell>
      <kw-list-cell title="工作单位">
        <view slot="rightNote">
          <view class="list-right-input"><input v-model="user.WORKUNIT" /></view>
        </view>
      </kw-list-cell>
      <kw-list-cell :isArrow="false" :border="{bottom:false}">
        <view>
          <view class="ddjs-head clearfix" @click="jlShow = !jlShow">
            <text class="fl">个人简介(1000字以内)</text>
            <view class="fr" v-show="!jlShow"><uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon></view>
            <view class="fr" v-show="jlShow"><uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon></view>
          </view>
          <view v-show="jlShow" class="ddjs-body">
            <textarea :value="user.JL" maxlength="1000" @input="inputJL"></textarea>
          </view>
        </view>
      </kw-list-cell>

    </view>
    <view class="save">
      <button @click="saveUserSet">保存</button>
    </view>
    <!-- 弹出框组 -->
    <view>
      <view v-if="alertXbShow">
        <kw-alert-input :check-list="checkList" :check-radio="user.XBM" @confirm="confirmXb" :isCheck="true" @close="alertXbShow=false"></kw-alert-input>
      </view>
      <view v-if="alertSfzjlxShow">
        <kw-alert-input :check-list="checkList" :check-radio="user.SFZJLXM" @confirm="confirmSfzjlx" :isCheck="true" @close="alertSfzjlxShow=false"></kw-alert-input>
      </view>
      <view v-if="alertMzShow">
        <kw-alert-input :check-list="checkList" :check-radio="user.MZM" @confirm="confirmMz" :isCheck="true" @close="alertMzShow=false"></kw-alert-input>
      </view>
      <view v-if="alertXlShow">
        <kw-alert-input :check-list="checkList" :check-radio="user.XL" @confirm="confirmXl" :isCheck="true" @close="alertXlShow=false"></kw-alert-input>
      </view>
      <view v-if="alertZyjszcShow">
        <kw-alert-input :check-list="checkList" :check-radio="user.ZYJSZC" @confirm="confirmZyjszc" :isCheck="true" @close="alertZyjszcShow=false"></kw-alert-input>
      </view>
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
          IMAGE: '', // 图像fid
          XM: '', // 姓名
          U_USERNAME: '', // 显示名
          AGE: '', // 年龄
          XBM: '', // 性别码
          XBMC: '男', // 性别名称
          DXLXM: '', // 督学类型码
          DH: '', // 电话
          SFZJLXM: '', // 身份证件码
          SFZJH: '', // 身份证件号
          MZM: '', // 民族码
          BIRTH: '', // 出生年月
          XL: '', // 学历
          ZYJSZC: '', // 专业技术职称
          ZW: '', // 职务
          WORKUNIT: '', // 工作单位
          JL: '', // 简介
          DXID: "" , // 督学id
          uid: "", // 用户id
        },
        imageUrl:"../../static/images/DefaultImg.png", // 保存的时候要用到的头像fid
        mc: {
          xbMc: '',
          zyjszcMc: '',
          xlMc: '',
          mzMc: '',
          sfzjlxMc: '',
          dxlxMc: ''
        },
        alertXbShow:false,
        alertSfzjlxShow:false,
        alertMzShow:false,
        alertXlShow:false,
        alertZyjszcShow:false,
        jlShow: true,
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
    methods: {
      // 加载数据
      loadUserSet () {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_dxgl/selectByPrimaryKeyGrzl',
          type: 'POST',
          vue: this,
          then (response) {
            let datas = response.datas
            if (datas) {
              datas.uid = this.$kwz.getLoginUser().uid
              this.user = datas
              // 后台返回的是一个fid，微信不支持，需要将文件下载下来，然后将src指向本地地址
              let url = `jc_file/doDownload?F_ID=${this.user.IMAGE}`;
              url += this.$kwz.token ? ('&token=' + this.$kwz.token) : ''
              this.$kwz.ajax.loadSource(url, (file) => {
                this.imageUrl = file;
              }, this);
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
        if (this.user.DH.search(/^(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/)) {
          this.$kwz.alert('电话未输入或输入有误')
          return false
        }
        // 没修改过年龄直接保存，是number类型
        this.user.AGE = String(this.user.AGE)
        if (this.user.AGE.search(/^[1-9][0-9]?[0-9]$/)) {
          this.$kwz.alert('年龄输入有误')
          return false
        }
        if (this.user.SFZJH && this.user.SFZJLXM == '1' && this.user.SFZJH.search(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/)) {
          this.$kwz.alert('身份证件号输入有误')
          return false
        }
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_dxgl/doUpdateGrzl',
          type: 'POST',
          data:{
            "MZM": this.user.MZM,  // 民族码
            "XBM": this.user.XBM,  // 性别码
            "JL": this.user.JL,  // 简介
            "DH":this.user.DH,  // 电话
            "ZYJSZC": this.user.ZYJSZC,  // 专业技术职称
            "U_ID": this.user.uid,  // 当前用户id
            "DXID": this.user.DXID, //督学di,用户不一定是督学,顾要传督学id
            "SFZJLXM": this.user.SFZJLXM,  // 身份证件类型码
            "IMAGE": this.user.IMAGE,  // 图像uid
            "XL": this.user.XL,  // 学历
            "XM": this.user.XM,  // 姓名
            "U_USERNAME": this.user.U_USERNAME,  // 显示名
            "SFZJH": this.user.SFZJH,  // 身份证件号
            "SJ":"",  // 数据库无介绍 传空
            "BIRTH": this.user.BIRTH,  // 出生年月
            "ZW": this.user.ZW,  // 职务
            "WORKUNIT": this.user.WORKUNIT,  // 工作单位
            "AGE": this.user.AGE  // 年龄
          },
          vue: this,
          then (response) {
            uni.switchTab({url: 'my'});
            this.$kwz.alert('保存成功')
            // this.loadUserSet()
          }
        })
      },
      // 更改头像
      changeIcon () {
        this.$kwz.uploadImage({}, {
          url: 'jc_jsgl/doUpload',
          success (data) {
            let datas = data.datas;
            if (datas && datas.saveInfos && datas.saveInfos[0] && datas.saveInfos[0].fId) {
                this.user.IMAGE = datas.saveInfos[0].fId
                let url = `jc_file/doDownload?F_ID=${datas.saveInfos[0].fId}`;
                url += this.$kwz.token ? ('&token=' + this.$kwz.token) : ''
                this.$kwz.ajax.loadSource(url, (file) => {
                  this.imageUrl = file;
                }, this);
            }
          }
        }, this)
      },
      alertXb () {
        this.alertXbShow = true;
        this.checkList = this.dms.DM_XB
      },
      alertSfzjlx () {
        this.alertSfzjlxShow = true;
        this.checkList = this.dms.DM_SFZJLX
      },
      alertMz () {
        this.alertMzShow = true;
        this.checkList = this.dms.DM_MZ
      },
      alertXl () {
        this.alertXlShow = true;
        this.checkList = this.dms.DM_XLCC
      },
      alertZyjszc () {
        this.alertZyjszcShow = true;
        this.checkList = this.dms.DM_ZYJSDJ
      },
      inputJL (e) {
        this.user.JL = e.detail.value
      },
      confirmXb (data) {
        this.user.XBM = data.value
        this.showMc(data.value, 'DM_XB', 'xbMc')
        this.alertXbShow = false
      },
      confirmSfzjlx (data) {
        this.user.SFZJLXM = data.value
        this.showMc(data.value, 'DM_SFZJLX', 'sfzjlxMc')
        this.alertSfzjlxShow = false
      },
      confirmMz (data) {
        this.user.MZM = data.value
        this.showMc(data.value, 'DM_MZ', 'mzMc')
        this.alertMzShow = false
      },
      // 更改时间
      changeBIRTH (e) {
      	this.user.BIRTH = e.detail.value
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
</style>
