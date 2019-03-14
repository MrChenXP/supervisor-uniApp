<template>
	<view class="child-content">
    <!-- 分页  -->
    <view class="pager">
    	<view class="zg" :class="{active:xxsxShow}" @click="xxsxShow = true">基本信息</view>
    	<view class="xs" :class="{active:!xxsxShow}" @click="xxsxShow = false">年度属性</view>
    </view>
    <!-- 基本信息 -->
    <view v-show="xxsxShow">
      <kw-list-cell :isArrow="false">
        <view>
        	<view class="ddjs-head clearfix" @click="sjjgShow = !sjjgShow">
        		<text class="fl">上级机构</text>
        		<view class="fr" v-show="!sjjgShow">
        			<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
        		</view>
        		<view class="fr" v-show="sjjgShow">
        			<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
        		</view>
        	</view>
        	<view v-show="sjjgShow" class="ddjs-body">
        		<view class="ddjs-text">{{jbxxData.PARENT_ORGS}}</view>
        	</view>
        </view>
      </kw-list-cell>
      <kw-list-cell title="学校名称" :right-note="jbxxData.ORG_MC"></kw-list-cell>
      <kw-list-cell title="学校代码" :right-note="jbxxData.ORG_DM"></kw-list-cell>
      <kw-list-cell title="办学类型" :right-note="jbxxData.XXBXLX"></kw-list-cell>
      <kw-list-cell title="办学模式" :right-note="jbxxData.XXBBMC"></kw-list-cell>
      <kw-list-cell title="所在地城乡类型" :right-note="jbxxData.XXZDCXLXDMC"></kw-list-cell>
      <kw-list-cell title="学校等级" :right-note="jbxxData.XXDJMC"></kw-list-cell>
      <kw-list-cell title="联系电话" :right-note="jbxxData.LXDH"></kw-list-cell>
      <kw-list-cell title="主页地址" :right-note="jbxxData.ZYDZ"></kw-list-cell>
      <kw-list-cell title="学校经度" :right-note="jbxxData.XXJD"></kw-list-cell>
      <kw-list-cell title="学校纬度" :right-note="jbxxData.XXWD"></kw-list-cell>
      <kw-list-cell title="学校地址" :right-note="jbxxData.XXDZ"></kw-list-cell>
      <kw-list-cell :isArrow="false">
        <view>
        	<view class="ddjs-head clearfix" @click="jjShow= !jjShow">
        		<text class="fl">简介</text>
        		<view class="fr" v-show="!jjShow">
        			<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
        		</view>
        		<view class="fr" v-show="jjShow">
        			<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
        		</view>
        	</view>
        	<view v-show="jjShow" class="ddjs-body">
        		<view class="ddjs-text">{{jbxxData.LSYG}}</view>
        	</view>
        </view>
      </kw-list-cell>
    </view>
    <!-- 年度属性 -->
    <view v-show="!xxsxShow">
        <picker :range="xnList" range-key="XQ_XN" @change="changeXn">
          <kw-list-cell title="查询条件" :right-note="xnValue"></kw-list-cell>
        </picker>
      <!-- 办学条件 -->
      <view>
        <view class="ddjs-head clearfix title" @click="bxtjShow = !bxtjShow">
        	<text class="fl">办学条件</text>
        	<view class="fr" v-show="!bxtjShow">
        		<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        	<view class="fr" v-show="bxtjShow">
        		<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        </view>
        <view v-show="bxtjShow">
          <kw-list-cell title="占地面积/㎡" :right-note="ndsxData.ZDMJ"></kw-list-cell>
          <kw-list-cell title="其中：绿化用地面积/㎡" :right-note="ndsxData.LHYDMJ"></kw-list-cell>
          <kw-list-cell title="其中：运动场地面积/㎡" :right-note="ndsxData.YDCDMJ"></kw-list-cell>
          <kw-list-cell title="校舍建筑面积/㎡" :right-note="ndsxData.XSJZMJ"></kw-list-cell>
          <kw-list-cell title="图书量/册" :right-note="ndsxData.TSL"></kw-list-cell>
          <kw-list-cell title="数字资源量/个" :right-note="ndsxData.SZZYL"></kw-list-cell>
          <kw-list-cell title="计算机台数/台" :right-note="ndsxData.JSJTS"></kw-list-cell>
          <kw-list-cell title="其中：教学用计算机/台" :right-note="ndsxData.JXYJSJ"></kw-list-cell>
          <kw-list-cell title="其中：平板电脑/台" :right-note="ndsxData.PBDN"></kw-list-cell>
          <kw-list-cell title="教室/间" :right-note="ndsxData.JSZS"></kw-list-cell>
          <kw-list-cell title="其中：网络多媒体教室/间" :right-note="ndsxData.WLDMTJS"></kw-list-cell>
          <kw-list-cell title="固定资产总值/元" :right-note="ndsxData.GDZCZZ"></kw-list-cell>
          <kw-list-cell title="其中：教学仪器设备资产值/元" :right-note="ndsxData.JXYQSBZCZ"></kw-list-cell>
        </view>
      </view>
      <!-- 学生 -->
      <view>
        <view class="ddjs-head clearfix title" @click="xsShow = !xsShow">
        	<text class="fl">学生</text>
        	<view class="fr" v-show="!xsShow">
        		<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        	<view class="fr" v-show="xsShow">
        		<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        </view>
        <view v-show="xsShow">
         <kw-list-cell title="毕业生数/人" :right-note="ndsxData.BYSS"></kw-list-cell>
         <kw-list-cell title="招生数/人" :right-note="ndsxData.ZSS"></kw-list-cell>
         <kw-list-cell title="教学班数/班" :right-note="ndsxData.JXBS"></kw-list-cell>
         <kw-list-cell title="在校学生数/人" :right-note="ndsxData.ZXXSS"></kw-list-cell>
         <kw-list-cell title="其中：女生人数/人" :right-note="ndsxData.NSRS"></kw-list-cell>
         <kw-list-cell title="其中：进城务工人员随迁子女数/人" :right-note="ndsxData.WGSQZNS"></kw-list-cell>
        </view>
      </view>
      <!-- 教职工 -->
      <view>
        <view class="ddjs-head clearfix title" @click="jzgShow = !jzgShow">
        	<text class="fl">教职工</text>
        	<view class="fr" v-show="!jzgShow">
        		<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        	<view class="fr" v-show="jzgShow">
        		<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        </view>
        <view v-show="jzgShow">
         <kw-list-cell title="教职工总数/人" :right-note="ndsxData.JZGZS"></kw-list-cell>
         <kw-list-cell title="专任教师数/人" :right-note="ndsxData.ZZJSS"></kw-list-cell>
         <kw-list-cell title="其中：女专任教师数/人" :right-note="ndsxData.NZZJSS"></kw-list-cell>
         <kw-list-cell title="其中：体育/艺术教师数/人" :right-note="ndsxData.TYJSS"></kw-list-cell>
        </view>
      </view>
      <!-- 骨干教师 -->
      <view>
        <view class="ddjs-head clearfix title" @click="ggjsShow = !ggjsShow">
        	<text class="fl">骨干教师</text>
        	<view class="fr" v-show="!ggjsShow">
        		<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        	<view class="fr" v-show="ggjsShow">
        		<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        </view>
        <view v-show="ggjsShow">
         <kw-list-cell title="县级及以上骨干教师（小学）/人" :right-note="ndsxData.XXXJYSJS"></kw-list-cell>
         <kw-list-cell title="县级及以上骨干教师（初中）/人" :right-note="ndsxData.CZXJYSJS"></kw-list-cell>
         <kw-list-cell title="县级及以上骨干教师（高中）/人" :right-note="ndsxData.GZXJYSJS"></kw-list-cell>
        </view>
      </view>
      <!-- 学历分布 -->
      <view>
        <view class="ddjs-head clearfix title" @click="xlfbShow = !xlfbShow">
        	<text class="fl">学历分布</text>
        	<view class="fr" v-show="!xlfbShow">
        		<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        	<view class="fr" v-show="xlfbShow">
        		<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        </view>
        <view v-show="xlfbShow">
         <kw-list-cell title="中专/高中毕业人数/人" :right-note="ndsxData.ZZGZBYRS"></kw-list-cell>
         <kw-list-cell title="专科毕业人数/人" :right-note="ndsxData.ZKBYRS"></kw-list-cell>
         <kw-list-cell title="本科毕业人数/人" :right-note="ndsxData.BKBYRS"></kw-list-cell>
         <kw-list-cell title="研究生毕业人数/人" :right-note="ndsxData.YJSBYRS"></kw-list-cell>
         <kw-list-cell title="其他学历人数/人" :right-note="ndsxData.QTXLRS"></kw-list-cell>
        </view>
      </view>
      <!-- 职称分布 -->
      <view>
        <view class="ddjs-head clearfix title" @click="zcfbShow = !zcfbShow">
        	<text class="fl">职称分布</text>
        	<view class="fr" v-show="!zcfbShow">
        		<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        	<view class="fr" v-show="zcfbShow">
        		<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        </view>
        <view v-show="zcfbShow">
         <kw-list-cell title="高级职称人数/人" :right-note="ndsxData.GJZCRS"></kw-list-cell>
         <kw-list-cell title="中级职称人数/人" :right-note="ndsxData.ZJZCRS"></kw-list-cell>
         <kw-list-cell title="初级职称人数/人" :right-note="ndsxData.CJZCRS"></kw-list-cell>
         <kw-list-cell title="未评职称人数/人" :right-note="ndsxData.WPZCRS"></kw-list-cell>
        </view>
      </view>
      <!-- 年龄结构 -->
      <view>
        <view class="ddjs-head clearfix title" @click="nljgShow = !nljgShow">
        	<text class="fl">年龄结构</text>
        	<view class="fr" v-show="!nljgShow">
        		<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        	<view class="fr" v-show="nljgShow">
        		<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
        	</view>
        </view>
        <view v-show="nljgShow">
         <kw-list-cell title="24岁及以下人数/人" :right-note="ndsxData.AGE0024"></kw-list-cell>
         <kw-list-cell title="25-29岁人数/人" :right-note="ndsxData.AGE2529"></kw-list-cell>
         <kw-list-cell title="30-34岁人数/人" :right-note="ndsxData.AGE3034"></kw-list-cell>
         <kw-list-cell title="35-39岁人数/人" :right-note="ndsxData.AGE3539"></kw-list-cell>
         <kw-list-cell title="40-44岁人数/人" :right-note="ndsxData.AGE4044"></kw-list-cell>
         <kw-list-cell title="45-49岁人数/人" :right-note="ndsxData.AGE4549"></kw-list-cell>
         <kw-list-cell title="50-54岁人数/人" :right-note="ndsxData.AGE5054"></kw-list-cell>
         <kw-list-cell title="55-59岁人数/人" :right-note="ndsxData.AGE5559"></kw-list-cell>
         <kw-list-cell title="60岁以上人数/人" :right-note="ndsxData.AGE60"></kw-list-cell>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import KwSearch from "@kwz/kw-ui/kw-search.vue"
	export default {
    components:{KwListCell,KwSearch},
		data() {
			return {
        // 基本信息和年度属性切换
        xxsxShow: true,
        // 基本信息-上级机构显示隐藏
        sjjgShow: true,
        // 基本信息-简介显示隐藏
        jjShow: true,
        // 基本信息-办学条件显示隐藏
        bxtjShow: true,
        // 基本信息-学生显示隐藏
        xsShow: true,
        // 基本信息-教职工显示隐藏
        jzgShow:true,
        // 基本信息-骨干教师显示隐藏
        ggjsShow:true,
        // 基本信息-学历分布显示隐藏
        xlfbShow:true,
        // 基本信息-职称分布显示隐藏
        zcfbShow:true,
        // 基本信息-年龄结构显示隐藏
        nljgShow:true,
        // 学校id
        id:"",
        // 基本信息
        jbxxData:{},
        // 学年属性数据
        ndsxData:{},
        // 学年属性数据-学年下拉数据
        xnList:[],
        // 学年属性数据-当前学年
        xnValue:"",
			};
		},
    onLoad(query) {
      this.id = query.id
      this.loadData()
    },
    methods:{
      // 预先加载数据
      loadData () {
        this.getJbxxData()
        this.getXnList()
        this.getXnValue()
      },
      // 基本信息数据获取
      getJbxxData(){
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_xx/doSelectByPrimaryKey',
          type: 'POST',
          data: {
            ORG_ID: this.id
          },
          vue: this,
          then (response) {
            this.jbxxData = response.datas
          }
        })
      },
      // 学年属性-学年下拉数据获取
      getXnList(){
        this.$kwz.ajax.ajaxUrl({
          url: 'jc_xq/doList',
          type: 'POST',
          vue: this,
          then (response) {
            this.xnList = this.$kwz.uniq(response.datas)
          }
        })
      },
      // 学年属性-获取当前学年
      getXnValue(){
        this.$kwz.ajax.ajaxUrl({
          url: 'jc_xq/getCurXq',
          type: 'POST',
          vue: this,
          then (response) {
            this.xnValue = response.datas.curXq.XQ_ND
            this.getNdsxData()
          }
        })
      },
      // 年度属性-获取数据
      getNdsxData(){
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_xx/doSelectNdsx',
          type: 'POST',
          data: {
            ORG_ID: this.id,
            XQ_ND: this.xnValue
          },
          vue: this,
          then (response) {
            this.ndsxData = response.datas
          }
        })
      },
      // 选择搜索条件 => 学段
      changeXn(e) {
      	let checkedOption = this.xnList[e.detail.value]
      	this.xnValue = checkedOption.XQ_ND
        this.getNdsxData()
      },
    }
	}
</script>

<style lang="scss">
  .pager{
    top:44px;
    /* #ifdef MP-WEIXIN */
    top:0;
    /* #endif */
  }
  .title{
    padding: 5upx 20upx;
    margin: 5upx 0;
  }
  .kw-search-body{
    top: -95upx;
  }
</style>
