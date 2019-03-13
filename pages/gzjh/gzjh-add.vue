<template>
	<view class="child-content">
    <kw-list-cell title="学校" :rightNote="xx.name" @click="schoolShow=true"></kw-list-cell>
    <picker :range="ywsj" mode="date" @change="changeYwsj">
      <kw-list-cell title="计划时间" :rightNote="ywsj"></kw-list-cell>
    </picker>
    <picker :range="sdList" :value="sdValue.index" range-key="DMMX_MC" @change="changeSd" >
      <kw-list-cell title="时段" :rightNote="sdValue.name" ></kw-list-cell>
    </picker>
    <kw-list-cell title="随行督学" :rightNote="sxdx.name" @click="sxdxShow=true"></kw-list-cell>
    <picker :range="pjList" @change="changePj" range-key="name" :value="pjValue.index" >
      <kw-list-cell title="规定任务评价" :rightNote="pjValue.name"></kw-list-cell>
    </picker>
    <kw-list-cell :isArrow="false">
      <view>
        <view class="ddjs-head clearfix" @click="ddsxShow = !ddsxShow">
          <text class="fl">督导事项</text>
          <view class="fr" v-show="!ddsxShow"><uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon></view>
          <view class="fr" v-show="ddsxShow"><uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon></view>
        </view>
        <view v-show="ddsxShow" class="ddjs-body">
          <!-- 以前手机端用的是文本域 -->
          <kw-editor :content="ddsx"></kw-editor>
        </view>
      </view>
    </kw-list-cell>
    <view class="save">
      <button @click="saveGzjh">保存</button>
    </view>
    
     <!-- 学校(请把学校搜索ajax写在该组件里) -->
    <view v-show="schoolShow">
      <xcdd-select-school @close="schoolShow=false" @confirm="confirmSchool"></xcdd-select-school>
    </view>
    <!-- 随行督学(请把随行督学搜索ajax写在该组件里) -->
    <view v-show="sxdxShow">
      <xcdd-select-sxdx @close="sxdxShow=false" @confirm="sxdxConfirm"></xcdd-select-sxdx>
    </view>
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import XcddSelectSchool from "@kwz/kw-ui/xcdd-select-school.vue"
  import XcddSelectSxdx from "@kwz/kw-ui/xcdd-select-sxdx.vue"
	import KwEditor from "@kwz/kw-ui/kw-editor.vue"
	export default {
		data() {
			return {
        // 学校显示隐藏
        schoolShow:false,
        // 随行督学显示隐藏
        sxdxShow:false,
        // 学校(校园)数据
        xx: {
        	name: '',
        	value: ''
        },
        // 表单数据
        formData: {
          xxName: '',
          xxId: '',
          YWSJ: '',
          sdValue: [],
          sxdxName: '',
          sxdxId: '',
          ddsxTxt: '',
          pgbzValue: [],
          remark: '',
          xqid: ''
        },
        startDate: '', // 可填写的最小时间,别放在date对象里,而且一定要事先创建好变量
        endDate: '', // 可填写的最大时间,别放在date对象里,而且一定要事先创建好变量
        // 业务时间
        ywsj:"",
        // 时段列表
        sdList:[],
        // 时段值
        sdValue:{
					name: '',
					value: '',
					index: 0
				},
				// 随行督学
				sxdx: {
					name: '',
					value: '',
					index: 0
				},
        // 评估标准名字列表 规定任务评价
        pjList:[],
        // 评估标准值
        pjValue: {
					name: '',
					value: '',
					index: 0
				},
        // 督导事项显示隐藏
        ddsxShow:false,
				// 督导事项
				ddsx: {},
				// 当前学期id
				xqid: '',
				remark: '',
				// 登陆用户
				loginUser: {},
				// 工作计划id
				contentId: ''
			}
		},
		computed:{
			minDate() {
				return this.$kwz.dateImpose('b892eba5fae9493189ac81a510bbbd73').minDate
			},
			maxDate() {
				return this.$kwz.dateImpose('b892eba5fae9493189ac81a510bbbd73').maxDate
			}
		},
		onLoad(param) {
			this.init()
			if(param && param.contentId) {
				this.contentId = param.contentId
			} else {
				// 加载当前学期id
				this.$kwz.ajax.ajaxUrl({
					url: 'jc_xq/getCurXq',
					type: 'POST',
					vue: this,
					then (response) {
						let datas = response.datas
						if (datas && datas.curXq) {
							this.xqid = datas.curXq.XQ_ID
						}
					}
				})
			}
      this.getdateImpose()
		},
    components:{KwListCell,XcddSelectSchool,XcddSelectSxdx,KwEditor},
    methods:{
			// 加载规定任务评价列表
			init () {
				// 时段代码
				this.$kwz.loadVueDms('DM_SD', dms => {
					this.sdList = dms.DM_SD
					// 评估标准
					this.$kwz.ajax.ajaxUrl({
						url: 'dd_gzap/doSelectPgbz/DDPGBZ',
						type: 'POST',
						data: {
							'YWLX': 'DDPGBZ',
							'DDPGBZ': 'DDPGBZ'
						},
						vue: this,
						then (response) {
							let datas = response.datas
							let pgbzList = []
							if (datas && datas.length > 0) {
								for (let i = 0; i < datas.length; i++) {
									pgbzList.push({
										name: datas[i].BZMC,
										value: datas[i].BZID
									})
								}
							} else {
								pgbzList.push({
									name: '暂无记录',
									value: ''
								})
							}
							this.pjList = pgbzList
							
							this.loadData()
						}
					})
					
				}, this)
				
				this.loginUser = this.$kwz.getLoginUser()
			},
      // 获取日期限制
      getdateImpose () {
        let startEnd = this.$kwz.dateImpose('b892eba5fae9493189ac81a510bbbd73')
        if (!startEnd) {
          setTimeout(() => {
            this.getdateImpose()
          }, 500)
        } else {
          this.startDate = this.$kwz.getLimdat(startEnd.minDate)
          this.endDate = this.$kwz.getLimdat(startEnd.maxDate)
          this.formData.minDate = startEnd.minDate
          this.formData.maxDate = startEnd.maxDate
        }
      },
			// 学校确定
			confirmSchool(e){
				this.xx.name = e.data.name;
				this.xx.value = e.data.value;
				this.schoolShow = false
			},
			// 随行督学确定
			sxdxConfirm(e) {
				let sxDxList = e.data
				let sxdxIds = []
				let sxdxNames = []
				if (sxDxList && sxDxList.length > 0) {
					for (let i = 0; i< sxDxList.length; i++) {
						sxdxIds.push(sxDxList[i].value)
						sxdxNames.push(sxDxList[i].name)
					}
				}
				this.sxdx.name = sxdxNames.join(',')
				this.sxdx.value = sxdxIds.join(',')
				this.sxdxShow = false
			},
      // 更改业务时间
      changeYwsj (e) {
      	this.ywsj = e.detail.value
      },
      // 更改时段
      changeSd (e) {
      	// this.ywsj = e.detail.value
				let index = e.detail.value
				this.sdValue.index = index
				this.sdValue.name = this.sdList[index].DMMX_MC
				this.sdValue.value = this.sdList[index].DMMX_CODE
      },
      // 更改评价标准
      changePj (e) {
				let index = e.detail.value
				this.pjValue.index = index
				this.pjValue.name = this.pjList[index].name
				this.pjValue.value = this.pjList[index].value
      },
			// 获取编辑器的督导纪实内容
			getDdsx () {
				let ddsx = [this.ddsx.content]
				if(this.ddsx.images && this.ddsx.images.length > 0) {
					let images = this.ddsx.images
					for(let i = 0;i < images.length; i++) {
						ddsx.push('<p><img src="')
						ddsx.push(images[i].imageUrl)
						ddsx.push('" ></p>')
					}
				}
				return ddsx.join('')
			},
			// 设置编辑器的督导纪实内容
			setDdsx (html) {
				let ddsx = []
				let ddsxImage = []
				let ddsxSplit = this.$kwz.splitHtml(html)
				if (ddsxSplit && ddsxSplit.length > 0) {
					for (let i in ddsxSplit) {
						let content = ddsxSplit[i]
						if (content.content) {
							ddsx.push(content.content)
						}
						if (content.imageUrl) {
							ddsxImage.push({
								type: 'image',
								content: content.imageUrl,
								imageUrl: content.realUrl
							})
						}
					}
				}
				this.ddsx = {
					content: ddsx.join(''),
					images: ddsxImage
				}
			},
			// 保存提交工作计划
			saveGzjh () {
				if (this.contentId) {
					this.doUpdate()
				} else {
					this.doAdd()
				}
			},
			// 新增
			doAdd () {
				this.$kwz.ajax.ajaxUrl({
					url: 'dd_gzap/doAdd/DDGZAP',
					type: 'POST',
					data: {
						CONTENT_TYPE: 'DDGZAP',
						XQID: this.xqid,
						STATUS: '1',
						GROUP_ARR: `[{
							"xxid": "${this.xx.value}",
							"xxmc": "${this.xx.name}",
							"jgid": "${this.sxdx.value}",
							"jgmc": "${this.sxdx.name}",
							"ywsj": "${this.ywsj}",
							"sd": "${this.sdValue.value}",
							"minDate": ${this.minDate},
							"maxDate": ${this.maxDate}
						}]`,
						TXT: this.getDdsx(),
						REMARK: this.remark,
						BZID: this.pjValue.value,
						ORG_ID: this.xx.value,
						AUTHOR: this.loginUser.name
					},
					vue: this,
					then (response) {
						this.$kwz.alert('保存成功')
						this.$kwz.back(1500)
					}
				})
			},
			// 修改
			doUpdate () {
				this.$kwz.ajax.ajaxUrl({
					url: 'dd_gzap/doUpdate',
					type: 'POST',
					data: {
						CONTENT_ID: this.contentId,
						XQID: this.xqid,
						ORG_ID: this.xx.value,
						JGID: this.sxdx.value,
						JGID_MC: this.sxdx.name,
						YWSJ: this.ywsj,
						SD: this.sdValue.value,
						TXT: this.getDdsx(),
						BZID: this.pjValue.value,
						minDate: this.minDate,
						maxDate: this.maxDate
					},
					vue: this,
					then (response) {
						this.$kwz.alert('保存成功')
						this.$kwz.back(1500)
					}
				})
			},
			// 加载工作安排
			loadData () {
				this.$kwz.ajax.ajaxUrl({
          url: 'dd_gzap/doSelectByPrimary/DDGZAP',
          type: 'POST',
          data: {
            CONTENT_ID: this.contentId
          },
          vue: this,
          then (response) {
            let datas = response.datas
            if (datas && datas.map) {
							let map = datas.map
							this.xx.name = map.ORG_ID_TARGET_MC
							this.xx.value = map.ORG_ID_TARGET
							this.ywsj = (map.YWSJ && map.YWSJ.length > 10 ? map.YWSJ.substr(0, 10) : '')
							this.sdValue.value = map.SD
							for(let i = 0; i < this.sdList.length; i++) {
								if(this.sdList[i].DMMX_CODE == map.SD) {
									this.sdValue.name = this.sdList[i].DMMX_MC
									this.sdValue.index = i
								}
							}
							this.sxdx.name = map.JGID_MC
							this.sxdx.value = map.JGID
							this.pjValue.value = map.BZID
							for(let i = 0; i < this.pjList.length; i++) {
								if(this.pjList[i].value == map.BZID) {
									this.pjValue.name = this.pjList[i].name
									this.pjValue.index = i
								}
							}
							this.setDdsx(map.TXT)
							this.xqid = map.XQID
            }
          }
        })
			}
    }
	}
</script>

<style lang="scss">
  .ddjs-head{
      height: 55upx;
    }
  .ddjs-body{
      border:#D9D9D9 solid 2upx;
      textarea{
        width: 100%;
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
