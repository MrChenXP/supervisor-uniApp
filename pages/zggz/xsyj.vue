<template>
	<view class="xsyj child-content">
			<!-- 搜索 -->
		<kw-search placeholder="点击进行搜索" :isInput="false" @confirm="searchList">
			<view slot="content">
				<picker :range="searchCondition.DM_XD" range-key="DMMX_MC" @change="changeXd">
					<kw-list-cell title="学段" :right-note="pageParam.xdMc"></kw-list-cell>
				</picker>
				<picker :range="searchCondition.ksList" range-key="name" @change="changeKs">
					<kw-list-cell title="科室" :right-note="pageParam.ksMc"></kw-list-cell>
				</picker>
				<picker :range="searchCondition.DM_DD_ZGXSLY" range-key="DMMX_MC" @change="changeZglx">
					<kw-list-cell title="整改类型" :right-note="pageParam.zglxMc"></kw-list-cell>
				</picker>
				<picker :range="searchCondition.DM_DD_CLZT" range-key="DMMX_MC" @change="changeZt">
					<kw-list-cell title="状态" :right-note="pageParam.ztMc"></kw-list-cell>
				</picker>
			</view>
		</kw-search>
		<!-- 分页 -->
		<view class="pager">
			<view class="zg" @click="$kwz.redirect({url: 'zggz'})">整改</view>
			<view class="xs active">协商</view>
		</view>
		<!-- 功能(新增删除) -->
		<view class="gn" v-if="hasScAuth || hasXzAuth">
			<view class="check fl" v-if="!deleteShow && hasScAuth">
				<radio :checked="deleteParam._CHECK_ALL_" @tap="checkAll">全选</radio>
			</view>
			<view class="delete fl" v-if="deleteShow && hasScAuth" @click="deleteAction" >删除</view>
			<view class="delete fl" v-if="!deleteShow && hasScAuth" @click="confirmDeleteAction">确认删除</view>
			<view class="add fr" @click="$kwz.router({url: 'xsyj-add'})" v-if="hasXzAuth">新增</view>
		</view>
		<!-- 列表组 -->
    <checkbox-group class="lists">
      <view>
        <!-- 单项列表 -->
        <view class="list" v-for="(item, index) in dataList" :key="index" @click="doXsyj(item.ZGXSID)">
          <view class="info">
            <view>
              <label v-if="!deleteShow">  
                <view class="check">
                  <checkbox :checked="deleteParam[item.ZGXSID]" 
                    @tap.stop="checkAction(item.ZGXSID)" />
                </view>
              </label>  
              {{item.XXMC || '未填写'}}
            </view>
            <view class="clearfix time">
              <view class="fl">{{item.ORG_MC || "未填写"}}</view>
              <view class="fr">发出时间：{{item.YWSJ}}</view>
            </view>
            <view class="clearfix time">{{item.ZGXSLYMC}}</view>
            <view class="clearfix status">
              <view v-if="true" :class="item.zgxsClass" class="fl">
                <uni-tag :text="item.CLZTMC" size="small" type="primary"></uni-tag>
              </view>
              <view v-if="item.CLZTDM < '22' && hasShAuth" class="fr cl">
                <uni-tag text="审核" size="small" circle="true" inverted="true" type="primary" 
                  @click.native.stop="toAdd(item.ZGXSID)" ></uni-tag>
              </view>
              <view v-else class="fr cl">
                <uni-tag text="处理" size="small" circle="true" inverted="true" type="primary" 
                  @click.native.stop="doXsyj(item.ZGXSID, 'xx')" v-if="item.CLZTDM < '26' && item.CLZTDM >= '22' && hasClAuth"></uni-tag>
                <uni-tag text="验收" size="small" circle="true" inverted="true" type="primary" 
                  @click.native.stop="doXsyj(item.ZGXSID, 'dx')" v-if="item.CLZTDM < '26' && hasYsAuth"></uni-tag>
              </view>
            </view>
          </view>
        </view>
      </view>
    </checkbox-group>
    <!-- 加载更多 一页默认20条 -->
    <uni-load-more v-if="dataList.length>=20" :status="loadingType" :contentText="contentText"></uni-load-more>
    <uni-load-more v-else status="noMore"></uni-load-more>
	</view>
</template>

