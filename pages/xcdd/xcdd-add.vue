<template>
	<view class="child-content">
    <kw-list-cell title="工作计划" :rightNote="gzjh.name" @click="loadGzjh"></kw-list-cell>
    <kw-list-cell title="学校(校园)" :rightNote="xx.name" @click="schoolShow=true"></kw-list-cell>
    <kw-list-cell title="随行督学" :rightNote="sxdx.name" @click="sxdxShow=true"></kw-list-cell>
    <picker :range="ywsj" mode="date" @change="changeYwsj">
      <kw-list-cell title="时间" :rightNote="ywsj"></kw-list-cell>
    </picker>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="ddjsShow = !ddjsShow">
          <text class="fl">督导纪实</text>
          <view class="fr" v-show="!ddjsShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="ddjsShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="ddjsShow" class="ddjs-body">
          <kw-editor :content="ddjs"></kw-editor>
        </view>
				<!-- <view v-show="ddjsShow" class="ddjs-body">
				  <kw-editor :content="ddjs"></kw-editor>
				</view> -->
      </view>
    </kw-list-cell>
    <kw-list-cell v-if="ddpgShow">
      <view>
        <view class="ddjs-head clearfix">
          <text class="fl">规定任务评价</text>
          <view class="fr"><button size="mini" type="warn" @click="toDdpg">去评估</button></view>
					<view>
						<uni-rate value="3" ></uni-rate>
					</view>
        </view>
      </view>
    </kw-list-cell>
		<kw-list-cell>
		  <view>
		    <view class="ddjs-head clearfix" @click="zlcjShow = !zlcjShow">
		      <text class="fl">资料采集</text>
		      <view class="fr" v-show="!zlcjShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
		      <view class="fr" v-show="zlcjShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
		    </view>
		    <view v-show="zlcjShow" class="ddjs-body">
					<view>
		      查阅资料<uni-number-box :value="cyzl" @change="changeCyzl"></uni-number-box>份
					</view>
					<view>
					列席会议<uni-number-box :value="lxhy" @change="changeLxhy"></uni-number-box>次
					</view>
					<view>
					座谈走访<uni-number-box :value="ztzf" @change="changeZtzf"></uni-number-box>次
					</view>
					<view>
					问卷调查<uni-number-box :value="wjdc" @change="changeWjdc"></uni-number-box>次
					</view>
					<view>
					校园巡视<uni-number-box :value="xyxs" @change="changeXyxs"></uni-number-box>次
					</view>
		    </view>
		  </view>
		</kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="jyzfShow = !jyzfShow">
          <text class="fl">典型经验和做法</text>
          <view class="fr" v-show="!jyzfShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="jyzfShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="jyzfShow" class="ddjs-body">
          <textarea :value="dxjyzfHide" maxlength="4000" @input="blurDxjyzf"></textarea>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="czwtShow = !czwtShow">
          <text class="fl">存在问题</text>
          <view class="fr" v-show="!czwtShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="czwtShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="czwtShow" class="ddjs-body">
          <textarea :value="czwtHide" maxlength="4000" @input="blurCzwt"></textarea>
        </view>
      </view>
    </kw-list-cell>
    <picker :range="hxclyjList" :value="hxclyj.index" range-key="name" @change="changeHxcly">
      <kw-list-cell title="后续处理意见" :rightNote="hxclyj.name"></kw-list-cell>
    </picker>
		<kw-list-cell :show="hxclyjXwt">
		  <view>
		    <view class="ddjs-body">
		      <textarea :value="zgxsyjHide" maxlength="4000" placeholder="请输入反馈意见" @input="blurZgxsyj"></textarea>
		    </view>
		  </view>
		</kw-list-cell>
    <view class="save">
      <button @click="saveXcdd">保存</button>
    </view>

    <!-- 工作计划(请把工作计划搜索ajax写在该组件里) -->
    <view v-show="gzjhShow">
      <xcdd-select-gzjh @close="gzjhShow=false" @confirm="confirmGzjh"></xcdd-select-gzjh>
    </view>
    <!-- 学校(请把学校搜索ajax写在该组件里) -->
    <view v-show="schoolShow">
      <xcdd-select-school @close="schoolShow=false" @confirm="confirmSchool"></xcdd-select-school>
    </view>
    <!-- 随行督学(请把随行督学搜索ajax写在该组件里) -->
    <view v-show="sxdxShow">
      <xcdd-select-sxdx @close="sxdxShow=false" @confirm="sxdxConfirm"></xcdd-select-sxdx>
    </view>
    <!-- 后续处理意见 请把ajax写在该组件里 -->
    <view v-show="hxclyjShow">
      <xcdd-hxclyj :hxcly="hxclyj" :contentId='contentId' @close="closeHxclyj" @confirm="confirmHxclyj" 
				:org="xx" :czwt="czwt" :ywsj="ywsj" ></xcdd-hxclyj>
    </view>
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import XcddSelectGzjh from "./compoentns/xcdd-select-gzjh.vue"
  import XcddSelectSchool from "./compoentns/xcdd-select-school.vue"
  import XcddSelectSxdx from "./compoentns/xcdd-select-sxdx.vue"
  import XcddHxclyj from "./compoentns/xcdd-hxclyj.vue"
  import {uniIcon, uniRate,uniNumberBox } from "@dcloudio/uni-ui"
  import KwEditor from "@kwz/kw-ui/kw-editor.vue"
	
	export default {
    components:{KwListCell,XcddSelectGzjh,XcddSelectSchool,XcddSelectSxdx,XcddHxclyj,uniIcon,KwEditor,uniRate,uniNumberBox },
		data() {
			return {
				contentId: '',
        // 工作计划显示隐藏
        gzjhShow:false,
        // 学校显示隐藏
        schoolShow:false,
        // 随行督学显示隐藏
        sxdxShow:false,
        // 工作计划数据
        gzjh: {
					name: '',
					value: ''
				},
				// 学校(校园)数据
				xx: {
					name: '',
					value: ''
				},
				// 随行督学
				sxdx: {
					name: '',
					value: ''
				},
        // 督导时间
        ywsj: "",
        // 督导纪实
        ddjs: {
					content: '',
					images: []
				},
				// 学期id,来源工作计划
				xqid: '',
				// 查阅资料
				cyzl: 0,
				// 列席会议
				lxhy: 0,
				// 座谈走访
				ztzf: 0,
				// 问卷调查
				wjdc: 0,
				// 校园巡视
				xyxs: 0,
				// 典型经验和做法
				dxjyzf: '',
				dxjyzfHide: '',
				// 存在问题
				czwt: '',
				czwtHide: '',
        // 督导纪实显示隐藏
        ddjsShow: false,
				// 资料采集显示隐藏
				zlcjShow: false,
        // 经验做法显示隐藏
        jyzfShow:false,
        // 存在问题显示隐藏
        czwtShow:false,
        // 后续处理意见的类型
        hxclyjList:[{
						name: '无意见',
						value: '1'
					},{
						name: '小问题--向学校现场反馈建议',
						value: '4'
					},{
						name: '一般问题--向学校发送整改建议',
						value: '2'
					},{
						name: '严重问题--向督导办上报整改建议',
						value: '5'
					},{
						name: '复杂问题--向科室发送协商意见',
						value: '3'
					}
				],
				// 原后续处理意见==》当切换后续处理意见，并为保存时，使用本值
				hxclyjOld: 0,
				// 后续处理意见
				hxclyj: {
					name: '',
					value: '',
					index: ''
				},
				// 后续处理意见小问题框输入
				hxclyjXwt: false,
				// 整改协商id
				zgxsid: '',
				// 整改协商意见
				zgxsyj: '',
				zgxsyjHide: '',
        // 后续处理意见显示隐藏
        hxclyjShow:false,
				gzjhPage: {
					keyword: ''
				},
				// 是否显示去评估
				ddpgShow: false,
				// 督导评估id ==>BZID
				pgbzID: '',
				// 不知道是啥id
				pgid: '',
				// 同上
				bid: '',
				// 同上
				mxid: '',
				// 登陆用户
				loginUser: {},
				minDate: '',
				maxDate: ''
			}
		},
		onLoad(param) {
			if(param) {
				if(param.CONTENT_ID) {
					this.contentId = param.CONTENT_ID
					this.loadData()
				} else if(param.workplanId){
					this.gzjh.value = param.workplanId
					this.loadDdGzjh()
				}
			}
			this.loginUser = this.$kwz.getLoginUser()
		},
    methods:{
			// 显示工作计划选择框
			loadGzjh (e) {
				this.gzjhShow=true
			},
      // 工作计划确定
      confirmGzjh(e){
				let gzjh = e.data
				if(gzjh) {
					this.gzjh.value = gzjh.value
					
					this.xx.name = gzjh.data.XXMC
					this.xx.value = gzjh.data.ORG_ID_TARGET
					
					this.sxdx.name = gzjh.data.CJID_MC
					this.sxdx.value = gzjh.data.CJID
					
					this.ywsj = gzjh.data.YWSJ && gzjh.data.YWSJ.length > 10 ? gzjh.data.YWSJ.substr(0, 10) : this.$kwz.formatDate('yyyy-MM-dd')
					
					let gzjhMc = `${this.xx.name}/${this.sxdx.name}/${this.ywsj}`
					this.gzjh.name = gzjhMc.length > 20 ? (gzjhMc.substr(0, 19) + '...') : gzjhMc
					
					// this.setDdjs(gzjh.data.TXT)
					if (gzjh.data.BZID) {
						this.ddpgShow = true
						this.pgbzID = gzjh.data.BZID
					}
					
				}
				this.gzjhShow=false
      },
			// 修改业务时间
			changeYwsj (e) {
				this.ywsj = e.detail.value
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
			// 获取督导纪实内容
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
			// 设置督导纪实内容
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
      // 后续处理意见改变 按下选择器的确定 0没问题不用弹框
      changeHxcly (e) {
				let index = e.detail.value

				if (index != '0' && index != '1') {
					if (!this.xx.value) {
						this.$kwz.alert('请先选择学校或工作计划');
					}else {
						this.hxclyj.index = index
						this.hxclyj.name = this.hxclyjList[index].name
						this.hxclyj.value = this.hxclyjList[index].value
						
						this.hxclyjShow = true
					}
					this.hxclyjXwt = false
				} else {
					if(index == '1') {
						this.hxclyjXwt = true
					}else{
						this.hxclyjXwt = false
					}
					this.hxclyj.index = index
					this.hxclyj.name = this.hxclyjList[index].name
					this.hxclyj.value = this.hxclyjList[index].value
					this.deleteDisposeIdeaId()
				}
      },
			// 删除后续处理意见id
			deleteDisposeIdeaId (cb) {
				let zgxsSaveCb = (data) => {
					console.log(data)
				}
				if (this.ZGXSID) {
					this.$kwz.ajax.ajaxUrl({
						url: 'dd_zgxs/doDelete',
							type: 'POST',
							vue: this,
							data: {
								ZGXSID: this.ZGXSID
							},
							success (data) {
								this.ZGXSID = ''
								if (typeof cb == 'function') {
									cb.apply(this, [zgxsSaveCb])
								}
							}
					})
				} else {
						if (typeof cb == 'function') {
							cb.apply(this, [zgxsSaveCb])
						}
				}
			},
      // 后续处理意见点 确认
      confirmHxclyj (e) {
				this.deleteDisposeIdeaId(e.cb)
      },
			// 关闭后续处理意见==》恢复打开之前的值
			closeHxclyj (e) {
				this.hxclyjShow = false
				this.hxclyj.index = this.hxclyjOld
				if (this.hxclyj.index > -1) {
					this.hxclyj.name = this.hxclyjList[this.hxclyj.index].name
					this.hxclyj.value = this.hxclyjList[this.hxclyj.index].value
				}
			},
			// 去评估
			toDdpg () {
				if (this.pgbzID) {
					if (this.pgid) {
            this.ddGetMxid()
          }else {
            this.$kwz.ajax.ajaxUrl({
              // 根据标准id查找最新批次
              url: 'jc_batch/selectBatchByMbid/DDPGBZ',
              type: 'POST',
              data: {
                MBID: this.pgbzID
              },
              vue: this,
              then (response) {
                let datas = response.datas
                this.BID = datas.BID
                if (datas && this.BID) {
                  // 查找评估记录是否已存在
                  this.$kwz.ajax.ajaxUrl({
                    url: 'jc_pgbzmx/getMbMx/DDPGBZ',
                    type: 'POST',
                    data: {
                      MB_ORG_ID: this.xx.value,
                      BID: this.BID
                    },
                    vue: this,
                    then (response) {
                      let datas1 = response.datas
                      // 未填报督学
                      let wtbDx = []
                      let sxdx = this.sxdx.value ? this.sxdx.value.split(',') : []
                      if (sxdx.length > 0) {
                        if (datas1 && datas1.length > 0) {
                          for (let j = 0; j < sxdx.length; j++) {
                            let eSxdx = false
                            for (let i = 0; i < datas1.length; i++) {
                              if (datas1[i].TBR === sxdx[j]) {
                                eSxdx = true
                                break
                              }
                            }
                            if (!eSxdx) {
                              wtbDx.push(sxdx[j])
                            }
                          }
                        } else {
                          wtbDx = sxdx
                        }
                        // 如果存在还未填报的督学==》就新增
                        if (wtbDx.length > 0) {
                          // 新增评估
                          this.$kwz.ajax.ajaxUrl({
                            url: 'jc_pgbzmb/doAddBatch/DDPGBZ',
                            type: 'POST',
                            data: {
                              BID: this.BID,
                              PGMC: datas.BMC,
                              PGLX: '2',
                              MB_ORG_ID: this.xx.value,
                              TBR: wtbDx.join(',')
                            },
                            vue: this,
                            then (response) {
                              this.ddGetMxid()
                            }
                          })
                        } else {
                          this.ddGetMxid()
                        }
                      }
                    }
                  })
                }
              }
            })
          }
				} else {
          this.$kwz.alert('工作计划数据有误')
        }
			},
			ddGetMxid () {
				this.$kwz.ajax.ajaxUrl({
					url: 'jc_pgbzmx/getMxByTbr/DDPGBZ',
					type: 'POST',
					data: {
						BID: this.pgid ? '' : this.BID,
						PGID: this.pgid ? this.pgid : '',
						tbr: this.loginUser.unicode,
						MB_ORG_ID: this.xx.value
					},
					vue: this,
					then (response) {
						let datas = response.datas
						if (datas && datas.MXID) {
							this.pgid = datas.PGID
							this.mxid = datas.MXID
							this.updateDdpg()
						}
					}
				})
			},
			// 更新督导评估
			updateDdpg () {
				if (this.mxid && this.pgbzID) {
					this.$kwz.router({
						url: 'compoentns/xcdd-pg?mxid=' + this.mxid + '&bzid=' + this.pgbzID + '&ywsj=' + this.ywsj
					})
				}
			},
			// 保存督导评估
			saveXcdd (sfXq) {
				let xcddData = {
					ORG_ID: this.xx.value,
					XXMC: this.xx.name,
					YWSJ: this.ywsj,
					USERID: this.sxdx.value,
					USERID_MC: this.sxdx.name,
					DDJS: this.getDdjs(),
					CYZL: this.cyzl,
					LXHY: this.lxhy,
					ZTZF: this.ztzf,
					WJDC: this.wjdc,
					XYXS: this.xyxs,
					DXJY: this.dxjyzf,
					CZWT: this.czwt,
					GZAP_YWID: this.gzjh.value,
					// XQID: this.data.xqValue,
					STATUS: this.hxclyj.value,
					STATUS_MC: this.hxclyj.name,
					ZGJY: this.zgxsyj,
					ZGXSID: this.zgxsid,
					PGMC: '',
					// BZID: this.pgbzID,
					PGID: this.pgid || '',
					minDate: this.minDate, // 最小时间限制
					maxDate: this.maxDate // 最大时间限制
				}
				let saveData = () => {
					xcddData.XQID = this.xqid
					if(this.contentId) {
						// 传了就代表是修改
						xcddData.CONTENT_ID = this.contentId
					}
					this.$kwz.ajax.ajaxUrl({
						url: 'ddjl/doEdit',
						type: 'POST',
						vue: this,
						data: xcddData,
						vue: this,
						then (response) {
							this.$kwz.alert('保存成功')
							this.$kwz.back(1500)
						}
					})
				}
				// 如果没有选择工作计划,则学期id会为空,那么默认取当前学期
				if(!this.xqid) {
					this.$kwz.ajax.ajaxUrl({
            url: 'jc_xq/getCurXq',
            type: 'POST',
            vue: this,
            then (response) {
              let datas = response.datas
              if (datas && datas.curXq && datas.curXq.XQ_ID) {
								this.xqid = datas.curXq.XQ_ID
                saveData.apply(this)
              }
            }
          })
				} else {
					saveData.apply(this)
				}
			},
			// 加载督导纪实
			loadData () {
				if(this.contentId) {
					this.$kwz.ajax.ajaxUrl({
						url: 'ddjl/doSelectByPrimaryKey',
						type: 'POST',
						data: {
							CONTENT_ID: this.contentId
						},
						vue: this,
						then (response) {
							let datas = response.datas
							console.log(datas)
							if (datas && datas.CONTENT_ID) {
								this.gzjh.value = datas.GZAP_YWID
								let workPlanName = (datas.JHXXMC ? (datas.JHXXMC + '') : datas.JHXXMC) + (datas.JHYWSJ ? (datas.JHYWSJ + '/') : datas.JHYWSJ) + (datas.JHSD ? (datas.JHSD + '/') : datas.JHSD) + datas.AUTHOR ? (datas.AUTHOR + '/') : datas.AUTHOR
								this.gzjh.name = workPlanName && workPlanName.length > 12 ? workPlanName.substr(0, 12) : workPlanName
								this.xx.value = datas.ORG_ID
								this.xx.name = datas.XXMC
								this.ywsj = datas.YWSJ
								this.hxclyj.value = datas.STATUS
								// this.disposeIdeaInit = datas.STATUS // 现存好进来时的状态值，等返回的时候来判断有没有修改
								// this.disposeIdea.STATUS = datas.STATUS
								let status = datas.STATUS
								if(status == '4') {
									this.zgxsyj = datas.ZGJY || ''
									this.zgxsyjHide = datas.ZGJY || ''
									this.hxclyjXwt = true
								}
								for(let i = 0; i < this.hxclyjList.length; i++) {
									if(this.hxclyjList[i].value == status) {
										this.hxclyj.name = this.hxclyjList[i].name
									}
								}
								this.sxdx.name = datas.USERNAME
								this.sxdx.value = datas.USERID
								
								this.dxjyzfHide = datas.DXJY || ''
								this.dxjyzf = datas.DXJY || ''

								this.czwtHide = datas.CZWT || ''
								this.czwt = datas.CZWT || ''
								
								this.cyzl = datas.CYZL || 0
								this.lxhy = datas.LXHY || 0
								this.ztzf = datas.ZTZF || 0
								this.wjdc = datas.WJDC || 0
								this.xyxs = datas.XYXS || 0
								this.pgid = datas.PGID
								
								this.setDdjs(datas.DDJS)
							}
						}
					})
				}
			},
			blurDxjyzf (e) {
				this.dxjyzf = e.detail.value
			},
			blurCzwt (e) {
				this.czwt = e.detail.value
			},
			blurZgxsyj (e) {
				this.zgxsyj = e.detail.value
			},
			changeCyzl (val) {
				this.cyzl = val
			},
			changeLxhy (val) {
				this.lxhy = val
			},
			changeZtzf (val) {
				this.ztzf = val
			},
			changeWjdc (val) {
				this.wjdc = val
			},
			changeXyxs (val) {
				this.xyxs = val
			},
			// 加载工作计划数据=>从工作计划列表点击去督导,传过来工作计划id,然后加载工作计划内容填充至督导纪实
			loadDdGzjh () {
				this.$kwz.ajax.ajaxUrl({
          url: 'dd_gzap/doSelectByPrimary/DDGZAP',
          type: 'POST',
          data: {
            CONTENT_ID: this.gzjh.value
          },
          vue: this,
          then (response) {
						let datas = response.datas
            if (datas && datas.map) {
							let gzjh = datas.map
							
							this.xx.name = gzjh.ORG_ID_TARGET_MC
							this.xx.value = gzjh.ORG_ID_TARGET
							
							this.sxdx.name = gzjh.JGID_MC || ''
							this.sxdx.value = gzjh.JGID || ''
							
							this.ywsj = gzjh.YWSJ && gzjh.YWSJ.length > 10 ? gzjh.YWSJ.substr(0, 10) : this.$kwz.formatDate('yyyy-MM-dd')
							
							let gzjhMc = `${this.xx.name}/${this.sxdx.name}/${this.ywsj}`
							this.gzjh.name = gzjhMc.length > 25 ? (gzjhMc.substr(0, 24) + '...') : gzjhMc
							
							// this.setDdjs(gzjh.data.TXT)
							if (gzjh.BZID) {
								this.ddpgShow = true
								this.pgbzID = gzjh.BZID
							}
						}
					}
				});
			}
    }
	}
</script>

<style lang="scss">
  .ddjs-head{
      height: 55upx;
      .fr,button{
        height: 55upx;
        line-height:55rpx;
      }
    }
  .ddjs-body{
      // border:#D9D9D9 solid 2upx;
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
