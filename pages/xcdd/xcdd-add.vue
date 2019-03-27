<template>
	<view class="child-content">
    <kw-list-cell title="工作计划" :rightNote="gzjh.name" @click="loadGzjh"></kw-list-cell>
    <kw-list-cell title="学校(校园)" :rightNote="xx.name" @click="schoolShow=true"></kw-list-cell>
    <kw-list-cell title="随行督学" :rightNote="sxdx.name" @click="sxdxShow=true"></kw-list-cell>
    <picker :range="ywsj" mode="date" @change="changeYwsj">
      <kw-list-cell title="时间" :rightNote="ywsj"></kw-list-cell>
    </picker>
    <kw-list-cell :isArrow="false">
      <view>
        <view class="ddjs-head clearfix" @click="ddjsShow = !ddjsShow">
          <text class="fl">督导纪实</text>
          <view class="fr" v-show="!ddjsShow"><uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon></view>
          <view class="fr" v-show="ddjsShow"><uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon></view>
        </view>
        <view v-show="ddjsShow" class="ddjs-body">
          <kw-editor :content="ddjs"></kw-editor>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell v-if="pgAuth && ddpgShow" :isArrow="false">
      <view>
        <view class="ddjs-head clearfix pg">
          <view class="clearfix">
            <text class="fl">规定任务评价</text>
            <view class="fr"><button size="mini" type="warn" @click="toDdpg">去评估</button></view>
          </view>
					<view class="clearfix">
						<!-- <uni-rate value="3" ></uni-rate> -->
            <text class="fl">评估标准:{{pgbzMc || "该标准有误,请联系管理员"}}</text>
            <view class="fr" v-if="ddpgPfShow"><uni-rate :value="ddpgFz" ></uni-rate></view>
					</view>
        </view>
      </view>
    </kw-list-cell>
		<kw-list-cell :isArrow="false">
		  <view>
		    <view class="ddjs-head clearfix" @click="zlcjShow = !zlcjShow">
		      <text class="fl">资料采集</text>
		      <view class="fr" v-show="!zlcjShow"><uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon></view>
		      <view class="fr" v-show="zlcjShow"><uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon></view>
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
    <kw-list-cell :isArrow="false">
      <view>
        <view class="ddjs-head clearfix" @click="jyzfShow = !jyzfShow">
          <text class="fl">典型经验和做法</text>
          <view class="fr" v-show="!jyzfShow"><uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon></view>
          <view class="fr" v-show="jyzfShow"><uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon></view>
        </view>
        <view v-show="jyzfShow" class="ddjs-body">
          <textarea :value="dxjyzfHide" maxlength="4000" @input="blurDxjyzf"></textarea>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell :isArrow="false">
      <view>
        <view class="ddjs-head clearfix" @click="czwtShow = !czwtShow">
          <text class="fl">存在问题</text>
          <view class="fr" v-show="!czwtShow"><uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon></view>
          <view class="fr" v-show="czwtShow"><uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon></view>
        </view>
        <view v-show="czwtShow" class="ddjs-body">
          <textarea :value="czwtHide" maxlength="4000" @input="blurCzwt"></textarea>
        </view>
      </view>
    </kw-list-cell>
    <picker :range="hxclyjList" :value="hxclyj.index" range-key="name" @change="changeHxcly">
      <kw-list-cell :border="{bottom:false}">
        <view>
          <view class="ddjs-head clearfix pg">
            <view class="clearfix">
              <text class="fl">后续处理意见</text>
              <text class="fr">{{hxclyj.name}}</text>
            </view>
        		<view class="clearfix" v-if="zgxsbhShow" >
              <text class="fl">整改协商编号：</text>
              <text class="fr">{{zgxsBh}}</text>
        		</view>
          </view>
        </view>
      </kw-list-cell>
    </picker>
		<kw-list-cell :show="hxclyjXwt">
		  <view>
		    <view class="ddjs-body">
		      <textarea :value="zgxsyjHide" maxlength="4000" placeholder="请输入反馈意见" @input="blurZgxsyj"></textarea>
		    </view>
		  </view>
		</kw-list-cell>
    <view class="save" v-if="xgAuth">
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
  import XcddSelectGzjh from "@kwz/kw-ui/xcdd-select-gzjh.vue"
  import XcddSelectSchool from "@kwz/kw-ui/xcdd-select-school.vue"
  import XcddSelectSxdx from "@kwz/kw-ui/xcdd-select-sxdx.vue"
  import XcddHxclyj from "./components/xcdd-hxclyj.vue"
  import {uniNumberBox,uniRate} from "@dcloudio/uni-ui"
  import KwEditor from "@kwz/kw-ui/kw-editor.vue"
	
	export default {
    components:{KwListCell,XcddSelectGzjh,XcddSelectSchool,XcddSelectSxdx,XcddHxclyj,KwEditor,uniNumberBox,uniRate},
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
					name: '无意见',
					value: '1',
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
				// 是否显示评估结果星星
				ddpgPfShow: false,
				// 督导评估id ==>BZID
				pgbzID: '',
				// 督导评估名称 ==》 界面显示
				pgbzMc: '',
				// 督导评估分值
				ddpgFz: 0,
				// 评估id
				pgid: '',
				// 未知id
				bid: '',
				// 明细id
				mxid: '',
				// 登陆用户
				loginUser: {},
				minDate: '',
				maxDate: '',
				// 是否显示整改协商编号信息
				zgxsbhShow: false,
        // 整改协商编号
				zgxsBh: '',
        // 页面初始整改协商id,在用户返回的时,进行新旧id判断,若用户再发了整改后不保存直接返回,则要删除整改
        zgxsidOld:'',
			}
		},
		computed: {
			pgAuth () {
				return this.$kwz.hasAuth('dd_ddjl/toPg')
			},
			xgAuth () {
				return this.$kwz.hasAuth('ddjl/doEdit')
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
    onUnload(){
      // 进行新旧id判断,若用户再发了整改后不保存直接返回,则要删除整改
      if(this.zgxsid != this.zgxsidOld && this.zgxsidOld != ""){
        this.deleteDisposeIdeaId()
      }
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
						this.pgbzMc = gzjh.data.BZMC
						
						this.$kwz.ajax.ajaxUrl({
							url: 'jc_pgbz/selectTbmbglByKey',
							type: 'POST',
							data: {
								BZID: this.pgbzID
							},
							vue: this,
							then(response) {
								let datas = response.datas
								if (datas && datas.tbmbglData) {
									// 获取评估详情
									this.$kwz.ajax.ajaxUrl({
										url: 'jc_pgbzmx/doSelectByPrimary/DDJL',
										type: 'POST',
										data: {
											MXID: this.mxid
										},
										vue: this,
										then(response) {
                      console.log(response)
											let datas1 = response.datas
											let sj = {}
											if (datas1 && datas1.SJ) {
												try {
													sj = JSON.parse(datas1.SJ)
												} catch (e) {
													console.error(e)
												}
												
												this.ddpgFz = sj.FZ || 0
												this.ddpgPfShow = true
												
											}
										}
									})
								}
							}
						})
					}
				}
				this.gzjhShow=false
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
      // 后续处理意见改变 按下选择器的确定 0没问题不用弹框
      changeHxcly (e) {
				let index = e.detail.value
				// 备份存储以前的老值
				this.hxclyjOld = this.hxclyj.index
				// 一般问题/严重问题/复杂问题
				if (index != '0' && index != '1') {
					if (!this.xx.value) {
						this.$kwz.alert('请先选择学校或工作计划');
					} else {
						this.hxclyj.index = index
						this.hxclyj.name = this.hxclyjList[index].name
						this.hxclyj.value = this.hxclyjList[index].value
						this.hxclyjShow = true
					}
					this.hxclyjXwt = false
				} else {
          // 无意见、小问题
					this.zgxsbhShow = false
					this.zgxsBh = ''
          // 如果是小问题就显示输入框
          this.hxclyjXwt = index == '1' ? true : false
					this.hxclyj.index = index
					this.hxclyj.name = this.hxclyjList[index].name
					this.hxclyj.value = this.hxclyjList[index].value
					this.deleteDisposeIdeaId()
				}
      },
			// 删除后续处理意见id
			deleteDisposeIdeaId (cb) {
				let vm = this;
				let zgxsSaveCb = (data) => {
					vm.hxclyjShow = false
					vm.zgxsbhShow = true
					vm.zgxsBh = data.ZGBH
          vm.zgxsid = data.ZGXSID
				}
				if (this.zgxsid) {
					this.$kwz.ajax.ajaxUrl({
						url: 'dd_zgxs/doDelete',
							type: 'POST',
							vue: this,
							data: {
								ZGXSID: this.zgxsid
							},
							success (data) {
								this.zgxsid = ''
								this.zgxsbhShow = false
								this.zgxsBh = ''
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
				this.deleteDisposeIdeaId(e.callback)
        // this.hxclyjShow = true
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
					// 修改
          // 如果没有评估id就去获取(评估需要一点进去就有pgid)
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
                  // 根据批次id和目标机构id查找以该学校为评估目标的评估记录是否已存在
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
                      // 未填报督学 判断哪个督学未填报，给他发起一个评估
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
      // 获取明细id
			ddGetMxid () {
				this.$kwz.ajax.ajaxUrl({
					url: 'jc_pgbzmx/getMxByTbr/DDPGBZ',
					type: 'POST',
					data: {
						BID: this.pgid ? '' : this.BID,
						PGID: this.pgid ? this.pgid : '',
						tbr: this.loginUser.uid,
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
						url: 'components/xcdd-pg?mxid=' + this.mxid + '&bzid=' + this.pgbzID + '&ywsj=' + this.ywsj
					})
				}
			},
			// 保存督导
			saveXcdd (sfXq) {
				let xcddData = {
          // 不要用这样的对象当请求体，请求会出错，原因未知
// 					ORG_ID: this.xx.value,
// 					XXMC: this.xx.name,
// 					YWSJ: this.ywsj,
// 					USERID: this.sxdx.value,
// 					USERID_MC: this.sxdx.name,
// 					DDJS: this.getDdjs(),
// 					CYZL: this.cyzl,
// 					LXHY: this.lxhy,
// 					ZTZF: this.ztzf,
// 					WJDC: this.wjdc,
// 					XYXS: this.xyxs,
// 					DXJY: this.dxjyzf,
// 					CZWT: this.czwt,
// 					GZAP_YWID: this.gzjh.value,
// 					// XQID: this.data.xqValue,
// 					STATUS: this.hxclyj.value,
// 					STATUS_MC: this.hxclyj.name,
// 					ZGJY: this.zgxsyj,
// 					ZGXSID: this.zgxsid,
// 					PGMC: '',
// 					// BZID: this.pgbzID,
// 					PGID: this.pgid,
// 					minDate: this.minDate, // 最小时间限制
// 					maxDate: this.maxDate // 最大时间限制
				}
				let saveData = () => {
// 					xcddData.XQID = this.xqid
// 					if(this.contentId) {
// 						// 传了就代表是修改
// 						xcddData.CONTENT_ID = this.contentId
// 					}
					this.$kwz.ajax.ajaxUrl({
						url: 'ddjl/doEdit',
						type: 'POST',
						vue: this,
						data: {
              CONTENT_ID: this.contentId || "",
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
              XQID: this.xqid,
              STATUS: this.hxclyj.value,
              STATUS_MC: this.hxclyj.name,
              ZGJY: this.zgxsyj,
              ZGXSID: this.zgxsid,
              PGMC: '',
              // BZID: this.pgbzID,
              PGID: this.pgid,
              minDate: this.minDate, // 最小时间限制
              maxDate: this.maxDate // 最大时间限制
            },
						vue: this,
						then (response) {
							this.$kwz.alert('保存成功')
							this.$kwz.redirect({url: 'xcdd'})
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
							if (datas && datas.CONTENT_ID) {
								this.xx.value = datas.ORG_ID
								this.xx.name = datas.XXMC
								this.ywsj = datas.YWSJ
								this.hxclyj.value = datas.STATUS
								// this.disposeIdea.STATUS = datas.STATUS
								let status = datas.STATUS
								if(status == '4') {
									this.zgxsyj = datas.ZGJY || ''
									this.zgxsyjHide = datas.ZGJY || ''
									this.hxclyjXwt = true
								} else if (status == '2' || status == '3' || status == '5') {
                  // 如果是小问题-复杂-严重就加载整改协商
									this.$kwz.ajax.ajaxUrl({
										url: 'dd_zgxs/selectZgxsList',
										type: 'POST',
										data: {
											CONTENT_ID: this.contentId
										},
										vue: this,
										then (response) {
											let zgdatas = response.datas
											if (zgdatas && zgdatas.length > 0) {
												let zgxsData = zgdatas[0]
												this.zgxsbhShow = true
												this.zgxsBh = zgxsData.BH
												this.zgxsid = zgxsData.ZGXSID
                        this.zgxsidOld = zgxsData.ZGXSID // 先存好进来时的id，等返回的时候来判断有没有修改
											}
										}
									})
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
								
								// 工作安排
								if (datas.GZAP_YWID) {
									this.gzjh.value = datas.GZAP_YWID
									this.$kwz.ajax.ajaxUrl({
										url: 'dd_gzap/doSelectByPrimary/DDGZAP',
										type: 'POST',
										data: {
											CONTENT_ID: datas.GZAP_YWID
										},
										vue: this,
										then (response) {
											let datas = response.datas.map
											let workPlanName = (datas.ORG_ID_TARGET_MC ? (datas.ORG_ID_TARGET_MC + '') : datas.ORG_ID_TARGET_MC) 
											+ (datas.YWSJ ? (datas.YWSJ + '/') : datas.YWSJ) + (datas.SD ? (datas.SD + '/') : datas.SD) 
											+ datas.AUTHOR ? (datas.AUTHOR + '/') : datas.AUTHOR
											this.gzjh.name = workPlanName
											if (datas.BZID) {
												this.ddpgShow = true
												this.pgbzID = datas.BZID
												this.pgbzMc = datas.BZMC
											}
										}
									})
									// 取所有督学的打分数据
									if (this.pgid) {
										this.$kwz.ajax.ajaxUrl({
											url: 'jc_pgbzmx/getMxByTbr/DDPGBZ',
											type: 'POST',
											data: {
												BID: '', 
												PGID: this.pgid,
												tbr: this.loginUser.uid,
												MB_ORG_ID: this.xx.value
											},
											vue: this,
											then (response) {
												let datas = response.datas
												if (datas && datas.MXID) {
													// this.pgid = datas.PGID
													this.mxid = datas.MXID
													this.$kwz.ajax.ajaxUrl({
														url: 'jc_pgbzmx/doSelectByPrimary/DDJL',
														type: 'POST',
														data: {
															MXID: datas.MXID
														},
														vue: this,
														then(response) {
															let datas1 = response.datas
															let sj = {}
															if (datas1 && datas1.SJ) {
																try {
																	sj = JSON.parse(datas1.SJ)
																} catch (e) {
																	console.error(e)
																}
																
																this.ddpgFz = sj.FZ || 0
																this.ddpgPfShow = true
															}
														}
													})
												}
											}
										})
									}
								}
							}
						}
					})
				}
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
				})
			},
      // 修改业务时间
      changeYwsj (e) {
      	this.ywsj = e.detail.value
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
    }
	}
</script>

<style lang="scss">
  .pg{
    // height: 110upx;
    .fr{
      color:#0580c2;
    }
  }

</style>
