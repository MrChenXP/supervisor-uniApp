<template>
	<view class="child-content">
    <kw-list-cell title="编号" v-if="!data.ZGXSID" >
      <view slot="rightNote">
        <view class="bh"><input :value="data.BH" /></view>
      </view>
    </kw-list-cell>
    <kw-list-cell v-else title="编号" :rightNote="data.BH" :isArrow="false" ></kw-list-cell>
    <kw-list-cell v-if="!data.ZGXSID" title="学校/单位" :rightNote="data.XXMC" @click="schoolShow=true"></kw-list-cell>
    <kw-list-cell v-else title="学校/单位" :rightNote="data.XXMC" :isArrow="false"></kw-list-cell>
    <picker v-if="!data.ZGXSID" :range="data.YWSJ" mode="date" @change="changeYwsj">
      <kw-list-cell title="时间" :rightNote="data.YWSJ"></kw-list-cell>
    </picker>
    <kw-list-cell v-else title="时间" :rightNote="data.YWSJ" :isArrow="false"></kw-list-cell>
    <kw-list-cell title="督学" :rightNote="loginUser.name" :isArrow="false"></kw-list-cell>
    <kw-list-cell :isArrow="false">
      <view>
        <!-- <view class="ddjs-head clearfix" @click="zggzShow = !zggzShow">
          <text class="fl">填写整改工作</text>
          <view class="fr" v-show="!zggzShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="zggzShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view> -->
        <view class="ddjs-body">
          <view>
            <view>经挂牌督导，你单位存在以下问题:</view>
            <textarea maxlength="4000" :value="data.XSNR" @input="changeCzwt"></textarea>
            <view>
              对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发
              <uni-number-box :value="data.CLQX" @change="changeClqx"></uni-number-box>
              日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。
            </view>
          </view>
        </view>
      </view>
    </kw-list-cell>
    <view class="save">
      <button @click="fn_ddjs_send">
        <text v-if="data.ZGXSID && hasShAuth">审核</text>
        <text v-if="!data.ZGXSID && hasFsAuth">发送</text>
      </button>
    </view>
    
    <!-- 学校(请把学校搜索ajax写在该组件里) -->
    <view v-show="schoolShow">
      <xcdd-select-school @close="schoolShow=false" @confirm="confirmSchool"></xcdd-select-school>
    </view>
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import XcddSelectSchool from "@kwz/kw-ui/xcdd-select-school.vue"
  import {uniNumberBox} from "@dcloudio/uni-ui"

	export default {
		data() {
			return {
         // 学校显示隐藏
        schoolShow:false,
        // 整改详情显示隐藏
        zggzShow:false,
        // 表单数据
        data: {
          BH: '',
          ORG_ID_TARGET: '',  // 学校id
          XXMC: '', // 学校名称
          YWSJ: '', // 业务时间
          XSNR: '', // 协商内容
          CLQX: 3, // 处理期限
          zgValue: [],
          ZGXSID: ''
        },
        // 存在问题值
        czwt:""
			};
		},
    components:{KwListCell,XcddSelectSchool,uniNumberBox},
    onLoad(query) {
    	this.loginUser = this.$kwz.getLoginUser()
      this.data.ZGXSID = query.id
      this.initPage()
    },
    computed:{
      // 发送权限
      hasFsAuth () {
      	return this.$kwz.hasAuth('dd_zgxs/doAddtzyj')
      },// 审核权限
      hasShAuth () {
      	return this.$kwz.hasAuth('dd_zgxs/zgtz_sh')
      }
    },
    methods:{
      // 判断来源(是否是审核) 获取id并预先加载数据
      initPage () {
        if (this.data.ZGXSID) {
          this.loadData()
        } else {
          this.loadBh()
          // 默认当前时间
          this.data.YWSJ = !this.data.YWSJ ? this.$kwz.formatDate() : this.data.YWSJ
          // 加载整改类型代码
          this.$kwz.loadVueDms('DM_DD_ZGXSLY', dms => {
            this.zgList = dms.DM_DD_ZGXSLY
          }, this)
        }
        this.getdateImpose()
      },
      // 更改时间
      changeYwsj (e) {
      	this.ywsj = e.detail.value
      },
      // 学校确定
      confirmSchool(e){
      	this.data.XXMC = e.data.name;
      	this.data.ORG_ID_TARGET = e.data.value;
      	this.schoolShow = false
      },
      // 获取日期限制
      getdateImpose () {
        // let startEnd = this.$kwz.dateImpose('3758a16aa4e14b3d87bb1f9c7e2fc509', this)
//         if (!startEnd) {
//           setTimeout(() => {
//             this.getdateImpose()
//           }, 500)
//         } else {
//           this.startDate = this.$kwz.getLimdat(JSON.parse(startEnd.minDate))
//           this.endDate = this.$kwz.getLimdat(JSON.parse(startEnd.maxDate))
//           this.data.minDate = startEnd.minDate
//           this.data.maxDate = startEnd.maxDate
//         }
      },
      // 改变存在问题变量值
      changeCzwt (e) {
      	this.data.XSNR = e.detail.value
      },
      // 预先加载数据
      loadData () {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/doSelectByPrimary',
          type: 'POST',
          data: {
            ZGXSID: this.data.ZGXSID
          },
          vue: this,
          then (response) {
            let datas = response.datas
            this.data.BH = datas.BH
            this.data.XXMC = datas.XXMC
            this.data.YWSJ = datas.YWSJ
            this.data.XSNR = datas.XSNR
            this.data.CLQX = datas.CLQX
          }
        })
      },
      // 加载编号
      loadBh () {
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_zgxs/getNowTimeString',
          type: 'POST',
          vue: this,
          then (response) {
            let datas = response.datas
            if (datas && datas.BH) {
              this.data.BH = datas.BH
            }
          }
        })
      },
      // 点击发送事件
      fn_ddjs_send () {
        if (!this.data.XXMC) {
          this.$kwz.alert('请选择学校')
          return
        }
        if (!this.data.YWSJ) {
          this.$kwz.alert('请选择时间')
          return
        }
        if (!this.data.XSNR) {
          this.$kwz.alert('请填写问题')
          return
        }
        if (!this.data.CLQX) {
          this.$kwz.alert('请填写整改期限')
          return
        } else if (isNaN(this.data.CLQX)) {
          this.$kwz.alert('整改期限必须为数字')
          return
        }
        this.saveZgtzs()
      },
      // 发送/审核ajax 有整改id就是审核
      saveZgtzs () {
        if (this.data.ZGXSID) {
          this.$kwz.ajax.ajaxUrl({
            url: 'dd_zgxs/doUpdate/ZGTZ',
            type: 'POST',
            data: {
              CMS_LMTYPE: '2',
              ZGXSID: this.data.ZGXSID,
              CLLX: '2',
              XSNR: this.data.XSNR,
              CLQX: this.data.CLQX
            },
            vue: this,
            then (response) {
              this.$kwz.redirect({url: 'zggz'})
              this.$kwz.alert('审核成功')
            }
          })
        } else {
          this.$kwz.ajax.ajaxUrl({
            url: 'dd_zgxs/doAddtzyj',
            type: 'POST',
            data: {
              BH: this.data.BH,
              YWID: '',
              ZGXSDM: '1',
              ZGXSMC: '整改通知',
              ZGXSLY: 3, // 先写死整改来源
  //          ZGXSLYMC: this.$kwz.getPopupName(this.zgList, this.data.zgValue[0], 'value', 'name'), //如果不是写死在注释回来
              ZGXSLYMC: '其他整改',
              ORG_ID_TARGET: this.data.ORG_ID_TARGET,
              CLQX: this.data.CLQX,
              YWSJ: this.data.YWSJ,
              XSNR: this.data.XSNR,
              minDate: this.data.minDate,
              maxDate: this.data.maxDate
            },
            vue: this,
            then (response) {
              this.$kwz.redirect({url: 'zggz'})
              this.$kwz.alert('发送成功')
            }
          })
        }
      },
      changeClqx(val){
        this.data.CLQX = val
      }
      
    }
	}
</script>

<style lang="scss">
  .bh{
    width: 500upx;
    text-align: right;
    ._input{
      color: #999999;
    }
  }
  .ddjs-head{
      height: 55upx;
  }
  .ddjs-body{
    padding:0 20upx;
    textarea{
      width: 100%;
      border:#D9D9D9 solid 2upx;
    }
    input{
      display: inline-block;
      width: 100upx;
      border:#D9D9D9 solid 2upx;
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
    text{
      color: white;
    }
    button:after{
      border: none;
    }
  }
</style>
