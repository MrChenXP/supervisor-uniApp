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
				<picker :range="searchCondition.ztList" range-key="name" @change="changeZt">
					<kw-list-cell title="状态" :right-note="pageParam.ztMc"></kw-list-cell>
				</picker>
			</view>
		</kw-search>
		<!-- 分页 -->
		<view class="pager">
			<view class="zg" @click="$kwz.redirect({url: 'zggz'})">整改</view>
			<view class="xs">协商</view>
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
              {{item.XXMC}}
            </view>
            <view class="clearfix time">
              <view class="fl">{{item.ORG_MC}}</view>
              <view class="fr">发出时间：{{item.YWSJ}}</view>
            </view>
            <view class="clearfix time">{{item.ZGXSLYMC}}</view>
            <view class="clearfix status">
              <view v-if="true" :class="item.zgxsClass" class="fl">
                <uni-tag :text="item.CLZTMC" size="small" type="primary"></uni-tag>
              </view>
              <!-- <view v-if="true" :class="fl xswc">
                <uni-tag text="状态=='协商处理完成'用这个样式" size="small" type="primary"></uni-tag>
              </view>
              <view v-if="false" class="fl xsz">
                <uni-tag text="其他状态用这个样式" size="small" type="primary"></uni-tag>
              </view> -->
              <view v-if="item.CLZTDM < '22' && hasShAuth" class="fr cl">
                <uni-tag text="审核" size="small" circle="true" inverted="true" type="primary" 
                  @click="toAdd(item.ZGXSID)" ></uni-tag>
              </view>
              <view v-else class="fr cl">
                <uni-tag text="处理" size="small" circle="true" inverted="true" type="primary" 
                  @click="doXsyj(item.ZGXSID, 'xx')" v-if="item.CLZTDM < '26' && item.CLZTDM >= '22' && hasClAuth"></uni-tag>
                <uni-tag text="验收" size="small" circle="true" inverted="true" type="primary" 
                  @click="doXsyj(item.ZGXSID, 'dx')" v-if="item.CLZTDM < '26' && hasYsAuth"></uni-tag>
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
					DM_DD_ZGXSLY: [],
					ksList: [],
					ztList: []
				},
				deleteParam: {
					'_CHECK_ALL_': false
				},
				constParam: {
					zgxsClass: {
						'26': 'xswc',
						'21': 'xsz',
						'22': 'xsz'
					}
				}
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
				this.$kwz.loadVueDms('DM_DD_ZGXSLY,DM_XD', dms => {
					this.searchCondition = dms || {}
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
					      this.searchCondition.ksList = ksList
					    }
						}
					})
					this.searchCondition.ztList = [{name: '全部', value: ''}, {name: '督学发出', value: '1'}, {name: '科室处理完毕', value: '2'}]
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
				let checkedOption = this.searchCondition.ztList[e.detail.value]
				this.pageParam.ztId = checkedOption.value
				this.pageParam.ztMc = checkedOption.name
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
							if (type) {
								this.dataList = datas;
							} else {
								this.dataList.push(...datas)
                this.pageParam.page++
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
	.pager {
		height: 95upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: #dedede solid 2upx;
    position:sticky;
    top:calc(44px + 100upx);
    /* #ifdef MP-WEIXIN */
    top:100upx;
    /* #endif */
    background:#f5f5f5;
		.zg,.xs {
			width: 355upx;
			height: 65upx;
			text-align: center;
			line-height: 65upx;
			font-size: 28upx;
		}
		.zg {
			color: white;
			border-radius: 10upx 0 0 10upx;
			background-color: #d6f1fb;
			color: #00bdfd;
		}
		.xs {
			background-color: #00bdfd;

			border-radius: 0 10upx 10upx 0;
		}
	}
	.gn {
		height: 86upx;
		padding: 18upx 0;
    position:sticky;
    top:calc(44px + 195upx);
    /* #ifdef MP-WEIXIN */
    top:195upx;
    /* #endif */
    background:#f5f5f5;
		.delete,.add,.check {
			width: 125upx;
			height: 50upx;
			border-radius: 25upx;
			margin-left: 25upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.delete {
			border: solid 2upx #e64c48;
			color: #e64c48;
		}
		.add {
			margin-right: 25upx;
			border: solid 2upx #68ae1d;
			color: #68ae1d;
		}
	}

	.lists {
		height: calc(100% - 281upx);
		padding: 0 20upx;
		overflow: auto;
		.list {
			margin-bottom: 20upx;
			background: white;
			padding: 25upx;
			border-radius: 15upx;
			display: flex;
			flex-direction: row;
      label{
        display:inline-block;
      }
			.check {
				width: 50upx;
			}
			.info {
				flex-grow: 2;
        width:100%;
        .time{
          overflow: hidden;
					color: #999999;
					font-size: 26upx;
					margin: 10upx 0;
					view {
						color: #999999;
					}
				}
				.status {
					margin: 10upx 0 0;
					font-size: 24upx;
					.xswc .uni-tag {
						background-color: #dcf0c7;
						border-color: #dcf0c7;
						color: #68ae1d;
					}
					.xsz .uni-tag {
						background-color: #f7e6c1;
						border-color: #f7e6c1;
						color: #f27506;
					}
					.shys .uni-tag {
						background-color: #d6f1fb;
						border-color: #d6f1fb;
						color: #109dea;
					}
					.cl .uni-tag {
						border-color: #00bdfd;
						color: #00bdfd;
						font-size: 24upx;
					}
				}
			}
		}
	}
</style>
