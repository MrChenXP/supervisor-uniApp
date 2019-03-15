<template>
	<view class="child-content">
    <!-- 搜索 -->
    <kw-search placeholder="请输入账号" @confirm="searchList">
      <view slot="content">
        <kw-list-cell title="姓名">
          <view slot="rightNote">
            <view class=""><input v-model="pageParam.XM" placeholder="请输入姓名"/></view>
          </view>
        </kw-list-cell>
        <kw-list-cell title="电话">
          <view slot="rightNote">
            <view class=""><input v-model="pageParam.DH" placeholder="请输入电话"/></view>
          </view>
        </kw-list-cell>
        <kw-list-cell title="编号">
          <view slot="rightNote">
            <view class=""><input v-model="pageParam.BH" placeholder="请输入编号"/></view>
          </view>
        </kw-list-cell>
        <picker :range="searchCondition.DM_DD_DXLX" range-key="DMMX_MC" @change="changeDxlx">
          <kw-list-cell title="督学类型" :rightNote="pageParam.DXLX"></kw-list-cell>
        </picker>
        <picker :range="searchCondition.YXZTList" range-key="DMMX_MC" @change="changeZt">
          <kw-list-cell title="状态" :rightNote="pageParam.YXZTMC"></kw-list-cell>
        </picker>
      </view>
    </kw-search>
    
    <!-- 列表组 -->
    <checkbox-group class="lists">
      <view>
        <!-- 单项列表 -->
        <view class="list" v-for="(item, index) in dataList" :key="index" @click="toPreview(item.DXID)">
          <view class="info">
            <view>
              <!-- 删除按钮隐藏 -->
              <!-- <label v-if="!deleteShow">  
                <view class="check">
                  <checkbox :checked="deleteParam[item.ORG_ID]" 
                    @tap.stop="checkAction(item.ORG_ID)" />
                </view>
              </label>  -->
              {{item.U_USERID}}
            </view>
            <view class="clearfix time">
              <view class="fl">姓名:{{item.XM || "未填写"}}</view>
              <view class="fr">电话:{{item.DH || "未填写"}}</view>
            </view>
            <view class="clearfix time">
              <view class="fl">督学类型:{{item.DXLX || "未填写"}}</view>
              <view class="fr">所在机构:{{item.ORG_MC || "未填写"}}</view>
            </view>
            <view class="clearfix time">
              <view class="fl">学历:{{item.DXXL || "未填写"}}</view>
              <view class="fr">职称:{{item.DXZC || "未填写"}}</view>
            </view>
            <view class="clearfix time">
              <view class="fl">职务:{{item.ZW || "未填写"}}</view>
              <view class="fr">工作单位:{{item.WORKUNIT || "未填写"}}</view>
            </view>
            <view class="clearfix time">
              <view class="fl">编号:{{item.BH || "未填写"}}</view>
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
        // 列表数据
        dataList: [],
        // 加载更多状态
        loadingType: "more",
        // 加载更多状态对应文字 键名不能改
        contentText: {
        	contentdown: "上拉显示更多",
        	contentrefresh: "正在加载...",
        	contentnomore: "没有更多数据了"
        },
        // 搜索以及分页参数
        pageParam: {
        	// 分页
        	page: 1,
          // 姓名
          XM: "",
          // 电话
          DH: "",
          // 编号
          BH: "",
          // 督学类型
          DXLX:"",
          // 督学类型码
          DXLXM:"",
          // 状态
          YXZT:"1",
          // 状态名称
          YXZTMC:"在岗",
        	// 关键字 账号
        	keyword: '',
        },
        // 搜索列表选择数据
        searchCondition: {
          // 督学类型选择列表
          DM_DD_DXLX:{},
          // 状态选择列表
          YXZTList:[
            {
              DMMX_CODE:"0",
              DMMX_MC:"已删除"
            },{
              DMMX_CODE:"1",
              DMMX_MC:"在岗"
            },{
              DMMX_CODE:"3", // 确实是3
              DMMX_MC:"离职/离岗"
            },
          ]
        },
			};
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
      	this.$kwz.loadVueDms("DM_DD_DXLX", dms => {
          this.searchCondition.DM_DD_DXLX = dms.DM_DD_DXLX || []
      	}, this)
      	this.pageList(true)
      },
      // 搜素列表
      searchList(e) {
      	this.pageParam.keyword = e.value
      	this.pageList(true)
      },
      // 修改督学类型
      changeDxlx(e){
        let checkedOption = this.searchCondition.DM_DD_DXLX[e.detail.value]
        this.pageParam.DXLXM = checkedOption.DMMX_CODE
        this.pageParam.DXLX = checkedOption.DMMX_MC
      },
      // 修改状态
      changeZt(e){
        let checkedOption = this.searchCondition.YXZTList[e.detail.value]
        this.pageParam.YXZT = checkedOption.DMMX_CODE
        this.pageParam.YXZTMC = checkedOption.DMMX_MC
      },
      // 加载列表 type=>true（覆盖式）/false（增量式）
      pageList(type) {
        this.pageParam.page = type ? 1 : this.pageParam.page
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_dxgl/doPageList',
          type: 'POST',
          data: {
          	"U_USERID":this.pageParam.keyword, //账号 
            "P_ORG_ID_MC":"", //查找指定下级机构名称 周雄=暂时不传
            "DH":this.pageParam.DH, //电话 
            "BH":this.pageParam.BH, //编号 
            "P_ORG_ID":"", ///查找指定下级机构代码 周雄=暂时不传
            "DXLXM":this.pageParam.DXLXM, //督学类型码
            "YXZT":this.pageParam.YXZT, //状态 （三种状态：1、在岗 0、已删除 3、离职/离岗） 
            "XM":this.pageParam.XM, //姓名 
            "page":this.pageParam.page
          },
          vue: this,
          then(data){
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
      // 列表卡点击事件
      toPreview (id) {
      	this.$kwz.router({
      		url: 'dxgl-preview?id=' + id,
      	})
      },
    }
	}
</script>

<style lang="scss">
  
</style>
