<template>
	<view class="zggz child-content">
		<!-- 搜索 -->
		<kw-search placeholder="请输入学校名称" @confirm="searchList">
			<view slot="content">
				<picker :range="searchCondition.DM_XD" range-key="DMMX_MC" @change="changeXd">
					<kw-list-cell title="学段" :right-note="pageParam.xdMc"></kw-list-cell>
				</picker>
				<picker :range="searchCondition.DM_DD_ZGXSLY" range-key="DMMX_MC" @change="changeZglx">
					<kw-list-cell title="整改类型" :right-note="pageParam.zglxMc"></kw-list-cell>
				</picker>
			</view>
		</kw-search>
		<!-- 分页 -->
		<view class="pager">
			<view class="zg">整改</view>
			<view class="xs" @click="$kwz.redirect({url: 'xsyj'})">协商</view>
		</view>
		<!-- 功能(新增删除) -->
		<view class="gn">
			<view class="check fl" v-if="!deleteShow">
				<radio :checked="deleteParam._CHECK_ALL_" @tap="checkAll" v-if="getPermission('dd_zgxs/doDeleteBatch/ZGTZ')">全选</radio>
			</view>
			<view class="delete fl" v-if="deleteShow && getPermission('dd_zgxs/doDeleteBatch/ZGTZ')" @click="deleteAction">删除</view>
			<view class="delete fl" v-if="!deleteShow && getPermission('dd_zgxs/doDeleteBatch/ZGTZ')" @click="confirmDeleteAction">确认删除</view>
			<view class="add fr" @click="toAdd('add')" v-if="getPermission('dd_zgxs/toZgtz/ZGTZ')">新增</view>
		</view>
		<!-- 列表组 -->
    <checkbox-group>
      <view class="lists">
			<!-- 单项列表 -->
        <view class="list" v-for="(item, index) in dataList" :key="index" @click="toZgxs(item.ZGXSID)">
          <view class="info">
            <view>
              <label v-if="!deleteShow">
                <view class="check">
                  <checkbox :checked="deleteParam[item.ZGXSID]" @tap.stop="checkAction(item.ZGXSID)" />
                </view>
              </label>
              {{item.XXMC}}
            </view>
            <view class="clearfix time">
              <view class="fl">整改天数：{{item.CLQX}}天</view>
              <view class="fr">发出时间：{{item.YWSJ}}</view>
            </view>
            <view class="clearfix status">
              <view :class="item.ztClass" class="fl">
                <uni-tag :text="item.CLZTMC" size="small" type="primary"></uni-tag>
              </view>
              <!-- 
              <view class="fl zgwc">
                <uni-tag text="整改完成" size="small" type="primary"></uni-tag>
              </view>
              <view class="fl zgz">
                <uni-tag text="整改中" size="small" type="primary"></uni-tag>
              </view>
              <view class="fl yys">
                <uni-tag text="已验收" size="small" type="primary"></uni-tag>
              </view>
              -->
              <view class="fr ys" v-if="item.CLZTDM === '1' && item.IS_SB ==='1'" >
                <uni-tag text="审核" size="small" circle="true" 
                  inverted="true" type="primary" @click="toAdd(item.ZGXSID)"></uni-tag>
                <!-- <uni-tag text="审核" v-if="item.CLZTDM == '1' && item.SFZGXX" size="small" circle="true" 
                    inverted="true" type="primary" @click="toAdd(item.ZGXSID)"></uni-tag> -->
                <!-- <uni-tag text="上传报告" v-if="item.CLZTDM != '5' && item.SFZGXX" size="small" circle="true" inverted="true" type="primary" @click="doZgxs(item.ZGXSID, '3')"></uni-tag>
                <uni-tag text="督学签收" v-if="item.CLZTDM == '3' && item.SFDX" size="small" circle="true" inverted="true" type="primary" @click="doZgxs(item.ZGXSID, '4')"></uni-tag>
                <uni-tag text="关闭整改" v-if="item.CLZTDM == '4' && item.SFDX" size="small" circle="true" inverted="true" type="primary" @click="doZgxs(item.ZGXSID, '5')"></uni-tag> -->
              </view>
              <view class="fr ys" v-else>
                <uni-tag text="处理" size="small" circle="true" inverted="true" type="primary"  @click="toZgxs(item.ZGXSID, 'xx')"
                  v-if="item.CLZTDM < 6 && !(item.SFSH && item.CLZTDM === '1') && getPermission('dd_zgxs/zgtz_deal')"></uni-tag>
                <uni-tag text="验收" size="small" circle="true" inverted="true" type="primary"
                  v-if="item.CLZTDM < 6" @click="toZgxs(item.ZGXSID, 'dx')"></uni-tag>
              </view>
            </view>
          </view>
        </view>
      </view>
    </checkbox-group>
	</view>
</template>

