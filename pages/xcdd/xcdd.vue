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
        <checkbox :checked="deleteParam._CHECK_ALL_" @tap="checkAll">全选</checkbox>
      </view>
      <view class="delete fl" v-if="hasScAuth && deleteShow" @click="deleteAction" >删除</view>
      <view class="delete fl" v-if="!deleteShow" @click="confirmDeleteAction">确认删除</view>
      <view class="add fr" @click="$kwz.router({url: 'xcdd-add'})" v-if="hasXzAuth">新增</view>
    </view>
    <!-- 列表组 -->
    <checkbox-group class="lists">
      <view>
        <!-- 单项列表 -->
        <view class="list" v-for="(item, index) in dataList" :key="index"  @click="toPreview(item.CONTENT_ID)">
          <view class="info">
            <view>
              <label v-if="!deleteShow">
                <view class="check">
                  <checkbox :checked="deleteParam[item.CONTENT_ID]" @tap.stop="checkAction(item.CONTENT_ID)" />
                </view>
              </label>
              {{item.XXMC}}
            </view>
            <view class="clearfix time">
              <view class="fl">{{item.AUTHOR}}</view>
              <view class="fr">督导时间：{{item.YWSJ}}</view>
            </view>
            <view class="clearfix status">
              <view v-if="true" :class="item.ztClass" class="fl clyj" @click.stop="toZgxs(item.STATUS,item.IDS)">
                <uni-tag :text="item.STATUS_MC || '未填写'" size="small" type="primary"></uni-tag>
              </view>
              <view v-if="hasXgAuth" class="fr bj" @click.stop="toDetail(item.CONTENT_ID)">
                <uni-tag text="编辑" size="small" circle="true" inverted="true" type="primary"></uni-tag>
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
    components: {KwSearch,KwListCell,uniLoadMore},
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
          xdMc: '全部',
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
        // 删除参数
        deleteParam: {
          '_CHECK_ALL_': false
        },
        // 徽标样式
        constParam: {
          ztClass: {
            '1': 'wwt',
            '2': 'qs',
            '3': 'zgz',
            '4': 'zgwc',
            '5': 'fs',
          }
        }
      }
    },
    onShow() {
      this.initData()
    },
    computed:{
      // 新增权限
      hasXzAuth () {
        return this.$kwz.hasAuth('ddjl/doEdit')
      },
      // 修改权限
      hasXgAuth () {
        return this.$kwz.hasAuth('ddjl/doEdit')
      },
      // 删除权限
      hasScAuth () {
        return this.$kwz.hasAuth('ddjl/deleteddjl')
      }
    },
    onReachBottom() {
      this.pageList()
      this.loadingType = "loading"
    },
    methods: {
      // 加载数据
      initData() {
        // 加载代码
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
      // 选择搜索条件 => 学期
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
      // 加载列表 type=>true（覆盖式）/false（增量式）1
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
              // 将数据集中的id放入删除集中的id
              for (let i = 0; i < datas.length; i++) {
                let tmp = datas[i]
                tmp.ztClass = this.constParam.ztClass[tmp.STATUS]
                deleteParam[tmp.CONTENT_ID] = false
              }
              // 复制老的删除集至新的删除集
              for (let i in this.deleteParam) {
                deleteParam[i] = this.deleteParam[i]
              }
              this.deleteParam = deleteParam
              this.pageParam.page++
              if (type) {
                this.dataList = datas
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
            url: 'jc_content/doDelete/DDJL',
            type: 'POST',
            data: {
              ids: ids.join(',')
            },
            vue: this,
            then (response) {
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
      // 去整改通知 || 协商意见
      toZgxs(status, ids) {
        if(status == '2' || status == '5'){
          this.$kwz.router({url:'xcdd-zgtzs?zgxsId=' + ids})
        } else if (status == '3'){
          this.$kwz.router({url:'xcdd-xsyjs?zgxsId=' + ids})
        }
      },
      // 去修改
      toDetail(ids) {
        this.$kwz.router({
          url: 'xcdd-add?CONTENT_ID=' + ids
        })
      },
      // 去预览
      toPreview (id) {
        if(id) {
          this.$kwz.router({url: 'xcdd-preview?contentId=' + id})
        }
      }
    }
  }
</script>

<style lang="scss">
  .lists {
    height: calc(100% - 186upx);
    .list {
      .info {
        .status {
          .wwt .uni-tag {
            background: none;
            border: none;
            color: #999999;
          }
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
</style>
