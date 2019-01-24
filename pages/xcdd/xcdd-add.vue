<template>
	<view class="child-content">
    <kw-list-cell title="工作计划" :rightNote="gzjh" @click="gzjhShow=!gzjhShow"></kw-list-cell>
    <kw-list-cell title="学校(校园)" :rightNote="gzjh"></kw-list-cell>
    <kw-list-cell title="随行督学" :rightNote="gzjh"></kw-list-cell>
    <kw-list-cell title="时间" :rightNote="gzjh"></kw-list-cell>
    <kw-list-cell title="督导纪实" :rightNote="gzjh"></kw-list-cell>
    <kw-list-cell title="典型经验和做法" :rightNote="gzjh"></kw-list-cell>
    <kw-list-cell title="存在问题" :rightNote="gzjh"></kw-list-cell>
    <kw-list-cell title="后续处理意见" :rightNote="gzjh"></kw-list-cell>

    <!-- 工作计划(请把工作计划搜索ajax写在该组件里) -->
    <view v-show="gzjhShow">
      <xcdd-select-gzjh></xcdd-select-gzjh>
    </view>
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import XcddSelectGzjh from "./compoentns/xcdd-select-gzjh.vue"
	export default {
		data() {
			return {
        gzjh:"工作计划",
        gzjhShow:false
			};
		},
    components:{KwListCell,XcddSelectGzjh},
    methods:{
      // 路由跳转
      goLink(link){
        uni.navigateTo({
          url: link
        });
      }
    }
	}
</script>

<style lang="scss">
  
</style>