<script>
	import KwSearch from "@kwz/kw-ui/kw-search.vue"
	import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
	import { uniBadge,uniTag,uniIcon} from '@dcloudio/uni-ui'
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
					xdMc: '',
					zglxMc: '',
					// 页码
					page: 1,
					// 关键字
					keyword: ''
				},
        // 列表数据
				dataList: [],
				// 搜索参数
				searchCondition: {
					// 学段选择列表
					DM_XD: [],
					// 整改类型选择列表
					DM_DD_ZGXSLY: []
				},
				deleteParam: {
					'_CHECK_ALL_': false
				},
				constParam: {
					ztClass: {
						'1': 'zgz'
					}
				}
			}
		},
		computed: {
			user () {
				return this.$kwz.getLoginUser()
			}
		},
		components: {
			KwSearch,
			KwListCell,
			uniBadge,
			uniTag,
			uniIcon
		},
		onShow() {
			this.initData()
		},
		methods: {
      // 获取功能权限
      getPermission (url) {
        return this.$kwz.hasAuth(url, this)
      },
			// 加载数据
			initData() {
				this.$kwz.loadVueDms('DM_DD_ZGXSLY,DM_XD', dms => {
					this.searchCondition = dms
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
			// 加载列表 type=>true（覆盖式）/false（增量式）
			pageList(type) {
				if (type) {
					this.pageParam.page = 1
				}
				this.$kwz.ajax.ajaxUrl({
					url: 'dd_zgxs/doPageList/zgtz',
					type: 'POST',
					data: {
						page: this.pageParam.page,
						XD: this.pageParam.xd,
						XXMC: this.pageParam.keyword,
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
								
								// 徽标的样式
								tmp.ztClass = this.constParam.ztClass[tmp.CLZTDM]
								tmp.ISCS = this.countCs(tmp.YWSJ, tmp.CLQX)
// 								// 确认是否是学校 暂时失效
//                 tmp.SFZGXX = (this.user.orgid === tmp.ORG_ID_TARGET)
// 								// 确认是否时督学 暂时失效
//                 tmp.SFDX = (this.user.orgid === tmp.ORG_ID)
// 								// 判断是否有审核功能
//                 tmp.SFSH = tmp.CLZTDM === '1' && tmp.IS_SB === '1'
								
							}
							for (let i in this.deleteParam) {
								deleteParam[i] = this.deleteParam[i]
							}
							this.deleteParam = deleteParam
							if (type) {
								this.dataList = datas;
							} else {
								this.dataList.push(...datas)
							}
						}

					}
				})
			},
			// 搜素列表
			searchList(e) {
				this.pageParam.keyword = e.value
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
			// 处理整改协商
			toZgxs(id, status) {
        // 不是详情那就是-处理验收
				if (status !== undefined) {
          this.$kwz.router({url: `zggz-preview?id=${id}&SF=${status}`})
				} else {
          this.$kwz.router({url: `zggz-preview?id=${id}`})
				}
// 				if (status == '2') {
// 					this.$kwz.ajax.ajaxUrl({
// 						url: 'dd_zgxs/doUpdate/ZGTZ',
// 						type: 'POST',
// 						data: {
// 							CMS_LMTYPE: '2',
// 							ZGXSID: id,
// 							CLBG: '',
// 							CLLX: status
// 						},
// 						vue: this,
// 						then (response) {
// 							this.$kwz.alert('处理成功')
// 							this.pageList(true)
// 						}
// 					})
// 				} else {
// 					this.toDetail(id)
// 				}
			},
			toAdd (val) {
				if (val !== 'add') { // 不是新增就是审核
          this.$kwz.router({url: `zggz-add?id=${val}`})
				} else {
          this.$kwz.router({url: "zggz-add"})
				}
			},
			// 显示详情
			toDetail(zgxsid) {
			},
			countCs(fcsj, cs) {
				try {
					// 获取 发出时间 将其变为毫秒
					let zggzTime = fcsj + ' 23:59:59'
					let oDateSend = new Date(zggzTime)
					let oDateSendS = oDateSend.getTime()
					// 获取整改天数毫秒
					let zggzTianShu = cs * 86400000
					let oDateTianShuS = oDateSendS + zggzTianShu
					// 获取当前时间毫秒
					let oDate = new Date()
					let oDateS = oDate.getTime()
					let gap = oDateTianShuS - oDateS
					return gap < 0
				} catch (e) {
					return false
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

		.zg,
		.xs {
			width: 355upx;
			height: 65upx;
			text-align: center;
			line-height: 65upx;
			font-size: 28upx;
		}

		.zg {
			color: white;
			background-color: #00bdfd;
			border-radius: 10upx 0 0 10upx;
		}

		.xs {
			background-color: #d6f1fb;
			color: #00bdfd;
			border-radius: 0 10upx 10upx 0;
		}
	}

	.gn {
		height: 86upx;
		padding: 18upx 0;

		.delete,
		.add,
		.check {
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
        display: inline-block;
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

					.zgwc .uni-tag {
						background-color: #dcf0c7;
						border-color: #dcf0c7;
						color: #68ae1d;
					}

					.zgz .uni-tag {
						background-color: #f7e6c1;
						border-color: #f7e6c1;
						color: #f27506;
					}

					.yys .uni-tag {
						background-color: #d6f1fb;
						border-color: #d6f1fb;
						color: #109dea;
					}

					.ys .uni-tag {
						border-color: #00bdfd;
						color: #00bdfd;
						font-size: 24upx;
					}
				}
			}
		}
	}
</style>
