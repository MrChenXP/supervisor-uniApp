<template>
	<view class="child-content">
    <!-- 搜索 -->
    <kw-search placeholder="请输入学校名称" @confirm="searchList">
      <view slot="content">
        <picker :value="pageParam.startTime" mode="date" @change="changeStart">
          <kw-list-cell title="开始时间" :rightNote="pageParam.startTime"></kw-list-cell>
        </picker>
        <picker :value="pageParam.endTime" mode="date" @change="changeEnd">
          <kw-list-cell title="结束时间" :rightNote="pageParam.endTime"></kw-list-cell>
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
      <view class="add fr" @click="$kwz.router({url: 'tkjl-add'})" v-if="hasXzAuth">新增</view>
    </view>
    <!-- 列表组 -->
    <checkbox-group class="lists">
      <view>
        <!-- 单项列表 -->
        <view class="list" v-for="(item, index) in dataList" :key="index" @click="toDetail(item.MXID,item.ISNEW)">
          <!-- 此处是左右结构 要换成跟xsyj一样的整体结构-->
          <label>
            <view class="check" v-if="!deleteShow">
              <checkbox :checked="deleteParam[item.MXID]" 
                @tap.stop="checkAction(item.MXID)" />
            </view>
          </label>
          <view class="info">
            <view>{{item.XXMC}}</view>
            <view class="clearfix time">
              <view class="fl">{{item.XZRMC}}</view>
              <view class="fr">督导时间：{{item.DDSJ}}</view>
            </view>
            <view class="clearfix status">
              <view v-if="item.SELF =='1'" class="fr bj" @click.stop="toAdd(item.MXID,item.ISNEW)">
                <uni-tag text="修改"  size="small" circle="true" inverted="true" type="primary" 
                  v-if="hasXgAuth" ></uni-tag>
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
    components:{KwSearch,KwListCell,uniLoadMore},
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
					startTime: '',  // 开始时间
					endTime: '',  // 结束时间
					keyword: '',
					page: 1
				},
        // 列表数据
				dataList: [],
				deleteParam: {
					'_CHECK_ALL_': false
				},
				constParam: {
				}
			};
		},
    onReachBottom() {
      this.pageList()
      this.loadingType = "loading"
    },
		onShow() {
			this.initData()
		},
    computed:{
    	// 新增权限
    	hasXzAuth () {
    		return this.$kwz.hasAuth('jc_pgbzmx/toAdd')
    	},
    	// 修改权限
    	hasXgAuth () {
    		return this.$kwz.hasAuth('jc_pgbz/toUpdate')
    	},
    	// 删除权限
    	hasScAuth () {
    		return this.$kwz.hasAuth('jc_pgbzmx/doDelete/TKJL')
    	}
    },
    methods:{
      // 加载数据
      initData() {
      	this.pageList(true)
      },
      // 加载列表 type=>true（覆盖式）/false（增量式）
      pageList(type) {
      	if (type) {
      		this.pageParam.page = 1
      	}
      	this.$kwz.ajax.ajaxUrl({
      		url: 'jc_pgbzmx/doSchoolPageList/TKJL',
      		type: 'POST',
      		data: {
            start_time: this.pageParam.startTime,
            end_time: this.pageParam.endTime,
      			page: this.pageParam.page,
      			XXMC: this.pageParam.keyword,
						// 后端不知道是什么 先传''
						MB_ORG_ID: '',
            ASC: '',
            ORDERBY: '',
      		},
      		vue: this,
      		then(data) {
      			let datas = data.datas
      			let deleteParam = {}
      			if (datas && datas.length > 0) {
      				for (let i = 0; i < datas.length; i++) {
      					let tmp = datas[i]
      					deleteParam[tmp.MXID] = false
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
      // 修改开始时间
      changeStart (e) {
      	this.pageParam.startTime = e.detail.value
      },
      // 修改结束时间
      changeEnd (e) {
      	this.pageParam.endTime = e.detail.value
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
      			url: 'jc_pgbzmx/doDelete/TKJL',
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
      deleteAction() {
      	this.deleteShow = false
      },
      // 去修改
			toAdd (id, isNew) {
        this.$kwz.router({
          url: 'tkjl-add?id=' + id + "&isNew=" + isNew
        })
			},
      // 列表卡点击事件
      toDetail(id, isNew){
        this.$kwz.router({
        	url: 'tkjl-preview?id=' + id + "&isNew=" + isNew
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
    height: calc(100% - 186upx);
    padding : 0 20upx;
    overflow: auto;
    .list{
      margin-bottom: 20upx;
      background: white;
      padding: 25upx;
      border-radius: 15upx;
      display: flex;
      flex-direction: row;
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
