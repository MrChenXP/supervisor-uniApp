<template>
	<view class="news child-content">
		<!-- 头部信息 -->
    <view class="head">
      <view class="title">{{news.TITLE}}</view>
      <view class="time">
        <text class="time-title">作者：{{news.AUTHOR}}</text>
        <text class="time-title">来源：{{news.LY}}</text>
        <text class="time-title">浏览次数：{{news.DJS}}</text>
      </view>
      <view class="time">
        <text class="time-title">时间：{{news.RELEASE_DATE}}</text>
      </view>
    </view>
    <!-- 正文 -->
    <view class="main-text">
      <rich-text :nodes="news.TXT"></rich-text>
      <!-- 老显示html方法 -->
      <!-- <view v-for="(item,key) in newsContent" :key="key">
        <view>{{item.content}}</view>
        <image v-if="item.image" :src="item.imageUrl" mode="aspectFit" ></image>
      </view> -->
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        contentId: '',
				news: {
        },
        newsContent: [
          {
            content: '',
            image: false,
            imageUrl: ''
          }
        ]
			};
		},
    onLoad(params) {
    	if(params && params.CONTENT_ID){
        this.contentId = params.CONTENT_ID
        this.loadNews();
      }
    },
    methods:{
     loadNews () {
       if(this.contentId) {
         this.$kwz.ajax.ajaxUrl({
           url: 'jc_mobile/open/getContent',
             type: 'POST',
             data: {
               CONTENTID: this.contentId
             },
             vue: this,
             then (data) {
               this.news = data.datas
               this.news.LY = this.news.LY || '本站原创'
               // 老显示html方法
               // this.news.TXT = this.$kwz.splitHtml(this.news.TXT)
               // this.newsContent.push(...this.$kwz.splitHtml(this.news.TXT))
             }
         })
       }
     } 
    }
	}
</script>

<style lang="scss">
  .news{
    padding: 20upx;
    background: white;
  }
  .head{
    .title{
      font-size: 38upx;
      font-weight: 900;
    }
    .time{
      color: #999999;
      font-size: 24upx;
    }
    .time-title{
      margin-left: 5px;
    }
  }
  .main-text{
    margin-top: 20upx;
    text-indent: 56upx;
  }
</style>
