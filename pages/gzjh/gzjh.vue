<template>
	<view class="ddjs child-content">
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
      <view class="delete fl" v-if="hasScAuth && deleteShow" @click="deleteAction">删除</view>
      <view class="delete fl"  v-if="!deleteShow" @click="confirmDeleteAction">确认删除</view>
      <view class="add fr" @click="$kwz.router({url: 'gzjh-add'})" v-if="hasXzAuth">新增</view>
    </view>
    <!-- 列表组 -->
    <checkbox-group class="lists">
      <view>
        <!-- 单项列表 -->
        <view class="list" v-for="(item, index) in dataList" :key="index" @click="toPreview(item.CONTENT_ID)">
          <view class="info">
            <view>
              <label v-if="!deleteShow">
                <view class="check">
                  <checkbox :checked="deleteParam[item.CONTENT_ID]" 
                    @tap.stop="checkAction(item.CONTENT_ID)" />
                </view>
              </label>
              {{item.ORG_ID_TARGET}}
            </view>
            <view class="clearfix time">
              <view class="fl">{{item.AUTHOR}}</view>
              <view class="fr">{{item.DDSD}}</view>
            </view>
            <view class="clearfix time">
              <text class="color-999">{{item.TXT || "未填写"}}</text>
            </view>
            <view class="clearfix status">
              <view v-if="!!item.BZMC" class="fl clyj">
                <uni-tag :text="item.BZMC" size="small" type="primary"></uni-tag>
              </view>
              <view v-if="item.STATUS == '1'" class="fr bj" @click.stop="doDispose(item.CONTENT_ID)">
                <uni-tag text="处理" v-if="hasClAuth" size="small" circle="true" inverted="true" type="primary"></uni-tag>
              </view>
              <view v-if="item.STATUS == '1'" class="fr bj" @click.stop="toUpdate(item.CONTENT_ID)">
                <uni-tag text="修改" v-if="hasXgAuth" size="small" circle="true" inverted="true" type="primary"></uni-tag>
              </view>
              <view v-if="item.STATUS == '1'" class="fr bj" @click.stop="toDD(item.CONTENT_ID)">
                <uni-tag text="督导" v-if="hasDdAuth" size="small" circle="true" inverted="true" type="primary"></uni-tag>
              </view>
              <view v-if="item.ISQS && item.STATUS == '1'" class="fr bj" @click.stop="doBcj(item.CONTENT_ID)">
                <!-- 以前的签收改为不参加 -->
                <uni-tag text="不参加" v-if="hasBcjAuth" size="small" circle="true" inverted="true" type="primary" ></uni-tag>
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
        // 加载更多状态
        loadingType: "more",
        // 加载更多状态对应文字 键名不能改
        contentText: {
        	contentdown: "上拉显示更多",
        	contentrefresh: "正在加载...",
        	contentnomore: "没有更多数据了"
        },
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
				// 徽标样式
				constParam: {
					ztClass: {
				    '1': 'fs',
						'2': 'fs',
						'3': 'zgz',
						'4': 'qs',
				    '5': 'qs',
				    '6': 'zgwc',
					}
				}
			};
		},
    components:{KwSearch,KwListCell,uniLoadMore},
		onShow() {
			this.initData()
		},
    onReachBottom() {
      this.pageList()
      this.loadingType = "loading"
    },
    computed:{
    	// 新增权限
    	hasXzAuth () {
    		return this.$kwz.hasAuth('dd_gzap/toAdd')
    	},
    	// 修改权限
    	hasXgAuth () {
    		return this.$kwz.hasAuth('dd_gzap/toUpdate')
    	},
    	// 删除权限
    	hasScAuth () {
    		return this.$kwz.hasAuth('dd_gzap/doDelete')
    	},
    	// 处理权限
    	hasClAuth () {
    		return this.$kwz.hasAuth('dd_gzap/doDeal')
    	},
    	// 督导权限
    	hasDdAuth () {
    		return this.$kwz.hasAuth('dd_gzap/doSelectDdjlByGzapid')
    	},
    	// 不参加（签收）权限
    	hasBcjAuth () {
    		return this.$kwz.hasAuth('dd_gzap/toQs')
    	}
    },
    methods:{
      // 加载数据
      initData() {
      	this.$kwz.loadVueDms('DM_XD', dms => {
      		this.searchCondition = this.$kwz.deepCopy(dms) || {}
          // 给选项加“全部”。其实就是显示全部，实际为空值，后台判断空为全部
          this.searchCondition.DM_XD.unshift({
            DMMX_CODE:"",DMMX_MC:"全部"
          })
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
      		url: 'dd_gzap/doPageList/DDGZAP',
      		type: 'POST',
      		data: {
      			page: this.pageParam.page,
      			XD: this.pageParam.xd,
      			ORG_ID_TARGET: this.pageParam.keyword,
      			XQID: this.pageParam.xq
      		},
      		vue: this,
      		then (data) {
      			let datas = data.datas
      			let deleteParam = {}
      			if (datas && datas.length > 0) {
      				for (let i = 0; i < datas.length; i++) {
      					let tmp = datas[i]
      					deleteParam[tmp.ZGXSID] = false
								tmp.ISQS = tmp.ISCYR === 1 && tmp.QDZT === '1'
								tmp.DDSD = tmp.YWSJ ? (tmp.YWSJ.substr(0, 10) + (tmp.SD === '1' ? ' 上午' : ' 下午')) : tmp.YWSJ
								// 截取内容
								let text = datas[i].TXT
								text = text && text.length > 35 ? text.substr(0, 35) + '...' : text
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
      			url: 'dd_gzap/doDelete',
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
			// 处理
			doDispose (contentId) {
				if (contentId) {
					this.$kwz.ajax.ajaxUrl({
						url: 'dd_gzap/doDeal',
						type: 'POST',
						data: {
							CONTENT_ID: contentId
						},
						vue: this,
						then (response) {
							this.$kwz.alert('操作成功')
							this.pageList(true)
						}
					})
				}
			},
      // 不参加
      doBcj (contentId) {
      	if (contentId) {
      		this.$kwz.ajax.ajaxUrl({
      			url: 'dd_gzap/doQs',
      			type: 'POST',
      			data: {
      				CONTENT_ID: contentId,
              QSZT:'3'
      			},
      			vue: this,
      			then (response) {
      				this.$kwz.alert('操作成功')
      				this.pageList(true)
      			}
      		})
      	}
      },
			// 修改
			toUpdate (contentId) {
				this.$kwz.router({
					url: `gzjh-add?contentId=${contentId}`
				})
			},
      // 去预览
			toPreview (contentId) {
				this.$kwz.router({
					url: `gzjh-preview?contentId=${contentId}`,
				})
			},
			// 督导
			toDD (contentId) {
				this.$kwz.router({
					url: `../xcdd/xcdd-add?workplanId=${contentId}`,
				})
			}
    }
	}
</script>

<style lang="scss">
  .gn{
    height: 86upx;
    padding: 18upx 0;
    position:sticky;
    top:calc(44px + 100upx);
    /* #ifdef MP-WEIXIN */
    top:100upx;
    /* #endif */
    background:#f5f5f5;
    .delete,.add,.check{
      width: 125upx;
      height: 50upx;
      border-radius: 25upx;
      margin-left:25upx;
      display: flex;
      justify-content:center;
      align-items: center;
    }
    .delete{
      border: solid 2upx #e64c48;
      color: #e64c48;
    }
    .add{
      margin-right: 25upx;
      border: solid 2upx #68ae1d;
      color: #68ae1d;
    }
  }
  .lists{
    background:#f5f5f5;

    // height: calc(100% - 186upx);
    padding : 0 20upx;
    // overflow: auto;
    .list{
      margin-bottom: 20upx;
      background: white;
      padding: 25upx;
      border-radius: 15upx;
      display: flex;
      flex-direction: row;
      label{
        display: inline-block;
      }
      .check{
        width: 50upx;
      }
      .info{
        flex-grow: 2;
        width:100%;
        .time{
          overflow: hidden;
          color:#999999;
          font-size: 26upx;
          margin: 10upx 0;
          max-height: 100upx;
          view{
            color:#999999;
          }
        }
        .status{
          margin: 10upx 0 0;
          font-size: 24upx;
          .clyj .uni-tag{
            background-color: #dcf0c7;
            border-color: #dcf0c7;
            color: #68ae1d;
          }
          .bj .uni-tag{
            border-color: #00bdfd;
            color: #00bdfd;
            font-size: 24upx;
          }
        }
        
      }
    }
  }
</style>
