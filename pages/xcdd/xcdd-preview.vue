<template>
	<view class="child-content">
    <!-- 标题 -->
    <kw-list-cell title="学校" rightNote="垃圾"></kw-list-cell>
    <kw-list-cell title="督导时间" rightNote="垃圾"></kw-list-cell>
    <kw-list-cell title="创建人" rightNote="垃圾"></kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="ddsxShow = !ddsxShow">
          <text class="fl">督导事项</text>
          <view class="fr" v-show="!ddsxShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="ddsxShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="ddsxShow" class="ddjs-body">
          <view class="ddjs-text">这里显示内容</view>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="ddjsShow = !ddjsShow">
          <text class="fl">督导纪实</text>
          <view class="fr" v-show="!ddjsShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="ddjsShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="ddjsShow" class="ddjs-body">
          <view class="ddjs-text">这里显示内容</view>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="pgjgShow = !pgjgShow">
          <text class="fl">评估结果</text>
          <view class="fr" v-show="!pgjgShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="pgjgShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="pgjgShow" class="ddjs-body">
          <view class="ddjs-text">这里显示内容</view>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="jyzfShow = !jyzfShow">
          <text class="fl">亮点</text>
          <view class="fr" v-show="!jyzfShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="jyzfShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="jyzfShow" class="ddjs-body">
          <view class="ddjs-text">这里显示内容</view>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="czwtShow = !czwtShow">
          <text class="fl">存在问题</text>
          <view class="fr" v-show="!czwtShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="czwtShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="czwtShow" class="ddjs-body">
          <view class="ddjs-text">这里显示内容</view>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="zgbgShow = !zgbgShow">
          <text class="fl">整改报告</text>
          <view class="fr" v-show="!zgbgShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="zgbgShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="zgbgShow" class="ddjs-body">
          <view class="ddjs-text">这里显示内容</view>
        </view>
      </view>
    </kw-list-cell>
    <kw-list-cell>
      <view>
        <view class="ddjs-head clearfix" @click="hxclyjShow = !hxclyjShow">
          <text class="fl">后续处理意见</text>
          <view class="fr" v-show="!hxclyjShow"><uni-icon type="arrowdown" size="25"></uni-icon></view>
          <view class="fr" v-show="hxclyjShow"><uni-icon type="arrowup" size="25"></uni-icon></view>
        </view>
        <view v-show="hxclyjShow" class="ddjs-body">
          <view v-if="zgxsdm=='1'">
            <view>经挂牌督导，你单位存在以下问题及建议:</view>
            <view>“协商内容”</view>
            <view>对以上问题要高度重视，采取措施，立即整改。整改报告于本通知下发 “处理期限”日内书面报责任督学，责任督学于接到报告的3日内上报人民政府教育督导室督管员备案。</view>
            <view class="time">业务时间</view>
          </view>
          <view v-if="zgxsdm=='2'">
            <view>我室责任督学于 "业务时间" 对 "学校名称" 进行了教育督导，发现该学校(幼儿园)存在以下问题及建议:</view>
            <view>“协商内容”</view>
            <view>请贵科室（中心）予以支持、配合、协调解决!</view>
            <view class="time">业务时间</view>
          </view>
          <view>
            <view>处理结果:</view>
            <view>这里放结果</view>
          </view>
        </view>
      </view>
    </kw-list-cell>
    
	</view>
</template>

<script>
  import KwListCell from "@kwz/kw-ui/kw-list-cell.vue"
  import { uniBadge,uniTag,uniIcon} from '@dcloudio/uni-ui'
	export default {
		data() {
			return {
        // 督导事项显示隐藏
        ddsxShow:false,
        // 督导纪实显示隐藏
        ddjsShow:false,
        //评估结果显示隐藏
        pgjgShow:false,
        // 亮点(典型经验和做法)显示隐藏
        jyzfShow:false,
        // 存在问题显示隐藏
        czwtShow:false,
        // 整改报告显示隐藏
        zgbgShow:false,
        // 后续处理意见显示隐藏
        hxclyjShow:false,
        // 是整改还是协商
        zgxsdm:'1',
			};
		},
    components:{uniBadge,uniTag,uniIcon,KwListCell},
    methods:{
      // 路由跳转
      goLink(link){
        uni.navigateTo({
          url: link,
        });
      }
    }
	}
</script>

<style lang="scss">
  .ddjs-head{
      height: 55upx;
    }
  .ddjs-body{
    padding:0 20upx;
    .time{
      text-align: right;
    }
  }
</style>
