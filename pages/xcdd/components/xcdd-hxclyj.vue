<template>
  <!-- 后续处理意见选择页面 -->
  <view class="xcdd-hxclyj child-content">
    <!-- 蒙版 -->
    <view class="xcdd-hxclyj-mask" @tap="close"></view>
    <!-- 内容 -->
    <view class="xcdd-hxclyj-content">
      <!-- 一般问题-向学校发送整改建议 严重问题-向督导办上报整改建议 -->
      <view v-if="hxcly.value=='2' || hxcly.value=='5'" class="xcdd-hxclyj-ybwt">
        <kw-list-cell title="编号" :rightNote="ybwtBh" :isArrow="false"></kw-list-cell>
        <kw-list-cell title="单位" :rightNote="org.name" :isArrow="false"></kw-list-cell>
        <kw-list-cell title="来源渠道" rightNote="经常性督导整改" :isArrow="false"></kw-list-cell>
        <view class="clyj">
          <view>经挂牌督导，你单位存在以下问题及建议:</view>
          <textarea v-model="czwt" maxlength="4000"></textarea>
          <view>对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发
            <uni-number-box :min="0" :max="30" :value="ybwtZgqx" @change="changeClqx"></uni-number-box>
            日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。
          </view>
        </view>
        <view class="ddsj">督导时间: {{ywsj}}</view>
      </view>
      <!-- 复杂问题-向科室发送协商意见 -->
      <view v-if="hxcly.value=='3'" class="xcdd-hxclyj-fzwt">
        <kw-list-cell title="编号" :rightNote="ybwtBh" :isArrow="false"></kw-list-cell>
        <picker :range="ksList" range-key="name" :value="fzwtKs.index" @change="changeKs" >
          <kw-list-cell title="科室" :rightNote="fzwtKs.name" ></kw-list-cell>
        </picker>
        <view class="clyj">
          <view>我室责任督学于</view><text>{{ywsj}}</text>对<text>{{org.name}}</text>
          进行了教育督导，发现该学校(幼儿园)存在以下问题及建议：
          <textarea v-model="czwt" maxlength="4000"></textarea>
          <view>请贵科室（中心）予以支持、配合、协调解决!</view>
        </view>
      </view>
      <view class="xcdd-hxclyj-save clearfix">
        <button @tap="close" size="mini" class="fl">取消</button>
        <button @tap="confirm" size="mini" class="fr">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import { uniBadge,uniTag,uniIcon,uniNumberBox } from '@dcloudio/uni-ui'
  export default {
    data() {
      return {
        ksList:[],
        ybwtBh: '',
        // ybwtCzwt: '',
        ybwtZgqx: 0,
        // ybwtYwsj: '',
        fzwtKs: {
          name: '点击选择科室',
          value: '',
          index: ''
        }
        // fzwtYwsj: ''
      };
    },
    props:{
      contentId: '',
      // 后续处理意见的状态 
      hxcly: Object,
      // 机构
      org: Object,
      // 存在的问题
      czwt: String,
      // 业务时间
      ywsj: String,
      // 业务时间
      zgxsId: String,
    },
    onLoad() {
      if (!this.ybwtBh) {
        this.getBh()
      }
      if (!this.ksList || this.ksList.length < 1) {
        this.getKs()
      }
    },
    components:{uniBadge,uniTag,uniIcon,KwListCell,uniNumberBox },
    methods:{
      // 点击确定
      confirm(){
        this.$emit("confirm", {
          callback: this.saveDisposeIdea
        })
      },
      // 点击取消用的
      close () {
        this.$emit("close", {
          data: this.zgxsId
        })
      },
      // 保存ajax
      saveDisposeIdea (cb) {
        let contentId = this.contentId ? this.contentId : ''
        // 发送复杂问题，向科室发送协商
        if(this.hxcly.value == '3') {
          if(this.fzwtKs.name == '点击选择科室'){
            this.$kwz.alert('请选择科室')
            return
          } else if(!this.czwt){
            this.$kwz.alert('请输入存在问题')
            return
          }
          this.$kwz.ajax.ajaxUrl({
            url: 'dd_zgxs/doAdd',
            type: 'POST',
            vue: this,
            data: {
              ORG_ID_TARGET: this.org.value,
              BH: this.ybwtBh,
              ZGXSLYMC: '经常性督导整改',
              XS_ORG_ID: this.fzwtKs.value,
              ZGXSLY: '1',
              ZGXSDM: "2",
              ZGXSMC: this.hxcly.name,
              XSNR: this.czwt,
              YWSJ: this.ywsj,
              YWID: contentId
            },
            then (response) {
              this.zgxsId = response.datas.ZGXSID
              this.$kwz.alert('发送成功')
              if (typeof cb == 'function') {
                cb.apply(this, [{
                  ZGXSID: response.datas.ZGXSID,
                  ZGBH: this.ybwtBh
                }])
              }
            }
          })
        } else {
          if(!this.czwt){
            this.$kwz.alert('请输入存在问题')
            return
          } else if(!this.ybwtZgqx){
            this.$kwz.alert('请输入整改期限')
            return
          }
          let isSb = this.hxcly.value == '5' ? '1' : '0'
          this.$kwz.ajax.ajaxUrl({
            url: 'dd_zgxs/doAdd',
            type: 'POST',
            vue: this,
            data: {
              ORG_ID_TARGET: this.org.value,
              BH: this.ybwtBh,
              ZGXSLYMC: '经常性督导整改',
              CLQX: this.ybwtZgqx,
              ZGXSLY: '1',
              ZGXSDM: "1",
              ZGXSMC: this.hxcly.name,
              XSNR: this.czwt,
              YWSJ: this.ywsj,
              YWID: contentId,
              IS_SB: isSb // 是否上报
            },
            then (response) {
              this.zgxsId = response.datas.ZGXSID
              this.$kwz.alert('发送成功')
              if (typeof cb == 'function') {
                cb.apply(this, [{
                  ZGXSID: response.datas.ZGXSID,
                  ZGBH: this.ybwtBh
                }])
              }
            }
          })
        }
      },
      // 获取编号
      getBh () {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/getNowTimeString',
          type: 'POST',
          vue: this,
          then (response) {
            let datas = response.datas
            if (datas.BH) {
              this.ybwtBh = datas.BH
              // let date = new Date()
              // this.disposeIdea.TIME = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
            }
          }
        })
      },
      // 获取科室列表
      getKs () {
        this.$kwz.ajax.ajaxUrl({
          url: 'ddjl/getKsList',
          type: 'post',
          vue: this,
          then (respose) {
            let datas = respose.datas.KSLIST
            if (datas && datas.length > 0) {
              let ksList = []
              for (let i = 0; i < datas.length; i++) {
                ksList.push({
                  name: datas[i].ORG_MC,
                  value: datas[i].ORG_ID
                })
              }
              this.ksList = ksList
            }
          }
        })
      },
      // 修改处理期限
      changeClqx(e){
        this.ybwtZgqx = e
      },
      // 科室选择
      changeKs (e) {
        let index = e.detail.value
        this.fzwtKs.index = index
        this.fzwtKs.name = this.ksList[index].name
        this.fzwtKs.value = this.ksList[index].value
      }
    }
  }
