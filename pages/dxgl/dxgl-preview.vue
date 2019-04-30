<template>
	<view class="child-content">
    <kw-list-cell>
        <view>
          <view class="head-img">
            <view class="head-img-title">头像</view>
            <view class="head-img-img">
              <image :src="data.IMAGE"></image>
            </view>
          </view>
        </view>
    </kw-list-cell>
    <kw-list-cell title="账号" :right-note="data.U_USERID"></kw-list-cell>
    <kw-list-cell title="编号" :right-note="data.BH"></kw-list-cell>
    <kw-list-cell title="姓名" :right-note="data.XM"></kw-list-cell>
    <kw-list-cell title="显示名" :right-note="data.U_USERNAME"></kw-list-cell>
    <kw-list-cell title="督学类型" :right-note="data.DXLX"></kw-list-cell>
    <kw-list-cell title="手机号码" :right-note="data.DH"></kw-list-cell>
    <kw-list-cell title="归属机构" :right-note="data.ORG_MC"></kw-list-cell>
    <kw-list-cell title="年龄" :right-note="String(data.AGE)"></kw-list-cell>
    <kw-list-cell title="性别" :right-note="data.XB"></kw-list-cell>
    <kw-list-cell title="民族" :right-note="data.MZMC"></kw-list-cell>
    <kw-list-cell title="出生年月" :right-note="data.BIRTH"></kw-list-cell>
    <kw-list-cell title="身份证件类型" :right-note="data.SFZJLXMC"></kw-list-cell>
    <kw-list-cell title="身份证件号" :right-note="data.SFZJH"></kw-list-cell>
    <kw-list-cell title="学历" :right-note="data.DXXL"></kw-list-cell>
    <kw-list-cell title="专业技术职称" :right-note="data.DXZC"></kw-list-cell>
    <kw-list-cell title="职务" :right-note="data.ZW"></kw-list-cell>
    <kw-list-cell title="工作单位" :right-note="data.WORKUNIT"></kw-list-cell>
    <kw-list-cell :isArrow="false">
      <view>
      	<view class="ddjs-head clearfix" @click="jjShow= !jjShow">
      		<text class="fl">个人简介</text>
      		<view class="fr" v-show="!jjShow">
      			<uni-icon type="arrowdown" color="#c7c7c7" size="20"></uni-icon>
      		</view>
      		<view class="fr" v-show="jjShow">
      			<uni-icon type="arrowup" color="#c7c7c7" size="20"></uni-icon>
      		</view>
      	</view>
      	<view v-show="jjShow" class="ddjs-body">
      		<view class="ddjs-text">{{data.JL}}</view>
      	</view>
      </view>
    </kw-list-cell>
  </view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
	export default {
    components:{KwListCell},
		data() {
			return {
        // 个人简介显示隐藏
        jjShow:true,
        id:"",
        data: {
        	IMAGE: '../../static/images/DefaultImg.png',
        },
        
			};
		},
    onLoad(query) {
      this.id = query.id
      this.loadData()
    },
    methods:{
      loadData(){
        this.$kwz.ajax.ajaxUrl({
          url: 'dd_dxgl/selectByPrimaryKey',
          type: 'POST',
          data: {
            DXID: this.id
          },
          vue: this,
          then (response) {
            this.data = response.datas.data
            this.data.IMAGE = this.data.IMAGE || "../../static/images/DefaultImg.png"
          }
        })
      }
    }
	}
</script>

<style lang="scss">
  .head-img{
    height: 100upx;
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;
    .head-img-title{
      line-height: 100upx;
      min-width: 20%;
    }
    .head-img-img{
      position:absolute;
      right: 0;
      width: 100upx;
      height: 100upx;
      image{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
