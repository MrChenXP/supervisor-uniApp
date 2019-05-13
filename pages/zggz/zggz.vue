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
        <picker :range="searchCondition.DM_DD_CLZT" range-key="DMMX_MC" @change="changeZt">
          <kw-list-cell title="状态" :right-note="pageParam.ztMc"></kw-list-cell>
        </picker>
      </view>
    </kw-search>
    <!-- 分页 -->
    <view class="pager">
      <view class="zg active">整改</view>
      <view class="xs" @click="$kwz.redirect({url: 'xsyj'})">协商</view>
    </view>
    <!-- 功能(新增删除) -->
    <view class="gn" v-if="hasScAuth || hasXzAuth">
      <view class="check fl" v-if="!deleteShow && hasScAuth">
        <radio :checked="deleteParam._CHECK_ALL_" @tap="checkAll">全选</radio>
      </view>
      <view class="delete fl" v-if="deleteShow && hasScAuth" @click="deleteAction">删除</view>
      <view class="delete fl" v-if="!deleteShow && hasScAuth" @click="confirmDeleteAction">确认删除</view>
      <view class="add fr" @click="toAdd('add')" v-if="hasXzAuth">新增</view>
    </view>
    <!-- 列表组 -->
    <checkbox-group class="lists">
      <view>
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
              <view class="fr">发出时间：<text :class="{'color_red': item.ISCS}">{{item.YWSJ}}</text></view>
            </view>
            <view class="clearfix status">
              <view :class="item.ztClass" class="fl">
                <uni-tag :text="item.CLZTMC" size="small" type="primary"></uni-tag>
              </view>
              <view class="fr ys" v-if="item.CLZTDM === '1' && item.IS_SB ==='1'" >
                <uni-tag text="审核" size="small" circle="true" v-if="hasShAuth"
                  inverted="true" type="primary" @click="toAdd(item.ZGXSID)"></uni-tag>
              </view>
              <view class="fr ys" v-else>
                <uni-tag text="处理" size="small" circle="true" inverted="true" type="primary"  @click="toZgxs(item.ZGXSID, 'xx')"
                  v-if="item.CLZTDM < 6 && !(item.SFSH && item.CLZTDM === '1') && hasClAuth"></uni-tag>
                <uni-tag text="验收" size="small" circle="true" inverted="true" type="primary"
                  v-if="item.CLZTDM < 6 && hasYsAuth" @click="toZgxs(item.ZGXSID, 'dx')"></uni-tag>
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
          xdMc: '',
          zglxMc: '',
          ztId: '', // 处理状态代码
          ztMc: '', // 处理状态名称
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
          DM_DD_ZGXSLY: [], // 整改类型选择列表
          DM_DD_CLZT: [], // 状态
        },
        // 删除参数
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
        },
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
    computed: {
      user () {
        return this.$kwz.getLoginUser()
      },
      // 新增权限
      hasXzAuth () {
        return this.$kwz.hasAuth('dd_zgxs/toZgtz/ZGTZ')
      },
      // 删除权限
      hasScAuth () {
        return this.$kwz.hasAuth('dd_zgxs/doDeleteBatch/ZGTZ')
      },
      // 审核权限
      hasShAuth () {
        return this.$kwz.hasAuth('dd_zgxs/zgtz_sh')
      },
      // 处理权限
      hasClAuth () {
        return this.$kwz.hasAuth('dd_zgxs/zgtz_deal')
      },
      // 验收权限
      hasYsAuth () {
        return this.$kwz.hasAuth('dd_zgxs/zgtz_done')
      }
    },
    components: {KwSearch,KwListCell,uniLoadMore},
    onShow() {
      this.initData()
    },
    onReachBottom() {
      this.pageList()
      this.loadingType = "loading"
    },
    methods: {
      // 加载数据
      initData() {
        this.$kwz.loadVueDms('DM_DD_CLZT,DM_DD_ZGXSLY,DM_XD', dms => {
          this.searchCondition = this.$kwz.deepCopy(dms) || {}
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
          this.searchCondition.DM_DD_ZGXSLY.unshift({
            DMMX_CODE:"",DMMX_MC:"全部"
          })
          this.searchCondition.DM_DD_CLZT.unshift({
            DMMX_CODE:"",DMMX_MC:"全部"
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
          url: 'dd_zgxs/doPageList/zgtz',
          type: 'POST',
          data: {
            page: this.pageParam.page,
            XD: this.pageParam.xd,
            XXMC: this.pageParam.keyword,
            ZGXSLY: this.pageParam.zglx,
            CLZTDM: this.pageParam.ztId,
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
                // 把状态(123456)对应的类名(zgz zgwc yys...)赋值给ztclass.然后页面上用
                tmp.ztClass = this.constParam.ztClass[tmp.CLZTDM]
                tmp.ISCS = this.countCs(tmp.YWSJ, tmp.CLQX) && tmp.CLZTDM < "4"
                 // 确认是否是学校 暂时失效
                // tmp.SFZGXX = (this.user.orgid === tmp.ORG_ID_TARGET)
                 // 确认是否时督学 暂时失效
                // tmp.SFDX = (this.user.orgid === tmp.ORG_ID)
                 // 判断是否有审核功能
                // tmp.SFSH = tmp.CLZTDM === '1' && tmp.IS_SB === '1'
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
        console.log('add sh')
        if (val !== 'add') { // 不是新增就是审核
          this.$kwz.router({url: `zggz-add?id=${val}`})
        } else {
          this.$kwz.router({url: "zggz-add"})
        }
      },
      // 显示详情
      toDetail(zgxsid) {
      },
      // 超时设置
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
  .gn {
    height: 86upx;
    padding: 18upx 0;
    position:sticky;
    top:calc(44px + 195upx);
    /* #ifdef MP-WEIXIN */
    top:195upx;
    /* #endif */
    background:#f5f5f5;
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
  .color_red{
    color: red !important;
  }
</style>