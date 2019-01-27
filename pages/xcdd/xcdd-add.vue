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
      </view>
    </kw-list-cell>
    <kw-list-cell v-if="ddpgShow">
      <view>
        <view class="ddjs-head clearfix">
          <text class="fl">规定任务评价</text>
          <view class="fr"><button size="mini" type="warn" @click="toDdpg">去评估</button></view>
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
          <textarea v-model="dxjyzf" maxlength="4000"></textarea>
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
          <textarea v-model="czwt" maxlength="4000"></textarea>
        </view>
      </view>
    </kw-list-cell>
    <picker :range="hxclyjList" :value="hxclyj.index" range-key="name" @change="changeHxcly">
      <kw-list-cell title="后续处理意见" :rightNote="hxclyj.name"></kw-list-cell>
    </picker>

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
  import {uniIcon} from "@dcloudio/uni-ui"
  import KwEditor from "@kwz/kw-ui/kw-editor.vue"
	
	export default {
    components:{KwListCell,XcddSelectGzjh,XcddSelectSchool,XcddSelectSxdx,XcddHxclyj,uniIcon,KwEditor},
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
        ddjs: [],
				// 典型经验和做法
				dxjyzf: '',
				// 存在问题
				czwt: '',
        // 督导纪实显示隐藏
        ddjsShow: false,
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
				// 整改协商id
				zgxsid: '',
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
				loginUser: {}
			}
		},
		onLoad() {
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
					this.gzjh.name = gzjh.name
					this.gzjh.value = gzjh.value
					
					this.xx.name = gzjh.data.XXMC
					this.xx.value = gzjh.data.ORG_ID_TARGET
					
					this.sxdx.name = gzjh.data.CJID_MC
					this.sxdx.value = gzjh.data.CJID
					
					this.ywsj = gzjh.data.YWSJ && gzjh.data.YWSJ.length > 10 ? gzjh.data.YWSJ.substr(0, 10) : this.$kwz.formatDate('yyyy-MM-dd')
					
					this.setDdjs(gzjh.data.TXT)
					
					if (gzjh.data.BZID) {
						this.ddpgShow = true
						this.pgbzID = gzjh.data.BZID
					}
					
				}
				this.gzjhShow=false
      },
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
			},
			setDdjs (html) {
				let ddjs = []
				let ddjsSplit = this.$kwz.splitHtml(html)
				if (ddjsSplit && ddjsSplit.length > 0) {
					for (let i in ddjsSplit) {
						let content = ddjsSplit[i]
						if (content.content) {
							ddjs.push({
								type: 'textarea',
								content: content.content
							})
						}
						if (content.imageUrl) {
							ddjs.push({
								type: 'image',
								content: content.imageUrl,
								imageUrl: content.realUrl
							})
						}
					}
				} else {
					ddjs.push({
						type: 'textarea',
						content: ''
					})
				}
				this.ddjs = ddjs
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
				} else {
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
						url: 'compoentns/xcdd-pg?mxid=' + this.mxid + '&bzid=' + this.pgbzID
					})
				}
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
      border:#D9D9D9 solid 2upx;
      textarea{
        width: 100%;
      }
  }
  
</style>