<script>
	import KwSearch from "@kwz/kw-ui/kw-search.vue"
	import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import {uniLoadMore} from '@dcloudio/uni-ui'
	export default {
		data() {
			return {
				// 删除显示隐藏
				deleteShow: true,
				// 搜索以及分页参数
				pageParam: {
					// 学段
					xd: '',
					// 整改类型
					zglx: '',
					// 状态
					ztId: '',
					// 科室
					ksId: '',
					xdMc: '',
					ksMc: '',
					zglxMc: '',
					ztMc: '',
					// 页码
					page: 1,
					// 关键字
					keyword: ''
				},
				dataList: [],
				// 搜索参数
				searchCondition: {
					// 学段选择列表
					DM_XD: [],
					// 整改类型选择列表
					DM_DD_ZGXSLY: [
            {DMMX_CODE:"1",DMMX_MC:"全部"},
            {DMMX_CODE:"1",DMMX_MC:"经常性督导整改"},
            {DMMX_CODE:"2",DMMX_MC:"投诉整改"},
            {DMMX_CODE:"3",DMMX_MC:"其他整改"},
          ],
					ksList: [],
					DM_DD_CLZT: []
				},
				deleteParam: {
					'_CHECK_ALL_': false
				},
				constParam: {
					zgxsClass: {
						'21': 'fs',
						'22': 'fs',
						'23': 'zgz',
						'24': 'qs',
						'25': 'qs',
						'26': 'zgwc',
					}
				},
        // 加载更多状态
        loadingType: "more",
        // 加载更多状态对应文字 键名不能改
        contentText: {
        	contentdown: "上拉显示更多",
        	contentrefresh: "正在加载...",
        	contentnomore: "没有更多数据了"
        },
			};
		},
		components: {KwSearch,KwListCell,uniLoadMore},
		onShow() {
			this.initData()
		},
    onReachBottom() {
      this.pageList()
      this.loadingType = "loading"
    },
    computed: {
      // 新增权限
      hasXzAuth () {
      	return this.$kwz.hasAuth('dd_zgxs/toZgtz/XSYJ')
      },
      // 删除权限
      hasScAuth () {
      	return this.$kwz.hasAuth('dd_zgxs/doDeleteBatch/XSYJ')
      },
      // 审核权限
      hasShAuth () {
      	return this.$kwz.hasAuth('dd_zgxs/xsyj_sh')
      },
      // 处理权限
      hasClAuth () {
      	return this.$kwz.hasAuth('dd_zgxs/xsyj_deal')
      },
      // 验收权限
      hasYsAuth () {
        return this.$kwz.hasAuth('dd_zgxs/zgtz_done')
      }
    },
		methods: {
			// 加载数据
			initData() {
				this.$kwz.loadVueDms('DM_DD_CLZT,DM_XD', dms => {
					this.searchCondition.DM_XD = this.$kwz.deepCopy(dms.DM_XD) || {}
          // 该代码表将整改通知的状态一起放进去了。要将他截出来
          let DM_DD_CLZT = this.$kwz.deepCopy(dms.DM_DD_CLZT) || {}
          for (let i in DM_DD_CLZT) {
          	if(DM_DD_CLZT[i].DMMX_CODE > 20){
              this.searchCondition.DM_DD_CLZT.push({
                DMMX_CODE:DM_DD_CLZT[i].DMMX_CODE,
                DMMX_MC:DM_DD_CLZT[i].DMMX_MC
              })
            }
          }
          // 给选项加“全部”。其实就是显示全部，实际为空值，后台判断空为全部
          this.searchCondition.DM_XD.unshift({
            DMMX_CODE:"",DMMX_MC:"全部"
          })
          this.searchCondition.DM_DD_CLZT.unshift({
            DMMX_CODE:"",DMMX_MC:"全部"
          })
					this.$kwz.ajax.ajaxUrl({
						url: 'ddjl/getKsList',
					  type: 'POST',
					  vue: this,
					  then (data) {
							let datas = data.datas
							if (datas && datas.KSLIST && datas.KSLIST.length > 0) {
					      let ksList = []
					      for (let i = 0; i < datas.KSLIST.length; i++) {
					        ksList.push({
					          name: datas.KSLIST[i].ORG_MC,
					          value: datas.KSLIST[i].ORG_ID
					        })
					      }
                ksList.unshift({
                  name:"全部",value:""
                })
					      this.searchCondition.ksList = ksList
					    }
						}
					})
				}, this)
				this.pageList(true)
			},
			// 选择搜索条件 => 整改类型
			changeZglx(e) {
				let checkedOption = this.searchCondition.DM_DD_ZGXSLY[e.detail.value]
				this.pageParam.zglx = checkedOption.DMMX_CODE
				this.pageParam.zglxMc = checkedOption.DMMX_MC
			},
			// 选择搜索条件 => 学段
			changeXd(e) {
				let checkedOption = this.searchCondition.DM_XD[e.detail.value]
				this.pageParam.xd = checkedOption.DMMX_CODE
				this.pageParam.xdMc = checkedOption.DMMX_MC
			},
			// 选择搜索条件 => 科室
			changeKs(e) {
				let checkedOption = this.searchCondition.ksList[e.detail.value]
				this.pageParam.ksId = checkedOption.value
				this.pageParam.ksMc = checkedOption.name
			},
			// 选择搜索条件 => 状态
			changeZt(e) {
				let checkedOption = this.searchCondition.DM_DD_CLZT[e.detail.value]
				this.pageParam.ztId = checkedOption.DMMX_CODE
				this.pageParam.ztMc = checkedOption.DMMX_MC
			},
			// 加载列表 type=>true（覆盖式）/false（增量式）
			pageList(type) {
				if (type) {
					this.pageParam.page = 1
				}
				this.$kwz.ajax.ajaxUrl({
					url: 'dd_zgxs/doPageList/xsyj',
					type: 'POST',
					data: {
						page: this.pageParam.page,
						XD: this.pageParam.xd,
						XXMC: this.pageParam.keyword,
						XS_ORG_ID: this.pageParam.ksId,
						CLZTDM: this.pageParam.ztId,
						ZGXSLY: this.pageParam.zglx
					},
					vue: this,
					then(data) {
						let datas = data.datas
						let deleteParam = {}
						if (datas && datas.length > 0) {
							for (let i = 0; i < datas.length; i++) {
								let tmp = datas[i]
								deleteParam[tmp.ZGXSID] = false
								tmp.zgxsClass = this.constParam.zgxsClass[tmp.CLZTDM]
								// datas[i].ISCS = this.countCs(tmp.YWSJ, tmp.CLQX)
								//datas[i].SFZGXX = (this.user.orgid === tmp.ORG_ID_TARGET)
								//datas[i].SFDX = (this.user.orgid === tmp.ORG_ID)
							}
							for (let i in this.deleteParam) {
								deleteParam[i] = this.deleteParam[i]
							}
							this.deleteParam = deleteParam
              this.pageParam.page++
							if (type) {
								this.dataList = datas;
							} else {
								this.dataList.push(...datas)
                this.loadingType = "more"
							}
						} else{
              this.loadingType = "noMore"
              if(type){
                this.dataList = []
              }
            }
					}
				})
			},
			// 搜素列表
			searchList(e) {
				// this.pageParam.keyword = e.value
				this.pageList(true)
			},
			// 全选和反选
			checkAll() {
				this.deleteParam._CHECK_ALL_ = !this.deleteParam._CHECK_ALL_
				for (let i in this.deleteParam) {
					this.deleteParam[i] = this.deleteParam._CHECK_ALL_
				}
			},
			// 选择
			checkAction(id) {
				if (id) {
					this.deleteParam[id] = !this.deleteParam[id]
				}
			},
			// 确认删除
			confirmDeleteAction() {
				let ids = []
				for (let i in this.deleteParam) {
					if (this.deleteParam[i] && i != '_CHECK_ALL_') {
						ids.push(i)
					}
				}
				if (ids.length > 0) {
					this.$kwz.ajax.ajaxUrl({
						url: 'dd_zgxs/doDeleteBatch/ZGTZ',
						type: 'POST',
						data: {
							ids: ids.join(',')
						},
						vue: this,
						then(response) {
							this.$kwz.alert('操作成功')
							this.pageList(true)
						}
					})
				}
				this.deleteShow = true
			},
			// 删除
			deleteAction(status) {
				this.deleteShow = false
			},
			toAdd (val) {
				if (val !== 'add') { // 不是新增就是审核
          this.$kwz.router({url: `xsyj-add?id=${val}`})
				} else {
          this.$kwz.router({url: "xsyj-add"})
				}
			},
			doXsyj (id, status) {
				// 不是详情那就是-处理验收
				if (status !== undefined) {
          this.$kwz.router({url: `xsyj-preview?id=${id}&SF=${status}`})
				} else {
          this.$kwz.router({url: `xsyj-preview?id=${id}`})
				}
			}
		}
	}
</script>

<style lang="scss">
	.gn {
    top:calc(44px + 195upx);
    /* #ifdef MP-WEIXIN */
    top:195upx;
    /* #endif */
	}
	.lists {
		.list {
			.info {
				.status {
					.fs .uni-tag {
						background-color: #f8dad9;
						border-color: #f8dad9;
						color: #e64c48;
					}
					.zgz .uni-tag {
						background-color: #f7e6c1;
						border-color: #f7e6c1;
						color: #f27506;
					}
					.qs .uni-tag {
					  background-color: #dcf0c7;
					  border-color: #dcf0c7;
					  color: #68ae1d;
					}
					.zgwc .uni-tag {
					  background-color: #d6f1fb;
					  border-color: #d6f1fb;
					  color: #109dea;
					}
				}
			}
		}
	}
</style>
