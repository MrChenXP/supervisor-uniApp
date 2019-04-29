<template>
	<view class="child-content">
    <view v-if="isNew === '1' || !data.MXID">
      <kw-list-cell title="学校(校园)" :rightNote="data.MB_ORG_MC" v-if="data.MXID" :isArrow="false"></kw-list-cell>
      <kw-list-cell title="学校(校园)" :rightNote="xx.name" @click="schoolShow=true" v-else></kw-list-cell>
      <kw-list-cell title="听课日期" :rightNote="data.YWSJ" v-if="data.MXID" :isArrow="false"></kw-list-cell>
      <picker :value="data.YWSJ" mode="date" @change="changeYwsj" :start="startDate" :end="endDate" v-else>
        <kw-list-cell title="听课日期" :rightNote="data.YWSJ"></kw-list-cell>
      </picker>
      <kw-list-cell title="听课班级">
        <view slot="rightNote">
          <view class="list-right-input"><input v-model="data.BJ" placeholder="请填写班级"/></view>
        </view>
      </kw-list-cell>
      <kw-list-cell title="听课学科">
        <view slot="rightNote">
          <view class="list-right-input"><input v-model="data.XK" placeholder="请填写学科"/></view>
        </view>
      </kw-list-cell>
      <kw-list-cell title="听课教师">
        <view slot="rightNote">
          <view class="list-right-input"><input v-model="data.JSMC" placeholder="请填写教师名称"/></view>
        </view>
      </kw-list-cell>
      <kw-list-cell :isArrow="false">
        <view>
          <view class="ddjs-head clearfix" @click="ddjsShow = !ddjsShow">
            <text class="fl">过程记录</text>
            <view class="fr" v-show="!ddjsShow"><uni-icon type="arrowdown" size="20" color="#c7c7c7"></uni-icon></view>
            <view class="fr" v-show="ddjsShow"><uni-icon type="arrowup" size="20" color="#c7c7c7"></uni-icon></view>
          </view>
          <view v-show="ddjsShow" class="ddjs-body">
            <kw-editor :content="ddjs"></kw-editor>
          </view>
        </view>
      </kw-list-cell>
      <kw-list-cell :isArrow="false">
        <view>
          <view class="ddjs-head clearfix">
            <view class="clearfix">
              <text class="fl">定性评价</text>
              <view class="fr"><uni-rate :value="data.FZ" @change="changeFz"></uni-rate></view>
            </view>
          </view>
        </view>
      </kw-list-cell>
      <kw-list-cell :isArrow="false">
        <view>
          <view class="ddjs-head clearfix" @click="zhpjShow = !zhpjShow">
            <text class="fl">综合评价</text>
            <view class="fr" v-show="!zhpjShow"><uni-icon type="arrowdown" size="20" color="#c7c7c7"></uni-icon></view>
            <view class="fr" v-show="zhpjShow"><uni-icon type="arrowup" size="20" color="#c7c7c7"></uni-icon></view>
          </view>
          <view v-show="zhpjShow" class="ddjs-body">
            <textarea :value="data.ZHPJ" maxlength="4000" @input="inputZhpj"></textarea>
          </view>
        </view>
      </kw-list-cell>
      <view class="save" v-if="hasBcAuth">
        <button @click="save">保存</button>
      </view>
      
      
      <!-- 学校(请把学校搜索ajax写在该组件里) -->
      <view v-show="schoolShow">
        <xcdd-select-school @close="schoolShow=false" @confirm="confirmSchool"></xcdd-select-school>
      </view>
    </view>
    <view v-else class="text-bold">
      {{tbmbglData.MBNR}}
    </view>
    
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import XcddSelectSchool from "@kwz/kw-ui/xcdd-select-school.vue"
  import KwEditor from "@kwz/kw-ui/kw-editor.vue"
  import {uniRate } from "@dcloudio/uni-ui"

	export default {
    components:{KwListCell,XcddSelectSchool,KwEditor,uniRate},
		data() {
			return {
        // 学校显示隐藏
        schoolShow:false,
        // 督导纪实显示隐藏
        ddjsShow: false,
        // 综合评价显示隐藏
        zhpjShow:false,
        // 学校(校园)数据
        xx: {
        	name: '',
        	value: ''
        },
        // 督导纪实 一定要加content 和 images 否则添加不了图片。原因不明
        ddjs: {
					content: '',
					images: []
				},
        // 听课记录表单数据
        data: {
          'MB_ORG_ID': '', // 学校id
          'YWSJ': '', // 业务时间
          'JSMC': '', // 教师名称
          'BJ': '', // 班级
          'XK': '', // 学科
          'GCJL': '', // 过程记录
          'FZ': 0, // 分值 定性评价
          'ZHPJ': '', // 综合评价
          'MB_ORG_MC': '', // 学校名称
          'MXID': '' // 此条记录的ID
        },
        startDate: '', // 可填写的最小时间,别放在date对象里,而且一定要事先创建好变量并给时间
        endDate: '', // 可填写的最大时间,别放在date对象里,而且一定要事先创建好变量并给时间
        tbmbglData: {}, // 老记录模板数据
        isNew:"1"
      }
		},
    computed:{
      // 保存权限
      hasBcAuth () {
      	return this.$kwz.hasAuth('jc_pgbzmx/doAddTkjl/TKJL')
      },
    },
    onLoad(param) {
      this.data.MXID = param.id
      this.isNew = param.isNew
      if (this.isNew !== "1" && this.data.MXID) {
        this.tbmbglData.MBNR="因系统升级，此记录请于电脑端修改"
      }else{
        this.initPage()
      }
    },
    methods:{
      // 初始化页面
      initPage(){
        // 有id就是修改，就事先获取数据
        if(this.data.MXID) {
          this.$kwz.ajax.ajaxUrl({
            url: 'jc_pgbzmx/doSelectByPrimary/TKJL',
            type: 'POST',
            data: {
              MXID: this.data.MXID
            },
            vue: this,
            then (response) {
              let datas = response.datas
              this.data = datas
              this.xx.value = this.data.MB_ORG_ID
              this.xx.name = this.data.MB_ORG_MC
              this.data.YWSJ = (datas.YWSJ.substr(0, 10))
              this.setDdjs(this.data.GCJL)
            }
          })
        }else{
          this.data.YWSJ = this.$kwz.formatDate()
        }
        this.getdateImpose()
      },
      // 点击保存按钮
      save(){
        this.data.GCJL= this.getDdjs()
        if (!this.xx.value || !this.data.YWSJ || !this.data.BJ || !this.data.XK || !this.data.JSMC) {
          this.$kwz.alert('学校，听课日期，听课班级，听课学科，听课教师中不能有空')
          return false
        } else if (!this.data.GCJL || this.data.FZ < 1 || !this.data.ZHPJ) {
          this.$kwz.alert('过程记录，定性评价，综合评价中不能有空')
          return false
        }
        if (this.data.MXID) {
          this.doUpdate()
        } else {
          this.doAdd()
        }
      },
      // 保存ajax
      doAdd () {
        this.$kwz.ajax.ajaxUrl({
          url: 'jc_pgbzmx/doAddTkjl/TKJL',
          type: 'POST',
          vue: this,
          data: {
            'XXMC': this.xx.value, // 字段名是学校名称 传的其实是学校id(后端取错
            'YWSJ': this.data.YWSJ, // 业务时间
            'JSMC': this.data.JSMC, // 教师名称
            'BJ': this.data.BJ, // 班级
            'XK': this.data.XK, // 学科
            'GCJL': this.data.GCJL, // 过程记录
            'FZ': String(this.data.FZ), // 分值 定性评价 12345字符串数值 0就是没填，不能提交
            'ZHPJ': this.data.ZHPJ, // 综合评价
            minDate: this.data.minDate,
            maxDate: this.data.maxDate
          },
          then (response) {
            this.$kwz.alert('保存成功')
            this.$kwz.redirect({url: 'tkjl'})
          }
        })
      },
      // 修改
      doUpdate () {
        this.$kwz.ajax.ajaxUrl({
          url: 'jc_pgbzmx/doUpdateTkjl/TKJL',
          type: 'POST',
          vue: this,
          data: {
            'XXMC': this.xx.value, // 字段名是学校名称 传的其实是学校id(后端取错名
            'YWSJ': this.data.YWSJ, // 业务时间
            'JSMC': this.data.JSMC, // 教师名称
            'BJ': this.data.BJ, // 班级
            'XK': this.data.XK, // 学科
            'GCJL': this.data.GCJL, // 过程记录
            'FZ': String(this.data.FZ), // 分值 定性评价 12345字符串数值 0就是没填，不能提交
            'ZHPJ': this.data.ZHPJ, // 综合评价
            'MXID': this.data.MXID,
            minDate: this.data.minDate,
            maxDate: this.data.maxDate
          },
          then (response) {
            this.$kwz.alert('保存成功')
            this.$kwz.back(500)
          }
        })
      },
      // 获取日期限制
      getdateImpose () {
        let startEnd = this.$kwz.dateImpose('cd5235ad9e2d463a9af919de06dcfb06')
        if (!startEnd) {
          setTimeout(() => {
            this.getdateImpose()
          }, 500)
        } else {
          this.startDate = this.$kwz.getLimdat(startEnd.minDate)
          this.endDate = this.$kwz.getLimdat(startEnd.maxDate)
          this.data.minDate = startEnd.minDate
          this.data.maxDate = startEnd.maxDate
        }
      },
      // 修改业务时间
      changeYwsj (e) {
      	this.data.YWSJ = e.detail.value
      },
      // 学校确定
      confirmSchool(e){
      	this.xx.name = e.data.name;
      	this.xx.value = e.data.value;
      	this.schoolShow = false
      },
      // 修改定性评价(分值)
      changeFz(e){
        this.data.FZ = e.value
      },
      //  修改综合评价value值
      inputZhpj(e) {
      	this.data.ZHPJ = e.detail.value
      },
      // 获取督导纪实内容 将ddjs转成html
      getDdjs () {
      	let ddjs = [this.ddjs.content]
      	if(this.ddjs.images && this.ddjs.images.length > 0) {
      		let images = this.ddjs.images
      		for(let i = 0;i < images.length; i++) {
      			ddjs.push('<p><img src="')
      			ddjs.push(images[i].imageUrl)
      			ddjs.push('" ></p>')
      		}
      	}
      	return ddjs.join('')
      },
      // 设置督导纪实内容 将html转成ddjs
      setDdjs (html) {
      	let ddjs = []
      	let ddjsImage = []
      	let ddjsSplit = this.$kwz.splitHtml(html)
      	if (ddjsSplit && ddjsSplit.length > 0) {
      		for (let i in ddjsSplit) {
      			let content = ddjsSplit[i]
      			if (content.content) {
      				ddjs.push(content.content)
      			}
      			if (content.imageUrl) {
      				ddjsImage.push({
      					type: 'image',
      					content: content.imageUrl,
      					imageUrl: content.realUrl
      				})
      			}
      		}
      	}
      	this.ddjs = {
      		content: ddjs.join(''),
      		images: ddjsImage
      	}
      },
    }
	}
</script>

<style lang="scss">
  
</style>
