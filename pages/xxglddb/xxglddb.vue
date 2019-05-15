<template>
	<view class="child-content">
    <!-- 搜索 -->
    <kw-search placeholder="请输入学校名称" @confirm="searchList">
      <view slot="content">
        <kw-list-cell title="学校代码">
          <view slot="rightNote">
            <view class="bh"><input v-model="pageParam.ORG_DM" placeholder="请输入学校代码"/></view>
          </view>
        </kw-list-cell>
        <picker :range="searchCondition.DM_BXLX" range-key="DMMX_MC" @change="changeBxlx">
          <kw-list-cell title="办学类型" :rightNote="pageParam.XXBXLXMMC"></kw-list-cell>
        </picker>
        <picker :range="searchCondition.DM_BXMS" range-key="DMMX_MC" @change="changeBxms">
          <kw-list-cell title="办学模式" :rightNote="pageParam.XXBBMMC"></kw-list-cell>
        </picker>
        <picker :range="searchCondition.DM_XXZDCXLX" range-key="DMMX_MC" @change="changeCxlx">
          <kw-list-cell title="城乡类型" :rightNote="pageParam.XXZDCXLXDMMC"></kw-list-cell>
        </picker>
        <picker :range="searchCondition.DM_XXDJ" range-key="DMMX_MC" @change="changeXxdj">
          <kw-list-cell title="学校等级" :rightNote="pageParam.XXDJMC"></kw-list-cell>
        </picker>
      </view>
    </kw-search>
    <!-- 功能(新增删除) 差权限判定和点击函数-->
   <!-- <view class="gn" v-if="hasScAuth || hasXzAuth">
    	<view class="check fl" v-if="!deleteShow && hasScAuth">
    		<radio :checked="deleteParam._CHECK_ALL_" @tap="checkAll">全选</radio>
    	</view>
    	<view class="delete fl" v-if="deleteShow && hasScAuth" @click="deleteAction" >删除</view>
    	<view class="delete fl" v-if="!deleteShow && hasScAuth" @click="confirmDeleteAction">确认删除</view>
    	<view class="add fr" @click="$kwz.router({url: 'xsyj-add'})" v-if="hasXzAuth">新增</view>
    </view> -->
    <!-- 列表组 -->
    <checkbox-group class="lists">
      <view>
        <!-- 单项列表 -->
        <view class="list" v-for="(item, index) in dataList" :key="index" @click="toDetail(item.ORG_ID)">
          <label>
            <view class="check" v-if="!deleteShow">
              <checkbox :checked="deleteParam[item.ORG_ID]" 
                @tap.stop="checkAction(item.ORG_ID)" />
            </view>
          </label>
          <view class="info">
            <view>
              <label v-if="!deleteShow">  
                <view class="check">
                  <checkbox :checked="deleteParam[item.ORG_ID]" 
                    @tap.stop="checkAction(item.ORG_ID)" />
                </view>
              </label>  
              {{item.XXMC}}
            </view>
            <view class="clearfix time">
              <view class="fl">学校代码:{{item.ORG_DM || "未填报"}}</view>
              <view class="fr">办学类型：{{item.XXBXLX || "未填报"}}</view>
            </view>
            <view class="clearfix time">
              <view class="fl">办学模式:{{item.XXBBMC || "未填报"}}</view>
              <view class="fr">城乡类型：{{item.XXZDCXLXDMC || "未填报"}}</view>
            </view>
            <view class="clearfix time">
              <view class="fl">学校等级:{{item.XXDJMC || "未填报"}}</view>
              <view class="fr">联系电话：{{item.LXDH || "未填报"}}</view>
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
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import KwSearch from "@kwz/kw-ui/kw-search.vue"
  import {uniLoadMore} from '@dcloudio/uni-ui'

	export default {
    components:{KwListCell,KwSearch,uniLoadMore},
		data() {
			return {
        // 删除显示隐藏
        deleteShow: true,
        // 搜索以及分页参数
        pageParam: {
          "XXBBM":"", //办学模式码
          "XXDJ":"", //学校等级码
          "XXBXLXM":"",//办学类型码
          "XXZDCXLXDM":"",//城乡类型码
          "XXBBMMC":"", //办学模式名称
          "XXDJMC":"", //学校等级码名称
          "XXBXLXMMC":"",//办学类型码名称
          "XXZDCXLXDMMC":"",//城乡类型码名称
        	// 学校代码
        	ORG_DM: '',
        	// 分页
        	page: 1,
        	// 关键字 学校名字
        	keyword: ''
        },
        // 搜索列表选择数据
        searchCondition: {
        	// 办学类型选择列表
        	DM_BXLX: [],
          // 办学模式选择列表
          DM_BXMS: [],
          // 城乡类型选择列表
          DM_XXZDCXLX: [],
          // 学校等级选择列表
          DM_XXDJ: [],
        },
        dataList: [],
        // 加载更多状态
        loadingType: "more",
        // 加载更多状态对应文字 键名不能改
        contentText: {
        	contentdown: "上拉显示更多",
        	contentrefresh: "正在加载...",
        	contentnomore: "没有更多数据了"
        },
      }
		},
    onShow() {
    	this.initData()
    },
    onReachBottom() {
      this.pageList()
      this.loadingType = "loading"
    },
    methods:{
      // 加载数据
      initData() {
        // 从代码表中搜索列表数据
      	this.$kwz.loadVueDms("DM_XXDJ,DM_BXMS,DM_BXLX,DM_XXZDCXLX", dms => {
      		this.searchCondition = this.$kwz.deepCopy(dms) || {}
          // 给选项加“全部”。其实就是显示全部，实际为空值，后台判断空为全部
          this.searchCondition.DM_BXLX.unshift({
            DMMX_CODE:"",DMMX_MC:"全部"
          })
          this.searchCondition.DM_BXMS.unshift({
            DMMX_CODE:"",DMMX_MC:"全部"
          })
          this.searchCondition.DM_XXZDCXLX.unshift({
            DMMX_CODE:"",DMMX_MC:"全部"
          })
          this.searchCondition.DM_XXDJ.unshift({
            DMMX_CODE:"",DMMX_MC:"全部"
          })
      	}, this)
      	this.pageList(true)
      },
      // 搜素列表
      searchList(e) {
      	this.pageParam.keyword = e.value
      	this.pageList(true)
      },
      // 加载列表 type=>true（覆盖式）/false（增量式）
      pageList(type) {
        this.pageParam.page = type ? 1 : this.pageParam.page
        this.$kwz.ajax.ajaxUrl({
        	url: 'dd_xx/doPageList',
        	type: 'POST',
        	data: {
        		"ORG_MC":this.pageParam.keyword,//学校名称
            // "start":"0",
            "XXBBM":this.pageParam.XXBBM, //办学模式
            // "rows":"20",
            "XXDJ":this.pageParam.XXDJ, //学校等级
            "ORG_DM":this.pageParam.ORG_DM, //学校代码
            "XXBXLXM":this.pageParam.XXBXLXM,//办学类型
            // "ASC":"",
            "XXZDCXLXDM":this.pageParam.XXZDCXLXDM,//城乡类型
            // "limit":"20",
            "page":this.pageParam.page, //分页 
        	},
        	vue: this,
        	then(data) {
            let datas = data.datas
            let deleteParam = {}
            if(datas && datas.length > 0){
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
            } else {
              this.loadingType = "noMore"
              if(type){
                this.dataList = []
              }
            }
          }
        })
      },
      // 修改办学类型
      changeBxlx(e){
        let checkedOption = this.searchCondition.DM_BXLX[e.detail.value]
        this.pageParam.XXBXLXM = checkedOption.DMMX_CODE
        this.pageParam.XXBXLXMMC = checkedOption.DMMX_MC
      },
      // 修改办学模式
      changeBxms(e){
        let checkedOption = this.searchCondition.DM_BXMS[e.detail.value]
        this.pageParam.XXBBM = checkedOption.DMMX_CODE
        this.pageParam.XXBBMMC = checkedOption.DMMX_MC
      },
      // 修改城乡类型
      changeCxlx(e){
        let checkedOption = this.searchCondition.DM_XXZDCXLX[e.detail.value]
        this.pageParam.XXZDCXLXDM = checkedOption.DMMX_CODE
        this.pageParam.XXZDCXLXDMMC = checkedOption.DMMX_MC
      },
      // 修改学校等级
      changeXxdj(e){
        let checkedOption = this.searchCondition.DM_XXDJ[e.detail.value]
        this.pageParam.XXDJ = checkedOption.DMMX_CODE
        this.pageParam.XXDJMC = checkedOption.DMMX_MC
      },
      // 列表卡点击事件
      toDetail(id){
        this.$kwz.router({
        	url: 'xxglddb-preview?id=' + id
        })
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
      
    }
	}
</script>

<style lang="scss">
  .lists{
    padding-top: 20upx;
  }
</style>
