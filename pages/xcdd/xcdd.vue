<template>
	<view class="xcdd child-content">
		<!-- 搜索 -->
		<kw-search placeholder="请输入学校名称" @confirm="searchList">
			<view slot="content">
				<picker :range="searchCondition.DM_XD" range-key="DMMX_MC" @change="changeXd">
					<kw-list-cell title="学段" :right-note="pageParam.xdMc"></kw-list-cell>
				</picker>
				<picker :range="searchCondition.DM_XQ" range-key="name" @change="changeXq">
					<kw-list-cell title="学期" :right-note="pageParam.xqMc"></kw-list-cell>
				</picker>
			</view>
		</kw-search>
		<!-- 功能(新增删除) -->
		<view class="gn">
			<view class="check fl" v-if="!deleteShow">
				<radio :checked="deleteParam._CHECK_ALL_" @tap="checkAll">全选</radio>
			</view>
			<view class="delete fl" v-if="deleteShow" @click="deleteAction">删除</view>
			<view class="delete fl" v-if="!deleteShow" @click="confirmDeleteAction">确认删除</view>
			<view class="add fr" @click="$kwz.router({url: 'xcdd-add'})">新增</view>
		</view>
		<!-- 列表组 -->
    <checkbox-group>
      <view class="lists">
			<!-- 单项列表 -->
			<view class="list" v-for="(item, index) in dataList" :key="index"  @click="toPreview(item.CONTENT_ID)">
        <label>
          <view class="check" v-if="!deleteShow">
            <checkbox :checked="deleteParam[item.CONTENT_ID]" @tap.stop="checkAction(item.CONTENT_ID)" />
          </view>
        </label>
				<view class="info">
					<view>{{item.XXMC}}</view>
					<view class="clearfix time">
						<view class="fl">{{item.AUTHOR}}</view>
						<view class="fr">督导时间：{{item.YWSJ}}</view>
					</view>
					<view class="clearfix status">
						<view v-if="true" class="fl clyj" @click.stop="toZgxs(item.STATUS,item.IDS)">
							<uni-tag :text="item.STATUS_MC" size="small" type="primary"></uni-tag>
						</view>
						<!-- <view v-if="false" class="fl zgz">
							<uni-tag text="整改中" size="small" type="primary"></uni-tag>
						</view>
						<view v-if="false" class="fl yys">
							<uni-tag text="已验收" size="small" type="primary"></uni-tag>
						</view> -->
						<!-- <view v-if="item.STATUS == '2' || item.STATUS === '5' " class="fr bj">
							<uni-tag text="发送整改通知" size="small" circle="true" inverted="true" type="primary" @click="toZgtz(item.IDS)"></uni-tag>
						</view>
						<view v-if="item.STATUS == '3' " class="fr bj">
							<uni-tag text="发送协商意见" size="small" circle="true" inverted="true" type="primary" @click="toXsyj(item.IDS)"></uni-tag>
						</view> -->
						<view v-if="true" class="fr bj" @click.stop="toDetail(item.CONTENT_ID)">
							<uni-tag text="编辑" size="small" circle="true" inverted="true" type="primary"></uni-tag>
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
	import {uniBadge, uniTag, uniIcon} from '@dcloudio/uni-ui'
	export default {
    components: {KwSearch,KwListCell,uniBadge,uniTag,uniIcon},
		data() {
			return {
				// 删除显示隐藏
				deleteShow: true,
				// 搜索以及分页参数
				pageParam: {
					// 学段
					xd: '',
					// 整改类型
					xq: '',
					xdMc: '',
					xqMc: '',
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
					DM_XQ: []
				},
				deleteParam: {
					'_CHECK_ALL_': false
				},
				constParam: {
				}
			}
		},
		onShow() {
			this.initData()
		},
		methods: {
			// 加载数据
			initData() {
				// 加载代码
				this.$kwz.loadVueDms('DM_XD', dms => {
					this.searchCondition = dms || {}
					// 加载学期
					this.$kwz.ajax.ajaxUrl({
						url: 'jc_xq/doList',
						type: 'POST',
						vue: this,
						then (data) {
							let datas = data.datas
							let xqs = [{
								name: '全部',
								value: ''
							}]
							if (datas && datas.length > 0) {
								for (let i = 0; i < datas.length; i++) {
									xqs.push({
										name: datas[i].XQ_MC,
										value: datas[i].XQ_ID
									})
								}
							}
							// 获取当前学期
							this.$kwz.ajax.ajaxUrl({
								url: 'jc_xq/getCurXq',
								type: 'POST',
								vue: this,
								then (data) {
									let datas = data.datas
									if (datas && datas.curXq && datas.curXq.XQ_ID) {
										this.pageParam.xq = datas.curXq.XQ_ID
										this.pageParam.xqMc = datas.curXq.XQ_MC
									}
									this.pageList(true)
								}
							})
							this.searchCondition.DM_XQ = xqs
						}
					})
				}, this)
			},
			// 选择搜索条件 => 整改类型
			changeXq(e) {
				let checkedOption = this.searchCondition.DM_XQ[e.detail.value]
				this.pageParam.xq = checkedOption.value
				this.pageParam.xqMc = checkedOption.name
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
					url: 'ddjl/doSchoolPageList',
					type: 'POST',
					data: {
						page: this.pageParam.page,
						XD: this.pageParam.xd,
						XXMC: this.pageParam.keyword,
						XQID: this.pageParam.xq
					},
					vue: this,
					then(data) {
						let datas = data.datas
						let deleteParam = {}
						if (datas && datas.length > 0) {
							for (let i = 0; i < datas.length; i++) {
								let tmp = datas[i]
								deleteParam[tmp.ZGXSID] = false
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
			// 去整改通知 || 协商意见 
			toZgxs(status,ids) {
        if(status === '2' || status === '5'){
          console.log(ids + '这是zgIds')
          this.$kwz.router({url:'xcdd-zgtzs'})
        } else if (status === '3'){
          console.log(ids+'这是sxIds')
          this.$kwz.router({url:'xcdd-xsyjs'})
        }
			},
			// 去修改
			toDetail(ids) {
        this.$kwz.router({
        	url: 'xcdd-add?CONTENT_ID=' + ids
        })
			},
			toPreview (id) {
				if(id) {
					this.$kwz.router({url: 'xcdd-preview?contentId=' + id})
				}
			}
		}
	}
</script>

<style lang="scss">
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
		height: calc(100% - 186upx);
		padding: 0 20upx;
		overflow: auto;

		.list {
			margin-bottom: 20upx;
			background: white;
			padding: 25upx;
			border-radius: 15upx;
			display: flex;
			flex-direction: row;

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

					.clyj .uni-tag {
						background-color: #dcf0c7;
						border-color: #dcf0c7;
						color: #68ae1d;
					}

					//           .zgz .uni-tag{
					//             background-color: #f7e6c1;
					//    别删         border-color: #f7e6c1;
					//             color: #f27506;
					//           }
					//           .yys .uni-tag{
					//             background-color: #d6f1fb;
					//             border-color: #d6f1fb;
					//             color: #109dea;
					//           }
					.bj .uni-tag {
						border-color: #00bdfd;
						color: #00bdfd;
						font-size: 24upx;
					}
				}
			}
		}
	}
</style>
