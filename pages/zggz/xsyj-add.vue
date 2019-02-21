<template>
	<view class="child-content">
    <kw-list-cell  v-if="!formData.ZGXSID" title="编号" :rightNote="formData.BH"></kw-list-cell>
    <kw-list-cell  v-else title="编号" :rightNote="formData.BH" :isArrow="false"></kw-list-cell>
    <kw-list-cell v-if="!formData.ZGXSID" title="学校/单位" :rightNote="formData.XXMC" @click="schoolShow=true"></kw-list-cell>
    <kw-list-cell  v-else title="学校/单位" :rightNote="formData.XXMC" :isArrow="false"></kw-list-cell>
    <picker v-if="!formData.ZGXSID" :range="ksList" @change="changeKs" range-key="name">
      <kw-list-cell title="科室/中心" :rightNote="formData.XS_ORG.name"></kw-list-cell>
    </picker>
    <kw-list-cell  v-else title="科室/中心" :rightNote="formData.XS_ORG" :isArrow="false"></kw-list-cell>
    <picker v-if="!formData.ZGXSID" :range="formData.YWSJ" mode="date" @change="changeYwsj">
      <kw-list-cell title="时间" :rightNote="formData.YWSJ"></kw-list-cell>
    </picker>
    <kw-list-cell  v-else title="时间" :rightNote="formData.YWSJ" :isArrow="false"></kw-list-cell>
    <kw-list-cell :isArrow="false">
      <view>
        <!-- <view class="ddjs-head clearfix" @click="xsyjShow = !xsyjShow">
          <text class="fl">填写协商意见</text>
          <view class="fr" v-show="!xsyjShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="xsyjShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view> -->
        <view class="ddjs-body">
          <view>
            <view>
              我室责任督学
              <text>{{loginUser.name}}</text>
              于
              <text>{{formData.YWSJ}}</text>
              对该校(幼儿园)进行了教育督导，发现该学校(幼儿园)存在以下问题：
            </view>
            <textarea maxlength="4000" :value="formData.XSNR"  @input="changeCzwt"></textarea>
            <view>
             请贵科室（中心）予以支持、配合、协调解决!
            </view>
          </view>
        </view>
      </view>
    </kw-list-cell>
    <view class="save">
      <button @click="fn_ddjs_send">
        <text v-if="formData.ZGXSID">审核</text>
        <text v-else>发送</text>
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

	export default {
		data() {
			return {
        formData: {
          BH: '',
          XXMC: [''],
          XS_ORG: [''],
          YWSJ: '',
          XSNR: '',
          ZGXSID: ''
        },
        ksList: [],
        // 学校显示隐藏
        schoolShow:false,
        // 整改详情显示隐藏
        xsyjShow:false
			};
		},
    components:{KwListCell,XcddSelectSchool},
    onLoad(query) {
      this.loginUser = this.$kwz.getLoginUser()
    	this.formData.ZGXSID = query.id
      this.initPage()
    },
    methods:{
      // 判断来源(是否是审核) 获取id并预先加载数据
      initPage () {
        if (this.formData.ZGXSID) {
          this.loadData()
        } else {
          this.loadBh()
          this.loadKsList()
          // 默认当前时间
          this.formData.YWSJ = !this.formData.YWSJ ? this.$kwz.formatDate() : this.formData.YWSJ
        }
        this.getdateImpose()
      },
      // 学校确定
      confirmSchool(e){
      	this.formData.XXMC = e.data.name;
      	this.formData.ORG_ID_TARGET = e.data.value;
      	this.schoolShow = false
      },
      // 获取日期限制
      getdateImpose () {
//           let startEnd = this.$kwz.dateImpose('3758a16aa4e14b3d87bb1f9c7e2fc509', this)
//           if (!startEnd) {
//             setTimeout(() => {
//               this.getdateImpose()
//             }, 500)
//           } else {
//             this.startDate = this.$kwz.getLimdat(JSON.parse(startEnd.minDate))
//             this.endDate = this.$kwz.getLimdat(JSON.parse(startEnd.maxDate))
//             this.formData.minDate = startEnd.minDate
//             this.formData.maxDate = startEnd.maxDate
//           }
        },
      // 获取功能权限
        getPermission (url) {
          return this.$kwz.hasAuth(url, this)
        },
      // 改变存在问题变量值
      changeCzwt (e) {
      	this.formData.XSNR = e.detail.value
      },
      // 预先加载数据
        loadData () {
          this.$kwz.ajax.ajaxUrl({
            url: 'dd_zgxs/doSelectByPrimary',
            type: 'POST',
            data: {
              ZGXSID: this.formData.ZGXSID
            },
            vue: this,
            then (response) {
             let datas = response.datas
              this.formData.BH = datas.BH
              this.formData.XXMC[0] = datas.XXMC
              this.formData.YWSJ = datas.YWSJ
              this.formData.XSNR = datas.XSNR
              this.formData.XS_ORG[0] = datas.XS_ORG
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
                this.formData.BH = datas.BH
              }
            }
          })
        },
      // 加载科室选择列表
        loadKsList () {
          this.$kwz.ajax.ajaxUrl({
            url: 'ddjl/getKsList',
            type: 'POST',
            vue: this,
            then (response) {
              let datas = response.datas.KSLIST
              let ksList = []
              if (datas && datas && datas.length > 0) {
                for (let i = 0; i < datas.length; i++) {
                  ksList.push({
                    value: datas[i].ORG_ID,
                    name: datas[i].ORG_MC
                  })
                }
              } else {
                ksList.push({
                  name: '暂无数据',
                  value: ''
                })
              }
              this.ksList = ksList
            }
          })
        },
        
      // 点击处理事件
        fn_ddjs_send () {
          if (!this.formData.XXMC) {
            this.$kwz.alert('请选择学校')
            return
          }
          if (!this.formData.XS_ORG) {
            this.$kwz.alert('请选择科室')
            return
          }
          if (!this.formData.YWSJ) {
            this.$kwz.alert('请选择时间')
            return
          }
          if (!this.formData.XSNR) {
            this.$kwz.alert('请填写问题')
            return
          }
          this.saveZgtzs()
        },
      // 发送/审核 ajax 有整改id就是审核
        saveZgtzs () {
          if (this.formData.ZGXSID) {
            this.$kwz.ajax.ajaxUrl({
              url: 'dd_zgxs/doUpdate/XSYJ',
              type: 'POST',
              data: {
                CMS_LMTYPE: '1',
                ZGXSID: this.formData.ZGXSID,
                CLLX: '22',
                XSNR: this.formData.XSNR
              },
              vue: this,
              then (response) {
                this.$kwz.redirect({url: 'xsyj'})
                this.$kwz.alert('审核成功')
              }
            })
          } else {
            this.$kwz.ajax.ajaxUrl({
              url: 'dd_zgxs/doAddtzyj',
              type: 'POST',
              data: {
                BH: this.formData.BH,
                ZGXSDM: '2',
                ZGXSMC: '协商意见',
                ZGXSLY: '3',
                ZGXSLYMC: '其他整改',
                ORG_ID_TARGET: this.formData.ORG_ID_TARGET,
                XS_ORG_ID: this.formData.XS_ORG.value,
                YWSJ: this.formData.YWSJ,
                XSNR: this.formData.XSNR,
                YWID: '',
                minDate: this.formData.minDate,
                maxDate: this.formData.maxDate
              },
              vue: this,
              then (response) {
                this.$kwz.redirect({url: 'xsyj'})
                this.$kwz.alert('发送成功')
              }
            })
          }
        },
      // 更改时间
      changeYwsj (e) {
      	this.ywsj = e.detail.value
      },
      // 更改科室
      changeKs(e) {
      	let i = e.detail.value
        this.formData.XS_ORG = this.ksList[i]
      },
    }
	}
</script>

<style lang="scss">
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