</script>

<style lang="scss">
  .xcdd-hxclyj{
    position: fixed;
    top:44px;
    left: 0;
    width: 750upx;
    padding: 80upx 20upx;
    z-index: 1001;
    background: rgba(0, 0, 0, 0.2);
    height: calc(100vh - 44px);
    /* #ifdef MP-WEIXIN */
    height: 100vh;
    top: 0;
    /* #endif */
    .clyj{
      padding: 20upx;
    }
//     input{
//       display: inline-block;
//       width: 100upx;
//       border:#D9D9D9 solid 2upx;
//     }
    .ddsj{
      padding: 0 20upx;
      text-align: right;
    }
  }
  .xcdd-hxclyj-mask{
    z-index: 1000;
    position: fixed;
    // background: rgba(0, 0, 0, 0.5);
    height: calc(100vh - 44px);
    width: 100%;
    top: 44px;
    left: 0;
    /* #ifdef MP-WEIXIN */
    height: 100vh;
    top: 0;
    /* #endif */
  }
  .xcdd-hxclyj-xwt{
    padding:20upx;
  }
  .xcdd-hxclyj-ybwt{
    border-radius: 10upx;
    padding-bottom: 20upx;
    
  }
  .xcdd-hxclyj-content{
    position: relative;
    z-index: 1001;
    margin: auto;
    width: 100%;
    background: white;
    box-shadow: 0 0 15upx 5upx darkgray;
    padding-bottom: 20upx;
    border-radius: 10upx;
    textarea{
      width: 100%;
      border:#D9D9D9 solid 2upx;
    }
  }
  .xcddSelectGzjBorderBottom::after{
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
  .xcdd-hxclyj-save{
    width: 670upx;
    height: 85upx;
    border-radius: 42.5upx;
    margin: 0 20upx;
    display: flex;
    background: white;
    button{
      padding: 0;
      width: 40%;
      border-radius: 42.5upx;
      background: linear-gradient(90deg, #00befe 0%, #028edf 100%), linear-gradient(#109dea, #109dea);
      color: white;
      line-height: 83upx;
    }
    .fl{
      background: lightgray;
    }
    button:after{
      border: none;
    }
  }
</style>
